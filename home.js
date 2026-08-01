const siteHeader = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
const newsletterForm = document.getElementById("newsletterForm");

function updateHeaderState() {
  if (window.scrollY > 40) {
    siteHeader.classList.add("is-scrolled");
  } else {
    siteHeader.classList.remove("is-scrolled");
  }
}

window.addEventListener("scroll", updateHeaderState);
updateHeaderState();

menuToggle.addEventListener("click", () => {
  mobileNav.classList.toggle("is-open");
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("is-open");
  });
});

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
  });
}
