import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { RequireAdmin, RequireAuth } from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ExcursionsPage from './pages/ExcursionsPage';
import TrackingPage from './pages/TrackingPage';
import PaymentsPage from './pages/PaymentsPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route element={<RequireAuth />}>
            <Route path="/excursions" element={<ExcursionsPage />} />
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