import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { DEFAULT_PROJECTS, DEFAULT_SITE_CONTENT } from '../data/defaultContent';
import { Inquiry, InquiryStatus, Project, SiteContent } from '../types/realestate';
import { db, handleFirestoreError, OperationType, storage } from './firebase';

const PROJECTS_COLLECTION = 'projects';
const INQUIRIES_COLLECTION = 'inquiries';
const SITE_CONTENT_COLLECTION = 'site_content';
const SITE_CONTENT_DOC_ID = 'main';
const ADMINS_COLLECTION = 'admins';

export const BOOTSTRAPPED_ADMIN_EMAIL = 'visionsigma23@gmail.com';

function clampString(value: string | undefined, max: number): string {
  return (value ?? '').trim().slice(0, max);
}

function clampStringArray(items: string[] | undefined, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => item.trim().slice(0, maxLen))
    .filter((item) => item.length > 0)
    .slice(0, maxItems);
}

export function slugifyProjectName(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

export function generateSafeDocId(prefix?: string): string {
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 16)
      : `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const cleanPrefix = prefix ? `${prefix.replace(/[^a-zA-Z0-9_-]/g, '')}_` : '';
  return `${cleanPrefix}${randomPart}`.slice(0, 120);
}

export function subscribePublishedProjects(
  onData: (projects: Project[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(collection(db, PROJECTS_COLLECTION), where('published', '==', true));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        ...(d.data() as Omit<Project, 'id'>),
        id: d.id,
      }));
      items.sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, PROJECTS_COLLECTION);
      } catch (wrapped) {
        onError?.(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export function subscribeAllProjects(
  onData: (projects: Project[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(collection(db, PROJECTS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        ...(d.data() as Omit<Project, 'id'>),
        id: d.id,
      }));
      items.sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, PROJECTS_COLLECTION);
      } catch (wrapped) {
        onError?.(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export async function upsertProject(project: Project, isNew: boolean): Promise<void> {
  const safeId = (project.id || slugifyProjectName(project.slug || project.name)).replace(
    /[^a-zA-Z0-9_-]/g,
    ''
  );
  if (!safeId) {
    throw new Error('Project ID or slug is required.');
  }

  const slug = slugifyProjectName(project.slug || project.name);
  if (!slug || slug.length < 2) {
    throw new Error('Project slug must be at least 2 alphanumeric characters.');
  }

  const path = `${PROJECTS_COLLECTION}/${safeId}`;
  const docRef = doc(db, PROJECTS_COLLECTION, safeId);

  const payload = {
    name: clampString(project.name, 140),
    slug,
    location: clampString(project.location, 180),
    category: clampString(project.category, 60) || 'Residential & Commercial',
    status: clampString(project.status, 60) || 'Upcoming',
    shortDescription: clampString(project.shortDescription, 360),
    fullDescription: clampString(project.fullDescription, 6000),
    coverImage: clampString(project.coverImage, 1000),
    galleryImages: clampStringArray(project.galleryImages, 12, 1000),
    amenities: clampStringArray(project.amenities, 24, 160),
    plotSizes: clampStringArray(project.plotSizes, 16, 120),
    propertyCategories: (project.propertyCategories ?? []).slice(0, 8).map((c) => ({
      title: clampString(c.title, 100),
      subtitle: clampString(c.subtitle, 100),
      description: clampString(c.description, 400),
    })),
    developmentHighlights: clampStringArray(project.developmentHighlights, 12, 300),
    investmentInfo: clampString(project.investmentInfo, 3000),
    locationNote: clampString(project.locationNote, 1200),
    mapEmbedUrl: clampString(project.mapEmbedUrl, 1000),
    faqs: (project.faqs ?? []).slice(0, 12).map((f) => ({
      question: clampString(f.question, 240),
      answer: clampString(f.answer, 1000),
    })),
    contactPhone: clampString(project.contactPhone, 40),
    contactEmail: clampString(project.contactEmail, 120),
    featured: Boolean(project.featured),
    published: Boolean(project.published),
    displayOrder: Number.isFinite(project.displayOrder) ? project.displayOrder : 1,
    updatedAt: serverTimestamp(),
  };

  try {
    if (isNew) {
      await setDoc(docRef, {
        ...payload,
        createdAt: serverTimestamp(),
      });
    } else {
      await updateDoc(docRef, payload);
    }
  } catch (error) {
    handleFirestoreError(error, isNew ? OperationType.CREATE : OperationType.UPDATE, path);
  }
}

export async function deleteProjectById(projectId: string): Promise<void> {
  const path = `${PROJECTS_COLLECTION}/${projectId}`;
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeSiteContent(
  onData: (content: SiteContent | null) => void,
  onError?: (err: Error) => void
): () => void {
  const path = `${SITE_CONTENT_COLLECTION}/${SITE_CONTENT_DOC_ID}`;
  return onSnapshot(
    doc(db, SITE_CONTENT_COLLECTION, SITE_CONTENT_DOC_ID),
    (snap) => {
      if (snap.exists()) {
        onData(snap.data() as SiteContent);
      } else {
        onData(null);
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch (wrapped) {
        onError?.(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  const path = `${SITE_CONTENT_COLLECTION}/${SITE_CONTENT_DOC_ID}`;
  const docRef = doc(db, SITE_CONTENT_COLLECTION, SITE_CONTENT_DOC_ID);

  const payload = {
    companyName: clampString(content.companyName, 100),
    companyLogoUrl: clampString(content.companyLogoUrl, 1000),
    tagline: clampString(content.tagline, 160),
    heroHeadline: clampString(content.heroHeadline, 160),
    heroSubtitle: clampString(content.heroSubtitle, 500),
    aboutPreviewTitle: clampString(content.aboutPreviewTitle, 180),
    aboutPreviewBody: clampString(content.aboutPreviewBody, 2000),
    aboutFullStory: clampString(content.aboutFullStory, 6000),
    whatsappNumber: clampString(content.whatsappNumber.replace(/[^\d+]/g, ''), 30) || '923000000000',
    contactPhone: clampString(content.contactPhone, 40),
    contactEmail: clampString(content.contactEmail, 120),
    officeAddress: clampString(content.officeAddress, 400),
    officeHours: clampString(content.officeHours, 160),
    socialLinks: {
      facebook: clampString(content.socialLinks?.facebook, 240),
      instagram: clampString(content.socialLinks?.instagram, 240),
      linkedin: clampString(content.socialLinks?.linkedin, 240),
      youtube: clampString(content.socialLinks?.youtube, 240),
    },
    stats: (content.stats ?? []).slice(0, 6).map((s) => ({
      label: clampString(s.label, 80),
      value: clampString(s.value, 60),
      note: clampString(s.note, 140),
    })),
    testimonials: (content.testimonials ?? []).slice(0, 6).map((t) => ({
      quote: clampString(t.quote, 600),
      author: clampString(t.author, 100),
      role: clampString(t.role, 120),
      project: clampString(t.project, 100),
    })),
    ctaHeadline: clampString(content.ctaHeadline, 200),
    ctaSubtext: clampString(content.ctaSubtext, 400),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(docRef, payload, { merge: false });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function submitInquiry(input: {
  name: string;
  phone: string;
  email: string;
  interestedProject: string;
  message: string;
  sourcePage?: string;
}): Promise<string> {
  const inquiryId = generateSafeDocId('inq');
  const path = `${INQUIRIES_COLLECTION}/${inquiryId}`;

  const payload = {
    name: clampString(input.name, 120),
    phone: clampString(input.phone, 40),
    email: clampString(input.email, 160),
    interestedProject: clampString(input.interestedProject, 160),
    message: clampString(input.message, 3000),
    sourcePage: clampString(input.sourcePage, 120) || '/',
    status: 'new' as InquiryStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, INQUIRIES_COLLECTION, inquiryId), payload);
    return inquiryId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeInquiries(
  onData: (inquiries: Inquiry[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(collection(db, INQUIRIES_COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        ...(d.data() as Omit<Inquiry, 'id'>),
        id: d.id,
      }));
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, INQUIRIES_COLLECTION);
      } catch (wrapped) {
        onError?.(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export async function updateInquiryStatus(
  inquiryId: string,
  status: InquiryStatus,
  adminNotes: string
): Promise<void> {
  const path = `${INQUIRIES_COLLECTION}/${inquiryId}`;
  try {
    await updateDoc(doc(db, INQUIRIES_COLLECTION, inquiryId), {
      status,
      adminNotes: clampString(adminNotes, 2000),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteInquiryById(inquiryId: string): Promise<void> {
  const path = `${INQUIRIES_COLLECTION}/${inquiryId}`;
  try {
    await deleteDoc(doc(db, INQUIRIES_COLLECTION, inquiryId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function checkIsAdminUser(uid: string, email: string | null, emailVerified: boolean): Promise<boolean> {
  if (emailVerified && email === BOOTSTRAPPED_ADMIN_EMAIL) {
    return true;
  }
  const path = `${ADMINS_COLLECTION}/${uid}`;
  try {
    const snap = await getDoc(doc(db, ADMINS_COLLECTION, uid));
    return snap.exists();
  } catch {
    return false;
  }
}

export async function seedInitialFirestoreData(): Promise<void> {
  for (const project of DEFAULT_PROJECTS) {
    const existing = await getDoc(doc(db, PROJECTS_COLLECTION, project.id));
    if (!existing.exists()) {
      await upsertProject(project, true);
    }
  }
  const existingSite = await getDoc(doc(db, SITE_CONTENT_COLLECTION, SITE_CONTENT_DOC_ID));
  if (!existingSite.exists()) {
    await saveSiteContent(DEFAULT_SITE_CONTENT);
  }
}

export async function uploadProjectImage(file: File, folder = 'projects'): Promise<string> {
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storageRef = ref(storage, `${folder}/${Date.now()}_${cleanName}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}
