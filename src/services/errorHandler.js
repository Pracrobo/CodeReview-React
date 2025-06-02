export function handleError(error, defaultMsg) {
  return {
    success: false,
    message: error?.message || defaultMsg,
    // 필요하다면 error 객체 전체를 반환하거나, 로그를 남길 수도 있음
  };
}