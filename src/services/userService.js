import { apiRequest } from './api.js';

export async function fetchUserAndPlan() {
  return await apiRequest('/payment/status', {
    credentials: 'include',
  });
}