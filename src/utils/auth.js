export function removeAuthStorage() {
  // 삭제할 항목들을 배열로 관리
  const itemsToRemove = [
    'userId',
    'accessToken',
    'username',
    'email',
    'avatarUrl',
  ];
  itemsToRemove.forEach((item) => localStorage.removeItem(item));
}

export function isLoggedIn() {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;
  try {
    const [, payload] = token.split('.');
    if (!payload) return false;
    // base64url → base64 변환
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const { exp } = JSON.parse(atob(base64));
    if (!exp) return false;
    // exp는 초 단위, Date.now()는 ms 단위
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
}