import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { attachPlayer, createEvent, createInvite } from '@/api/events';
import { createLocation, fetchMyLocations } from '@/api/locations';
import { searchUsersByUsername } from '@/api/users';
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
  const [isRecurring, setIsRecurring] = useState(false);
  const [playerUsername, setPlayerUsername] = useState('');
  const [inviteTargetInput, setInviteTargetInput] = useState('');
  const [inviteTargets, setInviteTargets] = useState<string[]>([]);
  const [showCreateLocation, setShowCreateLocation] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationAddress, setNewLocationAddress] = useState('');
  const [newLocationDescription, setNewLocationDescription] = useState('');
  const [newLocationWebsite, setNewLocationWebsite] = useState('');
  const [createState, setCreateState] = useState<CreateState>({ kind: 'idle' });

  const locationsQuery = useQuery({
    queryKey: ['locations', 'mine', 'active'],
    queryFn: () => fetchMyLocations({ isActive: true }),
    staleTime: 300_000,
  });

  const normalizedPlayerUsername = playerUsername.trim().replace(/^@/, '').toLowerCase();
  const playerSuggestionsQuery = useQuery({
    queryKey: ['users', 'search', normalizedPlayerUsername],
    queryFn: () => searchUsersByUsername(normalizedPlayerUsername),
    enabled: normalizedPlayerUsername.length >= 2,
    staleTime: 60_000,
  });
  const resolvedAttachPlayerId = useMemo(() => {
    return playerSuggestionsQuery.data?.find(
      (candidate) => candidate.username?.toLowerCase() === normalizedPlayerUsername,
    )?.id;
  }, [normalizedPlayerUsername, playerSuggestionsQuery.data]);

  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['events', 'my'] });
    },
  });

  const createLocationMutation = useMutation({
    mutationFn: createLocation,
    onSuccess: (location) => {
      setLocationId(location.id);
      setShowCreateLocation(false);
      setNewLocationName('');
      setNewLocationAddress('');
      setNewLocationDescription('');
      setNewLocationWebsite('');
      void qc.invalidateQueries({ queryKey: ['locations', 'mine'] });
    },
  });

  const addInviteTarget = (value: string) => {
    const normalized = value.trim().replace(/^@/, '').toLowerCase();
    if (!normalized) return;
    if (inviteTargets.includes(normalized)) return;
    setInviteTargets((prev) => [...prev, normalized]);
    setInviteTargetInput('');
  };

  const toIso = (value: string) => new Date(value).toISOString();

  const handleAttach = async () => {
    if (!resolvedAttachPlayerId) return;
    try {
      const event = await createEventMutation.mutateAsync({
        locationId,
        startsAt: toIso(startsAt),
        endsAt: toIso(endsAt),
        recurrence: null,
        isRecurring,
      });
      const attached = await attachPlayer(event.id, resolvedAttachPlayerId);
      setCreateState({ kind: 'attach-success', eventId: attached.id });
    } catch (error) {
      const code = getApiErrorCode(error);
      if (code === 'EVENT_TIME_CONFLICT') {
        setCreateState({ kind: 'time-conflict' });
      }
    }
  };

  const handleInvite = async () => {
    if (!inviteTargets.length) return;
    try {
      const event = await createEventMutation.mutateAsync({
        locationId,
        startsAt: toIso(startsAt),
        endsAt: toIso(endsAt),
        recurrence: null,
        isRecurring,
      });
      const invite = await createInvite(event.id, { targets: inviteTargets });
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
      <div className="flex flex-col gap-2">
        <label className="text-sm text-tg-hint">{t('event', 'locationId')}</label>
        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className="min-h-11 rounded-xl border border-woof-border bg-tg-bg px-3 text-tg-text"
        >
          <option value="">{t('common', 'empty')}</option>
          {locationsQuery.data?.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name} - {location.address}
            </option>
          ))}
        </select>
        <Button variant="secondary" size="sm" onClick={() => setShowCreateLocation((prev) => !prev)}>
          {t('event', 'createLocation')}
        </Button>
      </div>

      {showCreateLocation ? (
        <Card>
          <div className="flex flex-col gap-2">
            <Input label={t('location', 'name')} value={newLocationName} onChange={(e) => setNewLocationName(e.target.value)} />
            <Input label={t('location', 'address')} value={newLocationAddress} onChange={(e) => setNewLocationAddress(e.target.value)} />
            <Input
              label={t('location', 'description')}
              value={newLocationDescription}
              onChange={(e) => setNewLocationDescription(e.target.value)}
            />
            <Input label={t('location', 'website')} value={newLocationWebsite} onChange={(e) => setNewLocationWebsite(e.target.value)} />
            <Button
              variant="secondary"
              onClick={() =>
                createLocationMutation.mutate({
                  name: newLocationName.trim(),
                  address: newLocationAddress.trim(),
                  description: newLocationDescription.trim(),
                  website: newLocationWebsite.trim(),
                })
              }
              disabled={!newLocationName.trim() || !newLocationAddress.trim() || createLocationMutation.isPending}
            >
              {t('location', 'save')}
            </Button>
          </div>
        </Card>
      ) : null}

      <Input
        type="datetime-local"
        label={t('event', 'startsAt')}
        value={startsAt}
        onChange={(e) => {
          const nextStart = e.target.value;
          setStartsAt(nextStart);
          if (!nextStart) return;
          const nextEndDate = new Date(nextStart);
          nextEndDate.setHours(nextEndDate.getHours() + 1);
          const nextEndLocal = nextEndDate.toISOString().slice(0, 16);
          if (!endsAt || new Date(endsAt).getTime() <= new Date(nextStart).getTime()) {
            setEndsAt(nextEndLocal);
          }
        }}
      />
      <Input type="datetime-local" label={t('event', 'endsAt')} value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
      <label className="flex items-center gap-2 text-sm text-tg-text">
        <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} />
        {t('event', 'recurring')}
      </label>

      <Input
        label={t('event', 'playerUsername')}
        value={playerUsername}
        onChange={(e) => setPlayerUsername(e.target.value)}
        placeholder="@username"
      />
      {playerSuggestionsQuery.data?.length ? (
        <div className="rounded-xl border border-woof-border bg-tg-secondary-bg p-2 text-sm text-tg-text">
          {playerSuggestionsQuery.data.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              className="block w-full rounded-lg px-2 py-1 text-left hover:bg-woof-secondary-bg"
              onClick={() => setPlayerUsername(candidate.username ? `@${candidate.username}` : '')}
            >
              {(candidate.firstName || '').trim()} {candidate.lastName ?? ''} ({candidate.username ? `@${candidate.username}` : candidate.id})
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Input
          label={t('event', 'inviteTargets')}
          value={inviteTargetInput}
          onChange={(e) => setInviteTargetInput(e.target.value)}
          placeholder="@username"
        />
        <Button variant="secondary" size="sm" onClick={() => addInviteTarget(inviteTargetInput)}>
          {t('event', 'addTarget')}
        </Button>
        {inviteTargets.length ? (
          <div className="flex flex-wrap gap-2">
            {inviteTargets.map((target) => (
              <button
                key={target}
                type="button"
                className="rounded-full border border-woof-border px-3 py-1 text-sm text-tg-text"
                onClick={() => setInviteTargets((prev) => prev.filter((item) => item !== target))}
                title="Удалить"
              >
                @{target} ×
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-tg-hint">{t('event', 'noInviteTargets')}</p>
        )}
      </div>

      <Button disabled={!locationId || !startsAt || !endsAt || !resolvedAttachPlayerId} onClick={handleAttach}>
        {t('event', 'actionAttach')}
      </Button>
      <Button
        variant="secondary"
        disabled={!locationId || !startsAt || !endsAt || !inviteTargets.length}
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
