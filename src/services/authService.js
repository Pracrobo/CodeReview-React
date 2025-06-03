import { apiRequest } from './api.js';
import { removeAuthStorage } from '../utils/auth.js';
import { handleError } from './errorHandler.js';

// 인증 후 공통 후처리
function handlePostAuthCleanup() {
  removeAuthStorage();
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

// 로그아웃
export async function logout() {
  try {
    await apiRequest('/auth/logout', { method: 'POST', credentials: 'include' });
  } finally {
    handlePostAuthCleanup();
  }
  return { success: true };
}

// 계정 연동 해제
export async function unlinkAccount() {
  try {
    await apiRequest('/auth/unlink', { method: 'POST', credentials: 'include' });
    handlePostAuthCleanup();
    return { success: true };
  } catch (error) {
    return handleError(error, '계정 연동 해제에 실패했습니다.');
  }
}

// 계정 삭제
export async function deleteAccount() {
  try {
    await apiRequest('/auth/delete', { method: 'DELETE', credentials: 'include' });
    handlePostAuthCleanup();
    return { success: true };
  } catch (error) {
    return handleError(error, '계정 삭제에 실패했습니다.');
  }
}

// 토큰 갱신
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
