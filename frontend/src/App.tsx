import CafeDetailPage from '@/pages/CafeDetailPage';
import CafeListPage from '@/pages/CafeListPage';
import CreateCafePage from '@/pages/CreateCafePage';
import EditCafePage from '@/pages/EditCafePage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import CafeMapPage from './pages/CafeMapPage';
import DashboardPage from './pages/DashboardPage';
import RecommendationsPage from './pages/RecommendationsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/cafes" replace />} />
        <Route path="/cafes" element={<CafeListPage />} />
        <Route path="/cafes/map" element={<CafeMapPage />} />
        <Route path="/cafes/new" element={<CreateCafePage />} />
        <Route path="/cafes/:id" element={<CafeDetailPage />} />
        <Route path="/cafes/:id/edit" element={<EditCafePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
