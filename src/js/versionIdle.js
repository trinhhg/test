import { showUpdateDialog, showNotification } from './ui.js';
import { saveInputState } from './inputState.js';

let currentVersion = null;
let lastActivity = Date.now();
const INACTIVITY_LIMIT = 1800000; // 30 phút
const CHECK_INTERVAL = 10000; // 10s

// Reset thời gian hoạt động
function resetActivity() {
  lastActivity = Date.now();
  saveInputState();
}

// Kiểm tra thời gian không hoạt động
function checkIdle() {
  const now = Date.now();
  if (now - lastActivity > INACTIVITY_LIMIT && document.visibilityState === 'visible') {
    console.log("🕒 Không hoạt động quá lâu, reload lại trang...");
    saveInputState();
    location.replace(location.pathname + '?v=' + Date.now());
  }
}

// Kiểm tra phiên bản mới từ version.json
async function checkVersionLoop() {
  try {
    const baseURL = 'https://trinhhg.github.io/test';
    const versionResponse = await fetch(`${baseURL}/version.json?${Date.now()}`, {
      cache: 'no-store'
    });
    if (!versionResponse.ok) throw new Error('Không thể tải version.json');
    const versionData = await versionResponse.json();

    if (!currentVersion) {
      currentVersion = versionData.version;
      console.log("📌 Phiên bản hiện tại: " + currentVersion);
    } else if (versionData.version !== currentVersion) {
      setTimeout(() => {
        console.log("🆕 Phát hiện phiên bản mới sau 6 phút:", versionData.version);
        showUpdateDialog();
      }, 360000);
      return;
    }

    setTimeout(checkVersionLoop, 5000);
  } catch (err) {
    console.error('🚫 Kiểm tra phiên bản thất bại:', err);
    setTimeout(checkVersionLoop, 5000);
  }
}

// Gắn sự kiện theo dõi hoạt động
function setupIdleHandlers() {
  ['mousemove', 'click', 'keydown', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetActivity);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      console.log('Tab đã trở lại visible, kiểm tra thời gian không hoạt động');
      checkIdle();
      restoreInputState();
    }
  });

  setInterval(checkIdle, CHECK_INTERVAL);
}

export { checkVersionLoop, setupIdleHandlers };
