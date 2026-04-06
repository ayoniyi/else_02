import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Lenis from "lenis";
import gsap from "gsap";
import style from "./TeamMember.module.scss";
import HeroImg from "./assets/img1.webp";
import CoupleImg from "./assets/92F40E74-0D0D-436D-.2e16d0ba.format-webp.fill-1800x1200.webp";
import PortraitImg from "./assets/Delivery_250219_SM_Index_Venture_i54l1Zs.width-1440.format-webp.webp";
import WideImg from "./assets/IMG_0085.width-1440.format-webp.webp";

import { motion } from "framer-motion";
import NewNav from "@/components/NewNav";
import Navbar from "@/components/Navbar/Navbar";


// Tab data
const TABS = [
  { id: 0, label: "Consulting" },
  { id: 1, label: "Founding" },
  { id: 2, label: "Advising + Investing" },
  { id: 3, label: "Directing" },
  { id: 4, label: "Learning" },
  { id: 5, label: "Enjoying" },
];

const TeamMember = () => {
  // Track when entrance animation is complete
  const [isReady, setIsReady] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabIndicatorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis only after entrance animation completes
  // useEffect(() => {
  //   if (!isReady) return;

  //   const lenis = new Lenis();

  //   function raf(time: number) {
  //     lenis.raf(time);
  //     requestAnimationFrame(raf);
  //   }

  //   requestAnimationFrame(raf);

  //   return () => {
  //     lenis.destroy();
  //   };
  // }, [isReady]);

  // Safety timeout: if animation callback doesn't fire, enable scroll after 1.5s
  useEffect(() => {
    if (isReady) return;
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 1500);
    return () => clearTimeout(timeout);
  }, [isReady]);

  const containerRef = useRef<HTMLDivElement>(null);

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

  // Handle tab click with GSAP animation
  const handleTabClick = (tabIndex: number) => {
    if (tabIndex === activeTab || !tabsRef.current || !tabIndicatorRef.current) return;

    const tabs = tabsRef.current.querySelectorAll(`.${style.tab}`);
    const targetTab = tabs[tabIndex] as HTMLElement;
    
    if (!targetTab) return;

    // Animate the indicator to the new tab position
    gsap.to(tabIndicatorRef.current, {
      left: targetTab.offsetLeft,
      width: targetTab.offsetWidth,
      duration: 0.4,
      ease: "power2.out",
    });

    // Animate content out, change tab, animate content in
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setActiveTab(tabIndex);
          gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
          );
        },
      });
    } else {
      setActiveTab(tabIndex);
    }
  };

  // Position indicator on initial render and when ready
  useEffect(() => {
    if (!isReady || !tabsRef.current || !tabIndicatorRef.current) return;

    const tabs = tabsRef.current.querySelectorAll(`.${style.tab}`);
    const activeTabEl = tabs[activeTab] as HTMLElement;

    if (activeTabEl) {
      gsap.set(tabIndicatorRef.current, {
        left: activeTabEl.offsetLeft,
        width: activeTabEl.offsetWidth,
      });
    }
  }, [isReady, activeTab]);

  return (
    <motion.div {...animate(pageTransition)} className={style.pageWrapper}>
      <div className={style.cover}>
        <div className={style.coverTitle}>
          {" "}
          <h1>else</h1>
        </div>
        <motion.div {...animate(textTransition)} className={style.coverBtm}>
          <h2>team</h2>
        </motion.div>
      </div>
      <motion.div
        {...animate(scale)}
        className={style.teamMember}
        ref={containerRef}
        onAnimationComplete={(definition) => {
          if (definition === "enter") {
            setIsReady(true);
          }
        }}
      >
          <Navbar handleNavigate={handleNavigate} />


        {/* Hero Section */}
        <section className={style.heroSection}>
          <h1 className={style.heroTitle}>
            Getting Personal: Julie Bornsteins Mission to Reinvent
            Shopping—Again
          </h1>
          {/* <a href="#" className={style.shareLink}>
            Share ↗
          </a> */}
          <div className={style.heroImage}>
            <Image src={HeroImg} alt="Julie Bornstein" priority />
          </div>
        </section>

        <div className={style.tabs} ref={tabsRef}>
          <div className={style.tabIndicator} ref={tabIndicatorRef}></div>
          {TABS.map((tab) => (
            <div
              key={tab.id}
              className={`${style.tab} ${activeTab === tab.id ? style.tabActive : ""}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Tab Content - changes layout based on active tab */}
        <div ref={contentRef} className={style.tabContent}>
          {/* Layout varies by tab - different arrangements create illusion of different content */}
          
          {activeTab === 0 && (
            <>
              {/* Consulting - Default two-column layout */}
              <section className={style.contentSection}>
                <div className={style.contentWrapper}>
                  <div className={style.bodyText}>
                    <p>
                      Bornstein nodded eagerly. In many ways, she had spent her life
                      preparing for this moment—poring over <em>Seventeen</em>{" "}
                      magazine as a kid, dreaming up better ways to shop. Growing up
                      in "cold and boring" Syracuse, she spent every weekend at the
                      local mall, frustrated even then by what she saw as the
                      inefficiencies of retail—the difficulty of finding what you
                      wanted, the inability to make it easily searchable.
                    </p>
                    <p>
                      The only problem? The year was 1999. Ecommerce, as Dan Nordstrom
                      puts it, was "Model A's and buggy whips." Amazon had proven you
                      could sell books through a simple search box, but fashion was a
                      different story—personal, subjective, and highly visual.
                    </p>
                  </div>
                  <div className={style.quoteColumn}>
                    <p className={style.pullQuote}>
                      "Julie invented ecommerce at Nordstrom. She joined when we had
                      basically nothing, when no one knew what ecommerce was yet. You
                      can't overstate how transformative her impact was."
                    </p>
                    <p className={style.quoteAttribution}>—Dan Nordstrom, Nordstrom</p>
                  </div>
                </div>
              </section>
              <section className={style.imageSection}>
                <div className={style.wideImage}>
                  <div className={style.imageContainer}>
                    <Image src={CoupleImg} alt="Bornstein with her husband" />
                  </div>
                  <div className={style.imageCaption}>
                    <p>Bornstein with her husband Brian Birtwistle.</p>
                    <p className={style.imagePagination}>1/2</p>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === 1 && (
            <>
              {/* Founding - Image first, then text */}
              <section className={style.imageSection}>
                <div className={style.fullWidthImage}>
                  <Image src={PortraitImg} alt="Julie Bornstein portrait" />
                </div>
              </section>
              <section className={style.contentSection}>
                <h2 className={style.sectionHeader}>Building from scratch</h2>
                <div className={style.contentWrapper}>
                  <div className={style.quoteColumn}>
                    <p className={style.pullQuote}>
                      "I had a pretty rich fantasy life. I felt the freedom to do what
                      I wanted, not what was expected of me."
                    </p>
                    <p className={style.quoteAttribution}>—Julie Bornstein</p>
                  </div>
                  <div className={style.bodyText}>
                    <p>
                      In 1996, Jen Koen was a second-year student at Harvard Business
                      School. The program was only a quarter women; as a result, she
                      says, "It was really hard to make friends." One day, she was
                      standing in line in the cafeteria when a short, brown-haired
                      student walked up beside her, tapped her on the arm, and said,
                      "My name's Julie. Want to get lunch?"
                    </p>
                    <p>
                      They became fast friends, hitting the gym together, driving
                      around Cambridge in Bornstein's beat-up Honda Accord.
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === 2 && (
            <>
              {/* Advising + Investing - Quote block first */}
              <section className={style.fullWidthQuote}>
                <p className={style.largeQuote}>
                  "She knew ecommerce was coming. She had a vision for it and how to
                  apply it to fashion. She elbowed her way in and made clear she knew
                  more about it than anyone else."
                </p>
                <p className={style.largeQuoteAttribution}>
                  — Dan Nordstrom, former CEO, Nordstrom.com
                </p>
              </section>
              <section className={style.contentSection}>
                <div className={style.contentWrapperReverse}>
                  <div className={style.quoteColumn}>
                    <p className={style.pullQuote}>
                      "You take someone who's tremendously smart, savvy, driven, with
                      real technical acumen... Then you layer on a big heart."
                    </p>
                    <p className={style.quoteAttribution}>—David Suliteanu, former Sephora CEO</p>
                  </div>
                  <div className={style.bodyText}>
                    <p>
                      "We had a vision of the future, but we were so far from making
                      it a reality," Bornstein says. "We didn't have product to sell.
                      We didn't have a way to get it on the site. We didn't have the
                      technology or the infrastructure."
                    </p>
                    <p>
                      What Nordstrom <em>did</em> have was Bornstein. Over the next
                      five years, under her leadership, the company's ecommerce sales
                      soared from $10 million to $350 million.
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === 3 && (
            <>
              {/* Directing - Single column centered */}
              <section className={style.contentSection}>
                <div className={style.bodyTextCentered}>
                  <p>
                    That tenacity, as Koen describes it, had deep roots. Bornstein
                    grew up the middle of three sisters in a highly academic family.
                    While her sisters seemed going to be a designer, but she began to
                    imagine other roles in fashion, maybe as a buyer or CEO.
                  </p>
                  <p>
                    She was also interested in politics and women's reproductive
                    rights. As a teenager, she volunteered with Planned Parenthood and
                    joined its youth advisory board. At Harvard, she majored in
                    government and spent summers working for a U.S. senator.
                  </p>
                </div>
              </section>
              <section className={style.imageSection}>
                <div className={style.wideImage}>
                  <div className={style.imageContainer}>
                    <Image src={CoupleImg} alt="Bornstein with her husband" />
                  </div>
                  <div className={style.imageCaption}>
                    <p>Leading with vision and purpose.</p>
                    <p className={style.imagePagination}>1/2</p>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === 4 && (
            <>
              {/* Learning - Image grid with text */}
              <section className={style.contentSection}>
                <h2 className={style.sectionHeader}>Continuous Growth</h2>
                <div className={style.contentWrapper}>
                  <div className={style.bodyText}>
                    <p>
                      After college, she landed a merchandising job at Donna Karan. It
                      was her first exposure to how fashion products were designed and
                      brought to market. But while she learned a lot, the experience
                      wasn't what she hoped.
                    </p>
                    <p>
                      "Culturally, it wasn't a good fit," she says. Somewhat
                      disillusioned, she enrolled at Harvard Business School. "I
                      thought, at the very least, I'd come out with some hard skills
                      while I figured out what I wanted to do."
                    </p>
                  </div>
                  <div className={style.bodyText}>
                    <p>
                      By her second year, she had started dating a classmate named
                      Brian. The two decided to move to the Bay Area together after
                      graduation. Jeff Bezos came to speak to one of their classes.
                    </p>
                    <p>
                      Afterward, their professor asked Brian to drive Bezos to the
                      airport. By the time he got back, Brian had a job offer to join
                      Amazon in Seattle.
                    </p>
                  </div>
                </div>
              </section>
              <section className={style.imageSection}>
                <div className={style.fullWidthImage}>
                  <Image src={PortraitImg} alt="Julie Bornstein portrait" />
                </div>
              </section>
            </>
          )}

          {activeTab === 5 && (
            <>
              {/* Enjoying - Quote heavy layout */}
              <section className={style.fullWidthQuote}>
                <p className={style.largeQuote}>
                  "I got to see and work in a lot of different settings. And I
                  realized I prefer the private sector, where things move quicker
                  and everything is more in your control."
                </p>
                <p className={style.largeQuoteAttribution}>— Julie Bornstein</p>
              </section>
              <section className={style.contentSection}>
                <div className={style.contentWrapper}>
                  <div className={style.bodyText}>
                    <p>
                      "She had this incredible confidence," Koen recalls. "She'd find
                      a parking spot where others saw none, maneuver her way past slow
                      traffic, and approach classes she wanted with the same
                      spirit—she'd simply show up and make her case."
                    </p>
                  </div>
                  <div className={style.quoteColumn}>
                    <p className={style.pullQuote}>
                      "When she set her mind to something, she always found a way to
                      make it happen."
                    </p>
                    <p className={style.quoteAttribution}>—Jen Koen</p>
                  </div>
                </div>
              </section>
              <section className={style.imageSection}>
                <div className={style.wideImage}>
                  <div className={style.imageContainer}>
                    <Image src={CoupleImg} alt="Enjoying life" />
                  </div>
                  <div className={style.imageCaption}>
                    <p>Finding joy in every moment.</p>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TeamMember;
