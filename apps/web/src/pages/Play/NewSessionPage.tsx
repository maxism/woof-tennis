import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createPlaySession } from '@/api/play-sessions';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { InviteLinkShare } from '@/components/play/InviteLinkShare';
import { ROUTES } from '@/utils/constants';
import { t } from '@/utils/i18n';

export function NewSessionPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
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
      void qc.invalidateQueries({ queryKey: ['play-session'] });
      void qc.invalidateQueries({ queryKey: ['play-sessions', 'my'] });
      void qc.invalidateQueries({ queryKey: ['bookings', 'my'] });
      setCreatedLink(url);
      toast.success(t('playSession', 'create'));
    },
    onError: () => toast.error(t('common', 'retry')),
  });

  const backToPrevious = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/');
  };

  if (createdLink) {
    return (
      <div>
        <PageHeader
          title={t('playSession', 'share')}
          right={
            <Button variant="ghost" size="sm" onClick={() => setCreatedLink(null)}>
              {t('common', 'back')}
            </Button>
          }
        />
        <InviteLinkShare inviteLink={createdLink} />
        <Button
          variant="secondary"
          className="mt-3 w-full"
          onClick={() => navigate(ROUTES.play.mine)}
        >
          {t('nav', 'play')}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t('playSession', 'create')}
        right={
          <Button variant="ghost" size="sm" onClick={backToPrevious}>
            {t('common', 'back')}
          </Button>
        }
      />
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
