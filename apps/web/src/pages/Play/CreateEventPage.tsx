import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { attachPlayer, createEvent, createInvite } from '@/api/events';
import { InviteLinkShare } from '@/components/play/InviteLinkShare';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { ROUTES } from '@/utils/constants';
import { getApiErrorCode, getApiErrorMessage } from '@/utils/apiError';
import { t } from '@/utils/i18n';

type CreateState =
  | { kind: 'idle' }
  | { kind: 'attach-success'; eventId: string }
  | { kind: 'invite-success'; inviteLink: string }
  | { kind: 'time-conflict' };

export function CreateEventPage() {
  const qc = useQueryClient();
  const [locationId, setLocationId] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [createState, setCreateState] = useState<CreateState>({ kind: 'idle' });

  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['events', 'my'] });
    },
  });

  const handleAttach = async () => {
    try {
      const event = await createEventMutation.mutateAsync({ locationId, startsAt, endsAt, recurrence: null });
      const attached = await attachPlayer(event.id, playerId);
      setCreateState({ kind: 'attach-success', eventId: attached.id });
    } catch (error) {
      const code = getApiErrorCode(error);
      if (code === 'EVENT_TIME_CONFLICT') {
        setCreateState({ kind: 'time-conflict' });
      }
    }
  };

  const handleInvite = async () => {
    try {
      const event = await createEventMutation.mutateAsync({ locationId, startsAt, endsAt, recurrence: null });
      const invite = await createInvite(event.id);
      const inviteLink = `${window.location.origin}${ROUTES.invite(invite.code)}`;
      setCreateState({ kind: 'invite-success', inviteLink });
    } catch (error) {
      const code = getApiErrorCode(error);
      if (code === 'EVENT_TIME_CONFLICT') {
        setCreateState({ kind: 'time-conflict' });
      }
    }
  };

  if (createState.kind === 'attach-success') {
    return (
      <Card>
        <p className="text-base font-semibold text-tg-text">{t('event', 'attachSuccess')}</p>
        <Link to={ROUTES.home}>
          <Button className="mt-3 w-full">{t('event', 'attachCta')}</Button>
        </Link>
      </Card>
    );
  }

  if (createState.kind === 'invite-success') {
    return (
      <div className="flex flex-col gap-3">
        <Card>
          <p className="text-base font-semibold text-tg-text">{t('event', 'inviteSuccess')}</p>
        </Card>
        <InviteLinkShare inviteLink={createState.inviteLink} />
      </div>
    );
  }

  if (createState.kind === 'time-conflict') {
    return (
      <Card>
        <p className="text-base font-semibold text-tg-text">{t('event', 'timeConflict')}</p>
        <Button className="mt-3 w-full" onClick={() => setCreateState({ kind: 'idle' })}>
          {t('event', 'timeConflictCta')}
        </Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <PageHeader title={t('event', 'createTitle')} />
      <Input label={t('event', 'locationId')} value={locationId} onChange={(e) => setLocationId(e.target.value)} />
      <Input label={t('event', 'startsAt')} value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
      <Input label={t('event', 'endsAt')} value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
      <Input label={t('event', 'playerId')} value={playerId} onChange={(e) => setPlayerId(e.target.value)} />
      <Button disabled={!locationId || !startsAt || !endsAt || !playerId} onClick={handleAttach}>
        {t('event', 'actionAttach')}
      </Button>
      <Button
        variant="secondary"
        disabled={!locationId || !startsAt || !endsAt}
        onClick={handleInvite}
      >
        {t('event', 'actionInvite')}
      </Button>
      {createEventMutation.isError ? (
        <p className="text-sm text-woof-danger">
          {getApiErrorMessage(createEventMutation.error, t('common', 'retry'))}
        </p>
      ) : null}
    </div>
  );
}
