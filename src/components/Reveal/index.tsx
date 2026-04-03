import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import style from "./Reveal.module.scss";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/all";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const Reveal: React.FC = () => {
  const router = useRouter();
  const [loadingComplete, setLoadingComplete] = useState(false);
  const redirectFunc = () => {
    setLoadingComplete(true);
    setTimeout(() => {
      router.push("/portfolio");
      // console.log("redirect");
    }, 500);
  };
  const counterRef = useRef<HTMLDivElement>(null);
  const count1 = useRef<HTMLDivElement>(null);
  const count2 = useRef<HTMLDivElement>(null);
  const count3 = useRef<HTMLDivElement>(null);
  const count4 = useRef<HTMLDivElement>(null);
  const count5 = useRef<HTMLDivElement>(null);

  gsap.registerPlugin(CustomEase);
  CustomEase.create("hop", "0.9, 0, 0.1, 1");

  useGSAP(() => {
    if (!counterRef.current) return;

    const counts = [count1, count2, count3, count4, count5];

    // Create timeline inside effect to prevent recreation on every render
    const tl = gsap.timeline({
      delay: 0.3,
      defaults: {
        ease: "hop",
      },
    });

    // Animate each count's digits
    counts.forEach((countRef, index) => {
      if (!countRef.current) return;

      // Get digit elements directly from ref
      const digitElements = countRef.current.querySelectorAll(
        `.${style.digit} h1`,
      );
      if (!digitElements.length) return;

      // Animate in
      const isLastCount = index === counts.length - 1;
      tl.to(
        digitElements,
        {
          y: "0%",
          duration: 1,
          stagger: 0.075,
          onComplete: isLastCount ? () => redirectFunc() : undefined,
        },
        index * 1,
      );

      // Animate out (skip the last count)
      if (index < counts.length - 1) {
        tl.to(
          digitElements,
          {
            y: "-100%",
            duration: 1,
            stagger: 0.075,
          },
          index * 1 + 1,
        );
      }
    });

    // Animate counter container
    gsap.to(counterRef.current, {
      y: "-100%",
      duration: 1.2,
      ease: "hop",
    });
  });

  // FRAMER MOTION
  const animate = (variants: any) => {
    return {
      initial: "initial",
      animate: "enter",
      exit: "exit",
      variants,
    };
  };

  const pageTransition = {
    initial: { opacity: 0 },
    enter: {
      opacity: 1,

      transition: {
        // Per-property transitions
        opacity: {
          duration: 1,
          //ease: [0.76, 0, 0.24, 1],
        },
      },
    },
  };

  const textTransition = {
    initial: { opacity: 1 },
    enter: {
      opacity: 1,
    },
    exit: {
      filter: "blur(10px)",
      // opacity: 0,
      transition: {
        filter: {
          duration: 0.5,
          ease: [0.76, 0, 0.24, 1],
        },
      },
    },
  };

  return (
    <motion.div {...animate(pageTransition)} className={style.container}>
      <div className={style.title}>
        <h1>else</h1>
      </div>
      <motion.div
        {...animate(textTransition)}
        className={style.counter}
        ref={counterRef}
      >
        <div className={style.count} ref={count1}>
          <div className={style.digit}>
            <h1>0</h1>
          </div>
          <div className={style.digit}>
            <h1>0</h1>
          </div>
          <p className={style.perc}>%</p>
        </div>
        <div className={style.count} ref={count2}>
          <div className={style.digit}>
            <h1>2</h1>
          </div>
          <div className={style.digit}>
            <h1>5</h1>
          </div>
          <p className={style.perc}>%</p>
        </div>
        <div className={style.count} ref={count3}>
          <div className={style.digit}>
            <h1>5</h1>
          </div>
          <div className={style.digit}>
            <h1>0</h1>
          </div>
          <p className={style.perc}>%</p>
        </div>
        <div className={style.count} ref={count4}>
          <div className={style.digit}>
            <h1>7</h1>
          </div>
          <div className={style.digit}>
            <h1>5</h1>
          </div>
          <p className={style.perc}>%</p>
        </div>
        <div className={style.count} ref={count5}>
          <div className={style.digit}>
            <h1>1</h1>
          </div>
          <div className={style.digit}>
            <h1>0</h1>
          </div>
          <div className={style.digit}>
            <h1>0</h1>
          </div>
          <p className={style.perc}>%</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Reveal;
