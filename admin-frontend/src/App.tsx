import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import UserDetailPage from './pages/UserDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import ProjectsCreatePage from './pages/ProjectsCreatePage';
import ProjectsEditPage from './pages/ProjectsEditPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import Settings from './pages/Settings';
import PlannerPage from './pages/PlannerPage';

import PortfolioPage from './pages/portfolio/PortfolioPage';
import BookingsPage from './pages/services/BookingsPage';
import BookingsCalendarPage from './pages/services/BookingsCalendarPage';
import ServiceOffersPage from './pages/services/ServiceOffersPage';

import PagesManagement from './pages/content/PagesManagement';
import PageEditor from './pages/content/PageEditor';

import AnnouncementsPage from './pages/marketing/AnnouncementsPage';
import FAQsPage from './pages/marketing/FAQsPage';
import MessagesPage from './pages/marketing/MessagesPage';
import AuditPage from './pages/system/AuditPage';
import SystemStatusPage from './pages/system/SystemStatusPage';

function App() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Routes protégées */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Services Routes */}
          <Route path="/services/bookings" element={<BookingsPage />} />
          <Route path="/services/calendar" element={<BookingsCalendarPage />} />
          <Route path="/services/offers" element={<ServiceOffersPage />} />
          <Route path="/services/portfolio" element={<PortfolioPage />} />

          {/* Other Routes */}
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/new" element={<ProjectsCreatePage />} />
          <Route path="/projects/:id/edit" element={<ProjectsEditPage />} />
          <Route path="/users" element={<ClientsPage />} />
          <Route path="/users/:id" element={<UserDetailPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/settings" element={<Settings />} />

          {/* Content Routes */}
          <Route path="/content/pages" element={<PagesManagement />} />
          <Route path="/content/pages/new" element={<PageEditor />} />
          <Route path="/content/pages/:id/edit" element={<PageEditor />} />

          {/* Marketing Routes */}
          <Route path="/marketing/announcements" element={<AnnouncementsPage />} />
          <Route path="/marketing/faqs" element={<FAQsPage />} />
          <Route path="/marketing/messages" element={<MessagesPage />} />

          {/* System Routes */}
          <Route path="/system/audit" element={<AuditPage />} />
          <Route path="/system/status" element={<SystemStatusPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;