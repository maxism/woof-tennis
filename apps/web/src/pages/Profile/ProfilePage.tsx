import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { updateMe } from '@/api/users';
import { useUIStore } from '@/stores/uiStore';
import { ROUTES } from '@/utils/constants';
import { t } from '@/utils/i18n';

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const setActiveRole = useUIStore((s) => s.setActiveRole);
  const qc = useQueryClient();

  const toggleCoach = useMutation({
    mutationFn: () => updateMe({ isCoach: !user?.isCoach }),
    onSuccess: (u) => {
      const cur = useAuthStore.getState().user;
      if (!cur) return;
      updateUser({ ...cur, ...u, stats: cur.stats });
      setActiveRole(u.isCoach ? 'coach' : 'player');
      void qc.invalidateQueries();
      toast.success(t('common', 'save'));
    },
    onError: () => toast.error(t('common', 'retry')),
  });

  if (!user) return null;

  const name = `${user.firstName} ${user.lastName ?? ''}`.trim();

  return (
    <div>
      <PageHeader title={t('profile', 'title')} />
      <Card className="flex flex-row items-center gap-3">
        <Avatar src={user.photoUrl} name={user.firstName} size={56} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-tg-text">{name}</p>
          {user.username ? (
            <p className="text-sm text-tg-hint">@{user.username}</p>
          ) : null}
        </div>
      </Card>
      {user.stats ? (
        <Card className="mt-3">
          <p className="text-sm text-tg-hint">{t('profile', 'statsBookings')}</p>
          <p className="text-lg font-semibold text-tg-text">
            {user.stats.totalBookingsAsPlayer} / {user.stats.totalBookingsAsCoach}
          </p>
        </Card>
      ) : null}
      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-tg-hint">{t('profile', 'accountRole')}</p>
        <Button
          variant="secondary"
          className="w-full"
          disabled={toggleCoach.isPending}
          onClick={() => toggleCoach.mutate()}
        >
          {user.isCoach ? t('roles', 'asCoach') : t('roles', 'enableCoach')} —{' '}
          {user.isCoach ? 'Выкл' : 'Вкл'}
        </Button>
      </div>
      <Card className="mt-4">
        <p className="text-sm font-medium text-tg-hint">{t('profile', 'coachCabinet')}</p>
        <p className="mt-1 text-sm text-tg-text">{t('profile', 'coachToolsHint')}</p>
        <div className="mt-3 grid grid-cols-1 gap-2">
          <Link to={ROUTES.coach.locations}>
            <Button variant="secondary" className="w-full">{t('nav', 'locations')}</Button>
          </Link>
          <Link to={ROUTES.coach.schedule}>
            <Button variant="secondary" className="w-full">{t('nav', 'schedule')}</Button>
          </Link>
        </div>
      </Card>
      <Card className="mt-4">
        <p className="text-sm font-medium text-tg-hint">{t('profile', 'notificationsArchive')}</p>
        <Link to={ROUTES.notifications}>
          <Button className="mt-3 w-full">{t('nav', 'notifications')}</Button>
        </Link>
      </Card>
    </div>
  );
}
