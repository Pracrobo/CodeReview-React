import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentFailPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 3초 후 홈으로 이동
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return null;
}