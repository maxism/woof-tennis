import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ROUTES } from '@/utils/constants';
import { t } from '@/utils/i18n';

export function SearchPage() {
  const [id, setId] = useState('');
  const navigate = useNavigate();

  function openCoach() {
    const trimmed = id.trim();
    if (!trimmed) return;
    navigate(ROUTES.player.coach(trimmed));
  }

  return (
    <div>
      <PageHeader title={t('search', 'title')} />
      <EmptyState title={t('search', 'empty')} />
      <div className="mt-6 flex flex-col gap-2">
        <Input
          label={t('common', 'openById')}
          placeholder={t('common', 'coachIdPlaceholder')}
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <Button variant="secondary" onClick={openCoach}>
          {t('common', 'open')}
        </Button>
      </div>
    </div>
  );
}
