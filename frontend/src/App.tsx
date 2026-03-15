import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import { LoginPage } from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Production and Service pages (Prod project)
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import QuoteViewPage from './pages/QuoteViewPage';
import { PhotoboothPage } from './pages/PhotoboothPage';
import { ProductionPage } from './pages/ProductionPage';
import { ContactPage } from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';
import TransferPage from './pages/TransferPage'; // Import TransferPage
import { AboutPage } from './pages/AboutPage';
import { FAQPage } from './pages/FAQPage';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './context';

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
              <Route path="login" element={<LoginPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="transfer/:token" element={<TransferPage />} /> {/* Standalone Route */}

              <Route path="photobooth" element={<PhotoboothPage />} />
              <Route path="production" element={<ProductionPage />} />
              <Route path="services" element={<ServicesPage />} />
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
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

