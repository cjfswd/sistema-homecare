import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import HomePage from './pages/HomePage';
import ClinicalPage from './pages/ClinicalPage';
import VidasRHPage from './pages/VidasRHPage';
import FinancesPage from './pages/FinancesPage';
import TabelasPage from './pages/TabelasPage';
import ReportsPage from './pages/ReportsPage';
import StockPage from './pages/StockPage';
import LogsPage from './pages/LogsPage';
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
            <Route path="vidas-rh" element={<VidasRHPage />} />
            <Route path="administrative" element={<Navigate to="/vidas-rh" replace />} />
            <Route path="finances" element={<FinancesPage />} />
            <Route path="tabelas" element={<TabelasPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="stock" element={<StockPage />} />
            <Route path="logs" element={<LogsPage />} />
            <Route path="auth" element={<AuthorizationPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
