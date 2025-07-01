// src/text/replace.js
import { translations, getCurrentLang } from '../i18n/translations.js';
import { showNotification } from '../ui/notifications.js';
import { escapeRegExp } from '../utils/escape.js';

export function replaceText(inputText, pairs, matchCase) {
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

export function handleReplace() {
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
  }
}
