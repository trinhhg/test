import { translations, currentLang } from './translations.js';
import { showNotification, updateLanguage, updateWordCount, updateModeButtons, updateButtonStates } from './ui.js';
import { loadModes, loadSettings, saveSettings, addPair, currentMode, matchCaseEnabled, LOCAL_STORAGE_KEY } from './settings.js';
import { setupReplaceHandler } from './replace.js';
import { setupSplitHandler, updateSplitModeUI } from './split.js';
import { saveInputState, restoreInputState } from './inputState.js';
import { checkVersionLoop, setupIdleHandlers } from './versionIdle.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');
  try {
    updateLanguage('vn');
    loadModes();
    attachButtonEvents();
    attachTabEvents();
    updateSplitModeUI(2);
    setupReplaceHandler();
    setupSplitHandler();
    
    // Gọi hàm auth nếu tồn tại trong window
    if (window.setupLoginHandler) window.setupLoginHandler();
    if (window.setupLogoutHandler) window.setupLogoutHandler();
    if (window.startAuthStateListener) window.startAuthStateListener();

    setupIdleHandlers();
    checkVersionLoop();
  } catch (error) {
    console.error('Lỗi trong khởi tạo:', error);
    showNotification('Có lỗi khi khởi tạo ứng dụng, vui lòng tải lại!', 'error');
  }
});

// Hàm gắn sự kiện cho các nút
function attachButtonEvents() {
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
    copyButton: document.getElementById('copy-button'),
    inputText: document.getElementById('input-text'),
    outputText: document.getElementById('output-text'),
    splitInputText: document.getElementById('split-input-text'),
    output1Text: document.getElementById('output1-text'),
    output2Text: document.getElementById('output2-text'),
    output3Text: document.getElementById('output3-text'),
    output4Text: document.getElementById('output4-text'),
    exportSettingsButton: document.getElementById('export-settings'),
    importSettingsButton: document.getElementById('import-settings')
    // Note: copyButton1 to copyButton4 are commented out as they are missing in HTML
  };

  if (buttons.facebookLink) {
    buttons.facebookLink.addEventListener('click', () => {
      console.log('Đã nhấp vào liên kết Gia hạn tài khoản');
    });
  }

  if (buttons.matchCaseButton) {
    buttons.matchCaseButton.addEventListener('click', () => {
      console.log('Đã nhấp vào nút Match Case');
      // Use imported matchCaseEnabled directly
      window.matchCaseEnabled = !matchCaseEnabled;
      updateButtonStates();
      saveSettings();
    });
  }

  if (buttons.deleteModeButton) {
    buttons.deleteModeButton.addEventListener('click', () => {
      console.log('Đã nhấp vào nút Xóa Chế Độ');
      if (currentMode !== 'default') {
        if (confirm(`Bạn có chắc chắn muốn xóa chế độ "${currentMode}"?`)) {
          let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
          if (settings.modes[currentMode]) {
            delete settings.modes[currentMode];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
            // Use imported currentMode directly
            window.currentMode = 'default';
            loadModes();
            showNotification(translations[currentLang].modeDeleted.replace('{mode}', currentMode), 'success');
          }
        }
      }
    });
  }

  if (buttons.renameModeButton) {
    buttons.renameModeButton.addEventListener('click', () => {
      console.log('Đã nhấp vào nút Đổi Tên Chế Độ');
      const newName = prompt(translations[currentLang].renamePrompt);
      if (newName && !newName.includes('mode_') && newName.trim() !== '' && newName !== currentMode) {
        let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
        if (settings.modes[currentMode]) {
          settings.modes[newName] = settings.modes[currentMode];
          delete settings.modes[currentMode];
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
          // Use imported currentMode directly
          window.currentMode = newName;
          loadModes();
          showNotification(translations[currentLang].renameSuccess.replace('{mode}', newName), 'success');
        } else {
          showNotification(translations[currentLang].renameError, 'error');
        }
      }
    });
  }

  if (buttons.addModeButton) {
    buttons.addModeButton.addEventListener('click', () => {
      console.log('Đã nhấp vào nút Thêm Chế Độ');
      const newMode = prompt(translations[currentLang].newModePrompt);
      if (newMode && !newMode.includes('mode_') && newMode.trim() !== '' && newMode !== 'default') {
        let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
        if (settings.modes[newMode]) {
          showNotification(translations[currentLang].invalidModeName, 'error');
          return;
        }
        settings.modes[newMode] = { pairs: [], matchCase: false };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
        // Use imported currentMode directly
        window.currentMode = newMode;
        loadModes();
        showNotification(translations[currentLang].modeCreated.replace('{mode}', newMode), 'success');
      } else {
        showNotification(translations[currentLang].invalidModeName, 'error');
      }
    });
  }

  if (buttons.copyModeButton) {
    buttons.copyModeButton.addEventListener('click', () => {
      console.log('Đã nhấp vào nút Sao Chép Chế Độ');
      const newMode = prompt(translations[currentLang].newModePrompt);
      if (newMode && !newMode.includes('mode_') && newMode.trim() !== '' && newMode !== 'default') {
        let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
        if (settings.modes[newMode]) {
          showNotification(translations[currentLang].invalidModeName, 'error');
          return;
        }
        settings.modes[newMode] = JSON.parse(JSON.stringify(settings.modes[currentMode] || { pairs: [], matchCase: false }));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
        // Use imported currentMode directly
        window.currentMode = newMode;
        loadModes();
        showNotification(translations[currentLang].modeCreated.replace('{mode}', newMode), 'success');
      } else {
        showNotification(translations[currentLang].invalidModeName, 'error');
      }
    });
  }

  if (buttons.modeSelect) {
    buttons.modeSelect.addEventListener('change', (e) => {
      console.log('Chế độ đã thay đổi thành:', e.target.value);
      // Use imported currentMode directly
      window.currentMode = e.target.value;
      loadSettings();
      showNotification(translations[currentLang].switchedMode.replace('{mode}', currentMode), 'success');
      updateModeButtons();
    });
  }

  if (buttons.addPairButton) {
    buttons.addPairButton.addEventListener('click', () => {
      console.log('Đã nhấp vào nút Thêm Cặp');
      addPair();
    });
  }

  if (buttons.saveSettingsButton) {
    buttons.saveSettingsButton.addEventListener('click', () => {
      console.log('Đã nhấp vào nút Lưu Cài Đặt');
      saveSettings();
    });
  }

  if (buttons.inputText) {
    buttons.inputText.addEventListener('input', () => {
      updateWordCount('input-text', 'input-word-count');
      saveInputState();
    });
  }

  if (buttons.outputText) {
    buttons.outputText.addEventListener('input', () => {
      updateWordCount('output-text', 'output-word-count');
      saveInputState();
    });
  }

  ['split-input-text', 'output1-text', 'output2-text', 'output3-text', 'output4-text'].forEach(id => {
    const textarea = document.getElementById(id);
    if (textarea) {
      textarea.addEventListener('input', () => {
        const counterId = id === 'split-input-text' ? 'split-input-word-count' : `${id}-word-count`;
        updateWordCount(id, counterId);
        saveInputState();
      });
    }
  });

  if (buttons.copyButton) {
    buttons.copyButton.addEventListener('click', () => {
      console.log('Đã nhấp vào nút Sao chép');
      const outputTextArea = document.getElementById('output-text');
      if (outputTextArea && outputTextArea.value) {
        navigator.clipboard.writeText(outputTextArea.value).then(() => {
          console.log('Đã sao chép văn bản vào clipboard');
          showNotification(translations[currentLang].textCopied, 'success');
        }).catch(err => {
          console.error('Không thể sao chép văn bản: ', err);
          showNotification(translations[currentLang].failedToCopy, 'error');
        });
      } else {
        showNotification(translations[currentLang].noTextToCopy, 'error');
      }
    });
  }

  // Commented out copyButton1 to copyButton4 as they are missing in HTML
  /*
  if (buttons.copyButton1) {
    buttons.copyButton1.addEventListener('click', () => {
      console.log('Đã nhấp vào nút Sao chép 1');
      const output1TextArea = document.getElementById('output1-text');
      if (output1TextArea && output1TextArea.value) {
        navigator.clipboard.writeText(output1TextArea.value).then(() => {
          console.log('Đã sao chép văn bản từ output1');
          showNotification(translations[currentLang].textCopied, 'success');
        }).catch(err => {
          console.error('Không thể sao chép văn bản từ output1: ', err);
          showNotification(translations[currentLang].failedToCopy, 'error');
        });
      } else {
        showNotification(translations[currentLang].noTextToCopy, 'error');
      }
    });
  }

  if (buttons.copyButton2) {
    buttons.copyButton2.addEventListener('click', () => {
      console.log('Đã nhấp vào nút Sao chép 2');
      const output2TextArea = document.getElementById('output2-text');
      if (output2TextArea && output2TextArea.value) {
        navigator.clipboard.writeText(output2TextArea.value).then(() => {
          console.log('Đã sao chép văn bản từ output2');
          showNotification(translations[currentLang].textCopied, 'success');
        }).catch(err => {
          console.error('Không thể sao chép văn bản từ output2: ', err);
          showNotification(translations[currentLang].failedToCopy, 'error');
        });
      } else {
        showNotification(translations[currentLang].noTextToCopy, 'error');
      }
    });
  }

  if (buttons.copyButton3) {
    buttons.copyButton3.addEventListener('click', () => {
      console.log('Đã nhấp vào nút Sao chép 3');
      const output3TextArea = document.getElementById('output3-text');
      if (output3TextArea && output3TextArea.value) {
        navigator.clipboard.writeText(output3TextArea.value).then(() => {
          console.log('Đã sao chép văn bản từ output3');
          showNotification(translations[currentLang].textCopied, 'success');
        }).catch(err => {
          console.error('Không thể sao chép văn bản từ output3: ', err);
          showNotification(translations[currentLang].failedToCopy, 'error');
        });
      } else {
        showNotification(translations[currentLang].noTextToCopy, 'error');
      }
    });
  }

  if (buttons.copyButton4) {
    buttons.copyButton4.addEventListener('click', () => {
      console.log('Đã nhấp vào nút Sao chép 4');
      const output4TextArea = document.getElementById('output4-text');
      if (output4TextArea && output4TextArea.value) {
        navigator.clipboard.writeText(output4TextArea.value).then(() => {
          console.log('Đã sao chép văn bản từ output4');
          showNotification(translations[currentLang].textCopied, 'success');
        }).catch(err => {
          console.error('Không thể sao chép văn bản từ output4: ', err);
          showNotification(translations[currentLang].failedToCopy, 'error');
        });
      } else {
        showNotification(translations[currentLang].noTextToCopy, 'error');
      }
    });
  }
  */

  if (buttons.exportSettingsButton) {
    buttons.exportSettingsButton.addEventListener('click', () => {
      console.log('Đã nhấp vào nút Xuất Cài Đặt');
      let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
      const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'extension_settings.json';
      a.click();
      URL.revokeObjectURL(url);
      showNotification(translations[currentLang].settingsExported, 'success');
    });
  }

  if (buttons.importSettingsButton) {
    buttons.importSettingsButton.addEventListener('click', () => {
      console.log('Đã nhấp vào nút Nhập Cài Đặt');
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
              showNotification(translations[currentLang].settingsImported, 'success');
            } catch (err) {
              console.error('Lỗi khi phân tích JSON:', err);
              showNotification(translations[currentLang].importError, 'error');
            }
          };
          reader.readAsText(file);
        }
      });
      input.click();
    });
  }

  const splitModeButtons = document.querySelectorAll('.split-mode-button');
  splitModeButtons.forEach(button => {
    button.addEventListener('click', () => {
      console.log(`Đã nhấp vào chế độ Chia ${button.getAttribute('data-split-mode')}`);
      updateSplitModeUI(parseInt(button.getAttribute('data-split-mode')));
    });
  });
}

// Hàm gắn sự kiện cho các tab
function attachTabEvents() {
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
}
