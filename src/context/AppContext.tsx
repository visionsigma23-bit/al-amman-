import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { DEFAULT_PROJECTS, DEFAULT_SITE_CONTENT } from '../data/defaultContent';
import { auth, googleProvider } from '../lib/firebase';
import {
  checkIsAdminUser,
  seedInitialFirestoreData,
  subscribeAllProjects,
  subscribeInquiries,
  subscribePublishedProjects,
  subscribeSiteContent,
} from '../lib/firestoreService';
import { Inquiry, Project, SiteContent } from '../types/realestate';

interface WhatsAppPayload {
  customerName?: string;
  projectName?: string;
  details?: string;
}

interface AppContextValue {
  projects: Project[];
  allAdminProjects: Project[];
  inquiries: Inquiry[];
  siteContent: SiteContent;
  hasLiveProjectsInDb: boolean;
  hasLiveSiteContentInDb: boolean;
  user: User | null;
  isAdmin: boolean;
  authLoading: boolean;
  dataLoading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  initializeDatabaseDefaults: () => Promise<void>;
  buildWhatsAppUrl: (payload?: WhatsAppPayload) => string;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [livePublishedProjects, setLivePublishedProjects] = useState<Project[]>([]);
  const [allAdminProjects, setAllAdminProjects] = useState<Project[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [liveSiteContent, setLiveSiteContent] = useState<SiteContent | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const googleAuthInFlightRef = useRef(false);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        const adminStatus = await checkIsAdminUser(
          nextUser.uid,
          nextUser.email,
          nextUser.emailVerified
        );
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });

    const unsubPublished = subscribePublishedProjects(
      (items) => {
        setLivePublishedProjects(items);
        setDataLoading(false);
      },
      () => {
        setDataLoading(false);
      }
    );

    const unsubSiteContent = subscribeSiteContent(
      (content) => {
        setLiveSiteContent(content);
      },
      () => {
        // Fallback to editable default content if Firestore hasn't been initialized yet
      }
    );

    return () => {
      unsubAuth();
      unsubPublished();
      unsubSiteContent();
    };
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      setAllAdminProjects([]);
      setInquiries([]);
      return;
    }

    // Automatically seed initial AL-JALIL GARDEN & site_content if DB is fresh
    void seedInitialFirestoreData().catch(() => {
      // Ignore silent auto-seed failures; user can manually trigger from Overview
    });

    const unsubAll = subscribeAllProjects((items) => {
      setAllAdminProjects(items);
    });

    const unsubInquiries = subscribeInquiries((items) => {
      setInquiries(items);
    });

    return () => {
      unsubAll();
      unsubInquiries();
    };
  }, [isAdmin]);

  const signInWithGoogle = async () => {
    if (googleAuthInFlightRef.current) {
      return;
    }
    googleAuthInFlightRef.current = true;
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code?: unknown }).code)
          : '';
      if (code === 'auth/cancelled-popup-request' || code === 'auth/popup-closed-by-user') {
        setAuthError('Google sign-in popup was closed before completion. Please try again.');
      } else if (code === 'auth/popup-blocked') {
        setAuthError(
          'Your browser blocked the Google sign-in popup. Allow popups for this site or sign in with Email & Password.'
        );
      } else {
        setAuthError(
          err instanceof Error ? err.message : 'Unable to complete Google sign-in.'
        );
      }
    } finally {
      googleAuthInFlightRef.current = false;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Unable to sign in with email and password.';
      setAuthError(msg);
      throw err;
    }
  };

  const sendPasswordReset = async (email: string) => {
    setAuthError(null);
    await sendPasswordResetEmail(auth, email.trim());
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const initializeDatabaseDefaults = async () => {
    await seedInitialFirestoreData();
  };

  const siteContent = useMemo(
    () => liveSiteContent ?? DEFAULT_SITE_CONTENT,
    [liveSiteContent]
  );

  // If Firestore has been initialized (liveSiteContent !== null), reflect live published projects directly
  // so unpublishing a project removes it from the public website immediately.
  const projects = useMemo(() => {
    if (liveSiteContent !== null || livePublishedProjects.length > 0) {
      return livePublishedProjects;
    }
    return DEFAULT_PROJECTS;
  }, [livePublishedProjects, liveSiteContent]);

  const buildWhatsAppUrl = (payload?: WhatsAppPayload) => {
    const cleanPhone = (siteContent.whatsappNumber || '923000000000').replace(/[^\d]/g, '');
    const customerName = payload?.customerName?.trim() || 'Prospective Investor';
    const projectName = payload?.projectName?.trim() || 'AL-JALIL GARDEN';
    const details =
      payload?.details?.trim() ||
      'I would like to receive verified project details, plot availability, and consultation times.';

    const text = [
      `Assalam-o-Alaikum AL-Amaan Developers,`,
      `Name: ${customerName}`,
      `Project: ${projectName}`,
      `Inquiry: ${details}`,
    ].join('\n');

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const value: AppContextValue = {
    projects,
    allAdminProjects,
    inquiries,
    siteContent,
    hasLiveProjectsInDb: livePublishedProjects.length > 0 || allAdminProjects.length > 0,
    hasLiveSiteContentInDb: liveSiteContent !== null,
    user,
    isAdmin,
    authLoading,
    dataLoading,
    authError,
    signInWithGoogle,
    signInWithEmail,
    sendPasswordReset,
    signOutUser,
    initializeDatabaseDefaults,
    buildWhatsAppUrl,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
