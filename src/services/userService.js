import { API_BASE_URL } from './api.js';

export async function fetchUserAndPlan(token) {
  const res = await fetch(`${API_BASE_URL}/payment/status`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });
  return res.json();
}