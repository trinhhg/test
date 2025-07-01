// src/settings/settings.js
import { translations, getCurrentLang } from '../i18n/translations.js';
import { showNotification } from '../ui/notifications.js';
import { loadModes } from './modes.js';
import { saveInputState } from '../state/inputState.js'; // Thêm import saveInputState

const LOCAL_STORAGE_KEY = 'local_settings';

export function addPair(find = '', replace = '') {
  const list = document.getElementById('punctuation-list');
  if (!list) {
    console.error('Không tìm thấy phần tử punctuation-list');
    return;
  }

  // Kiểm tra trùng lặp hoặc lỗi tiềm ẩn
  const existingPairs = Array.from(document.querySelectorAll('.punctuation-item')).map(item => ({
    find: item.querySelector('.find')?.value || '',
    replace: item.querySelector('.replace')?.value || ''
  }));
  if (find && existingPairs.some(pair => pair.find === find && pair.replace === replace)) {
    showNotification('Cặp tìm-thay thế đã tồn tại!', 'error');
    return;
  }
  if (!find) {
    showNotification('Chuỗi tìm kiếm không được để trống!', 'error');
    return;
  }
  if (existingPairs.some(pair => pair.find === replace)) {
    showNotification('Chuỗi thay thế không được trùng với chuỗi tìm kiếm của cặp khác!', 'error');
    return;
  }

  const item = document.createElement('div');
  item.className = 'punctuation-item';

  const findInput = document.createElement('input');
  findInput.type = 'text';
  findInput.className = 'find';
  findInput.placeholder = translations[getCurrentLang()].findPlaceholder;
  findInput.value = find;

  const replaceInput = document.createElement('input');
  replaceInput.type = 'text';
  replaceInput.className = 'replace';
  replaceInput.placeholder = translations[getCurrentLang()].replacePlaceholder;
  replaceInput.value = replace;

  const removeButton = document.createElement('button');
  removeButton.className = 'remove';
  removeButton.textContent = translations[getCurrentLang()].removeButton;

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
    saveInputState();
  });

  findInput.addEventListener('input', saveInputState);
  replaceInput.addEventListener('input', saveInputState);
}

export function saveSettings(currentMode, matchCaseEnabled) {
  const items = document.querySelectorAll('.punctuation-item');
  if (items.length === 0) {
    showNotification(translations[getCurrentLang()].noPairsToSave, 'error');
    return;
  }

  const pairs = Array.from(items).map(item => ({
    find: item.querySelector('.find')?.value || '',
    replace: item.querySelector('.replace')?.value || ''
  })).filter(pair => pair.find); // Lọc các cặp có find không rỗng

  // Kiểm tra trùng lặp
  const findSet = new Set();
  for (const pair of pairs) {
    if (findSet.has(pair.find)) {
      showNotification(`Cặp tìm "${pair.find}" bị trùng lặp!`, 'error');
      return;
    }
    findSet.add(pair.find);
  }

  // Kiểm tra chuỗi thay thế trùng với chuỗi tìm kiếm
  for (const pair of pairs) {
    if (pairs.some(otherPair => otherPair !== pair && otherPair.find === pair.replace)) {
      showNotification(`Chuỗi thay thế "${pair.replace}" trùng với chuỗi tìm kiếm của cặp khác!`, 'error');
      return;
    }
  }

  // Sắp xếp cặp theo độ dài chuỗi tìm kiếm (dài đến ngắn)
  pairs.sort((a, b) => b.find.length - a.find.length);

  let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
  settings.modes[currentMode] = {
    pairs: pairs,
    matchCase: matchCaseEnabled
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
  loadModes();
  showNotification(translations[getCurrentLang()].settingsSaved.replace('{mode}', currentMode), 'success');
}

export function exportSettings() {
  let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
  const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'extension_settings.json';
  a.click();
  URL.revokeObjectURL(url);
  showNotification(translations[getCurrentLang()].settingsExported, 'success');
}

export function importSettings() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target.result);
          // Kiểm tra và sắp xếp lại các cặp khi nhập
          for (const mode in settings.modes) {
            if (settings.modes[mode].pairs) {
              settings.modes[mode].pairs.sort((a, b) => b.find.length - a.find.length);
            }
          }
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
          loadModes();
          showNotification(translations[getCurrentLang()].settingsImported, 'success');
        } catch (err) {
          console.error('Lỗi khi phân tích JSON:', err);
          showNotification(translations[getCurrentLang()].importError, 'error');
        }
      };
      reader.readAsText(file);
    }
  });
  input.click();
}
