import authService from './authService.js';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

let isLoggingOut = false; // 무한루프 방지 플래그

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
    const refreshResult = await authService.refreshAccessToken();
    if (refreshResult.success) {
      accessToken = refreshResult.accessToken;
      config.headers.Authorization = `Bearer ${accessToken}`;
      response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    } else {
      if (!isLoggingOut) {
        isLoggingOut = true;
        await authService.logout();
        window.location.replace('/');
        isLoggingOut = false;
      }
      throw new Error('인증이 만료되었습니다. 다시 로그인 해주세요.');
    }
  }

  // 404 처리 (user 없음 등)
  if (response.status === 404) {
    if (!isLoggingOut) {
      isLoggingOut = true;
      await authService.logout();
      window.location.replace('/');
      isLoggingOut = false;
    }
    throw new Error('리소스를 찾을 수 없습니다.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return await response.json();
}

export default {
  apiRequest,
  API_BASE_URL,
};
