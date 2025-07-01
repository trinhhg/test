// src/events/buttons.js
import { translations, getCurrentLang, setMatchCaseEnabled } from '../i18n/translations.js';
import { showNotification } from '../ui/notifications.js';
import { saveSettings, exportSettings, importSettings } from '../settings/settings.js';
import { addMode, copyMode, deleteMode, renameMode } from '../settings/modes.js';
import { handleReplace } from '../text/replace.js';
import { handleSplit } from '../text/split.js';
import { updateWordCount } from '../utils/wordCount.js';

export function attachButtonEvents() {
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
  }

  if (buttons.matchCaseButton) {
    buttons.matchCaseButton.addEventListener('click', () => {
      setMatchCaseEnabled(!getMatchCaseEnabled());
      updateButtonStates();
      saveSettings();
    });
  }

  if (buttons.deleteModeButton) {
    buttons.deleteModeButton.addEventListener('click', deleteMode);
  }

  if (buttons.renameModeButton) {
    buttons.renameModeButton.addEventListener('click', renameMode);
  }

  if (buttons.addModeButton) {
    buttons.addModeButton.addEventListener('click', addMode);
  }

  if (buttons.copyModeButton) {
    buttons.copyModeButton.addEventListener('click', copyMode);
  }

  if (buttons.modeSelect) {
    buttons.modeSelect.addEventListener('change', (e) => {
      currentMode = e.target.value;
      loadSettings();
      showNotification(translations[getCurrentLang()].switchedMode.replace('{mode}', currentMode), 'success');
      updateModeButtons();
    });
  }

  if (buttons.addPairButton) {
    buttons.addPairButton.addEventListener('click', () => {
      addPair();
    });
  }

  if (buttons.saveSettingsButton) {
    buttons.saveSettingsButton.addEventListener('click', saveSettings);
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

  if (buttons.replaceButton) {
    buttons.replaceButton.addEventListener('click', handleReplace);
  }

  if (buttons.copyButton) {
    buttons.copyButton.addEventListener('click', () => {
      const outputTextArea = document.getElementById('output-text');
      if (outputTextArea && outputTextArea.value) {
        navigator.clipboard.writeText(outputTextArea.value).then(() => {
          showNotification(translations[getCurrentLang()].textCopied, 'success');
        }).catch(err => {
          showNotification(translations[getCurrentLang()].failedToCopy, 'error');
        });
      } else {
        showNotification(translations[getCurrentLang()].noTextToCopy, 'error');
      }
    });
  }

  if (buttons.splitButton) {
    buttons.splitButton.addEventListener('click', handleSplit);
  }

  if (buttons.copyButton1) {
    buttons.copyButton1.addEventListener('click', () => {
      const output1TextArea = document.getElementById('output1-text');
      if (output1TextArea && output1TextArea.value) {
        navigator.clipboard.writeText(output1TextArea.value).then(() => {
          showNotification(translations[getCurrentLang()].textCopied, 'success');
        }).catch(err => {
          showNotification(translations[getCurrentLang()].failedToCopy, 'error');
        });
      } else {
        showNotification(translations[getCurrentLang()].noTextToCopy, 'error');
      }
    });
  }

  if (buttons.copyButton2) {
    buttons.copyButton2.addEventListener('click', () => {
      const output2TextArea = document.getElementById('output2-text');
      if (output2TextArea && output2TextArea.value) {
        navigator.clipboard.writeText(output2TextArea.value).then(() => {
          showNotification(translations[getCurrentLang()].textCopied, 'success');
        }).catch(err => {
          showNotification(translations[getCurrentLang()].failedToCopy, 'error');
        });
      } else {
        showNotification(translations[getCurrentLang()].noTextToCopy, 'error');
      }
    });
  }

  if (buttons.copyButton3) {
    buttons.copyButton3.addEventListener('click', () => {
      const output3TextArea = document.getElementById('output3-text');
      if (output3TextArea && output3TextArea.value) {
        navigator.clipboard.writeText(output3TextArea.value).then(() => {
          showNotification(translations[getCurrentLang()].textCopied, 'success');
        }).catch(err => {
          showNotification(translations[getCurrentLang()].failedToCopy, 'error');
        });
      } else {
        showNotification(translations[getCurrentLang()].noTextToCopy, 'error');
      }
    });
  }

  if (buttons.copyButton4) {
    buttons.copyButton4.addEventListener('click', () => {
      const output4TextArea = document.getElementById('output4-text');
      if (output4TextArea && output4TextArea.value) {
        navigator.clipboard.writeText(output4TextArea.value).then(() => {
          showNotification(translations[getCurrentLang()].textCopied, 'success');
        }).catch(err => {
          showNotification(translations[getCurrentLang()].failedToCopy, 'error');
        });
      } else {
        showNotification(translations[getCurrentLang()].noTextToCopy, 'error');
      }
    });
  }

  if (buttons.exportSettingsButton) {
    buttons.exportSettingsButton.addEventListener('click', exportSettings);
  }

  if (buttons.importSettingsButton) {
    buttons.importSettingsButton.addEventListener('click', importSettings);
  }

  const splitModeButtons = document.querySelectorAll('.split-mode-button');
  splitModeButtons.forEach(button => {
    button.addEventListener('click', () => {
      updateSplitModeUI(parseInt(button.getAttribute('data-split-mode')));
    });
  });
}
