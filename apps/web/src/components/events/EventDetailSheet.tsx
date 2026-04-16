import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { EventItem } from '@wooftennis/shared';
import { EventStatus } from '@wooftennis/shared';
import { cancelEvent, completeEvent, rescheduleEvent } from '@/api/events';
import { Button } from '@/components/ui/Button';
import { getLocationColor, STATUS_CONFIG, fmtDuration } from '@/utils/eventColors';
import { ROUTES } from '@/utils/constants';
import { t } from '@/utils/i18n';

interface Props {
  event: EventItem | null;
  onClose: () => void;
}

function fmtDetailDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function fmtHM(iso: string) {
  return new Date(iso).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Returns the date part "YYYY-MM-DD" for a datetime-local input value */
function toDateInput(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Returns "HH:MM" for a time input */
function toTimeInput(iso: string) {
  return new Date(iso).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

const TERMINAL_STATUSES: EventStatus[] = [EventStatus.Cancelled, EventStatus.Completed];

export function EventDetailSheet({ event, onClose }: Props) {
  const qc = useQueryClient();
  const [showReschedule, setShowReschedule] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTimeStart, setRescheduleTimeStart] = useState('');
  const [rescheduleTimeEnd, setRescheduleTimeEnd] = useState('');

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ['events', 'my'] });
    onClose();
  };

  const cancelMut = useMutation({
    mutationFn: () => cancelEvent(event!.id),
    onSuccess: invalidate,
    onError: () => toast.error(t('common', 'retry')),
  });

  const completeMut = useMutation({
    mutationFn: () => completeEvent(event!.id),
    onSuccess: invalidate,
    onError: () => toast.error(t('common', 'retry')),
  });

  const rescheduleMut = useMutation({
    mutationFn: () => {
      const startsAt = new Date(`${rescheduleDate}T${rescheduleTimeStart}`).toISOString();
      const endsAt = new Date(`${rescheduleDate}T${rescheduleTimeEnd}`).toISOString();
      return rescheduleEvent(event!.id, { startsAt, endsAt });
    },
    onSuccess: invalidate,
    onError: () => toast.error(t('common', 'retry')),
  });

  if (!event) return null;

  const locationColor = getLocationColor(event.locationId);
  const status = STATUS_CONFIG[event.status];
  const duration = fmtDuration(event.startsAt, event.endsAt);
  const isTerminal = TERMINAL_STATUSES.includes(event.status as EventStatus);
  const canComplete =
    event.status === EventStatus.Attached ||
    event.status === EventStatus.Accepted ||
    event.status === EventStatus.Rescheduled;

  const handleOpenReschedule = () => {
    setRescheduleDate(toDateInput(event.startsAt));
    setRescheduleTimeStart(toTimeInput(event.startsAt));
    setRescheduleTimeEnd(toTimeInput(event.endsAt));
    setShowReschedule(true);
  };

  const handleShare = async () => {
    const link = `${window.location.origin}${ROUTES.invite(event.inviteCode!)}`;
    if (navigator.share) {
      await navigator.share({ url: link }).catch(() => null);
    } else {
      await navigator.clipboard.writeText(link).catch(() => null);
      toast.success(t('event', 'linkCopied'));
    }
  };

  const isPending = cancelMut.isPending || completeMut.isPending || rescheduleMut.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Закрыть"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative z-10 w-full max-w-lg rounded-t-3xl border-t border-woof-border bg-tg-bg pb-safe shadow-xl">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-woof-border" />
        </div>

        <div className="px-4 pb-6 pt-2">
          {/* Location strip + date/time header */}
          <div className="mb-4 flex items-start gap-3">
            <div
              className="mt-1 h-full w-1 self-stretch rounded-full"
              style={{ backgroundColor: locationColor, minHeight: 48 }}
            />
            <div className="flex-1">
              <p className="text-xs font-medium capitalize text-tg-hint">
                {fmtDetailDate(event.startsAt)}
              </p>
              <p className="mt-0.5 text-xl font-bold text-tg-text">
                {fmtHM(event.startsAt)} — {fmtHM(event.endsAt)}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {duration ? (
                  <span className="text-sm text-tg-hint">{duration}</span>
                ) : null}
                {event.isRecurring ? (
                  <span className="rounded-full bg-woof-accent/10 px-2 py-px text-xs font-semibold text-woof-accent">
                    ↺ Повторяется
                  </span>
                ) : null}
                <span
                  className="rounded-full px-2 py-px text-xs font-semibold"
                  style={{ color: status.color, backgroundColor: status.bg }}
                >
                  {status.label}
                </span>
              </div>
            </div>
          </div>

          {/* Location name */}
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-tg-secondary-bg px-3 py-2.5">
            <span
              className="h-3 w-3 flex-shrink-0 rounded-full"
              style={{ backgroundColor: locationColor }}
            />
            <span className="text-sm font-medium text-tg-text">
              {event.locationName ?? 'Локация'}
            </span>
          </div>

          {/* Reschedule form (inline) */}
          {showReschedule ? (
            <div className="mb-4 rounded-2xl border border-woof-border bg-tg-secondary-bg px-3 py-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-tg-hint">
                {t('event', 'rescheduleTitle')}
              </p>
              <div className="flex flex-col gap-2">
                <div>
                  <label className="mb-1 block text-xs text-tg-hint">{t('event', 'rescheduleDate')}</label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full min-h-11 rounded-xl border border-woof-border bg-tg-bg px-3 text-sm text-tg-text outline-none focus:border-woof-accent focus:ring-1 focus:ring-woof-accent"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-tg-hint">{t('event', 'rescheduleTimeStart')}</label>
                    <input
                      type="time"
                      value={rescheduleTimeStart}
                      onChange={(e) => setRescheduleTimeStart(e.target.value)}
                      className="w-full min-h-11 rounded-xl border border-woof-border bg-tg-bg px-3 text-sm text-tg-text outline-none focus:border-woof-accent focus:ring-1 focus:ring-woof-accent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-tg-hint">{t('event', 'rescheduleTimeEnd')}</label>
                    <input
                      type="time"
                      value={rescheduleTimeEnd}
                      onChange={(e) => setRescheduleTimeEnd(e.target.value)}
                      className="w-full min-h-11 rounded-xl border border-woof-border bg-tg-bg px-3 text-sm text-tg-text outline-none focus:border-woof-accent focus:ring-1 focus:ring-woof-accent"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setShowReschedule(false)}
                    disabled={isPending}
                  >
                    {t('common', 'cancel')}
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={!rescheduleDate || !rescheduleTimeStart || !rescheduleTimeEnd || isPending}
                    onClick={() => rescheduleMut.mutate()}
                  >
                    {t('event', 'rescheduleConfirm')}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Cancel confirm */}
          {showCancelConfirm ? (
            <div className="mb-4 rounded-2xl border border-woof-danger/20 bg-woof-danger/5 px-3 py-3">
              <p className="mb-1 text-sm font-semibold text-woof-danger">{t('event', 'cancelConfirm')}</p>
              <p className="mb-3 text-xs text-tg-hint">{t('event', 'cancelHint')}</p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={isPending}
                >
                  {t('common', 'back')}
                </Button>
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-woof-danger px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  disabled={isPending}
                  onClick={() => cancelMut.mutate()}
                >
                  {t('event', 'actionCancel')}
                </button>
              </div>
            </div>
          ) : null}

          {/* Actions */}
          {!isTerminal && !showReschedule && !showCancelConfirm ? (
            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                onClick={handleOpenReschedule}
                disabled={isPending}
              >
                {t('event', 'actionReschedule')}
              </Button>
              {canComplete ? (
                <Button onClick={() => completeMut.mutate()} disabled={isPending}>
                  {t('event', 'actionComplete')}
                </Button>
              ) : null}
              {event.inviteCode ? (
                <Button variant="secondary" onClick={handleShare} disabled={isPending}>
                  {t('event', 'actionShare')}
                </Button>
              ) : null}
              <button
                type="button"
                className="mt-1 text-sm font-medium text-woof-danger disabled:opacity-50"
                disabled={isPending}
                onClick={() => setShowCancelConfirm(true)}
              >
                {t('event', 'actionCancel')}
              </button>
            </div>
          ) : null}

          {/* Closed event — just show close */}
          {isTerminal && !showReschedule && !showCancelConfirm ? (
            <Button variant="secondary" className="w-full" onClick={onClose}>
              {t('common', 'back')}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
