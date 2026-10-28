"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

const PARALLAX_RATE = 0.35;

export default function HeroBackground({
  imageSrc = "/images/hero/hero.jpg",
}) {
  const frameRef = useRef(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return undefined;

    let frameId = 0;

    const update = () => {
      frameId = 0;
      const hero = frame.closest("section");
      if (!hero) return;

      const rect = hero.getBoundingClientRect();
      const traveled = Math.min(Math.max(-rect.top, 0), rect.height);
      frame.style.transform = `translate3d(0, ${traveled * PARALLAX_RATE}px, 0)`;
    };

    const onScroll = () => {
      if (frameId) return;
      frameId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className={styles.heroBackground} aria-hidden="true">
      <div ref={frameRef} className={styles.heroImageFrame}>
        <Image
          src={imageSrc}
          alt=""
          fill
          preload
          quality={100}
          sizes="100vw"
          className={styles.heroImage}
        />
      </div>
    </div>
  );
}
