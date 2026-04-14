import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { attachPlayer, createEvent, createInvite } from '@/api/events';
import { createLocation, fetchMyLocations } from '@/api/locations';
import { searchUsersByUsername } from '@/api/users';
import { InviteLinkShare } from '@/components/play/InviteLinkShare';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { ROUTES } from '@/utils/constants';
import { getApiErrorCode, getApiErrorMessage } from '@/utils/apiError';
import { t } from '@/utils/i18n';

// ─── Types ────────────────────────────────────────────────────────────────────

type CreateState =
  | { kind: 'idle' }
  | { kind: 'attach-success'; eventId: string }
  | { kind: 'invite-success'; inviteLink: string }
  | { kind: 'time-conflict' };

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-woof-border bg-tg-secondary-bg px-4 py-3">
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-tg-hint">
        {label}
      </p>
      {children}
    </div>
  );
}

// ─── Tag chip (invite targets) ────────────────────────────────────────────────

function TagChip({
  value,
  onRemove,
}: {
  value: string;
  onRemove: () => void;
}) {
  return (
    <span className="flex items-center gap-1 rounded-full border border-woof-border bg-tg-bg px-3 py-1 text-sm text-tg-text">
      @{value}
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 leading-none text-tg-hint hover:text-woof-danger"
        aria-label={`Удалить @${value}`}
      >
        ×
      </button>
    </span>
  );
}

// ─── Terminal screens ─────────────────────────────────────────────────────────

function TerminalCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={title} />
      <div className="rounded-2xl border border-woof-border bg-tg-secondary-bg px-4 py-4">
        {children}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CreateEventPage() {
  const qc = useQueryClient();

  // Form state
  const [locationId, setLocationId] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [playerUsername, setPlayerUsername] = useState('');
  const [inviteTargetInput, setInviteTargetInput] = useState('');
  const [inviteTargets, setInviteTargets] = useState<string[]>([]);

  // Inline location creation
  const [showCreateLocation, setShowCreateLocation] = useState(false);
  const [newLocName, setNewLocName] = useState('');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [newLocDescription, setNewLocDescription] = useState('');
  const [newLocWebsite, setNewLocWebsite] = useState('');

  // Result state
  const [createState, setCreateState] = useState<CreateState>({ kind: 'idle' });

  // ── Data fetching ────────────────────────────────────────────────────────

  const locationsQuery = useQuery({
    queryKey: ['locations', 'mine', 'active'],
    queryFn: () => fetchMyLocations({ isActive: true }),
    staleTime: 300_000,
  });

  const normalizedUsername = playerUsername.trim().replace(/^@/, '').toLowerCase();

  const playerSuggestionsQuery = useQuery({
    queryKey: ['users', 'search', normalizedUsername],
    queryFn: () => searchUsersByUsername(normalizedUsername),
    enabled: normalizedUsername.length >= 2,
    staleTime: 60_000,
  });

  const resolvedPlayerId = useMemo(
    () =>
      playerSuggestionsQuery.data?.find(
        (c) => c.username?.toLowerCase() === normalizedUsername,
      )?.id,
    [normalizedUsername, playerSuggestionsQuery.data],
  );

  // ── Mutations ────────────────────────────────────────────────────────────

  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['events', 'my'] }),
  });

  const createLocationMutation = useMutation({
    mutationFn: createLocation,
    onSuccess: (loc) => {
      setLocationId(loc.id);
      setShowCreateLocation(false);
      setNewLocName('');
      setNewLocAddress('');
      setNewLocDescription('');
      setNewLocWebsite('');
      void qc.invalidateQueries({ queryKey: ['locations', 'mine'] });
    },
  });

  // ── Helpers ──────────────────────────────────────────────────────────────

  const toIso = (v: string) => new Date(v).toISOString();

  const addInviteTarget = (value: string) => {
    const n = value.trim().replace(/^@/, '').toLowerCase();
    if (!n || inviteTargets.includes(n)) return;
    setInviteTargets((prev) => [...prev, n]);
    setInviteTargetInput('');
  };

  const handleStartsAtChange = (value: string) => {
    setStartsAt(value);
    if (!value) return;
    const end = new Date(value);
    end.setHours(end.getHours() + 1);
    const endLocal = end.toISOString().slice(0, 16);
    if (!endsAt || new Date(endsAt) <= new Date(value)) setEndsAt(endLocal);
  };

  // ── Actions ──────────────────────────────────────────────────────────────

  const handleAttach = async () => {
    if (!resolvedPlayerId) return;
    try {
      const event = await createEventMutation.mutateAsync({
        locationId,
        startsAt: toIso(startsAt),
        endsAt: toIso(endsAt),
        recurrence: null,
        isRecurring,
      });
      await attachPlayer(event.id, resolvedPlayerId);
      setCreateState({ kind: 'attach-success', eventId: event.id });
    } catch (err) {
      if (getApiErrorCode(err) === 'EVENT_TIME_CONFLICT') {
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
      setCreateState({
        kind: 'invite-success',
        inviteLink: `${window.location.origin}${ROUTES.invite(invite.code)}`,
      });
    } catch (err) {
      if (getApiErrorCode(err) === 'EVENT_TIME_CONFLICT') {
        setCreateState({ kind: 'time-conflict' });
      }
    }
  };

  // ── Terminal screens ─────────────────────────────────────────────────────

  if (createState.kind === 'attach-success') {
    return (
      <TerminalCard title={t('event', 'attachSuccess')}>
        <p className="mb-4 text-sm text-tg-hint">
          Игрок получит уведомление в Telegram.
        </p>
        <Link to={ROUTES.home}>
          <Button className="w-full">{t('event', 'attachCta')}</Button>
        </Link>
      </TerminalCard>
    );
  }

  if (createState.kind === 'invite-success') {
    return (
      <div className="flex flex-col gap-3">
        <PageHeader title={t('event', 'inviteSuccess')} />
        <InviteLinkShare inviteLink={createState.inviteLink} />
      </div>
    );
  }

  if (createState.kind === 'time-conflict') {
    return (
      <TerminalCard title={t('event', 'timeConflict')}>
        <Button className="w-full" onClick={() => setCreateState({ kind: 'idle' })}>
          {t('event', 'timeConflictCta')}
        </Button>
      </TerminalCard>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────

  const isPending = createEventMutation.isPending || createLocationMutation.isPending;
  const canAttach = Boolean(locationId && startsAt && endsAt && resolvedPlayerId);
  const canInvite = Boolean(locationId && startsAt && endsAt && inviteTargets.length);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t('event', 'createTitle')} />

      {/* ── Когда ── */}
      <Section label="Когда">
        <div className="flex flex-col gap-2">
          <Input
            type="datetime-local"
            label={t('event', 'startsAt')}
            value={startsAt}
            onChange={(e) => handleStartsAtChange(e.target.value)}
          />
          <Input
            type="datetime-local"
            label={t('event', 'endsAt')}
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
          />
          <label className="flex cursor-pointer items-center gap-2 pt-1 text-sm text-tg-text">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="h-4 w-4 accent-woof-accent"
            />
            {t('event', 'recurring')}
          </label>
        </div>
      </Section>

      {/* ── Где ── */}
      <Section label="Где">
        <select
          value={locationId}
          onChange={(e) => {
            if (e.target.value === '__new__') {
              setShowCreateLocation(true);
            } else {
              setLocationId(e.target.value);
              setShowCreateLocation(false);
            }
          }}
          className="w-full min-h-11 rounded-xl border border-woof-border bg-tg-bg px-3 text-sm text-tg-text focus:outline-none focus:ring-2 focus:ring-woof-accent/40"
        >
          <option value="">Выберите локацию</option>
          {locationsQuery.data?.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
          <option value="__new__">+ {t('event', 'createLocation')}</option>
        </select>

        {showCreateLocation ? (
          <div className="mt-3 flex flex-col gap-2 border-t border-woof-border pt-3">
            <Input
              label={t('location', 'name')}
              value={newLocName}
              onChange={(e) => setNewLocName(e.target.value)}
            />
            <Input
              label={t('location', 'address')}
              value={newLocAddress}
              onChange={(e) => setNewLocAddress(e.target.value)}
            />
            <Input
              label={t('location', 'description')}
              value={newLocDescription}
              onChange={(e) => setNewLocDescription(e.target.value)}
            />
            <Input
              label={t('location', 'website')}
              value={newLocWebsite}
              onChange={(e) => setNewLocWebsite(e.target.value)}
            />
            <Button
              variant="secondary"
              disabled={!newLocName.trim() || !newLocAddress.trim() || isPending}
              onClick={() =>
                createLocationMutation.mutate({
                  name: newLocName.trim(),
                  address: newLocAddress.trim(),
                  description: newLocDescription.trim(),
                  website: newLocWebsite.trim(),
                })
              }
            >
              {t('location', 'save')}
            </Button>
          </div>
        ) : null}
      </Section>

      {/* ── Участник ── */}
      <Section label="Участник">
        {/* Direct attach via username */}
        <div className="flex flex-col gap-2">
          <Input
            label={t('event', 'playerUsername')}
            value={playerUsername}
            onChange={(e) => setPlayerUsername(e.target.value)}
            placeholder="@username"
          />

          {/* Autocomplete suggestions */}
          {playerSuggestionsQuery.data?.length ? (
            <div className="rounded-xl border border-woof-border bg-tg-bg">
              {playerSuggestionsQuery.data.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-tg-text hover:bg-tg-secondary-bg"
                  onClick={() =>
                    setPlayerUsername(c.username ? `@${c.username}` : '')
                  }
                >
                  <span className="font-medium">
                    {[c.firstName, c.lastName].filter(Boolean).join(' ')}
                  </span>
                  {c.username ? (
                    <span className="text-xs text-tg-hint">@{c.username}</span>
                  ) : null}
                  {resolvedPlayerId === c.id ? (
                    <span className="ml-auto text-xs font-semibold text-woof-accent">
                      ✓
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Divider */}
        <div className="my-3 flex items-center gap-2">
          <div className="flex-1 border-t border-woof-border" />
          <span className="text-xs text-tg-hint">или пригласить по ссылке</span>
          <div className="flex-1 border-t border-woof-border" />
        </div>

        {/* Invite targets */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              label={t('event', 'inviteTargets')}
              value={inviteTargetInput}
              onChange={(e) => setInviteTargetInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  addInviteTarget(inviteTargetInput);
                }
              }}
              placeholder="@username"
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => addInviteTarget(inviteTargetInput)}
              disabled={!inviteTargetInput.trim()}
              className="mt-5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-woof-border bg-tg-bg text-lg text-tg-hint disabled:opacity-40"
              aria-label={t('event', 'addTarget')}
            >
              +
            </button>
          </div>

          {inviteTargets.length ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {inviteTargets.map((target) => (
                <TagChip
                  key={target}
                  value={target}
                  onRemove={() =>
                    setInviteTargets((prev) => prev.filter((x) => x !== target))
                  }
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-tg-hint">{t('event', 'noInviteTargets')}</p>
          )}
        </div>
      </Section>

      {/* ── Actions ── */}
      <div className="flex flex-col gap-2">
        <Button disabled={!canAttach || isPending} onClick={handleAttach}>
          {t('event', 'actionAttach')}
        </Button>
        <Button
          variant="secondary"
          disabled={!canInvite || isPending}
          onClick={handleInvite}
        >
          {t('event', 'actionInvite')}
        </Button>
      </div>

      {createEventMutation.isError ? (
        <p className="rounded-xl border border-woof-danger/30 bg-woof-danger/10 px-3 py-2 text-sm text-woof-danger">
          {getApiErrorMessage(createEventMutation.error, t('common', 'retry'))}
        </p>
      ) : null}
    </div>
  );
}
