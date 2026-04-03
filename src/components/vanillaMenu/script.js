import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(SplitText, CustomEase);
CustomEase.create("hop", "0.85, 0, 0.15, 1");

const menu = document.querySelector(".menu");
const menuToggle = document.querySelector(".nav-toggle-btn");
let isMenuOpen = false;

SplitText.create(".menu a, .menu p", {
  type: "lines",
  mask: "lines",
  linesClass: "line",
});

const tl = gsap.timeline({ paused: true });

menuToggle.addEventListener("click", () => {
  if (isMenuOpen) {
    tl.reverse();
    menu.classList.remove("active");
  } else {
    tl.play();
    menu.classList.add("active");
  }
  isMenuOpen = !isMenuOpen;
});

tl.to(
  ".nav-toggle-btn .bar-1",
  {
    y: 3.25,
    rotation: 45,
    scaleX: 0.75,
    duration: 1,
    ease: "hop",
  },
  0,
)
  .to(
    ".nav-toggle-btn .bar-2",
    {
      y: -3.25,
      rotation: -45,
      scaleX: 0.75,
      duration: 1,
      ease: "hop",
    },
    0,
  )
  .to(
    ".menu .menu-bg-left-inner",
    {
      rotate: 0,
      duration: 1,
      ease: "hop",
    },
    0,
  )
  .to(
    ".menu .menu-bg-right-inner",
    {
      rotate: 0,
      duration: 1,
      ease: "hop",
    },
    0,
  )
  .to(
    ".menu-items-col:nth-child(1) .line",
    {
      y: 0,
      duration: 0.75,
      ease: "power3.out",
      stagger: 0.1,
    },
    "0.6",
  )
  .to(
    ".menu-items-col:nth-child(2) .line",
    {
      y: 0,
      duration: 0.75,
      ease: "power3.out",
      stagger: 0.1,
    },
    "<",
  )
  .to(
    ".menu-footer .line",
    {
      y: 0,
      duration: 0.75,
      ease: "power3.out",
      stagger: 0.1,
    },
    "<",
  );
