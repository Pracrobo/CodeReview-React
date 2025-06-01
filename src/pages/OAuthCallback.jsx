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
        .then(({ success, data }) => {
          if (success && data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
            if (data.githubAccessToken) localStorage.setItem('githubAccessToken', data.githubAccessToken);
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
