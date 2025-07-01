// src/text/split.js
import { translations, getCurrentLang } from '../i18n/translations.js';
import { showNotification } from '../ui/notifications.js';
import { countWords, updateWordCount } from '../utils/wordCount.js';

let currentSplitMode = 2;

export function updateSplitModeUI(mode) {
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
}

export function handleSplit() {
  const inputTextArea = document.getElementById('split-input-text');
  const outputTextAreas = [
    document.getElementById('output1-text'),
    document.getElementById('output2-text'),
    document.getElementById('output3-text'),
    document.getElementById('output4-text')
  ].slice(0, currentSplitMode);
  if (!inputTextArea || !inputTextArea.value) {
    showNotification(translations[getCurrentLang()].noTextToSplit, 'error');
    return;
  }

  let text = inputTextArea.value;
  const chapterRegex = /^Chương\s+(\d+)(?:::\s*(.*))?$/m;
  let chapterNum = 1;
  let chapterTitle = '';

  const match = text.match(chapterRegex);
  if (match) {
    chapterNum = parseInt(match[1]);
    chapterTitle = match[2] ? `: ${match[2]}` : '';
    text = text.replace(chapterRegex, '').trim();
  }

  const paragraphs = text.split('\n').filter(p => p.trim());
  const totalWords = countWords(text);
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
  showNotification(translations[getCurrentLang()].splitSuccess, 'success');
}
