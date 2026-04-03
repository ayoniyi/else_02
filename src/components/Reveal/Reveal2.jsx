"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import CustomEase from "gsap/dist/CustomEase";
import Image from "next/image";
// import { BsCart, BsArrowRight } from "react-icons/bs";

export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(CustomEase);
    CustomEase.create("hop", "0.9, 0, 0.1, 1");
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({
      delay: 0.3,
      defaults: {
        ease: "hop",
      },
    });

    const counts = document.querySelectorAll(".count");

    counts.forEach((count, index) => {
      const digits = count.querySelectorAll(".digit h1");

      tl.to(
        digits,
        {
          y: "0%",
          duration: 1,
          stagger: 0.075,
        },
        index * 1
      );

      if (index < counts.length) {
        tl.to(
          digits,
          {
            y: "-100%",
            duration: 1,
            stagger: 0.075,
          },
          index * 1 + 1
        );
      }
    });
  });

  return (
    <>
      <div className="loader">
        <div className="counter">
          <div className="count">
            <div className="digit">
              <h1>0</h1>
            </div>
            <div className="digit">
              <h1>0</h1>
            </div>
          </div>
          <div className="count">
            <div className="digit">
              <h1>2</h1>
            </div>
            <div className="digit">
              <h1>7</h1>
            </div>
          </div>
          <div className="count">
            <div className="digit">
              <h1>6</h1>
            </div>
            <div className="digit">
              <h1>5</h1>
            </div>
          </div>
          <div className="count">
            <div className="digit">
              <h1>9</h1>
            </div>
            <div className="digit">
              <h1>8</h1>
            </div>
          </div>
          <div className="count">
            <div className="digit">
              <h1>9</h1>
            </div>
            <div className="digit">
              <h1>9</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
