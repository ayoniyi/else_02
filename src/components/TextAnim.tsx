import { useEffect } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

// Declare GSAP plugins (assumed to be available globally or via CDN)
// declare const CustomEase: any;
// declare const SplitText: any;

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase, SplitText);
}

interface TextAnimProps {
  selector?: string;
  delay?: number;
}

/**
 * TextAnim Component
 *
 * Creates a silky smooth text animation with character reveal effect.
 *
 * Required CSS for smooth animation:
 * ```css
 * .gallery-title {
 *   overflow: hidden;
 * }
 * .gallery-title .word {
 *   overflow: hidden;
 *   display: inline-block;
 * }
 * .gallery-title .char {
 *   display: inline-block;
 *   overflow: hidden;
 * }
 * ```
 */

const TextAnim: React.FC<TextAnimProps> = ({
  selector = ".gallery-title",
  delay = 0.2,
}) => {
  useEffect(() => {
    // Create custom ease - smoother curve for silky animation
    CustomEase.create("hop", "0.76, 0, 0.24, 1");

    // Split text into words and characters
    const splitTextElements = (
      selector: string,
      type = "words,chars",
      addFirstChar = false
    ) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        const splitText = new SplitText(element, {
          type,
          wordsClass: "word",
          charsClass: "char",
        });

        if (type.includes("chars")) {
          (splitText.chars as Element[]).forEach((char, index) => {
            const element = char as HTMLElement;
            const originalText = element.textContent;
            element.innerHTML = `<span>${originalText}</span>`;

            if (addFirstChar && index === 0) {
              char.classList.add("first-char");
            }
          });
        }
      });
    };

    // Initialize text splitting
    splitTextElements(`${selector}`, "words,chars", true);

    // Create GSAP timeline animation
    const tl = gsap.timeline({ defaults: { ease: "hop" } });

    // Set initial state for smoother animation
    gsap.set(`${selector} .char span`, {
      y: "100%",
      opacity: 0,
    });

    tl.to(
      `${selector} .char span`,
      {
        y: "0%",
        opacity: 1,
        duration: 1.5,
        stagger: {
          amount: 0.3, // Total stagger time
          ease: "power2.out",
        },
      },
      delay
    );

    // Cleanup function
    return () => {
      tl.kill();
    };
  }, [selector, delay]);

  return null; // This component doesn't render anything
};

export default TextAnim;
