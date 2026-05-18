import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import Home from './pages/Home';
// import { ServicesPage } from './pages/ServicesPage'; // 🔒 Next version
// import { PhotoboothPage } from './pages/PhotoboothPage'; // 🔒 Next version
// import { ProductionPage } from './pages/ProductionPage'; // 🔒 Next version
import { PortfolioPage } from './pages/PortfolioPage';
import QuoteViewPage from './pages/QuoteViewPage';
import { ContactPage } from './pages/ContactPage';
import { ComingSoonPage } from './pages/ComingSoonPage'; // 🔒 Reservation blocked until next version
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';
import TransferPage from './pages/TransferPage'; // Import TransferPage
import { AboutPage } from './pages/AboutPage';
import { FAQPage } from './pages/FAQPage';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './context';
import { NotFoundPage } from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="transfer/:token" element={<TransferPage />} /> {/* Standalone Route */}

              {/* 🔒 RESERVATION BLOCKED - next version */}
              <Route path="photobooth" element={<ComingSoonPage />} />
              <Route path="production" element={<ComingSoonPage />} />
              <Route path="services" element={<ComingSoonPage />} />
              {/* eslint-disable-next-line */}
              {/* Original pages (PhotoboothPage, ProductionPage, ServicesPage) kept for next version */}
              <Route path="portfolio" element={<PortfolioPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="faq" element={<FAQPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="projects/:slug" element={<ProjectPage />} />
              <Route path="quotes/:quoteNumber" element={<QuoteViewPage />} />

              {/* Protected Routes */}
              <Route element={<RequireAuth />}>
                <Route path="dashboard" element={<DashboardPage />} />
              </Route>
              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

