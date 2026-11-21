/**
 * Dirty Dozen Security Rule Verification Matrix for AL-Amaan Developers.
 * Reference test suite matching security_spec.md for @firebase/rules-unit-testing.
 */

export const DIRTY_DOZEN_CASES = [
  {
    id: 'DD-01',
    name: 'Unauthenticated Project Creation',
    collection: 'projects',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-02',
    name: 'Non-Admin Verified User Project Update',
    collection: 'projects',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-03',
    name: 'Unverified Email Spoof Attack on Admin',
    collection: 'projects',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-04',
    name: 'Shadow Field Injection on Public Inquiry',
    collection: 'inquiries',
    operation: 'create',
    payload: { isAdmin: true },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-05',
    name: 'Inquiry Status Tampering on Create',
    collection: 'inquiries',
    operation: 'create',
    payload: { status: 'contacted' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-06',
    name: 'Public PII Read / List on Inquiries',
    collection: 'inquiries',
    operation: 'list',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-07',
    name: 'Unpublished Draft Project Scraping',
    collection: 'projects',
    operation: 'get',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-08',
    name: 'Timestamp Forgery on Inquiry Create',
    collection: 'inquiries',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-09',
    name: 'Denial-of-Wallet Oversized Inquiry Message (>3000 chars)',
    collection: 'inquiries',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-10',
    name: 'Path Variable ID Poisoning (>128 chars or invalid characters)',
    collection: 'inquiries',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-11',
    name: 'Self-Admin Privilege Escalation',
    collection: 'admins',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-12',
    name: 'Non-Admin Site Content Tampering',
    collection: 'site_content',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
  },
] as const;
