import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import HomePage from './pages/HomePage';
import ClinicalPage from './pages/ClinicalPage';
import PatientsPage from './pages/PatientsPage';
import PatientDetailPage from './pages/PatientDetailPage';
import ProfessionalsPage from './pages/ProfessionalsPage';
import ProfessionalDetailPage from './pages/ProfessionalDetailPage';
import FinancesPage from './pages/FinancesPage';
import TabelasPage from './pages/TabelasPage';
import ReportsPage from './pages/ReportsPage';
import StockPage from './pages/StockPage';
import LogsPage from './pages/LogsPage';
import NotificationsPage from './pages/NotificationsPage';
import AuthorizationPage from './pages/AuthorizationPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<HomePage />} />
            <Route path="clinical" element={<ClinicalPage />} />

            {/* Pacientes */}
            <Route path="pacientes" element={<PatientsPage />} />
            <Route path="pacientes/:id" element={<PatientDetailPage />} />

            {/* Profissionais */}
            <Route path="profissionais" element={<ProfessionalsPage />} />
            <Route path="profissionais/:id" element={<ProfessionalDetailPage />} />

            {/* Redirects de rotas antigas */}
            <Route path="vidas-rh" element={<Navigate to="/pacientes" replace />} />
            <Route path="administrative" element={<Navigate to="/pacientes" replace />} />

            <Route path="finances" element={<FinancesPage />} />
            <Route path="tabelas" element={<TabelasPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="stock" element={<StockPage />} />
            <Route path="logs" element={<LogsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="auth" element={<AuthorizationPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
