# AL-Amaan Developers – Real Estate Website & Admin Panel

A scalable corporate real estate web application for **AL-Amaan Developers**, featuring **AL-JALIL GARDEN** and a Firebase-backed Admin Dashboard for managing unlimited future projects, inquiries, and company settings.

## Architecture & Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, React Router v7, Motion
- **Backend / Database**: Firebase Authentication, Cloud Firestore, Firebase Storage
- **Security**: Hardened Firestore Security Rules (`firestore.rules`) validated with `@firebase/eslint-plugin-security-rules`
- **SEO**: Dynamic route titles/meta/OpenGraph (`SEOHead`), Schema.org JSON-LD (`index.html`), `public/robots.txt`, `public/sitemap.xml`

## Admin Routes
- `/admin/login` — Administrator sign-in (Email/Password + Forgot Password + Google Sign-In)
- `/admin/dashboard` — Overview metrics, recent inquiries, and quick actions
- `/admin/projects` — Project catalog management (publish/unpublish, feature, edit, delete)
- `/admin/projects/add` — Add new project with cover & multiple gallery image uploads
- `/admin/projects/edit/:id` — Edit existing project details
- `/admin/inquiries` — Customer inquiry management (`new`, `contacted`, `completed`, `archived`, WhatsApp & Email replies)
- `/admin/settings` — Company name, logo upload, contact numbers, WhatsApp number, office address, social links, statistics, and sample testimonials

## Firebase Setup & Admin Authorization
1. Provisioned Firebase client configuration resides in `firebase-applet-config.json`.
2. **Enable Email/Password Authentication** (for Email/Password login & Forgot Password):
   - Open the [Firebase Console](https://console.firebase.google.com/) for project `gen-lang-client-0158019776`.
   - Go to **Authentication -> Sign-in method -> Email/Password** and enable it.
   - Under **Authentication -> Users**, create your admin user (or sign in via **Continue with Google** using `visionsigma23@gmail.com`).
   - If you create an additional Email/Password admin user, ensure its email is verified (`email_verified: true`) and add a document at `/admins/{uid}` in Cloud Firestore (`{ email, role: "admin", createdAt }`).
3. **Firebase Storage**:
   - Ensure Firebase Storage is enabled in your Firebase Console for uploading project cover images, gallery images, and company logos.
4. **Deploy Security Rules**:
   - Lint rules: `npx eslint firestore.rules`
   - Deploy rules: `firebase deploy --only firestore:rules`

## Local Development & Deployment
```bash
npm install
npm run lint
npm run build
```
Serve the built `dist/` bundle with SPA fallback routing to `index.html`.
