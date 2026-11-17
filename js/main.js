(() => {
  "use strict";

  const lightbox = document.getElementById("beauty-lightbox");
  if (lightbox) {
    const image = lightbox.querySelector("img");
    const caption = lightbox.querySelector("p");

    document.querySelectorAll("[data-case-image]").forEach((button) => {
      button.addEventListener("click", () => {
        const source = button.querySelector("img");
        if (!source) return;
        image.src = source.currentSrc || source.src;
        image.alt = source.alt || "";
        caption.textContent = button.dataset.caption || source.alt || "";
        if (typeof lightbox.showModal === "function") lightbox.showModal();
      });
    });

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.close();
    });
  }

  // Permite registrar cliques caso o site principal já utilize dataLayer.
  window.dataLayer = window.dataLayer || [];
  document.querySelectorAll("[data-track]").forEach((element) => {
    element.addEventListener("click", () => {
      window.dataLayer.push({
        event: element.getAttribute("data-track"),
        page_name: "beleza",
        link_text: (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 90)
      });
    });
  });
})();
