import { apiRequest } from './api.js';
import { removeAuthStorage } from '../utils/auth.js';

// 공통 후처리 함수
function handlePostAuthCleanup(redirect) {
  removeAuthStorage();
  if (redirect) window.location.replace('/');
}

// 공통 에러 핸들링 함수
function handleError(error, defaultMsg) {
  return { success: false, message: error?.message || defaultMsg };
}

// GitHub OAuth 콜백 처리
export async function processGithubCallback(code) {
  try {
    const data = await apiRequest('/auth/github/callback', {
      method: 'POST',
      body: JSON.stringify({ code }),
      credentials: 'include',
    });
    return { success: true, data };
  } catch (error) {
    return handleError(error, 'GitHub 로그인 처리에 실패했습니다.');
  }
}

async function postAuthAction(url, method, failMsg, redirect = true) {
  let result;
  try {
    await apiRequest(url, { method, credentials: 'include' });
    result = { success: true };
  } catch (error) {
    result = handleError(error, failMsg);
  }
  handlePostAuthCleanup(redirect);
  return result;
}

// 로그아웃
export function logout(redirect = true) {
  return postAuthAction('/auth/logout', 'POST', '로그아웃 처리에 실패했습니다.', redirect);
}

// 계정 연동 해제
export function unlinkAccount(redirect = true) {
  return postAuthAction('/auth/unlink', 'POST', '계정 연동 해제에 실패했습니다.', redirect);
}

// 계정 삭제
export function deleteAccount(redirect = true) {
  return postAuthAction('/auth/delete', 'DELETE', '계정 삭제에 실패했습니다.', redirect);
}

export async function refreshAccessToken() {
  try {
    const data = await apiRequest('/auth/token/refresh', {
      method: 'POST',
      credentials: 'include',
    });
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      return { success: true, accessToken: data.accessToken };
    }
    throw new Error('토큰이 없습니다.');
  } catch (error) {
    removeAuthStorage();
    return handleError(error, '토큰 갱신에 실패했습니다.');
  }
}
