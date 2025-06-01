import { refreshAccessToken } from './authService.js';

// React 환경에서 환경 변수 접근
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// API 요청 함수
async function apiRequest(endpoint, options = {}) {
  let token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // accessToken 만료(401) 시 refresh 시도
    if (response.status === 401) {
      const refreshResult = await refreshAccessToken();
      if (refreshResult.success) {
        // 새 토큰으로 재시도
        token = refreshResult.token;
        config.headers.Authorization = `Bearer ${token}`;
        response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      } else {
        // refresh 실패 시 로그아웃 처리
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
