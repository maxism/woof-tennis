import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { acceptInvite, declineInvite, fetchInviteByCode } from '@/api/invites';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Spinner } from '@/components/ui/Spinner';
import { getApiErrorCode } from '@/utils/apiError';
import { ROUTES } from '@/utils/constants';
import { t } from '@/utils/i18n';

type Terminal = 'invite_expired' | 'invite_invalid' | 'time_conflict' | 'cancelled' | null;

export function InviteAcceptPage() {
  const { code = '' } = useParams<{ code: string }>();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ['invite', 'code', code],
    queryFn: () => fetchInviteByCode(code),
    enabled: Boolean(code),
    retry: false,
  });
  const [terminal, setTerminal] = useState<Terminal>(null);

  const accept = useMutation({
    mutationFn: (inviteId: string) => acceptInvite(inviteId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['events', 'my'] });
      window.location.href = ROUTES.home;
    },
    onError: (error) => {
      const code = getApiErrorCode(error);
      if (code === 'INVITE_EXPIRED') setTerminal('invite_expired');
      else if (code === 'INVITE_INVALID') setTerminal('invite_invalid');
      else if (code === 'EVENT_TIME_CONFLICT') setTerminal('time_conflict');
    },
  });

  const decline = useMutation({
    mutationFn: (inviteId: string) => declineInvite(inviteId),
    onSuccess: () => {
      setTerminal('cancelled');
    },
  });

  if (q.isLoading) return <Spinner />;

  const errorCode = getApiErrorCode(q.error);
  const terminalState = terminal ?? (errorCode === 'INVITE_EXPIRED' ? 'invite_expired' : errorCode === 'INVITE_INVALID' ? 'invite_invalid' : null);

  if (terminalState) {
    const map = {
      invite_expired: [t('event', 'inviteExpired'), t('event', 'inviteExpiredCta')],
      invite_invalid: [t('event', 'inviteInvalid'), t('event', 'inviteInvalidCta')],
      time_conflict: [t('event', 'timeConflict'), t('event', 'timeConflictCta')],
      cancelled: [t('event', 'cancelled'), t('event', 'inviteInvalidCta')],
    } as const;
    return (
      <EmptyState
        title={map[terminalState][0]}
        action={
          <Button onClick={() => (window.location.href = ROUTES.home)}>
            {map[terminalState][1]}
          </Button>
        }
      />
    );
  }

  if (q.isError || !q.data) {
    return <EmptyState title={t('event', 'inviteInvalid')} />;
  }

  return (
    <div className="flex flex-col gap-3">
      <PageHeader title={t('event', 'accept')} />
      <Card>
        <p className="text-sm text-tg-text">
          {new Date(q.data.event.startsAt).toLocaleString('ru-RU')} - {new Date(q.data.event.endsAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </Card>
      <Button onClick={() => accept.mutate(q.data.inviteId)}>{t('event', 'accept')}</Button>
      <Button variant="secondary" onClick={() => decline.mutate(q.data.inviteId)}>
        {t('event', 'decline')}
      </Button>
    </div>
  );
}
