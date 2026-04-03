import React, { useState, useRef, useEffect } from "react";
import style from "./MobileNav.module.scss";
import { motion } from "framer-motion";
import TextInput from "../TextInput/TextInput";
import TextArea from "../TextInput/TextArea";
import SplitText from "../SplitText";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface MobileNavProps {
  handleClose: () => void;
  handleNavigate: (route: string) => void;
  delay?: number;
}

const MobileNav: React.FC<MobileNavProps> = ({
  handleClose,
  handleNavigate,
  delay = 0,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  // Animation refs
  const formRef = useRef<HTMLFormElement>(null);
  const formTimeline = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      if (!formRef.current) return;

      // Create the timeline
      const tl = gsap.timeline({
        paused: true,
      });

      // Animate the input containers
      tl.fromTo(
        formRef.current.children,
        {
          y: 80,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          delay: 1.3, // Move delay here for smoother reverse
        },
      );

      formTimeline.current = tl;
      tl.play();
    },
    { scope: formRef },
  );

  // Handle reverse animation
  useEffect(() => {
    if (isExiting && formTimeline.current) {
      formTimeline.current.timeScale(2).reverse(); // Same speed as entrance
    }
  }, [isExiting]);

  // Easing curve matches the page's main transition
  const easing = [0.76, 0, 0.24, 1] as const;

  // Overlay fades in/out
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: easing,
        delay: delay, // Delay entrance
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: easing,
        delay: 0.2, // Delay to allow content reverse animations
      },
    },
  };

  // Container slides from left
  const containerVariants = {
    hidden: { x: "-100%" },
    visible: {
      x: 0,
      transition: {
        duration: 0.65,
        ease: easing,
        delay: delay, // Delay entrance
      },
    },
    exit: {
      x: "-100%",
      transition: {
        duration: 0.65,
        ease: easing,
        delay: 0.1,
      },
    },
  };

  return (
    <motion.div
      className={style.overlay}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={handleClose}
    >
      <motion.div
        className={style.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onAnimationStart={(definition) => {
          if (definition === "exit") {
            setIsExiting(true);
          }
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={style.close}>
          <p onClick={handleClose}>Close</p>
        </div>
        <div className={style.navItems}>
          <div onClick={() => handleNavigate("/aboutMain")}>
            <SplitText
              text="Theory"
              tag="p"
              immediate={true}
              animationDelay={0.2}
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              duration={0.6}
              delay={30}
            />
          </div>
          <div onClick={() => handleNavigate("/projects")}>
            <SplitText
              text="Companies"
              tag="p"
              immediate={true}
              animationDelay={0.4}
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              duration={0.6}
              delay={30}
            />
          </div>
          <div onClick={() => handleNavigate("/contact")}>
            <SplitText
              text="Perspective"
              tag="p"
              immediate={true}
              animationDelay={0.6}
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              duration={0.6}
              delay={30}
            />
          </div>
          <div onClick={() => handleNavigate("/contact")}>
            <SplitText
              text="Team"
              tag="p"
              immediate={true}
              animationDelay={0.8}
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              duration={0.6}
              delay={30}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MobileNav;
