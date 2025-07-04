// split.js
import { translations, currentLang } from './translations.js';
import { showNotification, updateWordCount } from './ui.js';
import { countWords } from './utils.js';
import { saveInputState } from './inputState.js';

let currentSplitMode = 2;

// Hàm cập nhật giao diện chia chương
function updateSplitModeUI(mode) {
  currentSplitMode = mode;
  const splitContainer = document.querySelector('.split-container');
  const output3Section = document.getElementById('output3-section');
  const output4Section = document.getElementById('output4-section');
  const splitModeButtons = document.querySelectorAll('.split-mode-button');

  splitContainer.classList.remove('split-2', 'split-3', 'split-4');
  splitContainer.classList.add(`split-${mode}`);

  splitModeButtons.forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.getAttribute('data-split-mode')) === mode);
  });

  output3Section.style.display = mode >= 3 ? 'block' : 'none';
  output4Section.style.display = mode === 4 ? 'block' : 'none';

  ['split-input-text', 'output1-text', 'output2-text', 'output3-text', 'output4-text'].forEach(id => {
    const textarea = document.getElementById(id);
    if (textarea) {
      textarea.value = '';
      const counterId = id === 'split-input-text' ? 'split-input-word-count' : `${id}-word-count`;
      updateWordCount(id, counterId);
    }
  });

  console.log(`Đã reset bộ đếm từ về "Words: 0" cho tất cả các ô khi chuyển sang chế độ Chia ${mode}`);
  saveInputState?.();
}

// Xử lý sự kiện nút chia chương
function setupSplitHandler() {
  const splitButton = document.getElementById('split-button');
  if (splitButton) {
    splitButton.addEventListener('click', () => {
      console.log('Đã nhấp vào nút Chia Chương');
      const inputTextArea = document.getElementById('split-input-text');
      const outputTextAreas = [
        document.getElementById('output1-text'),
        document.getElementById('output2-text'),
        document.getElementById('output3-text'),
        document.getElementById('output4-text')
      ].slice(0, currentSplitMode);
      if (!inputTextArea || !inputTextArea.value) {
        showNotification(translations[currentLang].noTextToSplit, 'error');
        return;
      }

      let text = inputTextArea.value;
      let chapterNum = 1;
      let chapterTitle = '';

      // Biểu thức chính quy để nhận diện tiêu đề chương
      const chapterRegex = /^[Cc]hương\s+(\d+)(?::\s*(.*))?$/m;
      const lines = text.split('\n');
      let contentStartIndex = 0;

      // Kiểm tra dòng đầu tiên có phải tiêu đề chương không
      const firstLine = lines[0].trim();
      const match = firstLine.match(chapterRegex);
      if (match) {
        chapterNum = parseInt(match[1]);
        chapterTitle = match[2] ? `: ${match[2]}` : '';
        contentStartIndex = 1; // Bỏ qua dòng tiêu đề
      }

      // Lấy nội dung chương (bỏ qua dòng tiêu đề nếu có)
      const content = lines.slice(contentStartIndex).join('\n');
      const paragraphs = content.split('\n').filter(p => p.trim());
      const totalWords = countWords(content);
      const wordsPerPart = Math.floor(totalWords / currentSplitMode);

      let parts = [];
      let wordCount = 0;
      let startIndex = 0;

      for (let i = 0; i < paragraphs.length; i++) {
        const wordsInParagraph = countWords(paragraphs[i]);
        wordCount += wordsInParagraph;
        if (parts.length < currentSplitMode - 1 && wordCount >= wordsPerPart * (parts.length + 1)) {
          parts.push(paragraphs.slice(startIndex, i + 1).join('\n\n'));
          startIndex = i + 1;
        }
      }
      parts.push(paragraphs.slice(startIndex).join('\n\n'));

      outputTextAreas.forEach((textarea, index) => {
        if (textarea) {
          textarea.value = `Chương ${chapterNum}.${index + 1}${chapterTitle}\n\n${parts[index] || ''}`;
          updateWordCount(`output${index + 1}-text`, `output${index + 1}-word-count`);
        }
      });

      inputTextArea.value = '';
      updateWordCount('split-input-text', 'split-input-word-count');
      showNotification(translations[currentLang].splitSuccess, 'success');
      saveInputState?.();
    });
  } else {
    console.error('Không tìm thấy nút Chia Chương');
  }
}

export { updateSplitModeUI, setupSplitHandler, currentSplitMode };
