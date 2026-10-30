/**
 * PRIYA & SHINOJ WEDDING INVITATION - MERGED INTERACTION LOGIC
 */

document.addEventListener("DOMContentLoaded", () => {
  const config = window.WEDDING_CONFIG || {};

  // DOM Selectors
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Initialize Elements
  const audio = $("#weddingMusic");
  const cover = $("#cover");
  const openBtn = $("#openInviteBtn");
  const musicToggle = $("#musicToggle");
  const musicLabel = $("#musicLabel");
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");
  const mainNav = $("#mainNav");
  const backToTop = $("#backToTop");

  /* ==================== 1. DATA BINDING ==================== */
  function bindData() {
    // Bind text nodes
    $$("[data-text]").forEach((node) => {
      const key = node.dataset.text;
      if (config[key] !== undefined) {
        node.textContent = config[key];
      }
    });

    // Set Audio Source
    if (audio && config.music) {
      audio.src = config.music;
    }

    // Set Instagram Links
    const brideInsta = $("#brideInsta");
    if (brideInsta && config.brideInstagram) {
      brideInsta.href = config.brideInstagram;
    }
    const groomInsta = $("#groomInsta");
    if (groomInsta && config.groomInstagram) {
      groomInsta.href = config.groomInstagram;
    }

    // Set Map & Directions
    const directionsBtn = $("#directionsBtn");
    if (directionsBtn && config.locationUrl) {
      directionsBtn.href = config.locationUrl;
    }
    const googleMapFrame = $("#googleMapFrame");
    if (googleMapFrame && config.mapEmbedUrl) {
      googleMapFrame.src = config.mapEmbedUrl;
    }

    // Set WhatsApp RSVP Links
    const waBride = $("#waBrideBtn");
    if (waBride && config.whatsapp?.bridePhone) {
      const text = encodeURIComponent(config.whatsapp.brideGreeting || "Hello Priya, I'm delighted to attend your wedding!");
      waBride.href = `https://api.whatsapp.com/send?phone=${config.whatsapp.bridePhone}&text=${text}`;
    }

    const waGroom = $("#waGroomBtn");
    if (waGroom && config.whatsapp?.groomPhone) {
      const text = encodeURIComponent(config.whatsapp.groomGreeting || "Hello Shinoj, I'm delighted to attend your wedding!");
      waGroom.href = `https://api.whatsapp.com/send?phone=${config.whatsapp.groomPhone}&text=${text}`;
    }

    // Google Calendar Link Setup
    setupGoogleCalendarLink();
  }

  /* ==================== 2. OPENING COVER & MUSIC ==================== */
  function openInvitation() {
    if (!cover || cover.classList.contains("is-open")) return;

    // 1. Trigger doors opening (swings open in 3D over 1.5s, immediately revealing Royal Cream Curtains)
    cover.classList.add("is-open");

    // 2. Play background music
    if (audio) {
      audio.play().then(() => {
        musicToggle.classList.remove("paused");
        if (musicLabel) musicLabel.textContent = "Playing";
      }).catch(() => {
        // Autoplay restrictions fallback
        musicToggle.classList.add("paused");
        if (musicLabel) musicLabel.textContent = "Play Music";
      });
    }

    // 3. First petal burst as doors swing open
    burstPetals(25);

    // 4. At 1.1s (doors wide open), gracefully part the Royal Cream Curtains to reveal invitation
    const curtainsWrapper = $("#curtainsWrapper");
    setTimeout(() => {
      if (curtainsWrapper) {
        curtainsWrapper.classList.add("curtains-open");
      }
      burstPetals(35);
    }, 1100);

    // 5. At 2.4s (curtains parted, invitation fully visible), unlock document scroll
    setTimeout(() => {
      document.body.classList.remove("is-locked");
      burstPetals(25);
    }, 2400);

    // 6. At 3.35s (cover overlay has completely faded out), cleanly hide cover
    setTimeout(() => {
      cover.style.display = "none";
    }, 3350);
  }

  const royalSeal = $("#royalSeal");
  if (royalSeal) {
    royalSeal.addEventListener("click", openInvitation);
  }

  if (openBtn) {
    openBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openInvitation();
    });
  }

  const doorsWrapper = $("#doorsWrapper");
  if (doorsWrapper) {
    doorsWrapper.addEventListener("click", openInvitation);
  }

  // Floating Music Controller Toggle
  if (musicToggle && audio) {
    musicToggle.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().then(() => {
          musicToggle.classList.remove("paused");
          if (musicLabel) musicLabel.textContent = "Playing";
        });
      } else {
        audio.pause();
        musicToggle.classList.add("paused");
        if (musicLabel) musicLabel.textContent = "Paused";
      }
    });
  }

  /* ==================== 3. NAVIGATION & SCROLLSPY ==================== */
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    $$(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close menu when tapping outside
    document.addEventListener("click", (e) => {
      if (navLinks.classList.contains("open") && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    // Sticky navbar effect
    if (mainNav) {
      if (scrollY > 60) {
        mainNav.classList.add("scrolled");
      } else {
        mainNav.classList.remove("scrolled");
      }
    }

    // Back to top button visibility
    if (backToTop) {
      if (scrollY > 500) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }

    // Active link scrollspy
    const sections = $$("section[id]");
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        $$(".nav-link").forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  });

  /* ==================== 4. SCRATCH TO REVEAL DATE ==================== */
  function setupScratchCard() {
    const wrap = $("#scratchWrap");
    const canvas = $("#scratchCanvas");
    const hint = $("#scratchHint");
    const banner = $("#revealedBanner");
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let isDrawing = false;
    let isRevealed = false;

    function initCanvas() {
      const rect = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Draw luxury metallic foil coating
      const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      grad.addColorStop(0, "#cbb173");
      grad.addColorStop(0.35, "#e8d39f");
      grad.addColorStop(0.7, "#a98939");
      grad.addColorStop(1, "#546857");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Decorative pattern
      ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
      for (let i = 0; i < rect.width; i += 16) {
        ctx.fillRect(i, 0, 2, rect.height);
      }

      // Scratch stamp text
      ctx.fillStyle = "#2c2311";
      ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.letterSpacing = "2px";
      ctx.fillText("✦ SCRATCH HERE TO REVEAL DATE ✦", rect.width / 2, rect.height / 2 + 5);
    }

    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function scratch(e) {
      if (!isDrawing || isRevealed) return;
      if (e.cancelable && e.type.startsWith("touch")) e.preventDefault();

      const { x, y } = getCoords(e);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 26, 0, Math.PI * 2);
      ctx.fill();

      checkCleared();
    }

    function checkCleared() {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let clearCount = 0;
      const totalPixels = pixels.length / 16;

      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] < 40) clearCount++;
      }

      if (clearCount / totalPixels > 0.38) {
        revealFullDate();
      }
    }

    function revealFullDate() {
      if (isRevealed) return;
      isRevealed = true;
      wrap.classList.add("is-revealed");
      canvas.style.transition = "opacity 0.6s ease";
      canvas.style.opacity = "0";

      if (hint) hint.style.display = "none";
      if (banner) banner.classList.add("visible");

      burstPetals(30);
    }

    // Pointer events
    canvas.addEventListener("mousedown", (e) => { isDrawing = true; scratch(e); });
    window.addEventListener("mouseup", () => { isDrawing = false; });
    canvas.addEventListener("mousemove", scratch);

    canvas.addEventListener("touchstart", (e) => { isDrawing = true; scratch(e); }, { passive: false });
    window.addEventListener("touchend", () => { isDrawing = false; });
    window.addEventListener("touchcancel", () => { isDrawing = false; });
    canvas.addEventListener("touchmove", scratch, { passive: false });

    window.addEventListener("resize", () => {
      if (!isRevealed) initCanvas();
    });

    window.addEventListener("orientationchange", () => {
      if (!isRevealed) setTimeout(initCanvas, 200);
    });

    initCanvas();
  }

  /* ==================== 5. COUNTDOWN TIMER ==================== */
  function setupCountdown() {
    const daysEl = $("#countDays");
    const hoursEl = $("#countHours");
    const minsEl = $("#countMins");
    const secsEl = $("#countSecs");
    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    // Timeline target: start with a timeline of 60 days
    const STORAGE_KEY = "priya_shinoj_wedding_countdown_60d";
    let target;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? Number(stored) : null;
      // If a valid future target within 60 days exists, preserve countdown progress; otherwise initialize 60 days
      if (parsed && !isNaN(parsed) && parsed > Date.now() && (parsed - Date.now()) <= (60 * 24 * 60 * 60 * 1000 + 60000)) {
        target = parsed;
      } else {
        target = Date.now() + (60 * 24 * 60 * 60 * 1000);
        localStorage.setItem(STORAGE_KEY, String(target));
      }
    } catch (e) {
      target = Date.now() + (60 * 24 * 60 * 60 * 1000);
    }

    function updateTimer() {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minsEl.textContent = String(minutes).padStart(2, "0");
      secsEl.textContent = String(seconds).padStart(2, "0");
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  /* ==================== 6. GOOGLE CALENDAR LINK ==================== */
  function setupGoogleCalendarLink() {
    const btn = $("#addToCalendarBtn");
    if (!btn) return;

    const title = encodeURIComponent(`${config.bride} & ${config.groom}'s Wedding Celebration`);
    const details = encodeURIComponent(`We are delighted to celebrate the wedding of ${config.bride} and ${config.groom} at ${config.venue}. Your blessings mean the world to us!`);
    const location = encodeURIComponent(`${config.venue}, ${config.venueAddress || ""}`);
    
    // Google Calendar dates format: YYYYMMDDTHHMMSSZ
    const dates = "20260824T120000Z/20260824T170000Z";
    btn.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  }

  /* ==================== 7. SCHEDULE ITINERARY RENDERER ==================== */
  function renderSchedule() {
    const container = $("#eventsTimeline");
    if (!container || !config.events) return;

    container.innerHTML = config.events.map((evt) => `
      <article class="event-card">
        <div class="event-icon-circle">
          <i class="fa-solid ${evt.icon || 'fa-calendar-star'}"></i>
        </div>
        <span class="event-time">${evt.time}</span>
        <h3 class="event-title">${evt.title}</h3>
        <p class="event-desc">${evt.description}</p>
      </article>
    `).join("");
  }

  /* ==================== 8. OUR STORY RENDERER ==================== */
  function renderStory() {
    const container = $("#storyGrid");
    if (!container || !config.story) return;

    container.innerHTML = config.story.map((item) => `
      <article class="story-card">
        <div class="story-img-wrap">
          <img src="${item.image}" alt="${item.title}" class="story-img" loading="lazy" />
          <span class="story-stage">${item.stage}</span>
        </div>
        <div class="story-body">
          <h3 class="story-title">${item.title}</h3>
          <p class="story-text">${item.text}</p>
        </div>
      </article>
    `).join("");
  }

  /* ==================== 9. GALLERY & LIGHTBOX ==================== */
  let currentLightboxIdx = 0;
  const galleryItems = config.gallery || [];

  function renderGallery() {
    const grid = $("#galleryGrid");
    if (!grid) return;

    grid.innerHTML = galleryItems.map((item, idx) => `
      <div class="gallery-item" data-index="${idx}">
        <img src="${item.src}" alt="${item.caption || 'Wedding Photo'}" loading="lazy" />
        <div class="gallery-overlay">
          <div class="gallery-overlay-icon" aria-hidden="true">
            <i class="fa-solid fa-expand"></i>
          </div>
          <span class="gallery-caption">${item.caption || ''}</span>
        </div>
      </div>
    `).join("");

    $$(".gallery-item", grid).forEach((el) => {
      el.addEventListener("click", () => {
        openLightbox(Number(el.dataset.index));
      });
    });
  }

  function openLightbox(index) {
    const modal = $("#lightboxModal");
    const img = $("#lightboxImg");
    const caption = $("#lightboxCaption");
    if (!modal || !img || !galleryItems[index]) return;

    currentLightboxIdx = index;
    img.src = galleryItems[index].src;
    caption.textContent = galleryItems[index].caption || "";
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    const modal = $("#lightboxModal");
    if (!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  const lightboxClose = $("#lightboxClose");
  const lightboxOverlay = $("#lightboxOverlay");
  const lightboxPrev = $("#lightboxPrev");
  const lightboxNext = $("#lightboxNext");

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener("click", closeLightbox);

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => {
      currentLightboxIdx = (currentLightboxIdx - 1 + galleryItems.length) % galleryItems.length;
      openLightbox(currentLightboxIdx);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", () => {
      currentLightboxIdx = (currentLightboxIdx + 1) % galleryItems.length;
      openLightbox(currentLightboxIdx);
    });
  }

  window.addEventListener("keydown", (e) => {
    const modal = $("#lightboxModal");
    if (modal && modal.classList.contains("active")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft" && lightboxPrev) lightboxPrev.click();
      if (e.key === "ArrowRight" && lightboxNext) lightboxNext.click();
    }
  });

  /* ==================== 10. RSVP FORM & WISHES WALL ==================== */
  const defaultWishes = [
    {
      name: "Anjali & Arvind",
      attendance: "yes",
      guests: "2",
      text: "Wishing you both a lifetime of happiness, unconditional love, and joy! Can't wait to celebrate!",
      date: "Just now"
    },
    {
      name: "Siddharth Menon",
      attendance: "yes",
      guests: "1",
      text: "Heartiest congratulations Priya & Shinoj! May your journey together be as bright and beautiful as you two.",
      date: "2 hours ago"
    },
    {
      name: "Dr. K. R. Nair & Family",
      attendance: "yes",
      guests: "3",
      text: "Sending our warmest blessings to the lovely couple. May God bless your union abundantly.",
      date: "Yesterday"
    }
  ];

  function getSavedWishes() {
    try {
      const stored = localStorage.getItem("wedding_wishes_priya_shinoj");
      if (stored) {
        let wishes = JSON.parse(stored);
        if (Array.isArray(wishes)) {
          // Auto-migrate Vivek to Arvind in user localStorage
          let updated = false;
          wishes = wishes.map((w) => {
            if (w && typeof w.name === "string" && /vivek/i.test(w.name)) {
              updated = true;
              return { ...w, name: w.name.replace(/vivek/gi, "Arvind") };
            }
            return w;
          });
          if (updated) {
            localStorage.setItem("wedding_wishes_priya_shinoj", JSON.stringify(wishes));
          }
          return wishes;
        }
      }
    } catch (e) {
      console.warn("Storage read error:", e);
    }
    return defaultWishes;
  }

  function renderWishes() {
    const container = $("#wishesGrid");
    if (!container) return;

    const wishes = getSavedWishes();
    container.innerHTML = wishes.map((w) => `
      <div class="wish-card">
        <div>
          <div class="wish-header">
            <span class="wish-author">${w.name}</span>
            <span class="wish-badge ${w.attendance === 'yes' ? 'attending' : ''}">
              ${w.attendance === 'yes' ? 'Attending' : 'Warm Wishes'}
            </span>
          </div>
          <p class="wish-text">"${w.text}"</p>
        </div>
        <span class="wish-date">${w.date}</span>
      </div>
    `).join("");
  }

  const rsvpForm = $("#rsvpForm");
  const rsvpAlert = $("#rsvpAlert");

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = $("#guestName").value.trim();
      const attendance = $("#rsvpAttendance").value;
      const guests = $("#guestCount").value;
      const blessing = $("#guestBlessing").value.trim();

      if (!name) return;

      const newWish = {
        name: name,
        attendance: attendance,
        guests: guests,
        text: blessing || (attendance === "yes" ? "Hearty congratulations and looking forward to being there!" : "Hearty congratulations to the bride and groom!"),
        date: "Just now"
      };

      const currentWishes = getSavedWishes();
      currentWishes.unshift(newWish);
      localStorage.setItem("wedding_wishes_priya_shinoj", JSON.stringify(currentWishes));

      // Re-render wishes
      renderWishes();

      // Show success feedback
      if (rsvpAlert) {
        rsvpAlert.className = "form-feedback success";
        rsvpAlert.textContent = `Thank you ${name}! Your RSVP and heartfelt wish have been recorded.`;
        rsvpAlert.classList.remove("hidden");
      }

      burstPetals(25);
      rsvpForm.reset();
      
      // Reset Neumorphic toggle to yes
      const btnYes = $("#btnAttendYes");
      if (btnYes) btnYes.click();

      setTimeout(() => {
        if (rsvpAlert) rsvpAlert.classList.add("hidden");
      }, 5000);
    });
  }

  /* ==================== 11. CELEBRATION PETALS BURST ==================== */
  function burstPetals(count = 25) {
    for (let i = 0; i < count; i++) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.setProperty("--sway", `${Math.random() * 140 - 70}px`);
      petal.style.setProperty("--fall", `${3.2 + Math.random() * 3}s`);
      petal.style.animationDelay = `${Math.random() * 0.5}s`;
      document.body.appendChild(petal);

      setTimeout(() => petal.remove(), 6500);
    }
  }

  /* ==================== 12. NEUMORPHIC ATTENDANCE TOGGLE ==================== */
  function setupNeumorphicToggle() {
    const toggleBtns = $$(".neu-toggle-btn");
    const hiddenSelect = $("#rsvpAttendance");
    const guestCountGroup = $("#guestCountGroup");

    toggleBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        toggleBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const val = btn.dataset.value;
        if (hiddenSelect) {
          hiddenSelect.value = val;
        }

        if (guestCountGroup) {
          if (val === "no") {
            guestCountGroup.style.opacity = "0.45";
            guestCountGroup.style.pointerEvents = "none";
          } else {
            guestCountGroup.style.opacity = "1";
            guestCountGroup.style.pointerEvents = "auto";
          }
        }
      });
    });
  }

  /* ==================== 13. SCROLL REVEAL ANIMATIONS ==================== */
  function setupScrollAnimations() {
    const targets = $$(
      ".section-heading, .couple-card, .scratch-card-box, .count-card, " +
      ".event-card, .story-card, .gallery-item, .venue-card, .whatsapp-card, " +
      ".rsvp-form-card, .wishes-wall-container, .wish-card"
    );

    targets.forEach((el, index) => {
      el.classList.add("reveal-on-scroll");
      // Add subtle stagger to siblings
      const siblingIndex = Array.from(el.parentElement?.children || []).indexOf(el);
      if (siblingIndex > 0) {
        el.style.transitionDelay = `${(siblingIndex % 4) * 0.12}s`;
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* ==================== 14. 3D CARD PERSPECTIVE TILT ==================== */
  function setupCardTilt() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 768) return;

    const cards = $$(
      ".couple-card, .event-card, .story-card, .venue-card, .whatsapp-card, .neu-card"
    );

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / (rect.height / 2)) * 6.5;
        const rotateY = (x / (rect.width / 2)) * 6.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ==================== INITIALIZE ALL MODULES ==================== */
  bindData();
  setupScratchCard();
  setupCountdown();
  renderSchedule();
  renderStory();
  renderGallery();
  renderWishes();
  setupNeumorphicToggle();
  setupScrollAnimations();
  setupCardTilt();
});
