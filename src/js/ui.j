import { translations } from './translations.js';
import { loadModes } from './settings.js';

let currentLang = 'vn';

// Hàm hiển thị giao diện chính
function showMainUI() {
  document.querySelector(".container").style.display = "block";
  document.querySelector(".login-container").style.display = "none";
  if (!hasShownLoginSuccess) {
    showNotification(translations[currentLang].loginSuccess, 'success');
    hasShownLoginSuccess = true;
  }
  restoreInputState();
}

// Hàm hiển thị form đăng nhập
function showLoginUI() {
  document.querySelector(".container").style.display = "none";
  document.querySelector(".login-container").style.display = "flex";
}

// Hàm hiển thị trạng thái loading
function showLoadingUI() {
  document.querySelector(".container").style.display = "none";
  document.querySelector(".login-container").style.display = "none";
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading';
  loadingDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 16px; color: #333;';
  loadingDiv.textContent = translations[currentLang].loading;
  document.body.appendChild(loadingDiv);
}

// Hàm xóa màn hình loading
function hideLoadingUI() {
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv) loadingDiv.remove();
}

// Hàm hiển thị hộp thoại thông báo cập nhật phiên bản mới
function showUpdateDialog() {
  const overlay = document.createElement('div');
  overlay.id = 'update-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '10000';

  const dialog = document.createElement('div');
  dialog.id = 'update-dialog';
  dialog.style.position = 'fixed';
  dialog.style.top = '50%';
  dialog.style.left = '50%';
  dialog.style.transform = 'translate(-50%, -50%)';
  dialog.style.backgroundColor = '#fff';
  dialog.style.padding = '20px';
  dialog.style.borderRadius = '8px';
  dialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  dialog.style.zIndex = '10001';
  dialog.style.maxWidth = '400px';
  dialog.style.width = '90%';
  dialog.style.textAlign = 'center';

  const title = document.createElement('h3');
  title.textContent = 'Thông báo từ trinhhg.github.io';
  title.style.margin = '0 0 10px 0';
  dialog.appendChild(title);

  const message = document.createElement('p');
  message.textContent = translations[currentLang].updateAvailable;
  message.style.margin = '20px 0';
  dialog.appendChild(message);

  const reloadButton = document.createElement('button');
  reloadButton.id = 'reload-btn';
  reloadButton.textContent = translations[currentLang].reloadButton;
  reloadButton.style.padding = '10px 20px';
  reloadButton.style.backgroundColor = '#007bff';
  reloadButton.style.color = '#fff';
  reloadButton.style.border = 'none';
  reloadButton.style.borderRadius = '5px';
  reloadButton.style.cursor = 'pointer';
  reloadButton.style.marginTop = '10px';
  reloadButton.addEventListener('click', () => {
    console.log('Người dùng nhấn Tải lại');
    const userConfirmed = confirm("🔄 Trang đã có phiên bản mới.\nNhấn OK hoặc bấm F5 để tải lại.");
    if (userConfirmed) {
      saveInputState();
      location.replace(location.pathname + '?v=' + Date.now());
    }
  });
  dialog.appendChild(reloadButton);

  document.body.appendChild(overlay);
  document.body.appendChild(dialog);

  overlay.addEventListener('click', () => {
    overlay.remove();
    dialog.remove();
  });
}

// Hàm hiển thị thông báo
function showNotification(message, type = 'success') {
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
}

// Hàm cập nhật ngôn ngữ
function updateLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  const elements = {
    appTitle: document.getElementById('app-title'),
    contactText1: document.getElementById('contact-text1'),
    settingsTab: document.getElementById('settings-tab'),
    replaceTab: document.getElementById('replace-tab'),
    splitTab: document.getElementById('split-tab'),
    settingsTitle: document.getElementById('settings-title'),
    modeLabel: document.getElementById('mode-label'),
    addMode: document.getElementById('add-mode'),
    copyMode: document.getElementById('copy-mode'),
    matchCase: document.getElementById('match-case'),
    findPlaceholder: document.getElementById('find-placeholder'),
    replacePlaceholder: document.getElementById('replace-placeholder'),
    removeButton: document.getElementById('remove-button'),
    addPair: document.getElementById('add-pair'),
    saveSettings: document.getElementById('save-settings'),
    replaceTitle: document.getElementById('replace-title'),
    inputText: document.getElementById('input-text'),
    replaceButton: document.getElementById('replace-button'),
    outputText: document.getElementById('output-text'),
    copyButton: document.getElementById('copy-button'),
    splitTitle: document.getElementById('split-title'),
    splitInputText: document.getElementById('split-input-text'),
    splitButton: document.getElementById('split-button'),
    output1Text: document.getElementById('output1-text'),
    output2Text: document.getElementById('output2-text'),
    output3Text: document.getElementById('output3-text'),
    output4Text: document.getElementById('output4-text'),
    copyButton1: document.getElementById('copy-button1'),
    copyButton2: document.getElementById('copy-button2'),
    copyButton3: document.getElementById('copy-button3'),
    copyButton4: document.getElementById('copy-button4'),
    exportSettings: document.getElementById('export-settings'),
    importSettings: document.getElementById('import-settings'),
    logoutLink: document.getElementById('logout-link')
  };

  if (elements.appTitle) elements.appTitle.textContent = translations[lang].appTitle;
  if (elements.contactText1) {
    const textNode = Array.from(elements.contactText1.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
    if (textNode) {
      textNode.textContent = translations[lang].contactText1;
    } else {
      console.warn('Không tìm thấy text node cho contactText1, tạo mới');
      elements.contactText1.insertBefore(document.createTextNode(translations[lang].contactText1), elements.contactText1.firstChild);
    }
  }
  if (elements.settingsTab) elements.settingsTab.textContent = translations[lang].settingsTab;
  if (elements.replaceTab) elements.replaceTab.textContent = translations[lang].replaceTab;
  if (elements.splitTab) elements.splitTab.textContent = translations[lang].splitTab;
  if (elements.settingsTitle) elements.settingsTitle.textContent = translations[lang].settingsTitle;
  if (elements.modeLabel) elements.modeLabel.textContent = translations[lang].modeLabel;
  if (elements.addMode) elements.addMode.textContent = translations[lang].addMode;
  if (elements.copyMode) elements.copyMode.textContent = translations[lang].copyMode;
  if (elements.matchCase) elements.matchCase.textContent = matchCaseEnabled ? translations[lang].matchCaseOn : translations[lang].matchCaseOff;
  if (elements.findPlaceholder) elements.findPlaceholder.placeholder = translations[lang].findPlaceholder;
  if (elements.replacePlaceholder) elements.replacePlaceholder.placeholder = translations[lang].replacePlaceholder;
  if (elements.removeButton) elements.removeButton.textContent = translations[lang].removeButton;
  if (elements.addPair) elements.addPair.textContent = translations[lang].addPair;
  if (elements.saveSettings) elements.saveSettings.textContent = translations[lang].saveSettings;
  if (elements.replaceTitle) elements.replaceTitle.textContent = translations[lang].replaceTitle;
  if (elements.inputText) elements.inputText.placeholder = translations[lang].inputText;
  if (elements.replaceButton) elements.replaceButton.textContent = translations[lang].replaceButton;
  if (elements.outputText) elements.outputText.placeholder = translations[lang].outputText;
  if (elements.copyButton) elements.copyButton.textContent = translations[lang].copyButton;
  if (elements.splitTitle) elements.splitTitle.textContent = translations[lang].splitTitle;
  if (elements.splitInputText) elements.splitInputText.placeholder = translations[lang].splitInputText;
  if (elements.splitButton) elements.splitButton.textContent = translations[lang].splitButton;
  if (elements.output1Text) elements.output1Text.placeholder = translations[lang].output1Text;
  if (elements.output2Text) elements.output2Text.placeholder = translations[lang].output2Text;
  if (elements.output3Text) elements.output3Text.placeholder = translations[lang].output3Text;
  if (elements.output4Text) elements.output4Text.placeholder = translations[lang].output4Text;
  if (elements.copyButton1) elements.copyButton1.textContent = translations[lang].copyButton + ' 1';
  if (elements.copyButton2) elements.copyButton2.textContent = translations[lang].copyButton + ' 2';
  if (elements.copyButton3) elements.copyButton3.textContent = translations[lang].copyButton + ' 3';
  if (elements.copyButton4) elements.copyButton4.textContent = translations[lang].copyButton + ' 4';
  if (elements.exportSettings) elements.exportSettings.textContent = translations[lang].exportSettings;
  if (elements.importSettings) elements.importSettings.textContent = translations[lang].importSettings;
  if (elements.logoutLink) elements.logoutLink.textContent = translations[lang].logoutText;

  const punctuationItems = document.querySelectorAll('.punctuation-item');
  punctuationItems.forEach(item => {
    const findInput = item.querySelector('.find');
    const replaceInput = item.querySelector('.replace');
    const removeBtn = item.querySelector('.remove');
    if (findInput) findInput.placeholder = translations[lang].findPlaceholder;
    if (replaceInput) replaceInput.placeholder = translations[lang].replacePlaceholder;
    if (removeBtn) removeBtn.textContent = translations[lang].removeButton;
  });

  const modeSelect = document.getElementById('mode-select');
  if (modeSelect) {
    loadModes();
  } else {
    console.error('Không tìm thấy phần tử mode select');
  }
}

export { showMainUI, showLoginUI, showLoadingUI, hideLoadingUI, showUpdateDialog, showNotification, updateLanguage, currentLang };
