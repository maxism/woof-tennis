import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createPlaySession } from '@/api/play-sessions';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { InviteLinkShare } from '@/components/play/InviteLinkShare';
import { t } from '@/utils/i18n';

export function NewSessionPage() {
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [locationText, setLocationText] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [comment, setComment] = useState('');

  const m = useMutation({
    mutationFn: () =>
      createPlaySession({
        locationText,
        date,
        startTime,
        maxPlayers,
        comment: comment || undefined,
      }),
    onSuccess: (session) => {
      const url = `${window.location.origin}/play/${session.inviteCode}`;
      setCreatedLink(url);
      toast.success(t('playSession', 'create'));
    },
    onError: () => toast.error(t('common', 'retry')),
  });

  if (createdLink) {
    return (
      <div>
        <PageHeader title={t('playSession', 'share')} />
        <InviteLinkShare inviteLink={createdLink} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={t('playSession', 'create')} />
      <div className="flex flex-col gap-3">
        <Input
          label={t('playSession', 'location')}
          value={locationText}
          onChange={(e) => setLocationText(e.target.value)}
        />
        <Input label={t('playSession', 'date')} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Input
          label={t('playSession', 'time')}
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <Input
          label={t('schedule', 'maxPlayers')}
          type="number"
          min={2}
          max={10}
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(Number(e.target.value))}
        />
        <Input
          label={t('playSession', 'comment')}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          variant="primary"
          className="w-full"
          disabled={m.isPending || !locationText || !date || !startTime}
          onClick={() => m.mutate()}
        >
          {t('playSession', 'create')}
        </Button>
      </div>
    </div>
  );
}
