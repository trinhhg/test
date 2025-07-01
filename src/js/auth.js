// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2VklwyVqGX7BgIsZeYannPijYk9_bB1Q",
  authDomain: "trinhhg-1f8f3.firebaseapp.com",
  projectId: "trinhhg-1f8f3",
  storageBucket: "trinhhg-1f8f3.firebasestorage.app",
  messagingSenderId: "63432174844",
  appId: "1:63432174844:web:57f18e049b4cf5860e7b79",
  measurementId: "G-LNZQTM2JTD"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);

// Lấy auth và firestore theo kiểu compat
const auth = firebase.auth();
const db = firebase.firestore();

// Biến để đảm bảo thông báo đăng nhập chỉ hiển thị một lần
let hasShownLoginSuccess = false;

// Hàm kiểm tra trạng thái tài khoản
function checkAccountStatus(uid) {
  const userDocRef = db.collection("users").doc(uid);
  return userDocRef.get().then((docSnap) => {
    if (docSnap.exists) {
      const userData = docSnap.data();
      const expiry = new Date(userData.expiry);
      const now = new Date();
      if (userData.disabled) {
        showNotification(translations[currentLang].accountDisabled, 'error');
        auth.signOut();
        showLoginUI();
        return false;
      } else if (now > expiry) {
        showNotification(translations[currentLang].accountExpired, 'error');
        auth.signOut();
        showLoginUI();
        return false;
      } else {
        return true;
      }
    } else {
      showNotification(translations[currentLang].noAccountData, 'error');
      auth.signOut();
      showLoginUI();
      return false;
    }
  }).catch((error) => {
    console.error("Lỗi khi kiểm tra tài khoản:", error);
    showNotification(translations[currentLang].accountCheckError, 'error');
    auth.signOut();
    return false;
  });
}

// Theo dõi trường active từ Firestore
function monitorAccountActiveStatus(uid) {
  const userDocRef = db.collection("users").doc(uid);
  userDocRef.onSnapshot((doc) => {
    if (!doc.exists || doc.data().active === false) {
      console.log('Tài khoản không tồn tại hoặc đã bị vô hiệu hóa (active: false)');
      auth.signOut().then(() => {
        alert(translations[currentLang].accountDeactivated);
        showLoginUI();
        location.replace(location.pathname + '?v=' + Date.now());
      }).catch((error) => {
        console.error('Lỗi khi đăng xuất:', error);
        showNotification('Lỗi khi đăng xuất.', 'error');
      });
    }
  }, (error) => {
    console.error('Lỗi khi theo dõi tài liệu Firestore:', error);
    showNotification(translations[currentLang].accountCheckError, 'error');
  });
}

// Theo dõi trạng thái đăng nhập và kiểm tra tài khoản
function startAuthStateListener() {
  showLoadingUI();
  auth.onAuthStateChanged((user) => {
    hideLoadingUI();
    if (user) {
      user.getIdTokenResult().then((idTokenResult) => {
        if (idTokenResult.claims.disabled) {
          showNotification(translations[currentLang].accountDisabled, 'error');
          auth.signOut();
          showLoginUI();
          saveInputState();
          location.replace(location.pathname + '?v=' + Date.now());
        } else {
          checkAccountStatus(user.uid).then((valid) => {
            if (valid) {
              monitorAccountActiveStatus(user.uid);
              showMainUI();
              startAccountStatusCheck();
            } else {
              saveInputState();
              location.replace(location.pathname + '?v=' + Date.now());
            }
          });
        }
      }).catch((error) => {
        console.error("Lỗi khi kiểm tra token:", error);
        showNotification(translations[currentLang].accountCheckError, 'error');
        auth.signOut();
        showLoginUI();
        saveInputState();
        location.replace(location.pathname + '?v=' + Date.now());
      });
    } else {
      showLoginUI();
    }
  });
}

// Theo dõi trạng thái tài khoản bằng onSnapshot
function startAccountStatusCheck() {
  const user = auth.currentUser;
  if (!user) {
    console.log('Không có người dùng để theo dõi trạng thái');
    return;
  }

  user.getIdTokenResult().then((idTokenResult) => {
    if (idTokenResult.claims.disabled) {
      console.log('Tài khoản bị vô hiệu hóa, đang tải lại trang...');
      showNotification(translations[currentLang].accountDisabled, 'error');
      auth.signOut();
      saveInputState();
      location.replace(location.pathname + '?v=' + Date.now());
    } else {
      const userDocRef = db.collection("users").doc(user.uid);
      userDocRef.onSnapshot((doc) => {
        if (!doc.exists) {
          console.log('Tài khoản không tồn tại');
          showNotification(translations[currentLang].noAccountData, 'error');
          auth.signOut();
          showLoginUI();
          saveInputState();
          location.replace(location.pathname + '?v=' + Date.now());
          return;
        }

        const userData = doc.data();
        const expiry = new Date(userData.expiry);
        const now = new Date();

        if (userData.disabled) {
          console.log('Tài khoản bị vô hiệu hóa (disabled: true)');
          showNotification(translations[currentLang].accountDisabled, 'error');
          auth.signOut();
          showLoginUI();
          saveInputState();
          location.replace(location.pathname + '?v=' + Date.now());
        } else if (now > expiry) {
          console.log('Tài khoản đã hết hạn');


          showNotification(translations[currentLang].accountExpired, 'error');
          auth.signOut();
          showLoginUI();
          saveInputState();
          location.replace(location.pathname + '?v=' + Date.now());
        }
      }, (error) => {
        console.error('Lỗi khi theo dõi tài liệu Firestore:', error);
        showNotification(translations[currentLang].accountCheckError, 'error');
        auth.signOut();
        showLoginUI();
        saveInputState();
        location.replace(location.pathname + '?v=' + Date.now());
      });
    }
  }).catch((error) => {
    console.error("Lỗi khi kiểm tra token:", error);
    showNotification(translations[currentLang].accountCheckError, 'error');
    auth.signOut();
    showLoginUI();
    saveInputState();
    location.replace(location.pathname + '?v=' + Date.now());
  });
}

// Xử lý đăng nhập
function setupLoginHandler() {
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
              saveInputState();
              location.replace(location.pathname + '?v=' + Date.now());
            }
          });
        })
        .catch((error) => {
          console.error("Lỗi đăng nhập:", error.code, error.message);
          showNotification(translations[currentLang].loginFailed, 'error');
        });
    });
  }
}

// Xử lý đăng xuất
function setupLogoutHandler() {
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      auth.signOut().then(() => {
        showLoginUI();
        showNotification(translations[currentLang].logoutSuccess, 'success');
        hasShownLoginSuccess = false;
        saveInputState();
        location.replace(location.pathname + '?v=' + Date.now());
      }).catch((error) => {
        console.error('Lỗi khi đăng xuất:', error);
        showNotification('Lỗi khi đăng xuất.', 'error');
      });
    });
  }
}

// Export các hàm cần thiết
export { auth, db, checkAccountStatus, monitorAccountActiveStatus, startAuthStateListener, setupLoginHandler, setupLogoutHandler, hasShownLoginSuccess };
