import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function normalizeRole(role: string | null | undefined) {
  return role?.trim().toLowerCase() ?? '';
}

export function RequireAuth() {
  const outletContext = useOutletContext();
  const { isLogedIn, role } = useAuth();
  const normalizedRole = normalizeRole(role);

  if (!isLogedIn || !['user', 'admin', 'owner'].includes(normalizedRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet context={outletContext} />;
}

export function RequireAdmin() {
  const outletContext = useOutletContext();
  const { isLogedIn, role } = useAuth();
  const normalizedRole = normalizeRole(role);

  if (!isLogedIn || normalizedRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet context={outletContext} />;
}

export function RequireAdminOrOwner() {
  const outletContext = useOutletContext();
  const { isLogedIn, role } = useAuth();
  const normalizedRole = normalizeRole(role);

  if (!isLogedIn || !['admin', 'owner'].includes(normalizedRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet context={outletContext} />;
}
