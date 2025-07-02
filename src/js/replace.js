// replace.js
import { translations, currentLang } from './translations.js';
import { showNotification, updateWordCount } from './ui.js';
import { LOCAL_STORAGE_KEY, currentMode } from './settings.js';
import { escapeRegExp } from './utils.js';
import { saveInputState } from './inputState.js';

// Hàm thay thế văn bản
function replaceText(inputText, pairs, matchCase) {
  let outputText = inputText;
  
  pairs.forEach(pair => {
    let find = pair.find;
    let replace = pair.replace !== null ? pair.replace : '';
    if (!find) return;

    const escapedFind = escapeRegExp(find);
    const regexFlags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(escapedFind, regexFlags);

    outputText = outputText.replace(regex, replace);
  });

  const paragraphs = outputText.split('\n').filter(p => p.trim());
  return paragraphs.join('\n\n');
}

// Xử lý sự kiện nút thay thế
function setupReplaceHandler() {
  const replaceButton = document.getElementById('replace-button');
  if (replaceButton) {
    replaceButton.addEventListener('click', () => {
      console.log('Đã nhấp vào nút Thay thế');
      const inputTextArea = document.getElementById('input-text');
      if (!inputTextArea || !inputTextArea.value) {
        showNotification(translations[currentLang].noTextToReplace, 'error');
        return;
      }

      let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
      const modeSettings = settings.modes[currentMode] || { pairs: [], matchCase: false };
      const pairs = modeSettings.pairs || [];
      if (pairs.length === 0) {
        showNotification(translations[currentLang].noPairsConfigured, 'error');
        return;
      }

      const outputText = replaceText(inputTextArea.value, pairs, modeSettings.matchCase);

      const outputTextArea = document.getElementById('output-text');
      if (outputTextArea) {
        outputTextArea.value = outputText;
        inputTextArea.value = '';
        updateWordCount('input-text', 'input-word-count');
        updateWordCount('output-text', 'output-word-count');
        showNotification(translations[currentLang].textReplaced, 'success');
        saveInputState();
      } else {
        console.error('Không tìm thấy khu vực văn bản đầu ra');
      }
    });
  } else {
    console.error('Không tìm thấy nút Thay thế');
  }
}

export { replaceText, setupReplaceHandler };
