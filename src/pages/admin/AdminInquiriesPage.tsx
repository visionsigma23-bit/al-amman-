import { useApp } from '../../context/AppContext';
import { InquiriesManager } from '../../components/admin/InquiriesManager';
import { SEOHead } from '../../components/SEOHead';
import { useAdminNotify } from '../../components/admin/AdminLayout';

export function AdminInquiriesPage() {
  const { inquiries, siteContent } = useApp();
  const { notify } = useAdminNotify();

  return (
    <>
      <SEOHead
        title={`Inquiries – ${siteContent.companyName} Admin`}
        description="Manage customer inquiries for AL-Amaan Developers."
      />
      <InquiriesManager inquiries={inquiries} onNotify={notify} />
    </>
  );
}
