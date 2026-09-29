import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { RequireAdmin, RequireAuth } from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import OrganisationsPage from './pages/OrganisationsPage';
import OrganisationDetailsPage from './pages/OrganisationDetailsPage';
import OrganisationWorkspacePage from './pages/OrganisationWorkspacePage';
import MyOrganisationsPage from './pages/MyOrganisationsPage';
import TrackingPage from './pages/TrackingPage';
import PaymentsPage from './pages/PaymentsPage';
import AdminPage from './pages/AdminPage';
import { apiClient } from './api/client';

function App() {
  useEffect(() => {
    apiClient
      .get('/api/Auth/me')
      .then((response) => {
        const { username, role } = response.data;
        localStorage.setItem('username', username);
        localStorage.setItem('role', role);
      })
      .catch(() =>{
        localStorage.removeItem('username');
        localStorage.removeItem('role');
      })
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/organisations" element={<OrganisationsPage />} />

          <Route element={<RequireAuth />}>
            <Route path="/organisations/:id" element={<OrganisationDetailsPage />} />
            <Route path="/organisations/:id/workspace" element={<OrganisationWorkspacePage />} />
            <Route path="/my-organisations" element={<MyOrganisationsPage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
          </Route>

          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;