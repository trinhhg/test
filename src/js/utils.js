// Hàm escape HTML
function escapeHtml(str) {
  try {
    if (typeof str !== 'string') return '';
    const htmlEntities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return str.replace(/[&<>"']/g, match => htmlEntities[match]);
  } catch (error) {
    console.error('Lỗi trong escapeHtml:', error);
    return str || '';
  }
}

// Hàm escape regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Hàm đếm từ
function countWords(text) {
  return text.trim() ? text.split(/\s+/).filter(word => word.length > 0).length : 0;
}

export { escapeHtml, escapeRegExp, countWords };
