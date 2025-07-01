// src/ui/mainUI.js
import { translations } from '../i18n/translations.js';
import { showNotification } from './notifications.js';

let hasShownLoginSuccess = false;

export function showMainUI() {
  document.querySelector(".container").style.display = "block";
  document.querySelector(".login-container").style.display = "none";
  if (!hasShownLoginSuccess) {
    showNotification(translations['vn'].loginSuccess, 'success');
    hasShownLoginSuccess = true;
  }
}

export function showLoginUI() {
  document.querySelector(".container").style.display = "none";
  document.querySelector(".login-container").style.display = "flex";
}

export function showLoadingUI() {
  document.querySelector(".container").style.display = "none";
  document.querySelector(".login-container").style.display = "none";
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading';
  loadingDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 16px; color: #333;';
  loadingDiv.textContent = translations['vn'].loading;
  document.body.appendChild(loadingDiv);
}

export function hideLoadingUI() {
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv) loadingDiv.remove();
}
