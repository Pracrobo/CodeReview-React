import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProPaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/login");
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Pro 플랜이 활성화되었습니다!");
        } else {
          alert(data.message || "Pro 플랜 활성화에 실패했습니다.");
        }
        navigate("/profile?tab=subscription", { replace: true });
      })
      .catch(() => {
        alert("Pro 플랜 활성화 중 오류가 발생했습니다.");
        navigate("/profile?tab=subscription", { replace: true });
      });
  }, [navigate]);

  return null;
}