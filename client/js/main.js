// main.js → handles navigation and shared behavior
document.addEventListener('DOMContentLoaded', () => {
  const categoryButtons = document.querySelectorAll('.link-btn[data-category]');

  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;

      if (category === '') location.href = './index.html';
      else if (category === 'Men') location.href = './men.html';
      else if (category === 'Women') location.href = './women.html';
    });
  });
});
