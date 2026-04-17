window.addEventListener("scroll", function () {
  const heroContentOverlayDarkening = document.querySelector(
    ".hero-content-overlay-darkening"
  );
  const heroContentOverlay = document.querySelector(".hero-content-overlay");
  const scrollPosition = window.scrollY;

  if (scrollPosition > 500) {
    heroContentOverlayDarkening.style.visibility = "hidden";
    heroContentOverlay.style.visibility = "hidden";
    return;
  } else {
    heroContentOverlayDarkening.style.visibility = "visible";
    heroContentOverlay.style.visibility = "visible";
  }

  // Adjust the background darkness based on scroll
  const darkenFactor = Math.min(scrollPosition / 700, 0.4); // Controls how dark the background gets
  heroContentOverlayDarkening.style.backgroundColor = `rgba(0, 0, 0, ${darkenFactor})`;
});

const target = document.querySelector(".homepage-section");

console.log(target);

function iconsWhite() {
  const icons = document.querySelectorAll(".icon-1");

  icons.forEach((icon) => {
    icon.style.filter = "brightness(1)";
  });

  const menuIcon = document.querySelectorAll(".menu-icon span");

  menuIcon.forEach((span) => {
    span.style.filter = "brightness(1)";
  });
}

function iconsDark() {
  const icons = document.querySelectorAll(".icon-1");

  icons.forEach((icon) => {
    icon.style.filter = "brightness(0)";
  });

  const menuIcon = document.querySelectorAll(".menu-icon span");

  menuIcon.forEach((span) => {
    span.style.filter = "brightness(0)";
  });
}

// Create an observer instance
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const homeSection = entry.target;

      const pictures = homeSection.querySelector(".pictures");
      pictures.style.animation = "darkenBackground 1s ease-in-out forwards";

      try {
        const text = homeSection.querySelector(".homepage-section-text");
        console.log(text);
        text.style.visibility = "visible";
        text.style.animation = "slide-down 2s ease-in-out forwards";
      } catch (e) {
        console.error(e);
      }
    }
  });
});

observer.observe(target);

let lastScrollTop = 0;
const navbar = document.querySelector("#navbar");

window.addEventListener("scroll", function () {
  const scrollPosition = window.scrollY;

  if (scrollPosition > 200) {
    navbar.style.backgroundColor = "#fff";
    iconsDark();
  } else {
    navbar.style.backgroundColor = "rgba(0, 0, 0, 0)";
    iconsWhite();
  }

  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  console.log(currentScroll, lastScrollTop);

  if (currentScroll > lastScrollTop) {
    // Scrolling down
    navbar.style.top = "-250px";
  } else {
    // Scrolling up
    navbar.style.top = 0;
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Prevent negative scroll values
});