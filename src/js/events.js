// src/js/events.js
(function () {
  window.App = window.App || {};

  App.attachButtonEvents = function () {
    const buttons = {
      facebookLink: document.getElementById('facebook-link'),
      matchCaseButton: document.getElementById('match-case'),
      deleteModeButton: document.getElementById('delete-mode'),
      renameModeButton: document.getElementById('rename-mode'),
      addModeButton: document.getElementById('add-mode'),
      copyModeButton: document.getElementById('copy-mode'),
      modeSelect: document.getElementById('mode-select'),
      addPairButton: document.getElementById('add-pair'),
      saveSettingsButton: document.getElementById('save-settings'),
      replaceButton: document.getElementById('replace-button'),
      copyButton: document.getElementById('copy-button'),
      splitButton: document.getElementById('split-button'),
      copyButton1: document.getElementById('copy-button1'),
      copyButton2: document.getElementById('copy-button2'),
      copyButton3: document.getElementById('copy-button3'),
      copyButton4: document.getElementById('copy-button4'),
      inputText: document.getElementById('input-text'),
      outputText: document.getElementById('output-text'),
      splitInputText: document.getElementById('split-input-text'),
      output1Text: document.getElementById('output1-text'),
      output2Text: document.getElementById('output2-text'),
      output3Text: document.getElementById('output3-text'),
      output4Text: document.getElementById('output4-text'),
      exportSettingsButton: document.getElementById('export-settings'),
      importSettingsButton: document.getElementById('import-settings')
    };

    if (buttons.facebookLink) {
      buttons.facebookLink.addEventListener('click', () => {
        console.log('Đã nhấp vào liên kết Gia hạn tài khoản');
      });
    } else {
      console.error('Không tìm thấy liên kết Gia hạn tài khoản');
    }

    if (buttons.matchCaseButton) {
      buttons.matchCaseButton.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Match Case');
        App.matchCaseEnabled = !App.matchCaseEnabled;
        updateButtonStates();
        App.saveSettings();
      });
    } else {
      console.error('Không tìm thấy nút Match Case');
    }

    // ... (giữ nguyên các sự kiện nút khác như trong code gốc)
  };

  App.attachTabEvents = function () {
    const tabButtons = document.querySelectorAll('.tab-button');
    console.log(`Tìm thấy ${tabButtons.length} nút tab`);
    if (tabButtons.length === 0) {
      console.error('Không tìm thấy nút tab');
      return;
    }

    tabButtons.forEach((button, index) => {
      console.log(`Gắn sự kiện click cho nút tab ${index}: ${button.id}`);
      button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        console.log(`Đang cố gắng mở tab: ${tabName}`);

        const tabContents = document.querySelectorAll('.tab-content');
        const allButtons = document.querySelectorAll('.tab-button');
        tabContents.forEach(tab => tab.classList.remove('active'));
        allButtons.forEach(btn => btn.classList.remove('active'));

        const selectedTab = document.getElementById(tabName);
        if (selectedTab) {
          selectedTab.classList.add('active');
          console.log(`Tab ${tabName} đã được hiển thị`);
        } else {
          console.error(`Không tìm thấy tab với ID ${tabName}`);
        }

        button.classList.add('active');
      });
    });
  };

  function updateButtonStates() {
    const matchCaseButton = document.getElementById('match-case');
    if (matchCaseButton) {
      matchCaseButton.textContent = App.matchCaseEnabled ? App.translations[App.currentLang].matchCaseOn : App.translations[App.currentLang].matchCaseOff;
      matchCaseButton.style.background = App.matchCaseEnabled ? '#28a745' : '#6c757d';
    } else {
      console.error('Không tìm thấy nút Match Case');
    }
  }
})();
