import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      authService.processGithubCallback(code)
        .then(({ success, data }) => {
          if (success && data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
            if (data.userId) localStorage.setItem('userId', data.userId);
            if (data.username) localStorage.setItem('username', data.username);
            if (data.email) localStorage.setItem('email', data.email);
            if (data.avatarUrl) localStorage.setItem('avatarUrl', data.avatarUrl);
            window.location.replace('/dashboard');
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

  return null;
}
