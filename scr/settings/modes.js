// src/settings/modes.js
import { translations, getCurrentLang, setMatchCaseEnabled, getMatchCaseEnabled } from '../i18n/translations.js';
import { showNotification } from '../ui/notifications.js';
import { addPair } from './settings.js';

const LOCAL_STORAGE_KEY = 'local_settings';
export let currentMode = 'default';

export function setCurrentMode(mode) {
  currentMode = mode;
}

export function loadModes() {
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

export function loadSettings() {
  let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
  const modeSettings = settings.modes?.[currentMode] || { pairs: [], matchCase: false };
  const list = document.getElementById('punctuation-list');
  if (list) {
    list.innerHTML = '';
    if (!modeSettings.pairs || modeSettings.pairs.length === 0) {
      addPair('', '');
    } else {
      modeSettings.pairs.slice().reverse().forEach(pair => {
        addPair(pair.find || '', pair.replace || '');
      });
    }
  }
  setMatchCaseEnabled(modeSettings.matchCase || false);
  updateButtonStates();
}

export function addMode() {
  const newMode = prompt(translations[getCurrentLang()].newModePrompt);
  if (newMode && !newMode.includes('mode_') && newMode.trim() !== '' && newMode !== 'default') {
    let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
    if (settings.modes[newMode]) {
      showNotification(translations[getCurrentLang()].invalidModeName, 'error');
      return;
    }
    settings.modes[newMode] = { pairs: [], matchCase: false };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    currentMode = newMode;
    loadModes();
    showNotification(translations[getCurrentLang()].modeCreated.replace('{mode}', newMode), 'success');
  } else {
    showNotification(translations[getCurrentLang()].invalidModeName, 'error');
  }
}

export function copyMode() {
  const newMode = prompt(translations[getCurrentLang()].newModePrompt);
  if (newMode && !newMode.includes('mode_') && newMode.trim() !== '' && newMode !== 'default') {
    let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
    if (settings.modes[newMode]) {
      showNotification(translations[getCurrentLang()].invalidModeName, 'error');
      return;
    }
    settings.modes[newMode] = JSON.parse(JSON.stringify(settings.modes[currentMode] || { pairs: [], matchCase: false }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    currentMode = newMode;
    loadModes();
    showNotification(translations[getCurrentLang()].modeCreated.replace('{mode}', newMode), 'success');
  } else {
    showNotification(translations[getCurrentLang()].invalidModeName, 'error');
  }
}

export function deleteMode() {
  if (currentMode !== 'default') {
    if (confirm(`Bạn có chắc chắn muốn xóa chế độ "${currentMode}"?`)) {
      let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
      if (settings.modes[currentMode]) {
        delete settings.modes[currentMode];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
        currentMode = 'default';
        loadModes();
        showNotification(translations[getCurrentLang()].modeDeleted.replace('{mode}', currentMode), 'success');
      }
    }
  }
}

export function renameMode() {
  const newName = prompt(translations[getCurrentLang()].renamePrompt);
  if (newName && !newName.includes('mode_') && newName.trim() !== '' && newName !== currentMode) {
    let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
    if (settings.modes[currentMode]) {
      settings.modes[newName] = settings.modes[currentMode];
      delete settings.modes[currentMode];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
      currentMode = newName;
      loadModes();
      showNotification(translations[getCurrentLang()].renameSuccess.replace('{mode}', newName), 'success');
    } else {
      showNotification(translations[getCurrentLang()].renameError, 'error');
    }
  }
}

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

function updateButtonStates() {
  const matchCaseButton = document.getElementById('match-case');
  if (matchCaseButton) {
    matchCaseButton.textContent = getMatchCaseEnabled() ? translations[getCurrentLang()].matchCaseOn : translations[getCurrentLang()].matchCaseOff;
    matchCaseButton.style.background = getMatchCaseEnabled() ? '#28a745' : '#6c757d';
  }
}
