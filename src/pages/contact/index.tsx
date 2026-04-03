import React, { useRef, useState, useEffect } from "react";
import style from "./Contact.module.scss";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import TextInput from "@/components/TextInput/TextInput";
import TextArea from "@/components/TextInput/TextArea";
import Image from "next/image";

import ig from "@/pages/icons/ig.svg";
import x from "@/pages/icons/x.svg";
import linkedin from "@/pages/icons/linkedin.svg";

const CONTACT_TABS = [
  { id: 0, label: "Pitch" },
  { id: 1, label: "Partner" },
  { id: 2, label: "Say Hi" },
];

const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabIndicatorRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Handle tab click with GSAP indicator animation
  const handleTabClick = (tabIndex: number) => {
    if (tabIndex === activeTab || !tabsRef.current || !tabIndicatorRef.current) return;

    const tabs = tabsRef.current.querySelectorAll(`.${style.contactTab}`);
    const targetTab = tabs[tabIndex] as HTMLElement;
    if (!targetTab) return;

    gsap.to(tabIndicatorRef.current, {
      left: targetTab.offsetLeft,
      width: targetTab.offsetWidth,
      duration: 0.4,
      ease: "power2.out",
    });

    setActiveTab(tabIndex);
  };

  // Position indicator on initial render
  useEffect(() => {
    if (!tabsRef.current || !tabIndicatorRef.current) return;

    const tabs = tabsRef.current.querySelectorAll(`.${style.contactTab}`);
    const activeTabEl = tabs[activeTab] as HTMLElement;

    if (activeTabEl) {
      gsap.set(tabIndicatorRef.current, {
        left: activeTabEl.offsetLeft,
        width: activeTabEl.offsetWidth,
      });
    }
  }, [activeTab]);

  // GSAP staggered entrance animation for form fields
  useGSAP(
    () => {
      if (!formRef.current) return;

      gsap.fromTo(
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
          delay: 0.8,
        }
      );
    },
    { scope: formRef }
  );
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
          <h2>contact</h2>
        </motion.div>
      </div>

      <motion.div
        {...animate(scale)}
        className={style.container}
        {...animate(scale)}
        ref={containerRef}
      >
        <div className={style.fullNav}>
            <div className={style.fullNavL}>
              <div className={style.topNavItem}>
                <p onClick={() => handleNavigate("/portfolio")}>Home</p>
              </div>
              <div className={style.topNavItem}>
                <p onClick={() => handleNavigate("/theory")}>Theory</p>
              </div>
              <div className={style.topNavItem}>
                <p onClick={() => handleNavigate("/companies")}>Companies</p>
              </div>
            </div>
            <div className={style.fullNavC}>
              <p>else</p>
            </div>
            <div className={style.fullNavR}>
              <div className={style.topNavItem}>
                <p onClick={() => handleNavigate("/perspectives")}>
                  Perspective
                </p>
              </div>
              <div className={style.topNavItem}>
                <p onClick={() => handleNavigate("/team/teamMember")}>Team</p>
              </div>
              <div className={style.topNavItem}>
                <p onClick={() => handleNavigate("/contact")}>Contact</p>
              </div>
            </div>
          </div>

        <div className={style.contactContainer}>
        
          <div className={style.contactLeft}>
            <div className={style.top}>
              <h2>REACH OUT</h2>

              <div className={style.contactTabs} ref={tabsRef}>
                <div className={style.contactTabIndicator} ref={tabIndicatorRef}></div>
                {CONTACT_TABS.map((tab) => (
                  <div
                    key={tab.id}
                    className={`${style.contactTab} ${activeTab === tab.id ? style.contactTabActive : ""}`}
                    onClick={() => handleTabClick(tab.id)}
                  >
                    {tab.label}
                  </div>
                ))}
              </div>
            </div>
           
            <div className={style.bottom}>
                <h2>SOCIALS</h2>
                 <div className={style.social} >
                <div className={style.socialItem}>
                  <Image src={ig} alt="ig" />
                </div>
                <div className={style.socialItem}>
                  <Image src={x} alt="x" />
                </div>
                <div className={style.socialItem}>
                  <Image src={linkedin} alt="linkedin" />
                </div>
              </div>
            </div>
                      
             
          </div>
          <div className={style.contactRight}>
            <h3 className={style.formTitle}>{CONTACT_TABS[activeTab].label}</h3>
            <div className={style.formBody}>
              <form ref={formRef}>
                <div className={style.singleInput}>
                  <TextInput
                    labelName="Full name"
                    inputName="fullName"
                    type="text"
                  />
                </div>
                <div className={style.singleInput}>
                  <TextInput
                    labelName="Email"
                    inputName="email"
                    type="email"
                  />
                </div>
                <div className={style.singleInput}>
                  <TextInput
                    labelName="Subject"
                    inputName="subject"
                    type="text"
                  />
                </div>
                <div className={style.singleInput}>
                  <TextArea labelName="Message" inputName="message" />
                </div>
                <div className={style.singleInput}>
                  <button type="button">Send Message</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Contact;
