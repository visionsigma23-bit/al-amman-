/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AdminLayout } from './components/admin/AdminLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { AppProvider } from './context/AppContext';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminInquiriesPage } from './pages/admin/AdminInquiriesPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminProjectFormPage } from './pages/admin/AdminProjectFormPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip flex flex-col bg-[#F6F7F9] text-[#252525]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Website Routes */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <HomePage />
                </PublicLayout>
              }
            />
            <Route
              path="/about"
              element={
                <PublicLayout>
                  <AboutPage />
                </PublicLayout>
              }
            />
            <Route
              path="/projects"
              element={
                <PublicLayout>
                  <ProjectsPage />
                </PublicLayout>
              }
            />
            <Route
              path="/projects/:slug"
              element={
                <PublicLayout>
                  <ProjectDetailPage />
                </PublicLayout>
              }
            />
            <Route
              path="/al-jalil-garden"
              element={
                <PublicLayout>
                  <ProjectDetailPage forcedSlug="al-jalil-garden" />
                </PublicLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <PublicLayout>
                  <ContactPage />
                </PublicLayout>
              }
            />

            {/* Admin Auth & Protected Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="projects" element={<AdminProjectsPage />} />
              <Route path="projects/add" element={<AdminProjectFormPage mode="add" />} />
              <Route path="projects/edit/:id" element={<AdminProjectFormPage mode="edit" />} />
              <Route path="inquiries" element={<AdminInquiriesPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            <Route
              path="*"
              element={
                <PublicLayout>
                  <HomePage />
                </PublicLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}
