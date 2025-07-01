// src/ui/notifications.js
export function showNotification(message, type = 'success') {
  const container = document.getElementById('notification-container');
  if (!container) {
    console.error('Không tìm thấy container thông báo');
    return;
  }

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  container.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
