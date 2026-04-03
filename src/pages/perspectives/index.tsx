import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import style from "./Perspectives.module.scss";

import { motion } from "framer-motion";
import NewNav from "@/components/NewNav";

interface Person {
  id: number;
  name: string;
  description: string;
  company: string;
  images: string[];
}

const PEOPLE_DATA: Person[] = [
  {
    id: 1,
    name: "Julie Bornstein",
    description:
      "WEEKEND MALLRAT. CHAMPION OF WOMEN. RETAIL'S DIGITAL PIONEER.",
    company: "Daydream",
    images: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
      "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400",
    ],
  },
  {
    id: 2,
    name: "Assaf Rappaport",
    description:
      "GLOBAL TECH ADVOCATE. TEAM CURATOR. SOFTWARE'S FASTEST PACE-SETTER.",
    company: "Wiz",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    ],
  },
  {
    id: 3,
    name: "Aaron Katz",
    description: "DATA VISIONARY. STARTUP BUILDER. ENTERPRISE TRANSFORMER.",
    company: "ClickHouse",
    images: [
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    ],
  },
  {
    id: 4,
    name: "Vlad Tenev",
    description: "FINANCE DISRUPTOR. ACCESS CHAMPION. MARKET DEMOCRATIZER.",
    company: "Robinhood",
    images: [
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=800",
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400",
    ],
  },
  {
    id: 5,
    name: "Anine Bing",
    description: "FASHION PIONEER. BRAND BUILDER. STYLE CURATOR.",
    company: "Anine Bing",
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    ],
  },
  {
    id: 6,
    name: "Chris Urmson",
    description: "AUTONOMY ARCHITECT. SAFETY ADVOCATE. FUTURE DRIVER.",
    company: "Aurora",
    images: [
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=800",
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    ],
  },
  {
    id: 7,
    name: "Riccardo Zacconi",
    description: "GAMING LEGEND. CASUAL KING. ENTERTAINMENT INNOVATOR.",
    company: "King",
    images: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    ],
  },
  {
    id: 8,
    name: "Dylan Field",
    description:
      "DESIGN REVOLUTIONARY. COLLABORATION CHAMPION. CREATIVE ENABLER.",
    company: "Figma",
    images: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400",
    ],
  },
  {
    id: 9,
    name: "Linda Lian",
    description: "COMMUNITY BUILDER. CUSTOMER ADVOCATE. GROWTH STRATEGIST.",
    company: "Common Room",
    images: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400",
    ],
  },
  {
    id: 10,
    name: "Alexandr Wang",
    description: "AI PIONEER. DATA ARCHITECT. SCALE MASTER.",
    company: "Scale AI",
    images: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    ],
  },
];

const Perspective = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroImagesRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const momentumId = useRef<number | null>(null);
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

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);

      // Fade out current content
      const tl = gsap.timeline();

      tl.to([heroContentRef.current, heroImagesRef.current], {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
      })
        .call(() => {
          setCurrentSlide(index);
        })
        .to([heroContentRef.current, heroImagesRef.current], {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => setIsTransitioning(false),
        });
    },
    [isTransitioning]
  );

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      goToSlide((currentSlide + 1) % PEOPLE_DATA.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide, isPaused, goToSlide]);

  const applyMomentum = useCallback(() => {
    if (!galleryRef.current || Math.abs(velocity.current) < 0.5) {
      momentumId.current = null;
      return;
    }

    gsap.to(galleryRef.current, {
      scrollLeft: galleryRef.current.scrollLeft - velocity.current,
      duration: 0.05,
      ease: "none",
      onComplete: () => {
        velocity.current *= 0.95; // Friction
        momentumId.current = requestAnimationFrame(applyMomentum);
      },
    });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!galleryRef.current) return;
    if (momentumId.current) {
      cancelAnimationFrame(momentumId.current);
      momentumId.current = null;
    }
    isDragging.current = true;
    startX.current = e.pageX - galleryRef.current.offsetLeft;
    scrollLeft.current = galleryRef.current.scrollLeft;
    lastX.current = e.pageX;
    lastTime.current = Date.now();
    velocity.current = 0;
    galleryRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !galleryRef.current) return;
    e.preventDefault();
    const x = e.pageX - galleryRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;

    // Calculate velocity
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      velocity.current = ((e.pageX - lastX.current) / dt) * 15;
    }
    lastX.current = e.pageX;
    lastTime.current = now;

    gsap.to(galleryRef.current, {
      scrollLeft: scrollLeft.current - walk,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (galleryRef.current) {
      galleryRef.current.style.cursor = "grab";
      // Apply momentum
      if (Math.abs(velocity.current) > 0.5) {
        applyMomentum();
      }
    }
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      if (galleryRef.current) {
        galleryRef.current.style.cursor = "grab";
        if (Math.abs(velocity.current) > 0.5) {
          applyMomentum();
        }
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!galleryRef.current) return;
    if (momentumId.current) {
      cancelAnimationFrame(momentumId.current);
      momentumId.current = null;
    }
    isDragging.current = true;
    startX.current = e.touches[0].pageX - galleryRef.current.offsetLeft;
    scrollLeft.current = galleryRef.current.scrollLeft;
    lastX.current = e.touches[0].pageX;
    lastTime.current = Date.now();
    velocity.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !galleryRef.current) return;
    const x = e.touches[0].pageX - galleryRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;

    // Calculate velocity
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      velocity.current = ((e.touches[0].pageX - lastX.current) / dt) * 15;
    }
    lastX.current = e.touches[0].pageX;
    lastTime.current = now;

    gsap.to(galleryRef.current, {
      scrollLeft: scrollLeft.current - walk,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    if (Math.abs(velocity.current) > 0.5) {
      applyMomentum();
    }
  };

  const currentPerson = PEOPLE_DATA[currentSlide];

  return (
    <motion.div {...animate(pageTransition)} className={style.pageWrapper}>
      <div className={style.cover}>
        <div className={style.coverTitle}>
          {" "}
          <h1>else</h1>
        </div>
        <motion.div {...animate(textTransition)} className={style.coverBtm}>
          <h2>perspectives</h2>
        </motion.div>
      </div>
      <motion.div
        {...animate(scale)}
        className={style.perspectives}
        {...animate(scale)}
        ref={containerRef}
      >
        {/* <div className={style.perspectives}> */}

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

       

        {/* Hero Section */}
        <section className={style.heroSection}>
          <div className={style.heroContent} ref={heroContentRef}>
            <h1 className={style.heroTitle}>
              <span className={style.heroName}>{currentPerson.name}.</span>{" "}
              <span className={style.heroDescription}>
                {currentPerson.description}
              </span>
            </h1>
            <button
              //onClick={() => goToSlide((currentSlide + 1) % PEOPLE_DATA.length)}
              onClick={() => handleNavigate("/aboutMain")}
              className={style.readMoreBtn}
            >
              Read more
            </button>
          </div>

          <div className={style.heroImages} ref={heroImagesRef}>
            <div className={style.mainImage}>
              <img
                src={currentPerson.images[0]}
                alt={currentPerson.name}
                key={`main-${currentPerson.id}`}
                className={style.fadeIn}
              />
            </div>
            <div className={style.sideImages}>
              <div className={style.sideImage}>
                <img
                  src={currentPerson.images[1]}
                  alt={currentPerson.name}
                  key={`side1-${currentPerson.id}`}
                  className={style.fadeIn}
                />
              </div>
              <div className={style.sideImage}>
                <img
                  src={currentPerson.images[2]}
                  alt={currentPerson.name}
                  key={`side2-${currentPerson.id}`}
                  className={style.fadeIn}
                />
              </div>
            </div>
          </div>

          <div className={style.heroPagination}>
            {PEOPLE_DATA.map((_, index) => (
              <button
                key={index}
                className={`${style.paginationDot} ${
                  index === currentSlide ? style.active : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            className={style.pauseBtn}
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            )}
          </button>
        </section>

        {/* Gallery Section */}
        <section className={style.gallerySection}>
          <h2 className={style.galleryTitle}>Meet the Founders</h2>
          <div
            ref={galleryRef}
            className={style.galleryTrack}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ overflow: "hidden" }}
          >
            {PEOPLE_DATA.map((person) => (
              <div key={person.id} className={style.galleryItem}>
                <div className={style.galleryImage}>
                  <img
                    src={person.images[0]}
                    alt={person.name}
                    draggable={false}
                  />
                </div>
                <p className={style.galleryName}>{person.name}</p>
                <p className={style.galleryCompany}>{person.company}</p>
              </div>
            ))}
          </div>
        </section>
      </motion.div>
    </motion.div>
  );
};

export default Perspective;
