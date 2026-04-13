import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { t } from '@/utils/i18n';

export function LocationFormPage() {
  return (
    <div>
      <PageHeader title={t('location', 'add')} />
      <EmptyState description={t('common', 'comingSoon')} />
    </div>
  );
}
