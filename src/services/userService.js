import { apiRequest } from './api.js';
import { handleError } from './errorHandler.js';

export async function fetchUserAndPlan() {
  try {
    const data = await apiRequest('/payment/status', {
      credentials: 'include',
    });
    return { success: true, data };
  } catch (error) {
    return handleError(error, '유저 정보 조회에 실패했습니다.');
  }
}