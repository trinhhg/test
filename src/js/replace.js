// replace.js
import { translations, currentLang } from './translations.js';
import { showNotification, updateWordCount } from './ui.js';
import { LOCAL_STORAGE_KEY, currentMode } from './settings.js';
import { escapeRegExp } from './utils.js';
import { saveInputState } from './inputState.js';

// Hàm thay thế văn bản
function replaceText(inputText, pairs, matchCase) {
  let outputText = inputText;

  // Step 1: Thực hiện thay thế ban đầu với match case
  pairs.forEach(pair => {
    let find = pair.find;
    let replace = pair.replace !== null ? pair.replace : '';
    if (!find) return;

    const escapedFind = escapeRegExp(find);
    const regexFlags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(escapedFind, regexFlags);

    // Giữ nguyên hoặc điều chỉnh chữ hoa/thường
    outputText = outputText.replace(regex, (match) => {
      if (matchCase) {
        return replace; // Giữ nguyên nếu matchCase bật
      } else {
        // Điều chỉnh chữ hoa/thường theo gốc
        if (match === match.toUpperCase()) {
          return replace.toUpperCase();
        } else if (match === match.toLowerCase()) {
          return replace.toLowerCase();
        } else if (match[0] === match[0].toUpperCase()) {
          return replace.charAt(0).toUpperCase() + replace.slice(1).toLowerCase();
        }
        return replace;
      }
    });
  });

  // Step 2: Viết hoa chữ cái đầu của từ thay thế ở đầu dòng hoặc sau ". "
  pairs.forEach(pair => {
    let replace = pair.replace !== null ? pair.replace : '';
    if (!replace) return;

    // Bỏ qua nếu từ thay thế đã toàn chữ hoa hoặc có chữ hoa xen kẽ
    if (replace === replace.toUpperCase() || /[A-Z]/.test(replace.slice(1))) {
      return;
    }

    // Regex để khớp từ thay thế ở đầu dòng hoặc sau ". "
    const pattern = new RegExp(`(^|\\n|\\.\\s)(${escapeRegExp(replace)})`, 'g');
    outputText = outputText.replace(pattern, (match, prefix, word) => {
      // Viết hoa chữ cái đầu của từ thay thế
      return prefix + word.charAt(0).toUpperCase() + word.slice(1);
    });
  });

  // Step 3: Định dạng đoạn văn
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
