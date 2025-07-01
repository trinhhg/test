// src/events/tabs.js
export function attachTabEvents() {
  const tabButtons = document.querySelectorAll('.tab-button');
  if (tabButtons.length === 0) {
    console.error('Không tìm thấy nút tab');
    return;
  }

  tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      const tabContents = document.querySelectorAll('.tab-content');
      const allButtons = document.querySelectorAll('.tab-button');
      tabContents.forEach(tab => tab.classList.remove('active'));
      allButtons.forEach(btn => btn.classList.remove('active'));

      const selectedTab = document.getElementById(tabName);
      if (selectedTab) {
        selectedTab.classList.add('active');
      } else {
        console.error(`Không tìm thấy tab với ID ${tabName}`);
      }

      button.classList.add('active');
    });
  });
}
