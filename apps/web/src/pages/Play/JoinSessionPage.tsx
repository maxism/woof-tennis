import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fetchPlaySessionByInvite, joinPlaySession } from '@/api/play-sessions';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatSlotDate, formatTimeRange } from '@/utils/date';
import { t } from '@/utils/i18n';
import { hapticLight } from '@/utils/telegram';
import { ParticipantStatus } from '@wooftennis/shared';

export function JoinSessionPage() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ['play-session', 'invite', inviteCode],
    queryFn: () => fetchPlaySessionByInvite(inviteCode!),
    enabled: Boolean(inviteCode),
  });

  const join = useMutation({
    mutationFn: (sessionId: string) => joinPlaySession(sessionId),
    onSuccess: () => {
      hapticLight();
      toast.success(t('playSession', 'join'));
      void qc.invalidateQueries({ queryKey: ['play-session'] });
      void q.refetch();
    },
    onError: (err: unknown) => {
      const msg =
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'message' in err.response.data
          ? String((err.response.data as { message?: string }).message)
          : t('common', 'retry');
      toast.error(msg);
    },
  });

  if (q.isLoading) return <Spinner />;
  if (q.isError || !q.data) {
    return <EmptyState description={t('error', 'notFound')} />;
  }

  const s = q.data;
  const end = s.endTime ?? s.startTime;

  return (
    <div>
      <PageHeader title={t('playSession', 'join')} />
      <Card className="mb-4">
        <p className="font-medium text-tg-text">{formatSlotDate(s.date)}</p>
        <p className="text-sm text-tg-hint">
          {formatTimeRange(s.startTime, end)} · {s.locationText}
        </p>
        {s.comment ? <p className="mt-2 text-sm text-tg-text">{s.comment}</p> : null}
        {Array.isArray(s.participants) ? (
          <p className="mt-2 text-xs text-tg-hint">
            Участников:{' '}
            {s.participants.filter((p) => p.status === ParticipantStatus.Confirmed).length} /{' '}
            {s.maxPlayers}
          </p>
        ) : null}
      </Card>
      <Button
        variant="primary"
        className="w-full"
        disabled={join.isPending}
        onClick={() => q.data && join.mutate(q.data.id)}
      >
        {t('playSession', 'join')}
      </Button>
    </div>
  );
}
