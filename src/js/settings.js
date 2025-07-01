import { translations, currentLang } from './translations.js';
import { showNotification } from './ui.js';

let currentMode = 'default';
let matchCaseEnabled = false;
const LOCAL_STORAGE_KEY = 'local_settings';

// Hàm tải các chế độ
function loadModes() {
  const modeSelect = document.getElementById('mode-select');
  if (!modeSelect) {
    console.error('Không tìm thấy phần tử mode select');
    return;
  }
  let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
  const modes = Object.keys(settings.modes || { default: {} });

  modeSelect.innerHTML = '';
  modes.forEach(mode => {
    const option = document.createElement('option');
    option.value = mode;
    option.textContent = mode;
    modeSelect.appendChild(option);
  });
  modeSelect.value = currentMode;
  loadSettings();
  updateModeButtons();
}

// Hàm tải cài đặt cho chế độ hiện tại
function loadSettings() {
  console.log('Đang tải cài đặt cho chế độ:', currentMode);
  let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
  const modeSettings = settings.modes?.[currentMode] || { pairs: [], matchCase: false };
  const list = document.getElementById('punctuation-list');
  if (list) {
    list.innerHTML = '';
    if (!modeSettings.pairs || modeSettings.pairs.length === 0) {
      addPair('', '');
    } else {
      modeSettings.pairs.slice().reverse().forEach(pair => {
        console.log('Đang tải cặp:', pair);
        addPair(pair.find || '', pair.replace || '');
      });
    }
  } else {
    console.error('Không tìm thấy phần tử punctuation-list');
  }
  matchCaseEnabled = modeSettings.matchCase || false;
  updateButtonStates();
  console.log('Đã cập nhật trạng thái:', { matchCaseEnabled });
}

// Hàm thêm cặp tìm-thay thế
function addPair(find = '', replace = '') {
  const list = document.getElementById('punctuation-list');
  if (!list) {
    console.error('Không tìm thấy phần tử punctuation-list');
    return;
  }

  const item = document.createElement('div');
  item.className = 'punctuation-item';

  const findInput = document.createElement('input');
  findInput.type = 'text';
  findInput.className = 'find';
  findInput.placeholder = translations[currentLang].findPlaceholder;
  findInput.value = find;

  const replaceInput = document.createElement('input');
  replaceInput.type = 'text';
  replaceInput.className = 'replace';
  replaceInput.placeholder = translations[currentLang].replacePlaceholder;
  replaceInput.value = replace;

  const removeButton = document.createElement('button');
  removeButton.className = 'remove';
  removeButton.textContent = translations[currentLang].removeButton;

  item.appendChild(findInput);
  item.appendChild(replaceInput);
  item.appendChild(removeButton);

  if (list.firstChild) {
    list.insertBefore(item, list.firstChild);
  } else {
    list.appendChild(item);
  }

  removeButton.addEventListener('click', () => {
    item.remove();
    console.log('Đã xóa cặp');
    saveInputState();
  });

  findInput.addEventListener('input', saveInputState);
  replaceInput.addEventListener('input', saveInputState);

  console.log('Đã thêm cặp vào DOM:', { find: findInput.value, replace: replaceInput.value });
}

// Hàm lưu cài đặt
function saveSettings() {
  const pairs = [];
  const items = document.querySelectorAll('.punctuation-item');
  if (items.length === 0) {
    showNotification(translations[currentLang].noPairsToSave, 'error');
    return;
  }
  items.forEach(item => {
    const find = item.querySelector('.find')?.value || '';
    const replace = item.querySelector('.replace')?.value || '';
    if (find) pairs.push({ find, replace });
    console.log('Đang lưu cặp:', { find, replace });
  });

  let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
  settings.modes[currentMode] = {
    pairs: pairs,
    matchCase: matchCaseEnabled
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
  console.log('Đã lưu cài đặt cho chế độ:', currentMode, settings);
  loadSettings();
  showNotification(translations[currentLang].settingsSaved.replace('{mode}', currentMode), 'success');
}

// Hàm cập nhật trạng thái nút
function updateButtonStates() {
  const matchCaseButton = document.getElementById('match-case');
  if (matchCaseButton) {
    matchCaseButton.textContent = matchCaseEnabled ? translations[currentLang].matchCaseOn : translations[currentLang].matchCaseOff;
    matchCaseButton.style.background = matchCaseEnabled ? '#28a745' : '#6c757d';
  } else {
    console.error('Không tìm thấy nút Match Case');
  }
}

// Hàm cập nhật nút chế độ
function updateModeButtons() {
  const renameMode = document.getElementById('rename-mode');
  const deleteMode = document.getElementById('delete-mode');
  if (currentMode !== 'default' && renameMode && deleteMode) {
    renameMode.style.display = 'inline-block';
    deleteMode.style.display = 'inline-block';
  } else if (renameMode && deleteMode) {
    renameMode.style.display = 'none';
    deleteMode.style.display = 'none';
  }
}

export { loadModes, loadSettings, addPair, saveSettings, updateButtonStates, updateModeButtons, currentMode, matchCaseEnabled, LOCAL_STORAGE_KEY };
