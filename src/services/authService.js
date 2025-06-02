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

// 로그아웃
export async function logout(redirect = true) {
  try {
    await apiRequest('/auth/logout', { method: 'POST', credentials: 'include' });
    handlePostAuthCleanup(redirect);
    return { success: true };
  } catch (error) {
    // 에러 발생 시 후처리 없이 실패 반환
    return handleError(error, '로그아웃 처리에 실패했습니다.');
  }
}

// 계정 연동 해제
export async function unlinkAccount(redirect = true) {
  try {
    await apiRequest('/auth/unlink', { method: 'POST', credentials: 'include' });
    handlePostAuthCleanup(redirect);
    return { success: true };
  } catch (error) {
    // 실패 시 후처리 없이 실패 반환
    return handleError(error, '계정 연동 해제에 실패했습니다.');
  }
}

// 계정 삭제
export async function deleteAccount(redirect = true) {
  try {
    await apiRequest('/auth/delete', { method: 'DELETE', credentials: 'include' });
    handlePostAuthCleanup(redirect);
    return { success: true };
  } catch (error) {
    // 실패 시 후처리 없이 실패 반환
    return handleError(error, '계정 삭제에 실패했습니다.');
  }
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
