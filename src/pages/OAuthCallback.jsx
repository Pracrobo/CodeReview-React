import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
          fetch("http://localhost:3001/auth/github/callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          })
            .then(res => res.json())
            .then(data => {
              if (data.token) {
                localStorage.setItem("token", data.token);
                if (data.accessToken) localStorage.setItem("access_token", data.accessToken);
                if (data.username) localStorage.setItem("username", data.username);
                if (data.email) localStorage.setItem("email", data.email);
                if (data.avatar_url) localStorage.setItem("avatar_url", data.avatar_url);
                navigate("/dashboard", { replace: true });
              } else {
                navigate("/login", { replace: true });
              }
            })
            .catch(() => {
              navigate("/login", { replace: true });
            });
        } else {
          navigate("/login", { replace: true });
        }
      }, [navigate]);

  // 콜백 처리 중에는 아무것도 렌더링하지 않음
  return null;
}