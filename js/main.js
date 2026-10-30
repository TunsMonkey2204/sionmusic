/**
 * SION MUSIC ACADEMY - MAIN APPLICATION SCRIPT
 * Warm Editorial Minimalist Theme
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. Sticky Header & Scroll Spy
  // =========================================================================
  const siteHeader = document.querySelector('.site-header');
  const desktopLinks = document.querySelectorAll('.header-menu-link');
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTopBtn');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Header shadow on scroll
    if (scrollY > 20) {
      siteHeader?.classList.add('is-scrolled');
    } else {
      siteHeader?.classList.remove('is-scrolled');
    }

    // Back to top button visibility
    if (scrollY > 400) {
      backToTopBtn?.classList.add('is-visible');
    } else {
      backToTopBtn?.classList.remove('is-visible');
    }

    // Scroll spy active link
    const viewportOffset = scrollY + 160;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (viewportOffset >= top && viewportOffset < top + height) {
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('is-active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('is-active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  backToTopBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // =========================================================================
  // 2. Mobile Navigation Drawer
  // =========================================================================
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  function toggleMobileMenu(forceState) {
    const isOpen = typeof forceState === 'boolean' ? forceState : !mobileDrawer?.classList.contains('is-open');
    if (isOpen) {
      mobileDrawer?.classList.add('is-open');
      mobileToggle?.classList.add('is-open');
      mobileToggle?.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer?.classList.remove('is-open');
      mobileToggle?.classList.remove('is-open');
      mobileToggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  mobileToggle?.addEventListener('click', () => toggleMobileMenu());

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });

  document.addEventListener('click', (e) => {
    if (mobileDrawer?.classList.contains('is-open') &&
        !mobileDrawer.contains(e.target) &&
        !mobileToggle.contains(e.target)) {
      toggleMobileMenu(false);
    }
  });

  // =========================================================================
  // 3. Instrument Sound Preview Listeners
  // =========================================================================
  const soundPreviewBtns = document.querySelectorAll('.sound-preview-btn');
  soundPreviewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const soundType = btn.dataset.sound;
      if (!window.SionAudio) return;

      if (soundType === 'piano') window.SionAudio.playPianoChord();
      else if (soundType === 'guitar') window.SionAudio.playGuitarPluck();
      else if (soundType === 'saxophone') window.SionAudio.playSaxophoneNote();
      else if (soundType === 'organ') window.SionAudio.playOrganChord();
      else if (soundType === 'vocal') window.SionAudio.playVocalChime();

      btn.style.transform = 'scale(0.96)';
      setTimeout(() => { btn.style.transform = ''; }, 150);
    });
  });

  // =========================================================================
  // 4. Interactive Lightbox
  // =========================================================================
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryItems = document.querySelectorAll('.gallery-item');

  let currentGalleryIndex = 0;
  const galleryData = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-item-title')?.textContent || '';
    const tag = item.querySelector('.gallery-item-tag')?.textContent || '';
    const src = item.dataset.fullsrc || img?.src || '';

    galleryData.push({
      src: src,
      alt: img?.alt || title,
      caption: tag ? `${tag} — ${title}` : title
    });

    item.addEventListener('click', () => {
      openLightbox(index);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  function openLightbox(index) {
    if (!galleryData[index] || !lightboxModal) return;
    currentGalleryIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('is-active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose?.focus();
  }

  function updateLightboxContent() {
    const data = galleryData[currentGalleryIndex];
    if (!data) return;
    if (lightboxImg) {
      lightboxImg.src = data.src;
      lightboxImg.alt = data.alt;
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = data.caption;
    }
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('is-active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showPrevLightbox() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  function showNextLightbox() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', showPrevLightbox);
  lightboxNext?.addEventListener('click', showNextLightbox);

  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (lightboxModal?.classList.contains('is-active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrevLightbox();
      if (e.key === 'ArrowRight') showNextLightbox();
    }

    if (consultModal?.classList.contains('is-open')) {
      if (e.key === 'Escape') closeConsultModal();
    }

    if (mobileDrawer?.classList.contains('is-open') && e.key === 'Escape') {
      toggleMobileMenu(false);
    }
  });

  // =========================================================================
  // 5. Consultation Booking Modal
  // =========================================================================
  const consultModal = document.getElementById('consultModal');
  const consultModalClose = document.getElementById('consultModalClose');
  const openModalBtns = document.querySelectorAll('[data-open-modal="consult"]');
  const modalSubjectSelect = document.getElementById('modalCourseSelect');

  function openConsultModal(defaultSubject = '') {
    if (!consultModal) return;
    if (defaultSubject && modalSubjectSelect) {
      modalSubjectSelect.value = defaultSubject;
    }
    consultModal.classList.add('is-open');
    consultModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = consultModal.querySelector('input, select');
    setTimeout(() => firstInput?.focus(), 100);
  }

  function closeConsultModal() {
    if (!consultModal) return;
    consultModal.classList.remove('is-open');
    consultModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const subject = btn.dataset.subject || '';
      openConsultModal(subject);
    });
  });

  consultModalClose?.addEventListener('click', closeConsultModal);
  consultModal?.addEventListener('click', (e) => {
    if (e.target === consultModal) {
      closeConsultModal();
    }
  });

  // =========================================================================
  // 6. Form Submission & Toast Notifications
  // =========================================================================
  const toastNotice = document.getElementById('toastNotice');
  const toastTitle = document.getElementById('toastTitle');
  const toastDesc = document.getElementById('toastDesc');
  let toastTimer = null;

  function showToast(title, desc) {
    if (!toastNotice) return;
    if (toastTitle) toastTitle.textContent = title;
    if (toastDesc) toastDesc.textContent = desc;

    toastNotice.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotice.classList.remove('is-show');
    }, 4500);
  }

  const trialForms = document.querySelectorAll('.js-trial-form');
  trialForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const phoneInput = form.querySelector('input[type="tel"]');
      const nameInput = form.querySelector('input[name="fullname"]');
      const courseInput = form.querySelector('select[name="course"]');

      const phoneVal = phoneInput?.value.trim() || '';
      const nameVal = nameInput?.value.trim() || 'Bạn';
      const courseVal = courseInput?.value || 'khóa học';

      const phoneRegex = /^(0)(3|5|7|8|9)[0-9]{8}$/;
      if (!phoneRegex.test(phoneVal.replace(/\s+/g, ''))) {
        alert('Vui lòng nhập số điện thoại di động Việt Nam hợp lệ (10 chữ số, ví dụ: 0389648022).');
        phoneInput?.focus();
        return;
      }

      showToast(
        'Đăng ký thành công!',
        `Cảm ơn ${nameVal}. SION MUSIC sẽ liên hệ xếp lịch học thử môn ${courseVal} trong thời gian sớm nhất.`
      );

      form.reset();
      if (consultModal?.classList.contains('is-open')) {
        setTimeout(closeConsultModal, 600);
      }
    });
  });

  // Copy address shortcut
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  copyAddressBtn?.addEventListener('click', () => {
    const address = 'Đường Nguyễn Quý Anh, Phường Khuê Mỹ, Quận Ngũ Hành Sơn, TP. Đà Nẵng';
    navigator.clipboard.writeText(address).then(() => {
      showToast('Đã sao chép địa chỉ!', address);
    }).catch(() => {
      alert('Địa chỉ: ' + address);
    });
  });

});
