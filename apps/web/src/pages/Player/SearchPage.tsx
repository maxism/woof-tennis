import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { searchUsersByUsername } from '@/api/users';
import { ROUTES } from '@/utils/constants';
import { t } from '@/utils/i18n';

export function SearchPage() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const search = useMutation({
    mutationFn: (value: string) => searchUsersByUsername(value),
  });

  function runSearch() {
    const trimmed = username.trim();
    if (!trimmed) return;
    search.mutate(trimmed);
  }

  return (
    <div>
      <PageHeader title={t('search', 'title')} />
      <div className="mt-6 flex flex-col gap-2">
        <Input
          label={t('search', 'usernameLabel')}
          placeholder={t('search', 'usernamePlaceholder')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              runSearch();
            }
          }}
        />
        <Button variant="secondary" onClick={runSearch} disabled={search.isPending || !username.trim()}>
          {t('common', 'open')}
        </Button>
      </div>

      {search.isError ? (
        <EmptyState
          title={t('common', 'retry')}
          description={t('search', 'searchError')}
          action={
            <Button variant="secondary" className="mt-3" onClick={runSearch}>
              {t('common', 'retry')}
            </Button>
          }
        />
      ) : null}

      {search.isSuccess && search.data.length === 0 ? (
        <EmptyState title={t('search', 'notFound')} description={t('search', 'notFoundHelp')} />
      ) : null}

      {search.data && search.data.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-2">
          {search.data.map((user) => (
            <li key={user.id}>
              <Card className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-tg-text">
                    {[user.firstName, user.lastName].filter(Boolean).join(' ')}
                  </p>
                  <p className="text-sm text-tg-hint">@{user.username}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => navigate(ROUTES.player.coach(user.id))}>
                  {t('search', 'openCoach')}
                </Button>
              </Card>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
