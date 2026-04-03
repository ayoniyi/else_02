import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import styles from "./NewNav.module.scss";
import Image from "next/image";

import ig from "./ig.svg";
import x from "./x.svg";
import linkedin from "./linkedin.svg";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, CustomEase);
  CustomEase.create("hop", "0.85, 0, 0.15, 1");
}

interface NavLink {
  href: string;
  label: string;
}

interface NewNavProps {
  logo?: string;
  ctaText?: string;
  ctaHref?: string;
  leftMenuLinks?: NavLink[];
  rightMenuLinks?: NavLink[];
  footerLinks?: NavLink[];
  copyright?: string;
  onNavigate?: (route: string) => void;
}

const NewNav: React.FC<NewNavProps> = ({
  logo = "Carbon Structure",
  ctaText = "Start Journey",
  ctaHref = "#",

  leftMenuLinks = [
    { href: "/theory", label: "Theory" },
    { href: "/companies", label: "Companies" },
    { href: "/perspectives", label: "Perspectives" },
    { href: "/team/teamMember", label: "Team" },
    { href: "/portfolio", label: "Projects" },
  ],
  rightMenuLinks = [
    { href: "#", label: "Tactile Vault" },
    { href: "#", label: "Form Experiments" },
    { href: "#", label: "Carbon Network" },
    { href: "#", label: "Shadow Library" },
    { href: "#", label: "Collections" },
  ],
  footerLinks = [
    { href: "#", label: "Usage Terms" },
    { href: "#", label: "Data & Cookies" },
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Accessibility" },
  ],
  copyright = "© 2025 Carbon Structure",
  onNavigate,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const splitTextRefs = useRef<any[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Create timeline
    tlRef.current = gsap.timeline({ paused: true });

    // Split text for animation
    if (menuRef.current) {
      const texts = menuRef.current.querySelectorAll("a, p, h3");
      splitTextRefs.current = [];

      texts.forEach((text) => {
        const split = new SplitText(text, {
          type: "lines",
          linesClass: "line",
        });
        splitTextRefs.current.push(split);

        // Wrap lines for masking
        split.lines.forEach((line: Element) => {
          const wrapper = document.createElement("div");
          wrapper.style.overflow = "hidden";
          wrapper.style.lineHeight = "1.1";
          line.parentNode?.insertBefore(wrapper, line);
          wrapper.appendChild(line);
        });
      });
    }

    const tl = tlRef.current;

    // Hamburger animation
    tl.to(
      `.${styles.bar1}`,
      {
        y: 3.25,
        rotation: 45,
        scaleX: 0.75,
        duration: 1,
        ease: "hop",
      },
      0
    )
      .to(
        `.${styles.bar2}`,
        {
          y: -3.25,
          rotation: -45,
          scaleX: 0.75,
          duration: 1,
          ease: "hop",
        },
        0
      )
      // Background panels animation
      .to(
        `.${styles.menuBgLeftInner}`,
        {
          rotate: 0,
          duration: 1,
          ease: "hop",
        },
        0
      )
      .to(
        `.${styles.menuBgRightInner}`,
        {
          rotate: 0,
          duration: 1,
          ease: "hop",
        },
        0
      )
      // Text animations
      .to(
        `.${styles.menuItemsCol}:nth-child(1) .line`,
        {
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1,
        },
        "0.6"
      )
      .to(
        `.${styles.menuItemsCol}:nth-child(2) .line`,
        {
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1,
        },
        "<"
      )
      .to(
        `.${styles.menuFooter} .line`,
        {
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1,
        },
        "<"
      )
      // Social icons animation
      .to(
        `.${styles.socialItem}`,
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1,
        },
        "<0.2"
      );

    // Set initial state for text lines and social icons
    gsap.set(".line", { y: "110%" });
    gsap.set(`.${styles.socialItem}`, { y: 40, opacity: 0 });

    return () => {
      // Cleanup
      splitTextRefs.current.forEach((split) => {
        if (split && split.revert) {
          split.revert();
        }
      });
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, []);

  const toggleMenu = () => {
    if (!tlRef.current) return;

    if (isMenuOpen) {
      tlRef.current.reverse();
      menuRef.current?.classList.remove(styles.active);
    } else {
      tlRef.current.play();
      menuRef.current?.classList.add(styles.active);
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    if (onNavigate) {
      // Close menu first, then navigate after animation completes
      if (isMenuOpen && tlRef.current) {
        // Store the timeline reference
        const tl = tlRef.current;

        // Set up callback for when reverse animation completes
        tl.eventCallback("onReverseComplete", () => {
          // Clear the callback to prevent memory leaks
          tl.eventCallback("onReverseComplete", null);
          // Navigate after menu is fully closed
          onNavigate(href);
        });

        // Start the reverse animation
        tl.reverse();
        menuRef.current?.classList.remove(styles.active);
        setIsMenuOpen(false);
      } else {
        // Menu is already closed, navigate immediately
        onNavigate(href);
      }
    }
  };

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <div className={styles.navToggle}>
            <div className={styles.navToggleBtn} onClick={toggleMenu}>
              {/* <span className={styles.bar1}></span>
            <span className={styles.bar2}></span> */}
              <p>{isMenuOpen ? "Close" : "Menu"}</p>
            </div>
          </div>
          <div className={styles.navLogo}>
            <p onClick={() => onNavigate?.("/portfolio")}>{logo}</p>
          </div>
          <div className={styles.navCta}>
            <p>{ctaText}</p>
          </div>
        </div>
      </nav>

      <div className={styles.menu} ref={menuRef}>
        <div className={styles.menuBg}>
          <div className={styles.menuBgLeft}>
            <div className={styles.menuBgLeftInner}></div>
          </div>
          <div className={styles.menuBgRight}>
            <div className={styles.menuBgRightInner}></div>
          </div>
        </div>
        <div className={styles.menuItems}>
          <div className={styles.menuItemsCol}>
            {leftMenuLinks.map((link, index) => (
              <div key={index} className={styles.menuLink}>
                <a
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                >
                  {link.label}
                </a>
              </div>
            ))}
          </div>
          <div className={styles.menuItemsCol}>
            {/* {rightMenuLinks.map((link, index) => (
              <div key={index} className={styles.menuLink}>
                <a
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                >
                  {link.label}
                </a>
              </div>
            ))} */}

            <div className={styles.menuHeading}>
              <h3>Contact</h3>
            </div>
            <div className={styles.menuLink}>
              <p>Pitch </p>
            </div>
            <div className={styles.menuLink}>
              <p>Partner </p>
            </div>
            <div className={styles.menuLink}>
              <p>Say Hi </p>
            </div>

            <div className={styles.menuHeading}>
              <h3>Socials</h3>
            </div>
            <div className={styles.social}>
              <div className={styles.socialItem}>
                <Image src={ig} alt="ig" />
              </div>
              <div className={styles.socialItem}>
                <Image src={x} alt="x" />
              </div>
              <div className={styles.socialItem}>
                <Image src={linkedin} alt="linkedin" />
              </div>
            </div>
          </div>
          <div className={styles.menuFooter}>
            <div className={styles.menuFooterCol}>
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className={styles.menuFooterCol}>
              <p>© 2025 else</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewNav;
