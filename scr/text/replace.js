// src/text/replace.js
import { translations, getCurrentLang } from '../i18n/translations.js';
import { showNotification } from '../ui/notifications.js';
import { escapeRegExp } from '../utils/escape.js';
import { saveInputState } from '../state/inputState.js'; // Thêm import saveInputState

export function replaceText(inputText, pairs, matchCase) {
  let outputText = inputText;

  pairs.forEach(pair => {
    let find = pair.find;
    let replace = pair.replace !== null ? pair.replace : '';
    if (!find) return;

    // Thoát các ký tự đặc biệt trong chuỗi tìm kiếm
    const escapedFind = escapeRegExp(find);
    const regexFlags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(escapedFind, regexFlags);

    // Hàm thay thế với logic viết hoa chữ cái đầu nếu cần
    outputText = outputText.replace(regex, (match, offset) => {
      // Kiểm tra xem vị trí thay thế có ở đầu câu hay không
      let isStartOfSentence = false;
      if (offset === 0 || outputText[offset - 1] === '\n') {
        // Đầu văn bản hoặc đầu dòng
        isStartOfSentence = true;
      } else if (outputText[offset - 1] === '.') {
        // Sau dấu chấm, kiểm tra thêm ngữ cảnh
        let prevIndex = offset - 2;
        // Bỏ qua khoảng trắng trước dấu chấm
        while (prevIndex >= 0 && /\s/.test(outputText[prevIndex])) {
          prevIndex--;
        }
        // Kiểm tra xem dấu chấm có phải là phần của dấu ba chấm hoặc nằm trong ngoặc
        if (
          prevIndex < 0 || // Dấu chấm ở đầu văn bản
          outputText[prevIndex] !== '.' && // Không phải dấu ba chấm
          !/[\[\(]/.test(outputText.slice(Math.max(0, prevIndex - 10), prevIndex + 1)) // Không trong ngoặc
        ) {
          isStartOfSentence = true;
        }
      }

      if (isStartOfSentence && replace) {
        // Viết hoa chữ cái đầu của chuỗi thay thế
        return replace.charAt(0).toUpperCase() + replace.slice(1);
      }
      return replace;
    });
  });

  // Định dạng lại đoạn văn
  const paragraphs = outputText.split('\n').filter(p => p.trim());
  return paragraphs.join('\n\n');
}

export function handleReplace(currentMode) {
  const inputTextArea = document.getElementById('input-text');
  if (!inputTextArea || !inputTextArea.value) {
    showNotification(translations[getCurrentLang()].noTextToReplace, 'error');
    return;
  }

  let settings = JSON.parse(localStorage.getItem('local_settings')) || { modes: { default: { pairs: [], matchCase: false } } };
  const modeSettings = settings.modes[currentMode] || { pairs: [], matchCase: false };
  const pairs = modeSettings.pairs || [];
  if (pairs.length === 0) {
    showNotification(translations[getCurrentLang()].noPairsConfigured, 'error');
    return;
  }

  const outputText = replaceText(inputTextArea.value, pairs, modeSettings.matchCase);

  const outputTextArea = document.getElementById('output-text');
  if (outputTextArea) {
    outputTextArea.value = outputText;
    inputTextArea.value = '';
    updateWordCount('input-text', 'input-word-count');
    updateWordCount('output-text', 'output-word-count');
    showNotification(translations[getCurrentLang()].textReplaced, 'success');
    saveInputState();
  }
}
