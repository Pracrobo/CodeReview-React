// React 환경에서 환경 변수 접근
import api from './api';

async function requestEmailService(checked) {
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('email');
  if (!userEmail) {
    console.error('사용자 이메일 정보를 찾을 수 없습니다.');
    return { success: false, message: '로그인된 사용자 이메일 없음' };
  }
  try {
    const response = await fetch(`${api.API_BASE_URL}/notification/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isEnable: checked,
        userId: userId,
        userEmail: userEmail,
      }),
    });
    if (!response.ok) {
      console.log('에러가 발생했습니다.');
    } else {
      console.log('메일 전송 여부 저장 완료');
    }
  } catch (error) {
    console.error('이메일 전송 실패', error);
  }
}

export default { requestEmailService };
