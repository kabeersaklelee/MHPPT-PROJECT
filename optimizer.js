const preloader = document.getElementById('preloader');
const startBtn = document.getElementById('start-button');
const loadingStatus = document.getElementById('loading-status');
const progressBar = document.getElementById('progress-bar');

const hidePreloader = () => {
  preloader.style.opacity = '0';
  setTimeout(() => {
    preloader.style.display = 'none';
    startAnimations();
  }, 500);
};

const startAnimations = () => {
  setTimeout(() => document.querySelector('.slides .title-text')?.classList.add('animate'), 100);
  setTimeout(() => document.querySelector('.slides .decorative-line')?.classList.add('animate'), 400);
  setTimeout(() => document.querySelector('.slides .author-text')?.classList.add('animate'), 700);
};

const startPresentation = () => {
  startBtn.style.display = 'none';
  
  const videos = Array.from(document.querySelectorAll('.slide-background video'));
  const bgImages = Array.from(document.querySelectorAll('[data-background-image]'));
  const images = Array.from(document.querySelectorAll('.slides section img'));

  const promises = [];

  videos.forEach(video => {
    promises.push(new Promise(resolve => {
      if (video.readyState >= 4) resolve();
      else video.addEventListener('canplaythrough', resolve, { once: true });
    }));
  });

  bgImages.forEach(el => {
    promises.push(new Promise(resolve => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = resolve;
      img.src = el.dataset.backgroundImage;
    }));
  });

  images.forEach(img => {
    promises.push(new Promise(resolve => {
      if (img.complete) resolve();
      else {
        img.onload = resolve;
        img.onerror = resolve;
      }
    }));
  });

  if (!promises.length) {
    hidePreloader();
    return;
  }

  loadingStatus.style.display = 'flex';
  let loaded = 0;

  Promise.all(promises.map(p => p.then(() => {
    loaded++;
    progressBar.textContent = Math.round((loaded / promises.length) * 100) + '%';
  }))).then(() => {
    videos.forEach(v => v.play());
    hidePreloader();
  });
};

const animateSlide = () => {
  const currentSlide = Reveal.getCurrentSlide();
  const titleText = currentSlide.querySelector('.title-text');
  const decorativeLine = currentSlide.querySelector('.decorative-line');
  const authorTexts = currentSlide.querySelectorAll('.author-text');
  
  if (titleText) {
    titleText.classList.remove('animate');
    setTimeout(() => titleText.classList.add('animate'), 50);
  }
  if (decorativeLine) {
    decorativeLine.classList.remove('animate');
    setTimeout(() => decorativeLine.classList.add('animate'), 350);
  }
  if (authorTexts.length) {
    authorTexts.forEach((text, idx) => {
      text.classList.remove('animate');
      setTimeout(() => text.classList.add('animate'), 650 + (idx * 150));
    });
  }
};

// Attach event listeners immediately when script loads
startBtn.addEventListener('click', startPresentation);

// Add slide animation listeners - need to be registered early
Reveal.on('slidechanged', animateSlide);
Reveal.on('slidetransitionend', animateSlide);