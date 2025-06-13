// React 환경에서 환경 변수 접근
import api from './api';

async function requestEmailService(checked) {
  const userId = localStorage.getItem('userId');
  try {
    const response = await fetch(`${api.API_BASE_URL}/notification/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isEnable: checked,
        userId: userId,
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

async function getEmailStatus(userId) {
  try {
    const response = await fetch(
      `${api.API_BASE_URL}/notification/email?userId=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data.message;
    } else {
      console.error('DB 조회 실패');
      return null;
    }
  } catch (error) {
    console.error('이메일 상태 조회 에러', error);
  }
}

export default { requestEmailService, getEmailStatus };
