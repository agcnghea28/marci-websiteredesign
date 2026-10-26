"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./MeetMarci.module.css";

const DRAG_CLICK_THRESHOLD_PX = 6;
const MARQUEE_SPEED_PX_PER_SEC = 40;
const MIN_SET_COUNT = 2;

const LOGOS = [
  {
    id: "ridge",
    src: "/images/logo/logo.webp",
    alt: "The Ridge Realty Group",
    width: 160,
    height: 80,
  },
  {
    id: "equal-housing",
    src: "/images/partners/equal-housing.svg",
    alt: "Equal Housing Opportunity",
    width: 64,
    height: 64,
  },
  {
    id: "realtor",
    src: "/images/partners/realtor.svg",
    alt: "REALTOR®",
    width: 120,
    height: 48,
  },
  {
    id: "chamber",
    src: "/images/partners/pahrump-chamber.svg",
    alt: "Pahrump Valley Chamber of Commerce",
    width: 200,
    height: 80,
  },
];

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function normalizeOffset(offset, loopWidth) {
  if (loopWidth <= 0) return offset;

  let next = offset;
  while (next <= -loopWidth) next += loopWidth;
  while (next > 0) next -= loopWidth;
  return next;
}

function getRequiredSetCount(viewportWidth, setWidth) {
  if (setWidth <= 0 || viewportWidth <= 0) return MIN_SET_COUNT;
  return Math.max(MIN_SET_COUNT, Math.ceil(viewportWidth / setWidth) + 2);
}

export default function LogoMarquee() {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const loopWidthRef = useRef(0);
  const offsetRef = useRef(0);
  const dragRef = useRef({
    isActive: false,
    didMove: false,
    startX: 0,
    startOffset: 0,
    pointerId: null,
  });
  const [setCount, setSetCount] = useState(4);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [trackOffset, setTrackOffset] = useState(0);

  const syncMeasurements = useCallback(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || track.children.length < LOGOS.length) return;

    const items = Array.from(track.children);
    let setWidth = 0;

    for (let index = 0; index < LOGOS.length; index += 1) {
      setWidth += items[index].getBoundingClientRect().width;
    }

    if (setWidth <= 0) return;

    loopWidthRef.current = setWidth;

    const viewportWidth = viewport?.clientWidth ?? 0;
    const requiredSets = getRequiredSetCount(viewportWidth, setWidth);

    if (requiredSets !== setCount) {
      setSetCount(requiredSets);
      return;
    }

    offsetRef.current = normalizeOffset(offsetRef.current, setWidth);
    setTrackOffset(offsetRef.current);
  }, [setCount]);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return undefined;

    syncMeasurements();

    const resizeObserver = new ResizeObserver(() => {
      syncMeasurements();
    });
    resizeObserver.observe(track);
    resizeObserver.observe(viewport);

    const images = track.querySelectorAll("img");
    images.forEach((image) => {
      image.addEventListener("load", syncMeasurements);
    });

    return () => {
      resizeObserver.disconnect();
      images.forEach((image) => {
        image.removeEventListener("load", syncMeasurements);
      });
    };
  }, [syncMeasurements, setCount]);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    let frameId = 0;
    let lastTime = performance.now();

    const tick = (now) => {
      const loopWidth = loopWidthRef.current;

      if (loopWidth > 0 && !dragRef.current.isActive && !isPaused) {
        const deltaSeconds = (now - lastTime) / 1000;
        offsetRef.current -= MARQUEE_SPEED_PX_PER_SEC * deltaSeconds;
        offsetRef.current = normalizeOffset(offsetRef.current, loopWidth);
        setTrackOffset(offsetRef.current);
      }

      lastTime = now;
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [isPaused]);

  const handleTrackPointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const track = trackRef.current;
    if (!track) return;

    dragRef.current = {
      isActive: true,
      didMove: false,
      startX: event.clientX,
      startOffset: offsetRef.current,
      pointerId: event.pointerId,
    };
    setIsDragging(true);
    track.setPointerCapture(event.pointerId);
  };

  const handleTrackPointerMove = (event) => {
    if (!dragRef.current.isActive) return;

    const loopWidth = loopWidthRef.current;
    const deltaX = event.clientX - dragRef.current.startX;

    if (Math.abs(deltaX) > DRAG_CLICK_THRESHOLD_PX) {
      dragRef.current.didMove = true;
    }

    offsetRef.current = normalizeOffset(
      dragRef.current.startOffset + deltaX,
      loopWidth,
    );
    setTrackOffset(offsetRef.current);

    if (dragRef.current.didMove) {
      event.preventDefault();
    }
  };

  const endTrackDrag = (event) => {
    if (!dragRef.current.isActive) return;

    const track = trackRef.current;
    if (track?.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }

    dragRef.current.isActive = false;
    setIsDragging(false);
  };

  const logoSlides = Array.from({ length: setCount }, () => LOGOS).flat();

  return (
    <div
      className={styles.logoStrip}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div ref={viewportRef} className={styles.marqueeViewport}>
        <ul
          ref={trackRef}
          className={`${styles.marqueeTrack} ${isDragging ? styles.marqueeDragging : ""}`}
          aria-label="Professional affiliations and credentials"
          style={{ transform: `translate3d(${trackOffset}px, 0, 0)` }}
          onPointerDown={handleTrackPointerDown}
          onPointerMove={handleTrackPointerMove}
          onPointerUp={endTrackDrag}
          onPointerCancel={endTrackDrag}
        >
          {logoSlides.map((logo, index) => {
            const isDuplicate = index >= LOGOS.length;

            return (
              <li
                key={`${logo.id}-${index}`}
                className={styles.logoItem}
                aria-hidden={isDuplicate ? true : undefined}
              >
                <Image
                  src={logo.src}
                  alt={isDuplicate ? "" : logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className={styles.logoImage}
                  draggable={false}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
