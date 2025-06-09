import authService from './authService.js';

// API 기본 URL (환경변수 또는 기본값)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

let isLoggingOut = false;

// 로그아웃 플로우 처리 (중복 방지)
async function handleLogoutFlow() {
  if (isLoggingOut) return;
  isLoggingOut = true;
  try {
    await authService.logout();
    window.location.replace('/');
  } finally {
    isLoggingOut = false;
  }
}

// 404 발생 시 로그아웃이 필요한 엔드포인트 목록
const logoutEndpoints = [
  '/auth/github/callback',
  '/auth/logout',
  '/auth/unlink',
  '/auth/delete',
  '/auth/token/refresh',
  '/payment/status',
  '/payment/complete',
];

// 인증이 필요 없는 엔드포인트 목록 (이 엔드포인트는 토큰/refresh 체크 없이 바로 요청)
const publicEndpoints = [
  '/auth/github/login',
  '/auth/github/callback',
  '/auth/token/refresh',
  '/auth/login',
  '/oauth/callback',
  '/login',
];

// accessToken이 없거나 만료된 경우 refresh 시도
async function getValidAccessToken() {
  let accessToken = localStorage.getItem('accessToken');
  if (accessToken) return accessToken;

  // accessToken이 없으면 refresh 시도 (쿠키 기반)
  try {
    const refreshResult = await authService.refreshAccessToken();
    if (refreshResult.success && refreshResult.accessToken) {
      return refreshResult.accessToken;
    }
  } catch (error) {
    // refresh 요청 자체가 실패(네트워크 등)해도 아래로 진행
    console.error('refreshAccessToken 에러:', error);
  }

  // refreshToken도 없거나 만료/실패 (최초 로그인 포함)
  await handleLogoutFlow();
  throw new Error('인증이 만료되었습니다. 다시 로그인 해주세요.');
}

// API 요청 래퍼 (토큰 자동 갱신 및 에러 처리)
async function apiRequest(endpoint, options = {}) {
  let accessToken = localStorage.getItem('accessToken');

  // 1. 인증이 필요 없는 엔드포인트는 토큰/refresh 없이 바로 요청
  if (publicEndpoints.some((pub) => endpoint.startsWith(pub))) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return await response.json();
  }

  // 2. 그 외 엔드포인트만 accessToken 없을 때 refresh 시도
  if (!accessToken && endpoint !== '/auth/token/refresh') {
    accessToken = await getValidAccessToken();
    // 실패 시 throw
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
    ...options,
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // 401 응답 처리 (토큰 만료, refreshToken 없음, user 없음 등)
  if (
    response.status === 401 &&
    endpoint !== '/auth/token/refresh'
  ) {
    // accessToken이 있는데 만료된 경우 refresh 시도
    accessToken = await getValidAccessToken();
    config.headers.Authorization = `Bearer ${accessToken}`;
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  }

  // 404 응답 처리 (user 없음 등)
  if (
    response.status === 404 &&
    logoutEndpoints.includes(endpoint)
  ) {
    await handleLogoutFlow();
    throw new Error(`유저 정보를 찾을 수 없습니다: ${endpoint}`);
  }

  if (response.status === 404) {
    throw new Error(`리소스를 찾을 수 없습니다: ${endpoint}`);
  }

  // 기타 에러 처리
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
