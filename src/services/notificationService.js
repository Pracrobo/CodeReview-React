export async function permissionNotificationWindow() {
  if (!('Notification' in window)) {
    console.log('이 브라우저는 알림을 지원하지 않습니다.');
    return false;
  }
  const realPermission = await Notification.requestPermission();
  console.log('허용여부', realPermission);
  if (realPermission === 'granted') {
    return true;
  } else if (realPermission === 'denied') {
    return false;
  } else if (realPermission === 'default') {
    return true;
  }
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

// default export
export default function notificationService(data) {
  permissionNotificationWindow();
  sendNotification(data);
}
