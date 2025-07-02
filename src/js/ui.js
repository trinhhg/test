import { translations } from './translations.js';
import { loadModes, matchCaseEnabled } from './settings.js'; // ⬅️ Thêm matchCaseEnabled từ settings.js

let currentLang = 'vn';
let hasShownLoginSuccess = false;

// ==== 1. Giao diện đăng nhập / chính / loading ====

function showMainUI() {
  document.querySelector(".container").style.display = "block";
  document.querySelector(".login-container").style.display = "none";

  if (!hasShownLoginSuccess) {
    showNotification(translations[currentLang].loginSuccess, 'success');
    hasShownLoginSuccess = true;
  }

  if (typeof restoreInputState === 'function') restoreInputState(); // ⬅️ Không lỗi nếu chưa khai báo
}

function showLoginUI() {
  document.querySelector(".container").style.display = "none";
  document.querySelector(".login-container").style.display = "flex";
}

function showLoadingUI() {
  document.querySelector(".container").style.display = "none";
  document.querySelector(".login-container").style.display = "none";

  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading';
  loadingDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 16px; color: #333;';
  loadingDiv.textContent = translations[currentLang].loading;
  document.body.appendChild(loadingDiv);
}

function hideLoadingUI() {
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv) loadingDiv.remove();
}

// ==== 2. Hộp thoại cập nhật ====

function showUpdateDialog() {
  const overlay = document.createElement('div');
  overlay.id = 'update-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10000';

  const dialog = document.createElement('div');
  dialog.id = 'update-dialog';
  dialog.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    z-index: 10001;
    max-width: 400px;
    width: 90%;
    text-align: center;
  `;

  dialog.innerHTML = `
    <h3 style="margin: 0 0 10px 0">Thông báo từ trinhhg.github.io</h3>
    <p style="margin: 20px 0">${translations[currentLang].updateAvailable}</p>
    <button id="reload-btn" style="padding: 10px 20px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">
      ${translations[currentLang].reloadButton}
    </button>
  `;

  dialog.querySelector('#reload-btn').addEventListener('click', () => {
    console.log('Người dùng nhấn Tải lại');
    const userConfirmed = confirm("🔄 Trang đã có phiên bản mới.\nNhấn OK hoặc bấm F5 để tải lại.");
    if (userConfirmed) {
      if (typeof saveInputState === 'function') saveInputState();
      location.replace(location.pathname + '?v=' + Date.now());
    }
  });

  overlay.addEventListener('click', () => {
    overlay.remove();
    dialog.remove();
  });

  document.body.appendChild(overlay);
  document.body.appendChild(dialog);
}

// ==== 3. Thông báo ngắn ====

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

// ==== 4. Cập nhật ngôn ngữ ====

function updateLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  const T = translations[lang];
  const el = id => document.getElementById(id);

  const mappings = [
    ['app-title', T.appTitle],
    ['settings-tab', T.settingsTab],
    ['replace-tab', T.replaceTab],
    ['split-tab', T.splitTab],
    ['settings-title', T.settingsTitle],
    ['mode-label', T.modeLabel],
    ['add-mode', T.addMode],
    ['copy-mode', T.copyMode],
    ['match-case', matchCaseEnabled ? T.matchCaseOn : T.matchCaseOff],
    ['add-pair', T.addPair],
    ['save-settings', T.saveSettings],
    ['replace-title', T.replaceTitle],
    ['replace-button', T.replaceButton],
    ['copy-button', T.copyButton],
    ['split-title', T.splitTitle],
    ['split-button', T.splitButton],
    ['copy-button1', T.copyButton + ' 1'],
    ['copy-button2', T.copyButton + ' 2'],
    ['copy-button3', T.copyButton + ' 3'],
    ['copy-button4', T.copyButton + ' 4'],
    ['export-settings', T.exportSettings],
    ['import-settings', T.importSettings],
    ['logout-link', T.logoutText]
  ];

  for (const [id, text] of mappings) {
    const elem = el(id);
    if (elem) elem.textContent = text;
  }

  const placeholders = [
    ['input-text', T.inputText],
    ['output-text', T.outputText],
    ['split-input-text', T.splitInputText],
    ['output1-text', T.output1Text],
    ['output2-text', T.output2Text],
    ['output3-text', T.output3Text],
    ['output4-text', T.output4Text]
  ];

  for (const [id, placeholder] of placeholders) {
    const elem = el(id);
    if (elem) elem.placeholder = placeholder;
  }

  const contact = el('contact-text1');
  if (contact) {
    const textNode = Array.from(contact.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
    if (textNode) {
      textNode.textContent = T.contactText1;
    } else {
      contact.insertBefore(document.createTextNode(T.contactText1), contact.firstChild);
    }
  }

  document.querySelectorAll('.punctuation-item').forEach(item => {
    const findInput = item.querySelector('.find');
    const replaceInput = item.querySelector('.replace');
    const removeBtn = item.querySelector('.remove');
    if (findInput) findInput.placeholder = T.findPlaceholder;
    if (replaceInput) replaceInput.placeholder = T.replacePlaceholder;
    if (removeBtn) removeBtn.textContent = T.removeButton;
  });

  const modeSelect = el('mode-select');
  if (modeSelect) {
    loadModes();
  } else {
    console.error('Không tìm thấy phần tử mode-select');
  }
}

// ==== 5. Cập nhật đếm từ ====

function updateWordCount(textareaId, wordCountId) {
  const text = document.getElementById(textareaId)?.value || '';
  const words = text.trim().split(/\s+/).filter(Boolean);
  const counter = document.getElementById(wordCountId);
  if (counter) counter.textContent = `Words: ${words.length}`;
}

// ==== 6. Export ====

export {
  showMainUI,
  showLoginUI,
  showLoadingUI,
  hideLoadingUI,
  showUpdateDialog,
  showNotification,
  updateLanguage,
  currentLang,
  updateWordCount
};
