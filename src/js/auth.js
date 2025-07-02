// Import Firebase compat để dùng API kiểu cũ (v8 style)
import firebase from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js';
import 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth-compat.js';
import 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore-compat.js';

import { showNotification, showLoginUI, showMainUI, showLoadingUI, hideLoadingUI } from './ui.js';
import { translations, currentLang } from './translations.js';
import { saveInputState } from './storage.js'; // Nếu bạn dùng lưu trạng thái
// Nếu bạn không có file storage.js thì có thể comment dòng trên

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB2VklwyVqGX7BgIsZeYannPijYk9_bB1Q",
  authDomain: "trinhhg-1f8f3.firebaseapp.com",
  projectId: "trinhhg-1f8f3",
  storageBucket: "trinhhg-1f8f3.appspot.com",
  messagingSenderId: "63432174844",
  appId: "1:63432174844:web:57f18e049b4cf5860e7b79",
  measurementId: "G-LNZQTM2JTD"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);

// Auth và Firestore
const auth = firebase.auth();
const db = firebase.firestore();

// Đánh dấu đã hiển thị thông báo đăng nhập chưa
let hasShownLoginSuccess = false;

// Kiểm tra trạng thái tài khoản
function checkAccountStatus(uid) {
  return db.collection("users").doc(uid).get().then(doc => {
    if (!doc.exists) {
      showNotification(translations[currentLang].noAccountData, 'error');
      auth.signOut();
      showLoginUI();
      return false;
    }

    const userData = doc.data();
    const expiry = new Date(userData.expiry);
    const now = new Date();

    if (userData.disabled) {
      showNotification(translations[currentLang].accountDisabled, 'error');
      auth.signOut();
      showLoginUI();
      return false;
    }

    if (now > expiry) {
      showNotification(translations[currentLang].accountExpired, 'error');
      auth.signOut();
      showLoginUI();
      return false;
    }

    return true;
  }).catch(error => {
    console.error("Lỗi khi kiểm tra tài khoản:", error);
    showNotification(translations[currentLang].accountCheckError, 'error');
    auth.signOut();
    showLoginUI();
    return false;
  });
}

// Theo dõi trạng thái active của tài khoản
function monitorAccountActiveStatus(uid) {
  db.collection("users").doc(uid).onSnapshot(doc => {
    if (!doc.exists || doc.data().active === false) {
      console.warn('Tài khoản bị vô hiệu hóa hoặc không tồn tại');
      auth.signOut().then(() => {
        alert(translations[currentLang].accountDeactivated);
        showLoginUI();
        location.replace(location.pathname + '?v=' + Date.now());
      });
    }
  });
}

// Theo dõi đăng nhập
function startAuthStateListener() {
  showLoadingUI();
  auth.onAuthStateChanged(user => {
    hideLoadingUI();
    if (user) {
      user.getIdTokenResult().then(token => {
        if (token.claims.disabled) {
          showNotification(translations[currentLang].accountDisabled, 'error');
          auth.signOut();
          showLoginUI();
          return;
        }

        checkAccountStatus(user.uid).then(valid => {
          if (valid) {
            monitorAccountActiveStatus(user.uid);
            showMainUI();
            startAccountStatusCheck();
          }
        });
      }).catch(error => {
        console.error("Lỗi khi kiểm tra token:", error);
        showNotification(translations[currentLang].accountCheckError, 'error');
        auth.signOut();
        showLoginUI();
      });
    } else {
      showLoginUI();
    }
  });
}

// Theo dõi trạng thái tài khoản và tự reload nếu cần
function startAccountStatusCheck() {
  const user = auth.currentUser;
  if (!user) return;

  db.collection("users").doc(user.uid).onSnapshot(doc => {
    if (!doc.exists) {
      showNotification(translations[currentLang].noAccountData, 'error');
      auth.signOut();
      showLoginUI();
      location.replace(location.pathname + '?v=' + Date.now());
      return;
    }

    const data = doc.data();
    const now = new Date();
    if (data.disabled || now > new Date(data.expiry)) {
      const message = data.disabled
        ? translations[currentLang].accountDisabled
        : translations[currentLang].accountExpired;

      showNotification(message, 'error');
      auth.signOut();
      showLoginUI();
      location.replace(location.pathname + '?v=' + Date.now());
    }
  });
}

// Xử lý đăng nhập
function setupLoginHandler() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;

    auth.signInWithEmailAndPassword(email, password)
      .then(({ user }) => {
        checkAccountStatus(user.uid).then(valid => {
          if (valid) {
            monitorAccountActiveStatus(user.uid);
            showMainUI();
            startAccountStatusCheck();
          }
        });
      })
      .catch(error => {
        console.error('Lỗi đăng nhập:', error);
        showNotification(translations[currentLang].loginFailed, 'error');
      });
  });
}

// Xử lý đăng xuất
function setupLogoutHandler() {
  const link = document.getElementById('logout-link');
  if (!link) return;

  link.addEventListener('click', e => {
    e.preventDefault();
    auth.signOut().then(() => {
      showLoginUI();
      showNotification(translations[currentLang].logoutSuccess, 'success');
      hasShownLoginSuccess = false;
      location.replace(location.pathname + '?v=' + Date.now());
    }).catch(error => {
      console.error('Lỗi khi đăng xuất:', error);
      showNotification('Lỗi khi đăng xuất.', 'error');
    });
  });
}

// Xuất các hàm
export {
  auth,
  db,
  hasShownLoginSuccess,
  setupLoginHandler,
  setupLogoutHandler,
  startAuthStateListener,
  monitorAccountActiveStatus,
  checkAccountStatus
};
