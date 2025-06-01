import { refreshAccessToken } from './authService.js';
import { removeAuthStorage } from '../utils/auth.js';

// React 환경에서 환경 변수 접근
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// API 요청 함수
async function apiRequest(endpoint, options = {}) {
  let accessToken = localStorage.getItem('accessToken');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // 토큰 갱신 요청 자체가 아니라면, 401 시 refresh 시도
    if (
      response.status === 401 &&
      endpoint !== '/auth/token/refresh'
    ) {
      const refreshResult = await refreshAccessToken();
      if (refreshResult.success) {
        accessToken = refreshResult.accessToken;
        config.headers.Authorization = `Bearer ${accessToken}`;
        response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      } else {
        removeAuthStorage();
        window.location.href = '/login';
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export { apiRequest, API_BASE_URL };
