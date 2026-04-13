import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { t } from '@/utils/i18n';

export function ManualSlotPage() {
  return (
    <div>
      <PageHeader title={t('schedule', 'addSlot')} />
      <EmptyState description={t('common', 'comingSoon')} />
    </div>
  );
}
