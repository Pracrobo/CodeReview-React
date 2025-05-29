import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PaymentFailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 쿼리스트링에서 실패 사유 추출(예: ?message=카드한도초과)
    const params = new URLSearchParams(location.search);
    const failMsg = params.get("message") || "결제에 실패했습니다. 다시 시도해 주세요.\n구독 관리 탭에서 재시도할 수 있습니다.";

    alert(failMsg);

    // 2초 후 자동 이동
    const timer = setTimeout(() => {
      navigate("/profile?tab=subscription", { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, location.search]);

  return null;
}