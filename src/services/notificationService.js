export async function permissionNotificationWindow() {
  if (!('Notification' in window)) {
    console.log('이 브라우저는 알림을 지원하지 않습니다.');
    return false;
  }
  const realPermission = await Notification.requestPermission();
  console.log('허용여부', realPermission);
  if (realPermission === 'granted') {
    return true;
  } else if (realPermission === 'denied' || realPermission === 'default') {
    return false;
  }
  return false;
}

export async function sendNotification(data) {
  try {
    if (data.type) {
      new Notification(data.title, {
        body: `요청하신 ${data.message}`,
        tag: `${data.status}-${data.repoName}`,
      });
    }
  } catch (error) {
    console.error('알림 에러', error);
  }
}

export default async function notificationService(data) {
  try {
    const hasPermission = await permissionNotificationWindow();
    if (hasPermission) {
      await sendNotification(data);
    } else {
      console.log('알림 권한이 없어 알림을 보낼 수 없습니다.');
    }
  } catch (error) {
    console.error('알림 서비스 에러:', error);
  }
}
