document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Custom Cursor ---
  const cursor = document.querySelector('.custom-cursor');
  const cursorRing = document.querySelector('.custom-cursor-ring');

  if (window.matchMedia('(pointer: fine)').matches && cursor && cursorRing) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      
      // Ring has slight lag for organic feel
      cursorRing.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
      }, { duration: 150, fill: 'forwards' });
    });

    const hoverables = document.querySelectorAll('a, button, input, select, textarea, .project-item');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorRing.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorRing.classList.remove('hover');
      });
    });
  } else {
    // Hide cursor elements on touch devices
    if (cursor) cursor.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
  }

  // --- 2. Scroll Progress Bar (Vertical sidebar) ---
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPos = window.scrollY;
      const scrollPercent = (scrollPos / scrollHeight) * 100;
      progressBar.style.height = `${scrollPercent}%`;
    });
  }

  // --- 3. Fullscreen Menu Overlay ---
  const menuBtn = document.querySelector('.menu-btn');
  const menuOverlay = document.querySelector('.menu-overlay');

  if (menuBtn && menuOverlay) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      menuOverlay.classList.toggle('active');
      
      // Prevent scrolling when menu is active
      if (menuOverlay.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking links
    const menuLinks = menuOverlay.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- 4. Intersection Observer for Scroll Reveals ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // only reveal once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 5. Split Text Animation for Hero Title ---
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const text = heroTitle.textContent.trim();
    heroTitle.innerHTML = '';
    
    // Split into words, and wrap each word
    const words = text.split(' ');
    words.forEach((word, idx) => {
      const wordContainer = document.createElement('span');
      wordContainer.classList.add('word');
      
      const wordSpan = document.createElement('span');
      wordSpan.classList.add('word-span');
      
      // Keep styling for marked text (e.g. Red words)
      if (word.startsWith('[red]') || word.endsWith('[red]')) {
        wordSpan.classList.add('accent');
        wordSpan.textContent = word.replace(/\[red\]/g, '');
      } else {
        wordSpan.textContent = word;
      }
      
      wordContainer.appendChild(wordSpan);
      heroTitle.appendChild(wordContainer);
      
      // Append space unless last word
      if (idx < words.length - 1) {
        heroTitle.appendChild(document.createTextNode(' '));
      }
    });

    // Force reflow and animate
    setTimeout(() => {
      heroTitle.classList.add('animated');
    }, 100);
  }

  // --- 6. Count-up Stats Animation ---
  const stats = document.querySelectorAll('.stat-number');
  if (stats.length > 0) {
    const countOptions = {
      threshold: 0.5
    };
    
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const targetVal = parseInt(target.getAttribute('data-target'), 10);
          if (isNaN(targetVal)) return;
          
          let currentVal = 0;
          const duration = 2000; // 2s
          const increment = targetVal / (duration / 16); // ~60fps
          
          const counter = setInterval(() => {
            currentVal += increment;
            if (currentVal >= targetVal) {
              target.textContent = targetVal + (target.getAttribute('data-suffix') || '');
              clearInterval(counter);
            } else {
              target.textContent = Math.floor(currentVal) + (target.getAttribute('data-suffix') || '');
            }
          }, 16);
          
          observer.unobserve(target);
        }
      });
    }, countOptions);

    stats.forEach(stat => countObserver.observe(stat));
  }

  // --- 7. Appointment Form Submission ---
  const rdvForm = document.getElementById('rdv-form');
  const successMsg = document.getElementById('rdv-success');

  if (rdvForm && successMsg) {
    rdvForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Perform simple validation on required fields
      const inputs = rdvForm.querySelectorAll('[required]');
      let valid = true;
      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = 'var(--color-primary)';
        } else {
          input.style.borderColor = '';
        }
      });

      if (!valid) return;

      // Animate submit button click
      const submitBtn = rdvForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.style.opacity = '0.7';

      setTimeout(() => {
        rdvForm.style.display = 'none';
        successMsg.style.display = 'block';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1500);
    });
  }
});
