// src/settings/settings.js
import { translations, getCurrentLang } from '../i18n/translations.js';
import { showLanguage } from '../ui/notifications.js';
import { loadModes } from './modes.js';

const LOCAL_STORAGE_KEY = 'local_settings';

export function saveSettings(currentMode, matchCaseEnabled) {
  const pairs = [];
  const items = document.querySelectorAll('.punctuation-item');
  if (items.length === 0) {
    showNotification(translations[getCurrentLang()].noPairsToSave, 'error');
    return;
  }
  items.forEach(item => {
    const find = item.querySelector('.find')?.value || '';
    const replace = item.querySelector('.replace')?.value || '';
    if (find) pairs.push({ find, replace });
  });

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
