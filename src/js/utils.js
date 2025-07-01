// src/js/utils.js
(function () {
  window.App = window.App || {};
  const INACTIVITY_LIMIT = 1800000; // 30 phút
  const CHECK_INTERVAL = 10000; // 10s
  let lastActivity = Date.now();

  App.setupInactivityCheck = function () {
    function resetActivity() {
      lastActivity = Date.now();
      App.saveInputState();
    }

    function checkIdle() {
      const now = Date.now();
      if (now - lastActivity > INACTIVITY_LIMIT && document.visibilityState === 'visible') {
        console.log("🕒 Không hoạt động quá lâu, reload lại trang...");
        App.saveInputState();
        location.replace(location.pathname + '?v=' + Date.now());
      }
    }

    ['mousemove', 'click', 'keydown', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, resetActivity);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab đã trở lại visible, kiểm tra thời gian không hoạt động');
        checkIdle();
        App.restoreInputState();
      }
    });

    setInterval(checkIdle, CHECK_INTERVAL);
  };

  App.escapeHtml = function (str) {
    try {
      if (typeof str !== 'string') return '';
      const htmlEntities = {
        '&': '&',
        '<': '<',
        '>': '>',
        '"': '"',
        "'": '''
      };
      return str.replace(/[&<>"']/g, match => htmlEntities[match]);
    } catch (error) {
      console.error('Lỗi trong escapeHtml:', error);
      return str || '';
    }
  };

  App.escapeRegExp = function (string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };
})();
