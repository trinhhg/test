// src/i18n/translations.js
export const translations = {
  vn: {
    appTitle: 'Tiện Ích Của Trịnh Hg',
    contactText1: '- Gia hạn tài khoản: ',
    settingsTab: 'Settings',
    replaceTab: 'Replace',
    splitTab: 'Chia Chương',
    // ... (các bản dịch khác giữ nguyên)
    duplicatePairError: 'Cặp tìm-thay thế đã tồn tại!',
    emptyFindError: 'Chuỗi tìm kiếm không được để trống!',
    replaceMatchesFindError: 'Chuỗi thay thế không được trùng với chuỗi tìm kiếm của cặp khác!',
    duplicateFindError: 'Cặp tìm "{find}" bị trùng lặp!'
  }
};

// ... (giữ nguyên phần còn lại)    if (replaceInput) replaceInput.placeholder = translations[lang].replacePlaceholder;
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
