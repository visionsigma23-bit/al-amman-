import { useApp } from '../../context/AppContext';
import { SiteContentEditor } from '../../components/admin/SiteContentEditor';
import { SEOHead } from '../../components/SEOHead';
import { useAdminNotify } from '../../components/admin/AdminLayout';

export function AdminSettingsPage() {
  const { siteContent } = useApp();
  const { notify } = useAdminNotify();

  return (
    <>
      <SEOHead
        title={`Company Settings – ${siteContent.companyName} Admin`}
        description="Update company settings, logo, WhatsApp number, and website copy."
      />
      <SiteContentEditor siteContent={siteContent} onNotify={notify} />
    </>
  );
}
