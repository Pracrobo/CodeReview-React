// React 환경에서 환경 변수 접근
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
console.log('API_BASE_URL:', API_BASE_URL);

// API 요청 함수
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      // 401 에러 처리
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('avatarUrl');
        window.location.href = '/login';
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API 요청 오류:', error);
    throw error;
  }
}

export { apiRequest };
