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

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = (n) => n.toString().padStart(2, '0');
  if (days > 0) {
    return `D-${days} (${days}일 ${pad(hours)}:${pad(minutes)}:${pad(seconds)} 남음)`;
  } else {
    return `D-0 (${pad(hours)}:${pad(minutes)}:${pad(seconds)} 남음)`;
  }
}