import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const username = params.get("username");
    const email = params.get("email");
    const avatar_url = params.get("avatar_url");

    if (token) {
      localStorage.setItem("token", token);
      if (username) localStorage.setItem("username", username);
      if (email) localStorage.setItem("email", email);
      if (avatar_url) localStorage.setItem("avatar_url", avatar_url);
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // 콜백 처리 중에는 아무것도 렌더링하지 않음
  return null;
}