// src/index.js
import { auth, db } from './config/firebase.js';
import { showMainUI, showLoginUI, showLoadingUI, hideLoadingUI } from './ui/mainUI.js';
import { showNotification } from './ui/notifications.js';
import { updateLanguage } from './i18n/translations.js';
import { loadModes } from './settings/modes.js';
import { attachButtonEvents } from './events/buttons.js';
import { attachTabEvents } from './events/tabs.js';
import { checkVersionLoop } from './version/versionCheck.js';
import { setupIdleDetection } from './idle/idleDetection.js';
import { updateSplitModeUI } from './text/split.js';
import { restoreInputState } from './state/inputState.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');

  showLoadingUI();
  auth.onAuthStateChanged((user) => {
    hideLoadingUI();
    if (user) {
      user.getIdTokenResult().then((idTokenResult) => {
        if (idTokenResult.claims.disabled) {
          showNotification(translations['vn'].accountDisabled, 'error');
          auth.signOut();
          showLoginUI();
          location.replace(location.pathname + '?v=' + Date.now());
        } else {
          checkAccountStatus(user.uid).then((valid) => {
            if (valid) {
              monitorAccountActiveStatus(user.uid);
              showMainUI();
              startAccountStatusCheck();
            } else {
              location.replace(location.pathname + '?v=' + Date.now());
            }
          });
        }
      }).catch((error) => {
        console.error("Lỗi khi kiểm tra token:", error);
        showNotification(translations['vn'].accountCheckError, 'error');
        auth.signOut();
        showLoginUI();
        location.replace(location.pathname + '?v=' + Date.now());
      });
    } else {
      showLoginUI();
    }
  });

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          checkAccountStatus(user.uid).then((valid) => {
            if (valid) {
              monitorAccountActiveStatus(user.uid);
              showMainUI();
              startAccountStatusCheck();
            } else {
              location.replace(location.pathname + '?v=' + Date.now());
            }
          });
        })
        .catch((error) => {
          console.error("Lỗi đăng nhập:", error.code, error.message);
          showNotification(translations['vn'].loginFailed, 'error');
        });
    });
  }

  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      auth.signOut().then(() => {
        showLoginUI();
        showNotification(translations['vn'].logoutSuccess, 'success');
        location.replace(location.pathname + '?v=' + Date.now());
      }).catch((error) => {
        console.error('Lỗi khi đăng xuất:', error);
        showNotification('Lỗi khi đăng xuất.', 'error');
      });
    });
  }

  function checkAccountStatus(uid) {
    const userDocRef = db.collection("users").doc(uid);
    return userDocRef.get().then((docSnap) => {
      if (docSnap.exists) {
        const userData = docSnap.data();
        const expiry = new Date(userData.expiry);
        const now = new Date();
        if (userData.disabled) {
          showNotification(translations['vn'].accountDisabled, 'error');
          auth.signOut();
          showLoginUI();
          return false;
        } else if (now > expiry) {
          showNotification(translations['vn'].accountExpired, 'error');
          auth.signOut();
          showLoginUI();
          return false;
        } else {
          return true;
        }
      } else {
        showNotification(translations['vn'].noAccountData, 'error');
        auth.signOut();
        showLoginUI();
        return false;
      }
    }).catch((error) => {
      console.error("Lỗi khi kiểm tra tài khoản:", error);
      showNotification(translations['vn'].accountCheckError, 'error');
      auth.signOut();
      return false;
    });
  }

  function monitorAccountActiveStatus(uid) {
    const userDocRef = db.collection("users").doc(uid);
    userDocRef.onSnapshot((doc) => {
      if (!doc.exists || doc.data().active === false) {
        auth.signOut().then(() => {
          alert(translations['vn'].accountDeactivated);
          showLoginUI();
          location.replace(location.pathname + '?v=' + Date.now());
        }).catch((error) => {
          console.error('Lỗi khi đăng xuất:', error);
          showNotification('Lỗi khi đăng xuất.', 'error');
        });
      }
    }, (error) => {
      console.error('Lỗi khi theo dõi tài liệu Firestore:', error);
      showNotification(translations['vn'].accountCheckError, 'error');
    });
  }

  function startAccountStatusCheck() {
    const user = auth.currentUser;
    if (!user) return;

    user.getIdTokenResult().then((idTokenResult) => {
      if (idTokenResult.claims.disabled) {
        showNotification(translations['vn'].accountDisabled, 'error');
        auth.signOut();
        showLoginUI();
        location.replace(location.pathname + '?v=' + Date.now());
      } else {
        const userDocRef = db.collection("users").doc(user.uid);
        userDocRef.onSnapshot((doc) => {
          if (!doc.exists) {
            showNotification(translations['vn'].noAccountData, 'error');
            auth.signOut();
            showLoginUI();
            location.replace(location.pathname + '?v=' + Date.now());
            return;
          }

          const userData = doc.data();
          const expiry = new Date(userData.expiry);
          const now = new Date();

          if (userData.disabled) {
            showNotification(translations['vn'].accountDisabled, 'error');
            auth.signOut();
            showLoginUI();
            location.replace(location.pathname + '?v=' + Date.now());
          } else if (now > expiry) {
            showNotification(translations['vn'].accountExpired, 'error');
            auth.signOut();
            showLoginUI();
            location.replace(location.pathname + '?v=' + Date.now());
          }
        }, (error) => {
          console.error('Lỗi khi theo dõi tài liệu Firestore:', error);
          showNotification(translations['vn'].accountCheckError, 'error');
          auth.signOut();
          showLoginUI();
          location.replace(location.pathname + '?v=' + Date.now());
        });
      }
    }).catch((error) => {
      console.error("Lỗi khi kiểm tra token:", error);
      showNotification(translations['vn'].accountCheckError, 'error');
      auth.signOut();
      showLoginUI();
      location.replace(location.pathname + '?v=' + Date.now());
    });
  }

  try {
    updateLanguage('vn');
    loadModes();
    attachButtonEvents();
    attachTabEvents();
    updateSplitModeUI(2);
    checkVersionLoop();
    setupIdleDetection();
    restoreInputState();
  } catch (error) {
    console.error('Lỗi khởi tạo ứng dụng:', error);
    showNotification('Có lỗi khi khởi tạo ứng dụng, vui lòng tải lại!', 'error');
  }
});
