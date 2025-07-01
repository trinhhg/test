// src/version/versionCheck.js
import { showUpdateDialog } from '../ui/updateDialog.js';

let currentVersion = null;

export async function checkVersionLoop() {
  try {
    const baseURL = 'https://trinhhg.github.io/test';
    const versionResponse = await fetch(`${baseURL}/version.json?${Date.now()}`, {
      cache: 'no-store'
    });
    if (!versionResponse.ok) throw new Error('Không thể tải version.json');
    const versionData = await versionResponse.json();

    if (!currentVersion) {
      currentVersion = versionData.version;
    } else if (versionData.version !== currentVersion) {
      setTimeout(() => {
        showUpdateDialog();
      }, 360000);
      return;
    }

    setTimeout(checkVersionLoop, 5000);
  } catch (err) {
    console.error('Kiểm tra phiên bản thất bại:', err);
    setTimeout(checkVersionLoop, 5000);
  }
}
