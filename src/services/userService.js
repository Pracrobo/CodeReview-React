import { API_BASE_URL } from './api.js';

export async function fetchUserAndPlan(token) {
  const res = await fetch(`${API_BASE_URL}/payment/status`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `HTTP error: ${res.status}`);
  }

  return res.json();
}