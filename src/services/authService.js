import { apiRequest, API_BASE_URL } from './api.js';

// GitHub OAuth 콜백 처리
export async function processGithubCallback(code) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/github/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('HTTP error: ' + response.status);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('GitHub 콜백 처리 오류:', error);
    return {
      success: false,
      message: error.message || 'GitHub 로그인 처리에 실패했습니다.',
    };
  }
}

// 로그아웃
export async function logout() {
  try {
    const token = localStorage.getItem('token');
    const githubAccessToken = localStorage.getItem('githubAccessToken');
    await fetch(`${API_BASE_URL}/auth/github/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ accessToken: githubAccessToken }),
    });
    // 모든 인증 정보 삭제 (token 포함)
    localStorage.removeItem('token');
    localStorage.removeItem('githubAccessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('avatarUrl');
    // 상태 갱신 이벤트 발생
    window.dispatchEvent(new Event('loginStateChanged'));
    window.location.replace('/');
    return { success: true };
  } catch (error) {
    console.error('로그아웃 중 오류 발생:', error);
    return { success: false };
  }
}

// 연동 해제
export async function unlinkGithubAccount() {
  try {
    const token = localStorage.getItem('token');
    const githubAccessToken = localStorage.getItem('githubAccessToken');
    await fetch(`${API_BASE_URL}/auth/github/unlink`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ accessToken: githubAccessToken }),
    });
    // 모든 인증 정보 삭제
    localStorage.removeItem('token');
    localStorage.removeItem('githubAccessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('avatarUrl');
    window.location.replace('/');
    return { success: true };
  } catch (error) {
    console.error('연동 해제 오류:', error);
    return { success: false };
  }
}

// 계정 데이터 삭제
export async function deleteGithubAccount(accessToken) {
  try {
    const response = await apiRequest('/auth/github/delete', {
      method: 'DELETE',
      body: JSON.stringify({ accessToken }),
    });
    window.location.replace('/');
    return {
      success: true,
      message: response.message || '계정 삭제가 완료되었습니다.',
    };
  } catch (error) {
    console.error('계정 삭제 오류:', error);
    return {
      success: false,
      message: error.message || '계정 삭제에 실패했습니다.',
    };
  }
}
