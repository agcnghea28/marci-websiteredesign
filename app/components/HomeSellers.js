"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./HomeSellers.module.css";

const SLIDES = [
  {
    id: "dining-living",
    src: "/images/home-sellers/carousel-01.jpg",
    alt: "Open dining and living area with patio access",
  },
  {
    id: "pool-estate",
    src: "/images/home-sellers/carousel-02.jpg",
    alt: "Luxury home with swimming pool and covered patio",
  },
  {
    id: "desert-estate",
    src: "/images/home-sellers/carousel-03.jpg",
    alt: "Desert estate with palm trees and mountain views",
  },
  {
    id: "curb-appeal",
    src: "/images/home-sellers/carousel-04.jpg",
    alt: "Mediterranean-style home with landscaped front yard",
  },
];

const DRAG_CLICK_THRESHOLD_PX = 6;
const AUTOPLAY_INTERVAL_MS = 5000;
const LOOP_SET_COUNT = 2;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function normalizeOffset(offset, loopWidth) {
  if (loopWidth <= 0) return offset;

  let next = offset;
  while (next <= -loopWidth) next += loopWidth;
  while (next > 0) next -= loopWidth;
  return next;
}

function getActiveIndex(offset, slideWidth, length) {
  if (slideWidth <= 0 || length === 0) return 0;
  const index = Math.round(-offset / slideWidth) % length;
  return ((index % length) + length) % length;
}

export default function HomeSellers() {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const loopWidthRef = useRef(0);
  const slideWidthRef = useRef(0);
  const offsetRef = useRef(0);
  const dragRef = useRef({
    isActive: false,
    didMove: false,
    startX: 0,
    startOffset: 0,
    pointerId: null,
  });

  const [slideWidthPx, setSlideWidthPx] = useState(0);
  const [trackOffset, setTrackOffset] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const syncMeasurements = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const slideWidth = Math.round(viewport.getBoundingClientRect().width);
    if (slideWidth <= 0) return;

    slideWidthRef.current = slideWidth;
    loopWidthRef.current = slideWidth * SLIDES.length;
    setSlideWidthPx(slideWidth);

    offsetRef.current = normalizeOffset(offsetRef.current, loopWidthRef.current);
    setTrackOffset(offsetRef.current);
    setActiveIndex(
      getActiveIndex(offsetRef.current, slideWidth, SLIDES.length),
    );
  }, []);

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
  }, [syncMeasurements]);

  const advanceSlide = useCallback(() => {
    const slideWidth = slideWidthRef.current;
    const loopWidth = loopWidthRef.current;
    if (!slideWidth || !loopWidth || dragRef.current.isActive || isPaused) {
      return;
    }

    offsetRef.current = normalizeOffset(
      offsetRef.current - slideWidth,
      loopWidth,
    );
    setTrackOffset(offsetRef.current);
    setActiveIndex(
      getActiveIndex(offsetRef.current, slideWidth, SLIDES.length),
    );
  }, [isPaused]);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const intervalId = window.setInterval(advanceSlide, AUTOPLAY_INTERVAL_MS);

    const onVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [advanceSlide]);

  const scrollToIndex = (index) => {
    const slideWidth = slideWidthRef.current;
    const loopWidth = loopWidthRef.current;
    if (!slideWidth || !loopWidth) return;

    const current = getActiveIndex(offsetRef.current, slideWidth, SLIDES.length);
    let diff = index - current;
    if (diff > SLIDES.length / 2) diff -= SLIDES.length;
    if (diff < -SLIDES.length / 2) diff += SLIDES.length;

    offsetRef.current = normalizeOffset(
      offsetRef.current - diff * slideWidth,
      loopWidth,
    );
    setTrackOffset(offsetRef.current);
    setActiveIndex(index);
  };

  const snapToNearestSlide = () => {
    const slideWidth = slideWidthRef.current;
    const loopWidth = loopWidthRef.current;
    if (!slideWidth || !loopWidth) return;

    const snapped = Math.round(offsetRef.current / slideWidth) * slideWidth;
    offsetRef.current = normalizeOffset(snapped, loopWidth);
    setTrackOffset(offsetRef.current);
    setActiveIndex(
      getActiveIndex(offsetRef.current, slideWidth, SLIDES.length),
    );
  };

  const handleTrackPointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const target = event.target;
    if (target instanceof Element && target.closest("button")) {
      return;
    }

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
    setActiveIndex(
      getActiveIndex(offsetRef.current, slideWidthRef.current, SLIDES.length),
    );

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
    snapToNearestSlide();

    if (dragRef.current.didMove) {
      window.setTimeout(() => {
        dragRef.current.didMove = false;
      }, 50);
    }
  };

  const handleTrackClickCapture = (event) => {
    if (!dragRef.current.didMove) return;

    event.preventDefault();
    event.stopPropagation();
    dragRef.current.didMove = false;
  };

  const carouselSlides = Array.from({ length: LOOP_SET_COUNT }, () => SLIDES).flat();

  const slideSizeStyle =
    slideWidthPx > 0
      ? {
          width: slideWidthPx,
          flex: `0 0 ${slideWidthPx}px`,
        }
      : undefined;

  return (
    <section id="sellers" className={`section ${styles.bleed}`}>
      <div className={styles.layout}>
        <div className={styles.content}>
          <p className="eyebrow eyebrow--on-dark">For Home Sellers</p>
          <h2>Don&apos;t Just List It</h2>
          <div className={styles.copy}>
            <p>Get it SOLD!</p>
            <p>
              We exhaust every avenue to ensure our listings are at the
              fingertips of every possible buyer, getting you top dollar for your
              home.
            </p>
          </div>
          <a href="#contact" className="btn btn--primary btn--on-dark">
            Let&apos;s Talk About Selling
          </a>
        </div>
        <div
          className={styles.imageWrap}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div
            ref={viewportRef}
            className={`${styles.viewport} ${
              slideWidthPx > 0 ? styles.viewportReady : ""
            }`}
          >
            <ul
              ref={trackRef}
              className={`${styles.track} ${isDragging ? styles.trackDragging : ""}`}
              aria-label="Home seller listing photos"
              style={{ transform: `translate3d(${trackOffset}px, 0, 0)` }}
              onPointerDown={handleTrackPointerDown}
              onPointerMove={handleTrackPointerMove}
              onPointerUp={endTrackDrag}
              onPointerCancel={endTrackDrag}
              onClickCapture={handleTrackClickCapture}
            >
              {carouselSlides.map((slide, index) => {
                const isDuplicate = index >= SLIDES.length;

                return (
                  <li
                    key={`${slide.id}-${index}`}
                    className={styles.slide}
                    style={slideSizeStyle}
                    aria-hidden={isDuplicate ? true : undefined}
                  >
                    <div className={styles.slideFrame}>
                      <Image
                        src={slide.src}
                        alt={isDuplicate ? "" : slide.alt}
                        fill
                        unoptimized
                        draggable={false}
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className={styles.image}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <nav
            className={styles.navigation}
            aria-label="Listing photo carousel"
          >
            <ol className={styles.dots}>
              {SLIDES.map((slide, index) => (
                <li key={slide.id}>
                  <button
                    type="button"
                    className={
                      index === activeIndex ? styles.dotActive : styles.dot
                    }
                    aria-label={`Show photo ${index + 1} of ${SLIDES.length}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                    onClick={() => scrollToIndex(index)}
                  />
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}
