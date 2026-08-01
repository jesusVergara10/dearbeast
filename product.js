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

// Stripe checkout
const addToCartBtn = document.getElementById("addToCartBtn");
const checkoutError = document.getElementById("checkoutError");

if (addToCartBtn) {
  addToCartBtn.addEventListener("click", async () => {
    const originalText = addToCartBtn.textContent;
    checkoutError.textContent = "";
    checkoutError.classList.remove("is-visible");
    addToCartBtn.disabled = true;
    addToCartBtn.textContent = "REDIRECTING…";

    try {
      const quantity = parseInt(qtyValue ? qtyValue.textContent : "1", 10) || 1;

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Something went wrong.");
      }

      window.location.href = data.url;
    } catch (err) {
      checkoutError.textContent = err.message || "Something went wrong. Please try again.";
      checkoutError.classList.add("is-visible");
      addToCartBtn.disabled = false;
      addToCartBtn.textContent = originalText;
    }
  });
}

// Checkout result banner (?checkout=success|cancelled)
const checkoutBanner = document.getElementById("checkoutBanner");

if (checkoutBanner) {
  const params = new URLSearchParams(window.location.search);
  const checkoutStatus = params.get("checkout");

  if (checkoutStatus === "success") {
    checkoutBanner.classList.add("is-visible", "is-success");
    checkoutBanner.innerHTML =
      '<p>Thank you! Your order was placed successfully.</p>';
    checkoutBanner.appendChild(makeBannerCloseButton());
  } else if (checkoutStatus === "cancelled") {
    checkoutBanner.classList.add("is-visible", "is-cancelled");
    checkoutBanner.innerHTML = "<p>Checkout was cancelled. No charge was made.</p>";
    checkoutBanner.appendChild(makeBannerCloseButton());
  }
}

function makeBannerCloseButton() {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute("aria-label", "Dismiss");
  btn.textContent = "×";
  btn.addEventListener("click", () => {
    checkoutBanner.classList.remove("is-visible");
  });
  return btn;
}
