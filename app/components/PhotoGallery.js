"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./PhotoGallery.module.css";

const PHOTOS = [
  {
    id: "clubhouse-golf",
    alt: "Clubhouse, pools, and golf course with mountain views in Pahrump",
    src: "/images/gallery/01-clubhouse-and-golf.jpg",
  },
  {
    id: "sunroom",
    alt: "Sunlit sunroom with desert landscaping visible through the windows",
    src: "/images/gallery/02-sunroom-red-chair.png",
  },
  {
    id: "neighborhood-aerial",
    alt: "Aerial view of Pahrump homes with mountains in the distance",
    src: "/images/gallery/03-neighborhood-mountains.png",
  },
  {
    id: "pool-home",
    alt: "Home with backyard pool and snow-capped mountains beyond",
    src: "/images/gallery/04-pool-home-mountains.jpg",
  },
  {
    id: "tennis-club",
    alt: "Community clubhouse and tennis courts near the golf course",
    src: "/images/gallery/05-tennis-clubhouse.png",
  },
  {
    id: "community-club",
    alt: "Recreation center, courts, and palm trees in a Pahrump community",
    src: "/images/gallery/06-community-clubhouse.jpg",
  },
  {
    id: "golf-course-homes",
    alt: "Modern homes along a golf course pond with desert mountains",
    src: "/images/gallery/07-homes-golf-course.png",
  },
  {
    id: "dining-room",
    alt: "Dining area with arched window and mountain views",
    src: "/images/gallery/08-dining-room.jpg",
  },
  {
    id: "kitchen",
    alt: "Updated kitchen with wood cabinetry and desert views",
    src: "/images/gallery/09-kitchen.jpg",
  },
  {
    id: "primary-bedroom",
    alt: "Primary bedroom suite with ensuite bath and mountain view",
    src: "/images/gallery/10-primary-bedroom.jpg",
  },
  {
    id: "ranch-sunset",
    alt: "Ranch-style home at sunset with palm trees and mountains",
    src: "/images/gallery/11-ranch-home-sunset.jpg",
  },
];

const DRAG_CLICK_THRESHOLD_PX = 6;
const MIN_SET_COUNT = 2;

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

function getActiveIndex(offset, slideWidth, length) {
  if (slideWidth <= 0 || length === 0) return 0;
  const index = Math.round(-offset / slideWidth) % length;
  return ((index % length) + length) % length;
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function PhotoGallery() {
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
    photoId: null,
  });
  const [setCount, setSetCount] = useState(MIN_SET_COUNT);
  const [trackOffset, setTrackOffset] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const syncMeasurements = useCallback(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || track.children.length < PHOTOS.length) return;

    const firstSlide = track.children[0];
    const slideWidth = firstSlide.getBoundingClientRect().width;
    if (slideWidth <= 0) return;

    slideWidthRef.current = slideWidth;
    loopWidthRef.current = slideWidth * PHOTOS.length;

    const viewportWidth = viewport?.clientWidth ?? 0;
    const requiredSets = getRequiredSetCount(viewportWidth, loopWidthRef.current);

    if (requiredSets !== setCount) {
      setSetCount(requiredSets);
      return;
    }

    offsetRef.current = normalizeOffset(offsetRef.current, loopWidthRef.current);
    setTrackOffset(offsetRef.current);
    setActiveIndex(
      getActiveIndex(offsetRef.current, slideWidth, PHOTOS.length),
    );
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
      const section = viewportRef.current;

      if (loopWidth > 0 && section && !dragRef.current.isActive && !isPaused) {
        const rootFontSize =
          Number.parseFloat(getComputedStyle(document.documentElement).fontSize) ||
          16;
        const speedRem =
          Number.parseFloat(
            getComputedStyle(section).getPropertyValue("--gallery-marquee-speed"),
          ) || 2.75;
        const speed = speedRem * rootFontSize;
        const deltaSeconds = (now - lastTime) / 1000;
        offsetRef.current -= speed * deltaSeconds;
        offsetRef.current = normalizeOffset(offsetRef.current, loopWidth);
        setTrackOffset(offsetRef.current);
        setActiveIndex(
          getActiveIndex(
            offsetRef.current,
            slideWidthRef.current,
            PHOTOS.length,
          ),
        );
      }

      lastTime = now;
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [isPaused]);

  useEffect(() => {
    if (!lightboxPhoto) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setLightboxPhoto(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxPhoto]);

  useEffect(() => {
    if (!lightboxPhoto) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxPhoto]);

  const scrollToIndex = (index) => {
    const slideWidth = slideWidthRef.current;
    const loopWidth = loopWidthRef.current;
    if (!slideWidth || !loopWidth) return;

    const current = getActiveIndex(offsetRef.current, slideWidth, PHOTOS.length);
    let diff = index - current;
    if (diff > PHOTOS.length / 2) diff -= PHOTOS.length;
    if (diff < -PHOTOS.length / 2) diff += PHOTOS.length;

    offsetRef.current = normalizeOffset(
      offsetRef.current - diff * slideWidth,
      loopWidth,
    );
    setTrackOffset(offsetRef.current);
    setActiveIndex(index);
  };

  const handleTrackPointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const track = trackRef.current;
    if (!track) return;

    const pressedSlide =
      event.target instanceof Element
        ? event.target.closest("[data-photo-id]")
        : null;

    dragRef.current = {
      isActive: true,
      didMove: false,
      startX: event.clientX,
      startOffset: offsetRef.current,
      pointerId: event.pointerId,
      photoId: pressedSlide?.dataset.photoId ?? null,
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
      getActiveIndex(offsetRef.current, slideWidthRef.current, PHOTOS.length),
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

    const moved = dragRef.current.didMove;
    const photoId = dragRef.current.photoId;
    dragRef.current.isActive = false;
    dragRef.current.photoId = null;
    setIsDragging(false);

    if (!moved && photoId) {
      const photo = PHOTOS.find((item) => item.id === photoId);
      if (photo) {
        openLightbox(photo);
        const swallowClick = (clickEvent) => {
          clickEvent.preventDefault();
          clickEvent.stopPropagation();
          window.removeEventListener("click", swallowClick, true);
        };
        window.addEventListener("click", swallowClick, true);
      }
    }

    if (moved) {
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

  const openLightbox = (photo) => {
    if (dragRef.current.didMove) return;
    setLightboxPhoto(photo);
    setIsPaused(true);
  };

  const closeLightbox = () => {
    setLightboxPhoto(null);
    setIsPaused(false);
  };

  const photoSlides = Array.from({ length: setCount }, () => PHOTOS).flat();

  const lightbox =
    lightboxPhoto && isMounted
      ? createPortal(
          <div
            className={styles.lightbox}
            role="dialog"
            aria-modal="true"
            aria-label={lightboxPhoto.alt}
          >
            <button
              type="button"
              className={styles.lightboxBackdrop}
              onClick={closeLightbox}
              aria-label="Close gallery preview"
            />
            <div className={styles.lightboxPanel}>
              <button
                type="button"
                className={styles.lightboxClose}
                onClick={closeLightbox}
                aria-label="Close"
              >
                <CloseIcon />
              </button>
              <div className={styles.lightboxImageWrap}>
                {/* Native img preserves the file's intrinsic aspect ratio in the popup */}
                <img
                  src={lightboxPhoto.src}
                  alt={lightboxPhoto.alt}
                  className={styles.lightboxImage}
                  decoding="async"
                />
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <section id="gallery" className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.headerPrimary}>
            <p className="eyebrow">Photo Gallery</p>
            <h2>Explore the Gallery</h2>
          </div>
          <p className={styles.description}>
            A visual look at the homes, properties, and surroundings that make
            Pahrump a place to call home.
          </p>
        </header>

        <div
          className={styles.carouselWrap}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            if (!lightboxPhoto) setIsPaused(false);
          }}
        >
          <div ref={viewportRef} className={styles.viewport}>
            <ul
              ref={trackRef}
              className={`${styles.track} ${isDragging ? styles.trackDragging : ""}`}
              aria-label="Photo gallery"
              style={{ transform: `translate3d(${trackOffset}px, 0, 0)` }}
              onPointerDown={handleTrackPointerDown}
              onPointerMove={handleTrackPointerMove}
              onPointerUp={endTrackDrag}
              onPointerCancel={endTrackDrag}
              onClickCapture={handleTrackClickCapture}
            >
              {photoSlides.map((photo, index) => {
                const isDuplicate = index >= PHOTOS.length;

                return (
                  <li
                    key={`${photo.id}-${index}`}
                    className={styles.slide}
                    aria-hidden={isDuplicate ? true : undefined}
                  >
                    <button
                      type="button"
                      className={styles.slideButton}
                      data-photo-id={photo.id}
                      onClick={() => openLightbox(photo)}
                      aria-label={`View larger: ${photo.alt}`}
                      tabIndex={isDuplicate ? -1 : 0}
                    >
                      <span className={styles.imageFrame}>
                        <Image
                          src={photo.src}
                          alt={isDuplicate ? "" : photo.alt}
                          fill
                          quality={100}
                          unoptimized
                          draggable={false}
                          sizes="(min-width: 1024px) 26rem, (min-width: 768px) 42vw, 72vw"
                          className={styles.image}
                        />
                        <span className={styles.imageScrim} aria-hidden="true" />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <nav
            className={styles.navigation}
            aria-label="Photo gallery carousel"
          >
            <div className={styles.dotsPill}>
              <ol className={styles.dots}>
                {PHOTOS.map((photo, index) => (
                  <li key={photo.id}>
                    <button
                      type="button"
                      className={
                        index === activeIndex ? styles.dotActive : styles.dot
                      }
                      aria-label={`Show photo ${index + 1}`}
                      aria-current={index === activeIndex ? "true" : undefined}
                      onClick={() => scrollToIndex(index)}
                    />
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        </div>
      </div>

      {lightbox}
    </section>
  );
}
