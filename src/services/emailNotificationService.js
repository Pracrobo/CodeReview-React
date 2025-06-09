// React 환경에서 환경 변수 접근
import api from './api';

async function requestEmailService(checked) {
  const userEmail = localStorage.getItem('email');
  try {
    const response = await fetch(`${api.API_BASE_URL}/notification/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: checked,
        userEmail: userEmail,
      }),
    });

    if (!response.ok) {
      console.log('에러가 발생했습니다.');
    } else {
      console.log('메일 전송');
    }
  } catch (error) {
    console.error('이메일 전송 실패', error);
  }
}

export default { requestEmailService };
