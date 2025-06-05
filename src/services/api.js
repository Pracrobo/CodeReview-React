import { refreshAccessToken, logout } from './authService.js';

// React 환경에서 환경 변수 접근
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

let isLoggingOut = false; // 무한루프 방지 플래그

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

  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // 401 처리 (토큰 만료, refreshToken 없음, user 없음 등)
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
      if (!isLoggingOut) {
        isLoggingOut = true;
        await logout();
        window.location.replace('/'); // 홈으로 강제 이동
      }
      return; // 무한루프 방지: 더 이상 throw하지 않고 종료
    }
  }

  // 404 처리 (user 없음 등)
  if (response.status === 404) {
    if (!isLoggingOut) {
      isLoggingOut = true;
      await logout();
      window.location.replace('/');
    }
    return;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return await response.json();
}

export { apiRequest, API_BASE_URL };
