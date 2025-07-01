// src/js/firebase.js
(function () {
  window.App = window.App || {};

  App.initializeFirebase = function () {
    const firebaseConfig = {
      apiKey: "AIzaSyB2VklwyVqGX7BgIsZeYannPijYk9_bB1Q",
      authDomain: "trinhhg-1f8f3.firebaseapp.com",
      projectId: "trinhhg-1f8f3",
      storageBucket: "trinhhg-1f8f3.firebasestorage.app",
      messagingSenderId: "63432174844",
      appId: "1:63432174844:web:57f18e049b4cf5860e7b79",
      measurementId: "G-LNZQTM2JTD"
    };

    firebase.initializeApp(firebaseConfig);
    App.auth = firebase.auth();
    App.db = firebase.firestore();
  };
})();
