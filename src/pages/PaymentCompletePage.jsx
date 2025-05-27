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
    // 결제 성공 시 백엔드에 Pro 플랜 활성화 요청
    fetch("http://localhost:3001/payment/complete", {
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
          navigate("/dashboard");
        } else {
          alert(data.message || "Pro 플랜 활성화에 실패했습니다.");
          navigate("/dashboard");
        }
      })
      .catch(() => {
        alert("Pro 플랜 활성화 중 오류가 발생했습니다.");
        navigate("/dashboard");
      });
  }, [navigate]);

  return null;
}