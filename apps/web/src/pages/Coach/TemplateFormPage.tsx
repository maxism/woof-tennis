import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { t } from '@/utils/i18n';

export function TemplateFormPage() {
  return (
    <div>
      <PageHeader title={t('schedule', 'addTemplate')} />
      <EmptyState description={t('common', 'comingSoon')} />
    </div>
  );
}
