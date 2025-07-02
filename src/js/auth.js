// auth.js
// Import các hàm cần thiết từ ui.js và translations.js
import { showMainUI, showLoginUI, showLoadingUI, hideLoadingUI, showNotification } from './ui.js';
import { translations, currentLang } from './translations.js';

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

// Khởi tạo Firebase (global firebase từ script HTML)
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

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

// Theo dõi tài khoản bị vô hiệu hóa
function monitorAccountActiveStatus(uid) {
  db.collection("users").doc(uid).onSnapshot(doc => {
    if (!doc.exists || doc.data().active === false) {
      alert(translations[currentLang].accountDeactivated);
      auth.signOut().then(() => {
        showLoginUI();
        location.replace(location.pathname + '?v=' + Date.now());
      });
    }
  });
}

// Theo dõi trạng thái đăng nhập
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

// Theo dõi trạng thái tài khoản (disabled/hết hạn)
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

// Đăng nhập
function setupLoginHandler() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;

    showLoadingUI();
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
        hideLoadingUI();
        showNotification(translations[currentLang].loginFailed, 'error');
      });
  });
}

// Đăng xuất
function setupLogoutHandler() {
  const link = document.getElementById('logout-link');
  if (!link) return;

  link.addEventListener('click', e => {
    e.preventDefault();
    showLoadingUI();
    auth.signOut().then(() => {
      showLoginUI();
      showNotification(translations[currentLang].logoutSuccess, 'success');
      hasShownLoginSuccess = false;
      location.replace(location.pathname + '?v=' + Date.now());
    }).catch(error => {
      console.error('Lỗi khi đăng xuất:', error);
      hideLoadingUI();
      showNotification('Lỗi khi đăng xuất.', 'error');
    });
  });
}

// Gắn các hàm vào window để main.js sử dụng
window.authModule = {
  auth,
  db,
  hasShownLoginSuccess,
  setupLoginHandler,
  setupLogoutHandler,
  startAuthStateListener,
  monitorAccountActiveStatus,
  checkAccountStatus
};
