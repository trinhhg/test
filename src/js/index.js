// src/js/index.js
(function () {
  // Namespace toàn cục
  window.App = window.App || {};

  document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded');

    // Khởi tạo Firebase
    App.initializeFirebase();

    // Khởi tạo giao diện và ngôn ngữ
    App.updateLanguage('vn');
    App.loadModes();
    App.updateSplitModeUI(2);
    App.attachButtonEvents();
    App.attachTabEvents();

    // Theo dõi trạng thái đăng nhập
    App.showLoadingUI();
    App.monitorAuthState();

    // Xử lý đăng nhập và đăng xuất
    App.handleLogin();
    App.handleLogout();

    // Khởi tạo kiểm tra không hoạt động
    App.setupInactivityCheck();
  });
})();
