import { API_BASE_URL } from './api.js';

export async function requestProPayment(token, orderId, successUrl, failUrl) {
  const res = await fetch(`${API_BASE_URL}/payment/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId, successUrl, failUrl }),
    credentials: 'include',
  });
  return res.json();
}

// 구독 취소/재구독 등도 여기에 추가