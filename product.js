// Quantity selector
const qtyValue = document.getElementById("qtyValue");
const qtyDecrease = document.querySelector("[data-qty-decrease]");
const qtyIncrease = document.querySelector("[data-qty-increase]");

if (qtyValue && qtyDecrease && qtyIncrease) {
  qtyDecrease.addEventListener("click", () => {
    const current = parseInt(qtyValue.textContent, 10);
    if (current > 1) qtyValue.textContent = current - 1;
  });

  qtyIncrease.addEventListener("click", () => {
    const current = parseInt(qtyValue.textContent, 10);
    qtyValue.textContent = current + 1;
  });
}

// Accordion / FAQ toggles
document.querySelectorAll("[data-accordion-trigger]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest(".accordion__item, .faq__item");
    if (item) item.classList.toggle("is-open");
  });
});

// UGC carousel prev/next
const ugcTrack = document.getElementById("ugcTrack");
const ugcPrev = document.getElementById("ugcPrev");
const ugcNext = document.getElementById("ugcNext");

if (ugcTrack && ugcPrev && ugcNext) {
  const scrollAmount = () => ugcTrack.clientWidth * 0.6;

  ugcPrev.addEventListener("click", () => {
    ugcTrack.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  });

  ugcNext.addEventListener("click", () => {
    ugcTrack.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });
}

// Gallery dot indicator
const galleryItems = document.querySelectorAll("[data-gallery-item]");
const galleryDots = document.querySelectorAll(".product__dot");

if (galleryItems.length && galleryDots.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Array.from(galleryItems).indexOf(entry.target);
          galleryDots.forEach((dot, i) =>
            dot.classList.toggle("is-active", i === index)
          );
        }
      });
    },
    { threshold: 0.6 }
  );

  galleryItems.forEach((item) => observer.observe(item));
}
