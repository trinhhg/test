// src/state/inputState.js
import { addPair } from '../settings/settings.js';
import { updateWordCount } from '../utils/wordCount.js';

const INPUT_STORAGE_KEY = 'input_state';

export function saveInputState() {
  const state = {
    inputText: document.getElementById('input-text')?.value || '',
    outputText: document.getElementById('output-text')?.value || '',
    splitInputText: document.getElementById('split-input-text')?.value || '',
    output1Text: document.getElementById('output1-text')?.value || '',
    output2Text: document.getElementById('output2-text')?.value || '',
    output3Text: document.getElementById('output3-text')?.value || '',
    output4Text: document.getElementById('output4-text')?.value || '',
    punctuationItems: Array.from(document.querySelectorAll('.punctuation-item')).map(item => ({
      find: item.querySelector('.find')?.value || '',
      replace: item.querySelector('.replace')?.value || ''
    }))
  };
  localStorage.setItem(INPUT_STORAGE_KEY, JSON.stringify(state));
}

export function restoreInputState() {
  const state = JSON.parse(localStorage.getItem(INPUT_STORAGE_KEY));
  if (!state) return;

  if (state.inputText && document.getElementById('input-text')) {
    document.getElementById('input-text').value = state.inputText;
    updateWordCount('input-text', 'input-word-count');
  }
  if (state.outputText && document.getElementById('output-text')) {
    document.getElementById('output-text').value = state.outputText;
    updateWordCount('output-text', 'output-word-count');
  }
  if (state.splitInputText && document.getElementById('split-input-text')) {
    document.getElementById('split-input-text').value = state.splitInputText;
    updateWordCount('split-input-text', 'split-input-word-count');
  }
  if (state.output1Text && document.getElementById('output1-text')) {
    document.getElementById('output1-text').value = state.output1Text;
    updateWordCount('output1-text', 'output1-word-count');
  }
  if (state.output2Text && document.getElementById('output2-text')) {
    document.getElementById('output2-text').value = state.output2Text;
    updateWordCount('output2-text', 'output2-word-count');
  }
  if (state.output3Text && document.getElementById('output3-text')) {
    document.getElementById('output3-text').value = state.output3Text;
    updateWordCount('output3-text', 'output3-word-count');
  }
  if (state.output4Text && document.getElementById('output4-text')) {
    document.getElementById('output4-text').value = state.output4Text;
    updateWordCount('output4-text', 'output4-word-count');
  }
  if (state.punctuationItems && state.punctuationItems.length > 0) {
    const list = document.getElementById('punctuation-list');
    if (list) {
      list.innerHTML = '';
      state.punctuationItems.slice().reverse().forEach(pair => {
        addPair(pair.find, pair.replace);
      });
    }
  }
}
