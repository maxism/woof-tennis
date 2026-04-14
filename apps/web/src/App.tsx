import { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/Home/HomePage';
import { ProfilePage } from '@/pages/Profile/ProfilePage';
import { NotificationsPage } from '@/pages/Notifications/NotificationsPage';
import { InviteAcceptPage } from '@/pages/Player/InviteAcceptPage';
import { LocationsPage } from '@/pages/Coach/LocationsPage';
import { LocationFormPage } from '@/pages/Coach/LocationFormPage';
import { CreateEventPage } from '@/pages/Play/CreateEventPage';
import { useBootstrapAuth } from '@/hooks/useBootstrapAuth';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { getStartParam, subscribeTelegramTheme, syncThemeFromTelegram } from '@/utils/telegram';
import { parsePlayInviteFromStartParam } from '@/utils/invite';
import { ROUTES } from '@/utils/constants';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';

function DeepLinkHandler() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    const code = parsePlayInviteFromStartParam(getStartParam());
    if (code) navigate(ROUTES.invite(code), { replace: true });
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    syncThemeFromTelegram();
    return subscribeTelegramTheme(() => syncThemeFromTelegram());
  }, []);

  return null;
}

function RoleStateSync() {
  const isCoach = useAuthStore((s) => Boolean(s.user?.isCoach));
  const activeRole = useUIStore((s) => s.activeRole);
  const setActiveRole = useUIStore((s) => s.setActiveRole);

  useEffect(() => {
    if (!isCoach && activeRole === 'coach') {
      setActiveRole('player');
    }
  }, [isCoach, activeRole, setActiveRole]);

  return null;
}

function AuthShell({ children }: { children: React.ReactNode }) {
  useBootstrapAuth();
  return <>{children}</>;
}

function CoachRoute({ children }: { children: React.ReactNode }) {
  const isCoach = useAuthStore((s) => Boolean(s.user?.isCoach));
  const activeRole = useUIStore((s) => s.activeRole);
  if (!isCoach || activeRole !== 'coach') return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthShell>
        <DeepLinkHandler />
        <RoleStateSync />
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/notifications" element={<NotificationsPage />} />

            <Route
              path="coach/locations"
              element={
                <CoachRoute>
                  <LocationsPage />
                </CoachRoute>
              }
            />
            <Route
              path="coach/locations/new"
              element={
                <CoachRoute>
                  <LocationFormPage />
                </CoachRoute>
              }
            />
            <Route
              path="coach/locations/:id/edit"
              element={
                <CoachRoute>
                  <LocationFormPage />
                </CoachRoute>
              }
            />

            <Route path="play/create" element={<CreateEventPage />} />
            <Route path="player/invite/:code" element={<InviteAcceptPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthShell>
    </BrowserRouter>
  );
}
