import { apiRequest } from './api.js';

export async function requestProPayment(orderId, successUrl, failUrl) {
  return await apiRequest('/payment/request', {
    method: 'POST',
    body: JSON.stringify({ orderId, successUrl, failUrl }),
    credentials: 'include',
  });
}

// 구독 취소/재구독 등도 여기에 추가