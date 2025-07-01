// src/i18n/translations.js
import { loadModes } from '../settings/modes.js';

export const translations = {
  vn: {
    appTitle: 'Tiện Ích Của Trịnh Hg',
    contactText1: '- Gia hạn tài khoản: ',
    settingsTab: 'Settings',
    replaceTab: 'Replace',
    splitTab: 'Chia Chương',
    // ... (các bản dịch khác giữ nguyên như trong code gốc)
  }
};

let currentLang = 'vn';
let matchCaseEnabled = false;

export function updateLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  const elements = {
    appTitle: document.getElementById('app-title'),
    contactText1: document.getElementById('contact-text1'),
    // ... (các phần tử khác giữ nguyên như trong code gốc)
  };

  if (elements.appTitle) elements.appTitle.textContent = translations[lang].appTitle;
  // ... (các cập nhật khác tương tự như trong code gốc)

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

export function getCurrentLang() {
  return currentLang;
}

export function setMatchCaseEnabled(value) {
  matchCaseEnabled = value;
}

export function getMatchCaseEnabled() {
  return matchCaseEnabled;
}
