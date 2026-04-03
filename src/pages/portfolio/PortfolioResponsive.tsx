import React, { useEffect, useRef, useState } from "react";
import style from "./Portfolio.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import MobileNav from "@/components/MobileNav/MobileNav";
import Image from "next/image";
import ham from "@/pages/icons/ham.svg";
import close from "@/pages/icons/close.svg";
import gsap from "gsap";

import img1 from "../../../public/assets/img1.jpg";
import img2 from "../../../public/assets/img2.jpg";
import img3 from "../../../public/assets/img3.jpg";
import img4 from "../../../public/assets/img4.jpg";
import img5 from "../../../public/assets/img5.jpg";
import img6 from "../../../public/assets/img6.jpg";
import img7 from "../../../public/assets/img7.jpg";
import img8 from "../../../public/assets/img8.jpg";
import Lenis from "@studio-freight/lenis/types";
///import ReactLenis from "@studio-freight/react-lenis/types";
import { ReactLenis } from "lenis/react";

const PortfolioResponsive = () => {
  const animate = (variants: any) => {
    return {
      initial: "initial",
      animate: "enter",
      //   exit: "exit",
      variants,
    };
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

    // contactOpen: {
    //   scale: 0.75, // Reduced from 0.95 for more obvious scaling
    //   right: "0vw",
    //   transition: {
    //     scale: {
    //       duration: 1,
    //       ease: [0.76, 0, 0.24, 1] as any,
    //     },
    //   },
    // },
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLDivElement>(null);
  const menuDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const menuButton = menuBtnRef.current;
    const menuDiv = menuDivRef.current;

    if (!menuButton || !menuDiv) return;

    // Set initial state for text items (hidden below)
    const items = menuDiv.querySelectorAll("p");
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

    menuButton.addEventListener("mouseenter", handleMouseEnter);
    menuButton.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      menuButton.removeEventListener("mouseenter", handleMouseEnter);
      menuButton.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const [showMenu, setShowMenu] = useState(false);

  const handleMenuModal = () => {
    //handle open
    // if (!menuDivRef.current) return;
    setShowMenu(!showMenu);
  };

  const handleNavigate = async (route: string) => {
    if (showMenu) {
      handleMenuModal();
    }
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
    <ReactLenis root options={{ lerp: 0.05 }}>
      <div className={style.resContainer}>
        <AnimatePresence mode="wait">
          {showMenu && (
            <MobileNav
              handleClose={handleMenuModal}
              handleNavigate={handleNavigate}
            />
          )}
        </AnimatePresence>
        <motion.div
          initial="initial"
          animate={"enter"}
          variants={scale}
          className={style.visualContainerRes}
          ref={containerRef}
        >
          <div className={style.topBar}>
            {/* onClick={() => handleNavigate("/aboutMain") */}
            {/* <Image src={ham} alt="ham" /> */}
            {/* <h3>
            <strong>else</strong>
          </h3> */}
            {/* <div className={style.menuBtn}>
            <svg
              width="28"
              height="19"
              viewBox="0 0 28 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="3" fill="#111827" />
              <rect y="8" width="28" height="3" fill="#111827" />
              <rect y="16" width="28" height="3" fill="#111827" />
            </svg>
          </div> */}
            <h3 onClick={() => handleMenuModal()}>Menu</h3>
          </div>
          <div className={style.heroRes}>
            <div className={style.titleRes}>
              <h2>else</h2>
            </div>

            <div className={style.imgBlock1}>
              <div className={style.bgImg}>
                <Image
                  onClick={() => handleNavigate("/projects")}
                  src={img1}
                  alt="img1"
                />
              </div>
              <div className={style.imgRow}>
                <Image src={img2} alt="img2" />
                <Image src={img3} alt="img3" />
              </div>
              <div className={style.bgImg}>
                <Image src={img1} alt="img1" />
              </div>
            </div>

            <div className={style.txtBlock1}>
              <p>
                {" "}
                Welcome to a revolutionary approach to digital design and
                development. Today we unveil a new standard in 3D, UI/UX, Motion
                and Interaction Design, Frontend, Backend, and Creative Web
                Development. attempt
              </p>
            </div>

            <div className={style.imgBlock2}>
              <div className={style.imgL}>
                <Image src={img4} alt="img4" />
              </div>
              <div className={style.imgR}>
                <Image src={img5} alt="img5" />
              </div>
              <div className={style.imgL1}>
                <Image src={img6} alt="img6" />
              </div>
            </div>

            <div className={style.txtBlock1}>
              <p>
                {" "}
                We&apos;ve pulled off an approach where design and technology
                blend seamlessly, creating digital experiences that are both
                visually stunning and user-intuitive.
              </p>
            </div>

            <div className={style.imgBlock1}>
              <div className={style.bgImg}>
                <Image src={img7} alt="img1" />
              </div>
              <div className={style.imgRow}>
                <Image src={img8} alt="img2" />
                <Image src={img1} alt="img3" />
              </div>
              <div className={style.bgImg}>
                <Image src={img2} alt="img1" />
              </div>
            </div>

            <div className={style.endTxtBlock}>
              <p>
                So, are you ready to reinvent your digital presence? Let&apos;s
                go on a journey where we bring your vision to life, one pixel at
                a time.
              </p>
              <br />
              <p>mail@else.com</p>
            </div>

            <div className={style.bottomNavRes}>
              <p>Contact</p>
              <p>Socials</p>
            </div>
            {/* <br /> */}
            {/* <div className={style.copy}>

            </div> */}
          </div>
        </motion.div>
      </div>
    </ReactLenis>
  );
};

export default PortfolioResponsive;
