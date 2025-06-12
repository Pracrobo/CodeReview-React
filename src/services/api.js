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

// refresh 중복 방지용 Promise
let refreshPromise = null;

function isPublicPath() {
  // 브라우저 환경에서만 동작
  if (typeof window === 'undefined') return false;
  const publicPaths = ['/', '/login', '/auth/login', '/oauth/callback'];
  return publicPaths.includes(window.location.pathname);
}

// accessToken이 없거나 만료된 경우 refresh 시도
async function getValidAccessToken(endpoint) {
  let accessToken = localStorage.getItem('accessToken');
  if (accessToken) return accessToken;

  // 인증이 필요 없는 엔드포인트거나, 현재 경로가 publicPath면 refresh 시도하지 않음
  if (
    publicEndpoints.some((pub) => endpoint.startsWith(pub)) ||
    isPublicPath()
  ) {
    return null;
  }

  // 이미 refresh 요청 중이면 기존 Promise 반환
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const refreshResult = await authService.refreshAccessToken();
      if (refreshResult.success && refreshResult.accessToken) {
        return refreshResult.accessToken;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('refreshAccessToken 에러:', error);
    }
    await handleLogoutFlow();
    throw new Error('인증이 만료되었습니다. 다시 로그인 해주세요.');
  })();
  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

// API 요청 래퍼 (토큰 자동 갱신 및 에러 처리)
async function apiRequest(endpoint, options = {}) {
  let accessToken = localStorage.getItem('accessToken');

  // 인증이 필요 없는 엔드포인트는 토큰/refresh 없이 바로 요청
  if (publicEndpoints.some((pub) => endpoint.startsWith(pub))) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // 쿠키 포함
      ...options,
    };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // JSON 파싱 시 에러 처리 개선
    try {
      return await response.json();
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      throw new Error('서버 응답을 파싱할 수 없습니다.');
    }
  }

  // accessToken이 없으면 refresh 시도 (단, publicEndpoints는 제외)
  if (!accessToken && endpoint !== '/auth/token/refresh') {
    accessToken = await getValidAccessToken(endpoint);
    // 실패 시 throw
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
    credentials: 'include', // 쿠키 포함 - 중요!
    ...options,
  };

  let hasRetried = false;
  while (true) {
    let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // 401 응답 처리 (한 번만 refresh 시도)
    if (
      response.status === 401 &&
      endpoint !== '/auth/token/refresh' &&
      !hasRetried
    ) {
      accessToken = await getValidAccessToken(endpoint);
      if (!accessToken) {
        throw new Error('인증이 만료되었습니다. 다시 로그인 해주세요.');
      }
      config.headers.Authorization = `Bearer ${accessToken}`;
      hasRetried = true;
      continue;
    }

    if (response.status === 401) {
      await handleLogoutFlow();
      throw new Error('인증이 만료되었습니다. 다시 로그인 해주세요.');
    }

    // 이하 기존 404, 기타 에러 처리 동일
    if (response.status === 404 && logoutEndpoints.includes(endpoint)) {
      await handleLogoutFlow();
      throw new Error(`유저 정보를 찾을 수 없습니다: ${endpoint}`);
    }

    if (response.status === 404) {
      throw new Error(`리소스를 찾을 수 없습니다: ${endpoint}`);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }

    try {
      return await response.json();
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      throw new Error('서버 응답을 파싱할 수 없습니다.');
    }
  }
}

export default {
  apiRequest,
  API_BASE_URL,
};
