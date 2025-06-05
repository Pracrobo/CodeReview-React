export async function permissionNotificationWindow() {
  if (!('Notification' in window)) {
    console.log('이 브라우저는 알림을 지원하지 않습니다.');
    return false;
  }
  const realPermission = await Notification.requestPermission();
  if (realPermission === 'granted') {
    console.log('허용여부', realPermission);
    return true;
  } else if (realPermission === 'denied') {
    console.log('허용여부', realPermission);
    return false;
  } else {
    return true;
  }
}

export async function sendNotification(permisson, repoTitle, result) {
  try {
    if (permisson === 'granted' && result) {
      new Notification('새 알림이 도착했습니다.', {
        body: `${repoTitle}의 분석 결과가 완료되었습니다.`,
        tag: `${repoTitle}-${result}`,
      });
    } else if (permisson === 'granted' && !result) {
      new Notification('새 알림이 도착했습니다.', {
        body: `${repoTitle}의 분석 결과가 실패했습니다.`,
        tag: `${repoTitle}-${result}`,
      });
    } else {
      console.log('알림을 허용하지 않았습니다.');
    }
  } catch (error) {
    console.error('알림 에러', error);
  }
}
