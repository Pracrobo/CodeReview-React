import { refreshAccessToken, logout } from './authService.js';

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
      await logout(false); // redirect 없이 로그아웃만
      alert('인증이 만료되었습니다. 다시 로그인해주세요.');
      window.location.replace('/');
      return;
    }
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
