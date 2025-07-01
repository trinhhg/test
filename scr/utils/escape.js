// src/utils/escape.js
export function escapeHtml(str) {
  try {
    if (typeof str !== 'string') return '';
    const htmlEntities = {
      '&': '&',
      '<': '<',
      '>': '>',
      '"': '"',
      "'": '''
    };
    return str.replace(/[&<>"']/g, match => htmlEntities[match]);
  } catch (error) {
    console.error('Lỗi trong escapeHtml:', error);
    return str || '';
  }
}

export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
