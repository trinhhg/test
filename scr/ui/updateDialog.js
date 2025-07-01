// src/ui/updateDialog.js
import { translations } from '../i18n/translations.js';
import { saveInputState } from '../state/inputState.js';

export function showUpdateDialog() {
  const overlay = document.createElement('div');
  overlay.id = 'update-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '10000';

  const dialog = document.createElement('div');
  dialog.id = 'update-dialog';
  dialog.style.position = 'fixed';
  dialog.style.top = '50%';
  dialog.style.left = '50%';
  dialog.style.transform = 'translate(-50%, -50%)';
  dialog.style.backgroundColor = '#fff';
  dialog.style.padding = '20px';
  dialog.style.borderRadius = '8px';
  dialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  dialog.style.zIndex = '10001';
  dialog.style.maxWidth = '400px';
  dialog.style.width = '90%';
  dialog.style.textAlign = 'center';

  const title = document.createElement('h3');
  title.textContent = 'Thông báo từ trinhhg.github.io';
  title.style.margin = '0 0 10px 0';
  dialog.appendChild(title);

  const message = document.createElement('p');
  message.textContent = translations['vn'].updateAvailable;
  message.style.margin = '20px 0';
  dialog.appendChild(message);

  const reloadButton = document.createElement('button');
  reloadButton.id = 'reload-btn';
  reloadButton.textContent = translations['vn'].reloadButton;
  reloadButton.style.padding = '10px 20px';
  reloadButton.style.backgroundColor = '#007bff';
  reloadButton.style.color = '#fff';
  reloadButton.style.border = 'none';
  reloadButton.style.borderRadius = '5px';
  reloadButton.style.cursor = 'pointer';
  reloadButton.style.marginTop = '10px';
  reloadButton.addEventListener('click', () => {
    const userConfirmed = confirm("🔄 Trang đã có phiên bản mới.\nNhấn OK hoặc bấm F5 để tải lại.");
    if (userConfirmed) {
      saveInputState();
      location.replace(location.pathname + '?v=' + Date.now());
    }
  });
  dialog.appendChild(reloadButton);

  document.body.appendChild(overlay);
  document.body.appendChild(dialog);

  overlay.addEventListener('click', () => {
    overlay.remove();
    dialog.remove();
  });
}
