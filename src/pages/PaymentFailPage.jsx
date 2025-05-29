import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentFailPage() {
  const navigate = useNavigate();

  useEffect(() => {
    alert("결제에 실패했습니다. 다시 시도해 주세요.");
    navigate("/profile?tab=subscription", { replace: true });
  }, [navigate]);

  return null;
}