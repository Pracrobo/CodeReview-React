import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { processGithubCallback } from '../services/authService';

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      processGithubCallback(code)
        .then((result) => {
          if (result.success && result.data.token) {
            const { data } = result;
            // 서비스 인증용 JWT
            localStorage.setItem('token', data.token);
            // GitHub API 호출용 accessToken
            if (data.accessToken)
              localStorage.setItem('accessToken', data.accessToken);
            if (data.username) localStorage.setItem('username', data.username);
            if (data.email) localStorage.setItem('email', data.email);
            if (data.avatarUrl)
              localStorage.setItem('avatarUrl', data.avatarUrl);
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/login', { replace: true });
          }
        })
        .catch(() => {
          navigate('/login', { replace: true });
        });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // 콜백 처리 중에는 아무것도 렌더링하지 않음
  return null;
}
