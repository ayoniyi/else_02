import React, { useRef } from "react";
import style from "./Theory.module.scss";
import { motion } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";
import NewNav from "@/components/NewNav";
import Navbar from "@/components/Navbar/Navbar";

import Image from "next/image";

import heroImg from "./hero-image.webp";

const Theory = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // FRAMER MOTION
  const animate = (variants: any) => {
    return {
      initial: "initial",
      animate: "enter",
      //exit: "exit",
      variants,
    };
  };

  const scale = {
    initial: { scale: 0.5, right: "-150vw", maxHeight: "100vh" },
    enter: {
      scale: 1,

      right: "0vw",
      maxHeight: "none",
      transition: {
        // Per-property transitions
        right: {
          duration: 0.5,

          ease: [0.76, 0, 0.24, 1],
        },
        scale: {
          duration: 0.5,
          delay: 0.5,
          ease: [0.76, 0, 0.24, 1],
        },
        height: {
          duration: 0,
          delay: 1, // Wait for scale to complete first
          ease: [0.76, 0, 0.24, 1],
        },
      },
    },
  };

  const textTransition = {
    initial: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    exit: {
      filter: "blur(10px)",
      opacity: 0,
      transition: {
        filter: {
          duration: 0.5,
          ease: [0.76, 0, 0.24, 1],
        },
        duration: 0.5,
        delay: 0.5,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  // Page-level wrapper for AnimatePresence to track - doesn't animate visually,
  // just keeps the page mounted long enough for inner exit animations to complete
  const pageTransition = {
    initial: { opacity: 1 },
    enter: { opacity: 1 },
    // exit: {
    //   opacity: 1, // No visual change - inner elements handle the actual animation
    //   transition: { duration: 1.7 }, // Match the longest inner exit animation duration
    // },
  };

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
      <div className={style.cover}>
        <div className={style.coverTitle}>
          {" "}
          <h1>else</h1>
        </div>
        <motion.div {...animate(textTransition)} className={style.coverBtm}>
          <h2>theory</h2>
        </motion.div>
      </div>
      <motion.div
        {...animate(scale)}
        className={style.container}
        {...animate(scale)}
        ref={containerRef}
      >
          <Navbar handleNavigate={handleNavigate} />


        <div className={style.hero}>
          <Image
            src={"/assets/glasses.jpg"}
            alt="Theory"
            width={500}
            height={500}
          />

          <p className={style.heroText}>
            The Theory of Everything is a theory that explains the universe. On
            her first day at Nordstrom, Julie Bornstein sat in her new bosss
            office. Across from her was Dan Nordstrom, the companys co-president
            and CEO of its newly spun-out ecommerce division. Julie, he said,
            it&apos;s all about personalization.

          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Theory;
