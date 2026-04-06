import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import style from "./Portfolio.module.scss";
import TextAnim from "@/components/TextAnim";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";

import ig from "@/pages/icons/ig.svg";
import x from "@/pages/icons/x.svg";
import linkedin from "@/pages/icons/linkedin.svg";
import Image from "next/image";
import Head from "next/head";

import ContactFixed from "@/components/ContactFixed/ContactFixed";
import { useTransition } from "@/context/TransitionContext";
import Link from "next/link";
//import Inner from "@/components/PageTransition/Inner";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Dynamic import to ensure Three.js only loads on client-side
const GalleryCanvas = dynamic(
  () => import("../../components/GalleryCanvasOriginal"),
  {
    ssr: false,
  },
);

const PortfolioLarge = () => {
  // FRAMER MOTION
  const animate = (variants: any) => {
    return {
      initial: "initial",
      animate: "enter",
      //   exit: "exit",
      variants,
    };
  };

  // Modify your page transition variants
  const pageTransition = {
    initial: { opacity: 1 },
    enter: { opacity: 1 },
    // exit: {
    //   opacity: 1,
    //   transition: { duration: 1.7 },
    // },
  };

  // Update visual animation to respond to context
  const visualAnimation = {
    initial: { scale: 0.5, x: "150vw", opacity: 0 },
    enter: {
      scale: 1,
      x: "0vw",
      opacity: 1,
      transition: {
        x: { duration: 0.6 },
        scale: { duration: 0.8, delay: 0.8 },
        opacity: { duration: 0.3, delay: 0.3 },
      },
    },
    // exit: {
    //   scale: 0.5,
    //   x: "-150vw",
    //   opacity: 0,
    //   transition: {
    //     scale: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as any },
    //     x: { duration: 0.8, delay: 0.8 },
    //     opacity: { duration: 0.3, delay: 1.3 },
    //   },
    // },
  };

  const scale = {
    initial: { scale: 0.5, right: "-150vw" },
    enter: {
      scale: 1,

      right: "0vw",
      transition: {
        // Per-property transitions
        right: {
          duration: 0.5,

          ease: [0.76, 0, 0.24, 1] as any,
        },
        scale: {
          duration: 0.5,
          delay: 1.2, // Wait for modal content to reverse before scaling up
          ease: [0.76, 0, 0.24, 1] as any,
        },
        height: {
          duration: 0,
          delay: 1, // Wait for scale to complete first
          ease: [0.76, 0, 0.24, 1] as any,
        },
      },
    },
    // exit: {
    //   scale: 0.5,

    //   right: "150vw",
    //   transition: {
    //     // Per-property transitions
    //     height: {
    //       ease: [0.76, 0, 0.24, 1] as any,
    //     },
    //     scale: {
    //       duration: 0.8,

    //       //ease: [0.76, 0, 0.24, 1] as any,
    //     },
    //     right: {
    //       duration: 0.8,
    //       delay: 0.8,
    //       // ease: [0.76, 0, 0.24, 1] as any,
    //     },
    //   },
    // },
    contactOpen: {
      scale: 0.75, // Reduced from 0.95 for more obvious scaling
      right: "0vw",
      transition: {
        scale: {
          duration: 1,
          ease: [0.76, 0, 0.24, 1] as any,
        },
      },
    },
  };

  // Track when gallery should be mounted (after entrance animation)
  const [galleryReady, setGalleryReady] = useState(false);

  // Robust scroll lock to avoid "snap to top" / laggy entrance on refresh.
  // - Forces scroll position to top (avoids browser scroll restoration mid-animation)
  // - Locks both html + body overflow (some browsers scroll the html element)
  const scrollLockRef = useRef<{
    htmlOverflow: string;
    bodyOverflow: string;
  } | null>(null);

  const lockScroll = () => {
    if (typeof window === "undefined") return;
    if (scrollLockRef.current) return;

    // Disable browser scroll restoration (prevents refresh/back restoring mid-page)
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Ensure we start from the top for the entrance animation
    window.scrollTo(0, 0);

    const html = document.documentElement;
    const body = document.body;

    scrollLockRef.current = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
  };

  const unlockScroll = () => {
    if (typeof window === "undefined") return;
    const prev = scrollLockRef.current;
    if (!prev) return;

    const html = document.documentElement;
    const body = document.body;
    html.style.overflow = prev.htmlOverflow;
    body.style.overflow = prev.bodyOverflow;
    scrollLockRef.current = null;
  };

  useEffect(() => {
    lockScroll();
    return () => {
      unlockScroll();
      // Let the browser restore scroll again for other pages
      if (
        typeof window !== "undefined" &&
        "scrollRestoration" in window.history
      ) {
        window.history.scrollRestoration = "auto";
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Safety net: if Framer Motion doesn't fire onAnimationComplete (e.g. reduced motion),
  // don't leave the page scroll-locked or the gallery unmounted.
  useEffect(() => {
    if (galleryReady) return;
    const t = window.setTimeout(() => {
      setGalleryReady(true);
      unlockScroll();
      ScrollTrigger.refresh();
    }, 2500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galleryReady]);

  const textTransition = {
    initial: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.76, 0, 0.24, 1] as any,
      },
    },
    // exit: {
    //   filter: "blur(10px)",
    //   opacity: 0,
    //   transition: {
    //     filter: {
    //       duration: 0.5,
    //       ease: [0.76, 0, 0.24, 1] as any,
    //     },
    //     duration: 0.5,
    //     delay: 0.5,
    //     ease: [0.76, 0, 0.24, 1] as any,
    //   },
    // },
  };

  const socialButtonRef = useRef<HTMLDivElement>(null);
  const socialDivRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contactBtnRef = useRef<HTMLDivElement>(null);
  const contactDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socialButton = socialButtonRef.current;
    const socialDiv = socialDivRef.current;

    if (!socialButton || !socialDiv) return;

    // Set initial state for images (hidden below)
    const images = socialDiv.querySelectorAll("img");
    gsap.set(images, { y: 20, opacity: 0 });

    const handleMouseEnter = () => {
      // Animate images from bottom with stagger
      gsap.to(images, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2, // Wait for clip-path to start
      });
    };

    const handleMouseLeave = () => {
      // Reset images when mouse leaves
      gsap.to(images, {
        y: 20,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.in",
      });
    };

    socialButton.addEventListener("mouseenter", handleMouseEnter);
    socialButton.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      socialButton.removeEventListener("mouseenter", handleMouseEnter);
      socialButton.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const contactButton = contactBtnRef.current;
    const contactDiv = contactDivRef.current;

    if (!contactButton || !contactDiv) return;

    // Set initial state for text items (hidden below)
    const items = contactDiv.querySelectorAll("p");
    gsap.set(items, { y: 20, opacity: 0 });

    const handleMouseEnter = () => {
      gsap.to(items, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(items, {
        y: 20,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.in",
      });
    };

    contactButton.addEventListener("mouseenter", handleMouseEnter);
    contactButton.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      contactButton.removeEventListener("mouseenter", handleMouseEnter);
      contactButton.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const [showContact, setShowContact] = useState(false);

  const handleContactModal = () => {
    //handle open
    if (!containerRef.current) return;
    setShowContact(!showContact);
  };

  const triggerScaleDown = () => {
    if (!containerRef.current) return;
    // Scale down container
    gsap.to(containerRef.current, {
      scale: 0.5,
      duration: 0.8,
      ease: "power2.inOut",
    });
    // Fade out text elements immediately
    gsap.to(".horizontal-scroll-text, .horizontal-scroll-end", {
      filter: "blur(10px)",
      opacity: 0,
      duration: 0.5,
    });
  };

  // const handleNavigate = async (route: string) => {
  //   const router = (await import("next/router")).default;

  //   // Slide away animation
  //   await gsap
  //     .to(containerRef.current, {
  //       right: "150vw",
  //       duration: 0.8,
  //       ease: "power2.inOut",
  //     })
  //     .then();

  //   // Navigate after animations complete
  //   router.push(route);
  // };

  const handleNavigate = async (route: string) => {
    const router = (await import("next/router")).default;

    // Manually trigger exit animations sequentially
    const exitAnimations = [
      gsap.to(containerRef.current, {
        scale: 0.5,
        duration: 0.8,
        ease: "power2.inOut",
      }),
      gsap.to(containerRef.current, {
        right: "150vw",
        duration: 0.8,
        delay: 0.8,
        ease: "power2.inOut",
      }),
      gsap.to(".horizontal-scroll-text, .horizontal-scroll-end", {
        filter: "blur(10px)",
        opacity: 0,
        duration: 0.5,
        delay: 1.6,
      }),
    ];

    await Promise.all(exitAnimations.map((anim) => anim.then()));

    // Navigate after animations complete
    router.push(route);
  };

  return (
    <motion.div {...animate(pageTransition)} className={style.pageWrapper}>
      <Head>
        <title>else | Portfolio</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AnimatePresence mode="wait">
        {showContact && (
          <ContactFixed handleClose={handleContactModal} delay={1} />
        )}
      </AnimatePresence>

      <div className={style.cover}>
        <div className={style.coverTitle}>
          {" "}
          <h1>else</h1>
        </div>
        <motion.div {...animate(textTransition)} className={style.coverBtm}>
          <h2>home</h2>
        </motion.div>
      </div>

      {/* Spacer creates scrollable distance; visual container stays fixed */}
      <div className={style.scrollSpacer} aria-hidden />

      {/* Fixed visual container - follows scroll via GSAP/ScrollTrigger */}
      <div className={style.scrollContainer}>
        {/* Visual container - handles entrance/exit animations */}
        <motion.div
          initial="initial"
          animate={showContact ? "contactOpen" : "enter"}
          variants={scale}
          className={style.visualContainer}
          ref={containerRef}
          onAnimationStart={(definition) => {
            // Ensure scroll stays locked while the entrance/exit animation runs
            if (definition === "enter" || definition === "exit") {
              lockScroll();
            }
          }}
          onAnimationComplete={(definition) => {
            if (definition === "enter") {
              // Mount the gallery only after the entrance completes.
              // This prevents Lenis/ScrollTrigger from initializing against the wrong scroll state.
              setGalleryReady(true);
              unlockScroll();
              requestAnimationFrame(() => ScrollTrigger.refresh());
            }
          }}
        >
          <h1 className={`${style.title} gallery-title`}>else</h1>
          <TextAnim selector=".gallery-title" />

          <div className={style.canvasWrapper}>
            {galleryReady && (
              <GalleryCanvas
                handleNavigate={handleNavigate}
                triggerScaleDown={triggerScaleDown}
              />
            )}
          </div>

          {/* Nav sections scrolls horizontally with the gallery but appears on top of the gallery */}


          <div className={`${style.textSection} horizontal-scroll-text`}>
            <p className={style.paragraphLeft}>
              Welcome to a revolutionary approach to digital design and
              development. Today we unveil a new standard in 3D, UI/UX, Motion
              and Interaction Design, Frontend, Backend, and Creative Web
              Development. attempt
            </p>
            <p className={style.paragraphRight}>
              We&apos;ve pulled off an approach where design and technology
              blend seamlessly, creating digital experiences that are both
              visually stunning and user-intuitive.
            </p>
          </div>

          <div className={style.bottomNav}>

          </div>

          {/* End section that appears after gallery - also scrolls horizontally */}
          <div className={`${style.endSection} horizontal-scroll-end`}>
            <p className={style.bigQuote}>
              So, are you ready to reinvent your digital presence? Let&apos;s go
              on a journey where we bring your vision to life, one pixel at a
              time.
            </p>
            <p>
              <span>mail@else.com</span>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PortfolioLarge;
