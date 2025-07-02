// versionIdle.js
import { showUpdateDialog, saveInputState } from './ui.js';
import { translations, currentLang } from './translations.js';
import { restoreInputState } from './inputState.js'; // Thêm nhập restoreInputState

let currentVersion = null;
const INACTIVITY_LIMIT = 1800000; // 30 phút
const CHECK_INTERVAL = 10000; // Kiểm tra mỗi 10s
let lastActivity = Date.now();

// Reset thời gian hoạt động
function resetActivity() {
  lastActivity = Date.now();
  if (typeof saveInputState === 'function') {
    saveInputState(); // Kiểm tra trước khi gọi
  }
}

// Kiểm tra thời gian không hoạt động
function checkIdle() {
  const now = Date.now();
  if (now - lastActivity > INACTIVITY_LIMIT && document.visibilityState === 'visible') {
    console.log("🕒 Không hoạt động quá lâu, reload lại trang...");
    if (typeof saveInputState === 'function') {
      saveInputState();
    }
    location.replace(`${location.pathname}?v=${Date.now()}`); // Cache-busting
  }
}

// Thiết lập các trình xử lý không hoạt động
function setupIdleHandlers() {
  ['mousemove', 'click', 'keydown', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetActivity);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      console.log('Tab đã trở lại visible, kiểm tra thời gian không hoạt động');
      checkIdle();
      if (typeof restoreInputState === 'function') {
        restoreInputState();
      }
    }
  });

  setInterval(checkIdle, CHECK_INTERVAL);
}

// Kiểm tra phiên bản mới từ version.json
async function checkVersionLoop() {
  try {
    const baseURL = 'https://trinhhg.github.io/tienichtrinhhg';
    const versionResponse = await fetch(`${baseURL}/version.json?${Date.now()}`, {
      cache: 'no-store'
    });
    if (!versionResponse.ok) {
      throw new Error('Không thể tải version.json');
    }
    const versionData = await versionResponse.json();

    if (!currentVersion) {
      currentVersion = versionData.version;
      console.log(`📌 Phiên bản hiện tại: ${currentVersion}`);
    } else if (versionData.version !== currentVersion) {
      setTimeout(() => {
        console.log(`🆕 Phát hiện phiên bản mới sau 6 phút: ${versionData.version}`);
        if (typeof showUpdateDialog === 'function') {
          showUpdateDialog();
        } else {
          console.error('showUpdateDialog không được định nghĩa');
        }
      }, 360000); // 6 phút
      return;
    }
    setTimeout(checkVersionLoop, 5000);
  } catch (err) {
    console.error('🚫 Kiểm tra phiên bản thất bại:', err);
    setTimeout(checkVersionLoop, 5000);
  }
}

export { setupIdleHandlers, checkVersionLoop };
