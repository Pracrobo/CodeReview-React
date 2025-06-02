import { apiRequest } from './api.js';
import { handleError } from './errorHandler.js';

export async function requestProPayment(orderId, successUrl, failUrl) {
  try {
    const data = await apiRequest('/payment/request', {
      method: 'POST',
      body: JSON.stringify({ orderId, successUrl, failUrl }),
      credentials: 'include',
    });
    return { success: true, data };
  } catch (error) {
    return handleError(error, 'Pro 결제 요청에 실패했습니다.');
  }
}

// 구독 취소/재구독 등도 여기에 추가 (동일 패턴으로 작성)