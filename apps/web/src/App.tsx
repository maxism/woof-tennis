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
import { ReviewFormPage } from '@/pages/Reviews/ReviewFormPage';
import { useBootstrapAuth } from '@/hooks/useBootstrapAuth';
import { useAuthStore } from '@/stores/authStore';
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

function AuthShell({ children }: { children: React.ReactNode }) {
  useBootstrapAuth();
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthShell>
        <DeepLinkHandler />
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />

            <Route path="coach/locations" element={<LocationsPage />} />
            <Route path="coach/locations/new" element={<LocationFormPage />} />
            <Route path="coach/locations/:id/edit" element={<LocationFormPage />} />
            <Route path="coach/schedule" element={<SchedulePage />} />
            <Route path="coach/schedule/template/new" element={<TemplateFormPage />} />
            <Route path="coach/schedule/template/:id/edit" element={<TemplateFormPage />} />
            <Route path="coach/schedule/slot/new" element={<ManualSlotPage />} />
            <Route path="coach/slot/:id" element={<SlotDetailPage />} />

            <Route path="player/search" element={<SearchPage />} />
            <Route path="player/coach/:id" element={<CoachProfilePage />} />
            <Route path="player/booking/:id" element={<BookingDetailPage />} />

            <Route path="play/new" element={<NewSessionPage />} />
            <Route path="play/:inviteCode" element={<JoinSessionPage />} />

            <Route path="review/:bookingId" element={<ReviewFormPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthShell>
    </BrowserRouter>
  );
}
