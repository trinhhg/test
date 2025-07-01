// src/js/textProcessing.js
(function () {
  window.App = window.App || {};

  App.replaceText = function (inputText, pairs, matchCase) {
    let outputText = inputText;

    pairs.forEach(pair => {
      let find = pair.find;
      let replace = pair.replace !== null ? pair.replace : '';
      if (!find) return;

      const escapedFind = App.escapeRegExp(find);
      const regexFlags = matchCase ? 'g' : 'gi';
      const regex = new RegExp(escapedFind, regexFlags);

      outputText = outputText.replace(regex, replace);
    });

    const paragraphs = outputText.split('\n').filter(p => p.trim());
    return paragraphs.join('\n\n');
  };

  App.handleReplace = function () {
    const inputTextArea = document.getElementById('input-text');
    if (!inputTextArea || !inputTextArea.value) {
      App.showNotification(App.translations[App.currentLang].noTextToReplace, 'error');
      return;
    }

    let settings = JSON.parse(localStorage.getItem('local_settings')) || { modes: { default: { pairs: [], matchCase: false } } };
    const modeSettings = settings.modes[App.currentMode] || { pairs: [], matchCase: false };
    const pairs = modeSettings.pairs || [];
    if (pairs.length === 0) {
      App.showNotification(App.translations[App.currentLang].noPairsConfigured, 'error');
      return;
    }

    const outputText = App.replaceText(inputTextArea.value, pairs, modeSettings.matchCase);

    const outputTextArea = document.getElementById('output-text');
    if (outputTextArea) {
      outputTextArea.value = outputText;
      inputTextArea.value = '';
      App.updateWordCount('input-text', 'input-word-count');
      App.updateWordCount('output-text', 'output-word-count');
      App.showNotification(App.translations[App.currentLang].textReplaced, 'success');
      App.saveInputState();
    } else {
      console.error('Không tìm thấy khu vực văn bản đầu ra');
    }
  };

  App.handleSplit = function () {
    const inputTextArea = document.getElementById('split-input-text');
    const outputTextAreas = [
      document.getElementById('output1-text'),
      document.getElementById('output2-text'),
      document.getElementById('output3-text'),
      document.getElementById('output4-text')
    ].slice(0, App.currentSplitMode);
    if (!inputTextArea || !inputTextArea.value) {
      App.showNotification(App.translations[App.currentLang].noTextToSplit, 'error');
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
    const wordsPerPart = Math.floor(totalWords / App.currentSplitMode);

    let parts = [];
    let wordCount = 0;
    let startIndex = 0;

    for (let i = 0; i < paragraphs.length; i++) {
      const wordsInParagraph = countWords(paragraphs[i]);
      wordCount += wordsInParagraph;
      if (parts.length < App.currentSplitMode - 1 && wordCount >= wordsPerPart * (parts.length + 1)) {
        parts.push(paragraphs.slice(startIndex, i + 1).join('\n\n'));
        startIndex = i + 1;
      }
    }
    parts.push(paragraphs.slice(startIndex).join('\n\n'));

    outputTextAreas.forEach((textarea, index) => {
      if (textarea) {
        textarea.value = `Chương ${chapterNum}.${index + 1}${chapterTitle}\n\n${parts[index] || ''}`;
        App.updateWordCount(`output${index + 1}-text`, `output${index + 1}-word-count`);
      }
    });

    inputTextArea.value = '';
    App.updateWordCount('split-input-text', 'split-input-word-count');
    App.showNotification(App.translations[App.currentLang].splitSuccess, 'success');
    App.saveInputState();
  };

  function countWords(text) {
    return text.trim() ? text.split(/\s+/).filter(word => word.length > 0).length : 0;
  }
})();
