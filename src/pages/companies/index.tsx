import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import style from "./Companies.module.scss";
import Img1 from "./assets/img1.jpg";
import Img2 from "./assets/img2.jpg";
import Img3 from "./assets/img3.jpg";
import Img4 from "./assets/img4.jpg";
import Img5 from "./assets/img5.jpg";
import Img6 from "./assets/img6.jpg";
import Img7 from "./assets/img7.jpg";
import Img8 from "./assets/img8.jpg";
import Img9 from "./assets/img9.jpg";
import Img10 from "./assets/img10.jpg";
import Image from "next/image";
import Canvas from "./components/Canvas";

import { motion } from "framer-motion";
import NewNav from "@/components/NewNav";
import Navbar from "@/components/Navbar/Navbar";


gsap.registerPlugin(ScrollTrigger);

const Companies = () => {
  const spotlightRef = useRef<HTMLElement>(null);
  const projectIndexRef = useRef<HTMLHeadingElement>(null);
  const projectImagesRef = useRef<HTMLDivElement>(null);
  const projectNamesRef = useRef<HTMLDivElement>(null);
  const projectImgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const projectNameRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const spotlightSection = spotlightRef.current;
    const projectIndex = projectIndexRef.current;
    const projectImagesContainer = projectImagesRef.current;
    const projectNamesContainer = projectNamesRef.current;
    const projectImgs = projectImgRefs.current.filter(
      Boolean
    ) as HTMLDivElement[];
    const projectNames = projectNameRefs.current.filter(
      Boolean
    ) as HTMLParagraphElement[];

    if (
      !spotlightSection ||
      !projectIndex ||
      !projectImagesContainer ||
      !projectNamesContainer
    ) {
      return;
    }

    const totalProjectCount = projectNames.length;

    const spotlightSectionHeight = spotlightSection.offsetHeight;
    const spotlightSectionPadding = parseFloat(
      getComputedStyle(spotlightSection).padding
    );
    const projectIndexHeight = projectIndex.offsetHeight;
    const containerHeight = projectNamesContainer.offsetHeight;
    const imagesHeight = projectImagesContainer.offsetHeight;

    const moveDistanceIndex =
      spotlightSectionHeight - spotlightSectionPadding * 2 - projectIndexHeight;
    const moveDistanceNames =
      spotlightSectionHeight - spotlightSectionPadding * 2 - containerHeight;
    const moveDistanceImages = window.innerHeight - imagesHeight;

    const imgActivationThreshold = window.innerHeight / 2;

    const scrollTrigger = ScrollTrigger.create({
      trigger: spotlightSection,
      start: "top top",
      end: `+=${window.innerHeight * 5}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const currentIndex = Math.min(
          Math.floor(progress * totalProjectCount) + 1,
          totalProjectCount
        );

        projectIndex.textContent = `${String(currentIndex).padStart(
          2,
          "0"
        )}/${String(totalProjectCount).padStart(2, "0")}`;

        gsap.set(projectIndex, {
          y: progress * moveDistanceIndex,
        });

        gsap.set(projectImagesContainer, {
          y: progress * moveDistanceImages,
        });

        projectImgs.forEach((img) => {
          const imgRect = img.getBoundingClientRect();
          const imgTop = imgRect.top;
          const imgBottom = imgRect.bottom;

          if (
            imgTop <= imgActivationThreshold &&
            imgBottom >= imgActivationThreshold
          ) {
            gsap.set(img, {
              opacity: 1,
            });
          } else {
            gsap.set(img, {
              opacity: 0.5,
            });
          }
        });

        projectNames.forEach((p, index) => {
          const startProgress = index / totalProjectCount;
          const endProgress = (index + 1) / totalProjectCount;
          const projectProgress = Math.max(
            0,
            Math.min(
              1,
              (progress - startProgress) / (endProgress - startProgress)
            )
          );

          gsap.set(p, {
            y: -projectProgress * moveDistanceNames,
          });

          if (projectProgress > 0 && projectProgress < 1) {
            gsap.set(p, {
              color: "#000",
            });
          } else {
            gsap.set(p, {
              color: "#a0a0a0",
            });
          }
        });
      },
    });

    return () => {
      scrollTrigger.kill();
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  // PAGE TRANSITION PROPS ---- START
  const animate = (variants: any) => {
    return {
      initial: "initial",
      animate: "enter",
      //exit: "exit",
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
  const pageTransition = {
    initial: { opacity: 1 },
    enter: { opacity: 1 },
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
    ];

    await Promise.all(exitAnimations.map((anim) => anim.then()));
    // Navigate after animations complete
    router.push(route);
  };

  //PAGE TRANSITION PROPS ---- STOP

  return (
    <motion.div className={style.pageWrapper}>
      <div className={style.cover}>
        <div className={style.coverTitle}>
          {" "}
          <h1>else</h1>
        </div>
        <motion.div {...animate(textTransition)} className={style.coverBtm}>
          <h2>companies</h2>
        </motion.div>
      </div>

      <Navbar handleNavigate={handleNavigate} />


      <motion.div
        className={style.companies}
        // {...animate(scale)}
        ref={containerRef}
      >
        {/* <div className={style.intro}> */}
        {/* <p>A collection of selected works</p> */}
        {/* <h2>COMPANIES PAGE</h2> */}
        {/* <h3>A selection of companies we've worked with</h3> */}
        {/* </div> */}
        <div className={style.pageTitle}>
          <h2>Companies</h2>
        </div>
        {/* <NewNav
          logo="else"
          ctaText="Start"
          ctaHref="/start"
          leftMenuLinks={[
            { href: "/theory", label: "Theory" },
            { href: "/companies", label: "Companies" },
            { href: "/perspectives", label: "Perspectives" },
            { href: "/team", label: "Team" },
            { href: "/portfolio", label: "Portfolio" },
          ]}
          rightMenuLinks={[
            { href: "/aboutMain", label: "About" },
            { href: "/work", label: "Work" },
            { href: "/contact", label: "Contact" },
            { href: "/blog", label: "Blog" },
            { href: "/resources", label: "Resources" },
          ]}
          footerLinks={[
            { href: "/terms", label: "Terms" },
            { href: "/privacy", label: "Privacy" },
            { href: "/cookies", label: "Cookies" },
          ]}
          copyright="© 2025 else"
          onNavigate={handleNavigate}
        /> */}
        <section className={style.spotlight} ref={spotlightRef}>
          <div className={style.projectIndex}>
            <h1 ref={projectIndexRef}>01/10</h1>
          </div>

          <div className={style.projectImages} ref={projectImagesRef}>
            <div
              className={style.projectImg}
              ref={(el) => {
                projectImgRefs.current[0] = el;
              }}
            >
              <Image src={Img1} alt="" />
            </div>
            <div
              className={style.projectImg}
              ref={(el) => {
                projectImgRefs.current[1] = el;
              }}
            >
              <Image src={Img2} alt="" />
            </div>
            <div
              className={style.projectImg}
              ref={(el) => {
                projectImgRefs.current[2] = el;
              }}
            >
              <Image src={Img3} alt="" />
            </div>
            <div
              className={style.projectImg}
              ref={(el) => {
                projectImgRefs.current[3] = el;
              }}
            >
              <Image src={Img4} alt="" />
            </div>
            <div
              className={style.projectImg}
              ref={(el) => {
                projectImgRefs.current[4] = el;
              }}
            >
              <Image src={Img5} alt="" />
            </div>
            <div
              className={style.projectImg}
              ref={(el) => {
                projectImgRefs.current[5] = el;
              }}
            >
              <Image src={Img6} alt="" />
            </div>
            <div
              className={style.projectImg}
              ref={(el) => {
                projectImgRefs.current[6] = el;
              }}
            >
              <Image src={Img7} alt="" />
            </div>
            <div
              className={style.projectImg}
              ref={(el) => {
                projectImgRefs.current[7] = el;
              }}
            >
              <Image src={Img8} alt="" />
            </div>
            <div
              className={style.projectImg}
              ref={(el) => {
                projectImgRefs.current[8] = el;
              }}
            >
              <Image src={Img9} alt="" />
            </div>
            <div
              className={style.projectImg}
              ref={(el) => {
                projectImgRefs.current[9] = el;
              }}
            >
              <Image src={Img10} alt="" />
            </div>
          </div>

          <div className={style.projectNames} ref={projectNamesRef}>
            <p
              ref={(el) => {
                projectNameRefs.current[0] = el;
              }}
            >
              Human Form Study
            </p>
            <p
              ref={(el) => {
                projectNameRefs.current[1] = el;
              }}
            >
              Interior Light
            </p>
            <p
              ref={(el) => {
                projectNameRefs.current[2] = el;
              }}
            >
              Project 21
            </p>
            <p
              ref={(el) => {
                projectNameRefs.current[3] = el;
              }}
            >
              Shadow Portraits
            </p>
            <p
              ref={(el) => {
                projectNameRefs.current[4] = el;
              }}
            >
              Everyday Objects
            </p>
            <p
              ref={(el) => {
                projectNameRefs.current[5] = el;
              }}
            >
              Unit 07 Care
            </p>
            <p
              ref={(el) => {
                projectNameRefs.current[6] = el;
              }}
            >
              Motion Practice
            </p>
            <p
              ref={(el) => {
                projectNameRefs.current[7] = el;
              }}
            >
              Noonlight Series
            </p>
            <p
              ref={(el) => {
                projectNameRefs.current[8] = el;
              }}
            >
              Material Stillness
            </p>
            <p
              ref={(el) => {
                projectNameRefs.current[9] = el;
              }}
            >
              Quiet Walk
            </p>
          </div>
        </section>
        <section className={style.outro}>
          <Canvas title="ADD A COMPANY" />
        </section>
      </motion.div>
    </motion.div>
  );
};

export default Companies;
