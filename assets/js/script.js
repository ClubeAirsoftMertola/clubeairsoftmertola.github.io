document.addEventListener('DOMContentLoaded', function () {
  const hero = document.querySelector('.hero h1');
  setTimeout(() => {
    hero.classList.add('animate__animated', 'animate__flash');
  }, 500);
});
