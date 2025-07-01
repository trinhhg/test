// src/js/ui.js
(function () {
  window.App = window.App || {};
  App.currentLang = 'vn';
  let hasShownLoginSuccess = false;

  App.showMainUI = function () {
    document.querySelector(".container").style.display = "block";
    document.querySelector(".login-container").style.display = "none";
    if (!hasShownLoginSuccess) {
      App.showNotification(App.translations[App.currentLang].loginSuccess, 'success');
      hasShownLoginSuccess = true;
    }
    App.restoreInputState();
  };

  App.showLoginUI = function () {
    document.querySelector(".container").style.display = "none";
    document.querySelector(".login-container").style.display = "flex";
  };

  App.showLoadingUI = function () {
    document.querySelector(".container").style.display = "none";
    document.querySelector(".login-container").style.display = "none";
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 16px; color: #333;';
    loadingDiv.textContent = App.translations[App.currentLang].loading;
    document.body.appendChild(loadingDiv);
  };

  App.hideLoadingUI = function () {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) loadingDiv.remove();
  };

  App.showNotification = function (message, type = 'success') {
    const container = document.getElementById('notification-container');
    if (!container) {
      console.error('Không tìm thấy container thông báo');
      return;
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    container.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  App.updateLanguage = function (lang) {
    App.currentLang = lang;
    document.documentElement.lang = lang;

    const elements = {
      appTitle: document.getElementById('app-title'),
      contactText1: document.getElementById('contact-text1'),
      settingsTab: document.getElementById('settings-tab'),
      replaceTab: document.getElementById('replace-tab'),
      splitTab: document.getElementById('split-tab'),
      // ... (giữ nguyên các phần tử như trong code gốc)
      logoutLink: document.getElementById('logout-link')
    };

    if (elements.appTitle) elements.appTitle.textContent = App.translations[lang].appTitle;
    if (elements.contactText1) {
      const textNode = Array.from(elements.contactText1.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = App.translations[lang].contactText1;
      } else {
        console.warn('Không tìm thấy text node cho contactText1, tạo mới');
        elements.contactText1.insertBefore(document.createTextNode(App.translations[lang].contactText1), elements.contactText1.firstChild);
      }
    }
    // ... (giữ nguyên các cập nhật textContent và placeholder)

    const punctuationItems = document.querySelectorAll('.punctuation-item');
    punctuationItems.forEach(item => {
      const findInput = item.querySelector('.find');
      const replaceInput = item.querySelector('.replace');
      const removeBtn = item.querySelector('.remove');
      if (findInput) findInput.placeholder = App.translations[lang].findPlaceholder;
      if (replaceInput) replaceInput.placeholder = App.translations[lang].replacePlaceholder;
      if (removeBtn) removeBtn.textContent = App.translations[lang].removeButton;
    });

    const modeSelect = document.getElementById('mode-select');
    if (modeSelect) {
      App.loadModes();
    } else {
      console.error('Không tìm thấy phần tử mode select');
    }
  };

  App.updateSplitModeUI = function (mode) {
    App.currentSplitMode = mode;
    const splitContainer = document.querySelector('.split-container');
    const output3Section = document.getElementById('output3-section');
    const output4Section = document.getElementById('output4-section');
    const splitModeButtons = document.querySelectorAll('.split-mode-button');

    splitContainer.classList.remove('split-2', 'split-3', 'split-4');
    splitContainer.classList.add(`split-${mode}`);

    splitModeButtons.forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.getAttribute('data-split-mode')) === mode);
    });

    output3Section.style.display = mode >= 3 ? 'block' : 'none';
    output4Section.style.display = mode === 4 ? 'block' : 'none';

    ['split-input-text', 'output1-text', 'output2-text', 'output3-text', 'output4-text'].forEach(id => {
      const textarea = document.getElementById(id);
      if (textarea) {
        textarea.value = '';
        const counterId = id === 'split-input-text' ? 'split-input-word-count' : `${id}-word-count`;
        App.updateWordCount(id, counterId);
      }
    });
    console.log(`Đã reset bộ đếm từ về "Words: 0" cho tất cả các ô khi chuyển sang chế độ Chia ${mode}`);
    App.saveInputState();
  };

  App.updateWordCount = function (textareaId, counterId) {
    const textarea = document.getElementById(textareaId);
    const counter = document.getElementById(counterId);
    if (textarea && counter)}
  }
})();
