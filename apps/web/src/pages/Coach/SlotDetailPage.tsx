import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { t } from '@/utils/i18n';

export function SlotDetailPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <PageHeader title={`${t('schedule', 'addSlot')} · ${id ?? ''}`} />
      <EmptyState description={t('common', 'comingSoon')} />
    </div>
  );
}
