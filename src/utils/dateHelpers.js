export function formatKoreanDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function getRemainDetail(expireDateString) {
  if (!expireDateString) return '';
  const now = new Date();
  const expire = new Date(expireDateString);
  const diff = expire - now;
  if (diff <= 0) return '만료됨';

  // 남은 일수는 올림 처리
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = (n) => n.toString().padStart(2, '0');
  const dDay = days; // D-0: 만료일 당일, D-1: 하루 전

  return `D-${dDay < 0 ? 0 : dDay} (${days}일 ${pad(hours)}:${pad(minutes)}:${pad(seconds)} 남음)`;
}