// src/idle/idleDetection.js
import { saveInputState, restoreInputState } from '../state/inputState.js';

let lastActivity = Date.now();
const INACTIVITY_LIMIT = 1800000; // 30 phút
const CHECK_INTERVAL = 10000; // 10 giây

export function setupIdleDetection() {
  ['mousemove', 'click', 'keydown', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetActivity);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkIdle();
      restoreInputState();
    }
  });

  setInterval(checkIdle, CHECK_INTERVAL);
}

function resetActivity() {
  lastActivity = Date.now();
  saveInputState();
}

function checkIdle() {
  const now = Date.now();
  if (now - lastActivity > INACTIVITY_LIMIT && document.visibilityState === 'visible') {
    saveInputState();
    location.replace(location.pathname + '?v=' + Date.now());
  }
}
