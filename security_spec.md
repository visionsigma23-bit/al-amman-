# Firestore Security Specification & Payload-First TDD

## 1. Data Invariants
1. **Unpublished Draft Isolation**: Documents in `/projects/{projectId}` with `published == false` are strictly invisible to unauthenticated visitors and non-admin users (`get` and `list` must enforce `resource.data.published == true || isAdmin()`).
2. **Inquiry PII Isolation**: Documents in `/inquiries/{inquiryId}` contain personal contact information (`name`, `phone`, `email`). Public visitors can ONLY `create` inquiries with `status == 'new'` and `createdAt == request.time`. Only verified administrators (`isAdmin()`) can `get`, `list`, `update`, or `delete` inquiries.
3. **Admin Escalation Prevention**: No user can self-register into `/admins/{adminId}` or modify role fields. Only the bootstrapped verified admin email (`visionsigma23@gmail.com` with `email_verified == true`) or an existing `/admins/{uid}` document holder can manage admin records or mutate projects and site content.
4. **Strict Schema & Bounds**: Every string has explicit `.size()` bounds, arrays have bounded lengths (`<= 24`), extra shadow fields are rejected via `keys().hasOnly(...)` / `affectedKeys().hasOnly(...)`, and timestamps must equal `request.time`.
5. **Path ID Hardening**: All single-document operations validate `isValidId(id)` (`^[a-zA-Z0-9_\-]+$`, max 128 chars).

## 2. The "Dirty Dozen" Adversarial Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Project Creation**: Unauthenticated `create` on `/projects/al-jalil-garden` -> Denied (`!isAdmin()`).
2. **Non-Admin Verified User Project Update**: Authenticated non-admin user attempts `update` on `/projects/al-jalil-garden` -> Denied (`!isAdmin()`).
3. **Email Spoofing Attack**: User with `email: "visionsigma23@gmail.com"` and `email_verified: false` attempts admin write -> Denied (`email_verified == true` check fails).
4. **Shadow Field Injection on Inquiry**: Public visitor sends inquiry with extra `"isAdmin": true` or `"approved": true` field -> Denied (`keys().hasOnly(...)` fails).
5. **Inquiry Status Tampering on Create**: Public visitor creates inquiry with `status: "contacted"` instead of `"new"` -> Denied.
6. **Public PII Read / List**: Unauthenticated or non-admin user calls `get` or `list` on `/inquiries` -> Denied.
7. **Unpublished Project Scraping**: Unauthenticated user calls `get` on an unpublished draft project (`published: false`) -> Denied.
8. **Timestamp Forgery on Inquiry**: Public visitor sends `createdAt: "2020-01-01T00:00:00Z"` instead of `serverTimestamp()` -> Denied (`createdAt == request.time` fails).
9. **Denial-of-Wallet Oversized String**: Public visitor sends a 10,000-character inquiry `message` (limit 3000) -> Denied.
10. **ID Poisoning Attack**: Visitor attempts `create` on `/inquiries/` with a 200-char invalid ID containing `$` or spaces -> Denied (`isValidId()` fails).
11. **Self-Admin Privilege Escalation**: Authenticated non-admin user attempts `setDoc` on `/admins/{theirUid}` -> Denied.
12. **Site Content Tampering**: Non-admin user attempts to modify `whatsappNumber` in `/site_content/main` -> Denied.
