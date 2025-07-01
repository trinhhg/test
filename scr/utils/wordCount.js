// src/utils/wordCount.js
import { translations, getCurrentLang } from '../i18n/translations.js';

export function countWords(text) {
  return text.trim() ? text.split(/\s+/).filter(word => word.length > 0).length : 0;
}

export function updateWordCount(textareaId, counterId) {
  const textarea = document.getElementById(textareaId);
  const counter = document.getElementById(counterId);
  if (textarea && counter) {
    const wordCount = countWords(textarea.value);
    counter.textContent = translations[getCurrentLang()].wordCount.replace('{count}', wordCount);
  }
}
