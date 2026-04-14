import { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/Home/HomePage';
import { ProfilePage } from '@/pages/Profile/ProfilePage';
import { NotificationsPage } from '@/pages/Notifications/NotificationsPage';
import { SearchPage } from '@/pages/Player/SearchPage';
import { CoachProfilePage } from '@/pages/Player/CoachProfilePage';
import { BookingDetailPage } from '@/pages/Player/BookingDetailPage';
import { LocationsPage } from '@/pages/Coach/LocationsPage';
import { LocationFormPage } from '@/pages/Coach/LocationFormPage';
import { SchedulePage } from '@/pages/Coach/SchedulePage';
import { TemplateFormPage } from '@/pages/Coach/TemplateFormPage';
import { SlotDetailPage } from '@/pages/Coach/SlotDetailPage';
import { ManualSlotPage } from '@/pages/Coach/ManualSlotPage';
import { NewSessionPage } from '@/pages/Play/NewSessionPage';
import { JoinSessionPage } from '@/pages/Play/JoinSessionPage';
import { MySessionsPage } from '@/pages/Play/MySessionsPage';
import { ReviewFormPage } from '@/pages/Reviews/ReviewFormPage';
import { useBootstrapAuth } from '@/hooks/useBootstrapAuth';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { getStartParam, subscribeTelegramTheme, syncThemeFromTelegram } from '@/utils/telegram';
import { parsePlayInviteFromStartParam } from '@/utils/invite';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';

function DeepLinkHandler() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    const code = parsePlayInviteFromStartParam(getStartParam());
    if (code) navigate(`/play/${code}`, { replace: true });
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

function PlayerRoute({ children }: { children: React.ReactNode }) {
  const isCoach = useAuthStore((s) => Boolean(s.user?.isCoach));
  const activeRole = useUIStore((s) => s.activeRole);
  if (isCoach && activeRole === 'coach') return <Navigate to="/" replace />;
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
            <Route path="notifications" element={<NotificationsPage />} />

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
            <Route
              path="coach/schedule"
              element={
                <CoachRoute>
                  <SchedulePage />
                </CoachRoute>
              }
            />
            <Route
              path="coach/schedule/template/new"
              element={
                <CoachRoute>
                  <TemplateFormPage />
                </CoachRoute>
              }
            />
            <Route
              path="coach/schedule/template/:id/edit"
              element={
                <CoachRoute>
                  <TemplateFormPage />
                </CoachRoute>
              }
            />
            <Route
              path="coach/schedule/slot/new"
              element={
                <CoachRoute>
                  <ManualSlotPage />
                </CoachRoute>
              }
            />
            <Route
              path="coach/slot/:id"
              element={
                <CoachRoute>
                  <SlotDetailPage />
                </CoachRoute>
              }
            />

            <Route
              path="player/search"
              element={
                <PlayerRoute>
                  <SearchPage />
                </PlayerRoute>
              }
            />
            <Route
              path="player/coach/:id"
              element={
                <PlayerRoute>
                  <CoachProfilePage />
                </PlayerRoute>
              }
            />
            <Route
              path="player/booking/:id"
              element={
                <PlayerRoute>
                  <BookingDetailPage />
                </PlayerRoute>
              }
            />

            <Route
              path="play/mine"
              element={
                <PlayerRoute>
                  <MySessionsPage />
                </PlayerRoute>
              }
            />
            <Route
              path="play/new"
              element={
                <PlayerRoute>
                  <NewSessionPage />
                </PlayerRoute>
              }
            />
            <Route path="play/:inviteCode" element={<JoinSessionPage />} />

            <Route path="review/:bookingId" element={<ReviewFormPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthShell>
    </BrowserRouter>
  );
}
