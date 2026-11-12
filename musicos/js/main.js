(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  const tabs = Array.from(document.querySelectorAll(".folder-tab"));
  const panels = Array.from(document.querySelectorAll(".folder-panel"));

  function activateTab(name, focus = false) {
    tabs.forEach((tab) => {
      const active = tab.dataset.tab === name;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });

    panels.forEach((panel) => {
      const active = panel.id === `panel-${name}`;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab.dataset.tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      activateTab(tabs[next].dataset.tab, true);
    });
  });

  if (tabs.length) activateTab("musica");

  const mobileVideo = document.querySelector(".mobile-preview-device video");
  const audioToggle = document.querySelector(".video-audio-toggle");

  if (mobileVideo && audioToggle) {
    const audioLabel = audioToggle.querySelector(".video-audio-label");

    const syncAudioToggle = () => {
      const audioEnabled = !mobileVideo.muted;
      audioToggle.classList.toggle("is-unmuted", audioEnabled);
      audioToggle.setAttribute("aria-pressed", String(audioEnabled));
      audioToggle.setAttribute("aria-label", audioEnabled ? "Silenciar áudio do vídeo" : "Ativar áudio do vídeo");
      if (audioLabel) audioLabel.textContent = audioEnabled ? "Silenciar áudio" : "Ativar áudio";
    };

    // O vídeo sempre começa sem som; o visitante decide quando ouvir.
    mobileVideo.muted = true;
    mobileVideo.defaultMuted = true;
    syncAudioToggle();

    audioToggle.addEventListener("click", () => {
      mobileVideo.muted = !mobileVideo.muted;
      syncAudioToggle();
    });

    // Mantém o botão sincronizado caso o visitante use o controle nativo do vídeo.
    mobileVideo.addEventListener("volumechange", syncAudioToggle);
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  const revealTargets = document.querySelectorAll(
    ".hero-copy, .hero-art, .point-heading, .point-copy, .point-portrait, .statement, .map-heading, .folder-interface, .frequency-card, .case-intro-grid, .mobile-preview, .case-mosaic, .case-details, .testimonial-grid, .fit-grid, .audience-ticker, .cta-grid"
  );
  revealTargets.forEach((element) => element.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach((element) => observer.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  }
})();
