import React, { useState, useRef, useEffect } from "react";
import style from "./ContactFixed.module.scss";
import { motion } from "framer-motion";
import TextInput from "../TextInput/TextInput";
import TextArea from "../TextInput/TextArea";
import SplitText from "../SplitText";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface ContactFixedProps {
  handleClose: () => void;
  delay?: number;
}

const ContactFixed: React.FC<ContactFixedProps> = ({
  handleClose,
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
        }
      );

      formTimeline.current = tl;
      tl.play();
    },
    { scope: formRef }
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
        delay: 1.2, // Delay to allow content reverse animations
      },
    },
  };

  // Container slides from left
  const containerVariants = {
    hidden: { x: "-100%" },
    visible: {
      x: 0,
      transition: {
        duration: 0.5,
        ease: easing,
        delay: delay, // Delay entrance
      },
    },
    exit: {
      x: "-100%",
      transition: {
        duration: 0.5,
        ease: easing,
        delay: 0.5, // Delay to allow content reverse animations to play first
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
        <div className={style.top}>
          <div className={style.titleBx}>
            {/* <h2>reach out</h2> */}
            <SplitText
              text="reach out"
              tag="h2"
              delay={10}
              immediate={true}
              animationDelay={1.2}
              reverse={isExiting}
              reverseDelay={0}
            />
            {/* <p>Share your ideas, let's make magic.</p> */}
            <SplitText
              text="Share your ideas, let's make magic."
              tag="p"
              delay={10}
              immediate={true}
              animationDelay={1.25}
              reverse={isExiting}
              reverseDelay={0}
            />
          </div>
          <div className={style.cancel} onClick={handleClose}>
            <p>close</p>
          </div>
        </div>

        <div className={style.body}>
          <form ref={formRef}>
            <div className={style.singleInput}>
              <TextInput
                labelName="Full name"
                inputName="fullName"
                type="text"
                // value={userInput.tag}
                // inputHandler={inputHandler}
                // onKeyUp={(e) => handleKey}
              />{" "}
            </div>
            <div className={style.singleInput}>
              <TextInput
                labelName="Email"
                inputName="email"
                type="email"
                // value={userInput.tag}
                // inputHandler={inputHandler}
                // onKeyUp={(e) => handleKey}
              />{" "}
            </div>
            <div className={style.singleInput}>
              <TextInput
                labelName="Subject"
                inputName="subject"
                type="text"
                // value={userInput.tag}
                // inputHandler={inputHandler}
                // onKeyUp={(e) => handleKey}
              />{" "}
            </div>
            <div className={style.singleInput}>
              <TextArea labelName="Message" inputName="message" />
            </div>
            <div className={style.singleInput}>
              <button>Send Messsage</button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactFixed;
