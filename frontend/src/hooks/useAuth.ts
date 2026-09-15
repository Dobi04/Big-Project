import { useCallback, useState } from 'react';
import { apiClient } from '../api/client';

function getStoredUsername() {
  return localStorage.getItem('username') || '';
}

function getStoredRole() {
  return localStorage.getItem('role') || 'User';
}

export function useAuth() {
  const [username, setUsername] = useState(getStoredUsername);
  const [role, setRole] = useState(getStoredRole);

  const isLogedIn = Boolean(username);

  const refresh = useCallback(() => {
    setUsername(getStoredUsername());
    setRole(getStoredRole());
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUsername('');
    setRole('User');
  }, []);

  return { username, role, isLogedIn, refresh, logout };
}