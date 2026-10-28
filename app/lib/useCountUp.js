"use client";

import { useEffect, useRef, useState } from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Animates a numeric value when the returned ref enters the viewport.
 */
export function useCountUp(end, { duration = 1800, start = 0, decimals = 0 } = {}) {
  const ref = useRef(null);
  const [value, setValue] = useState(start);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const runAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      if (prefersReducedMotion()) {
        setValue(end);
        return;
      }

      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        const next = start + (end - start) * eased;
        const factor = 10 ** decimals;
        setValue(Math.round(next * factor) / factor);
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [duration, end, start, decimals]);

  return { ref, value };
}
