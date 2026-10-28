"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Testimonials.module.css";

const TESTIMONIAL_AVATAR = "/images/testimonials/avatar-1.svg";

const TESTIMONIALS = [
  {
    id: "james-d",
    name: "James D.",
    role: "Client",
    location: "Pahrump, Nevada",
    quote:
      "Real estate agent with all the polish and professionalism you need! Knowledgeable, and so helpful... every step of the way! Top pick for Pahrump!",
    avatar: TESTIMONIAL_AVATAR,
  },
  {
    id: "teresa-l",
    name: "Teresa L.",
    role: "Client",
    location: "Pahrump, Nevada",
    quote:
      "Professional, friendly and knows her profession well. Pahrump is lucky to have her 30+ years of experience. I highly recommend Marci and Lauren.",
    avatar: TESTIMONIAL_AVATAR,
  },
  {
    id: "cherly-t",
    name: "Cherly T.",
    role: "Home Seller",
    location: "Pahrump, Nevada",
    quote:
      "Very professional and knowledgeable. Very well groomed..trying to price your home right the first time when listing..would recommend her and her company.",
    avatar: TESTIMONIAL_AVATAR,
  },
  {
    id: "jana",
    name: "Jana",
    role: "Home Buyer",
    location: "Pahrump, Nevada",
    quote:
      "Marci Metzger was fantastic to work with! She quickly understood our must-haves versus our nice-to-haves and found us a home that checked every box.",
    avatar: TESTIMONIAL_AVATAR,
  },
];

const DRAG_CLICK_THRESHOLD_PX = 6;
const SWIPE_THRESHOLD_PX = 48;

function ChevronLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getWrappedIndex(index, length) {
  return ((index % length) + length) % length;
}

export default function Testimonials() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const dragRef = useRef({
    isActive: false,
    didMove: false,
    startX: 0,
    pointerId: null,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const updateParallax = useCallback(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) {
      setParallaxOffset(0);
      return;
    }

    const rect = section.getBoundingClientRect();
    const speed =
      Number.parseFloat(
        getComputedStyle(section).getPropertyValue("--testimonials-parallax-speed"),
      ) || 0.45;

    const offset = rect.top * -speed;
    setParallaxOffset(offset);
  }, []);

  useEffect(() => {
    let frameId = 0;

    const onScrollOrResize = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        updateParallax();
        frameId = 0;
      });
    };

    updateParallax();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [updateParallax]);

  const goToPrevious = () => {
    setActiveIndex((current) =>
      getWrappedIndex(current - 1, TESTIMONIALS.length),
    );
  };

  const goToNext = () => {
    setActiveIndex((current) =>
      getWrappedIndex(current + 1, TESTIMONIALS.length),
    );
  };

  const getCardPosition = (index) => {
    const length = TESTIMONIALS.length;
    let diff = index - activeIndex;

    if (diff > length / 2) diff -= length;
    if (diff < -length / 2) diff += length;

    return diff;
  };

  const clampDragOffset = (offset) => {
    const stage = stageRef.current;
    const maxDrag = stage ? stage.clientWidth * 0.35 : 160;
    return Math.max(-maxDrag, Math.min(maxDrag, offset));
  };

  const handleStagePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const stage = stageRef.current;
    if (!stage) return;

    dragRef.current = {
      isActive: true,
      didMove: false,
      startX: event.clientX,
      pointerId: event.pointerId,
    };
    setIsDragging(true);
    stage.setPointerCapture(event.pointerId);
  };

  const handleStagePointerMove = (event) => {
    if (!dragRef.current.isActive) return;

    const deltaX = event.clientX - dragRef.current.startX;
    if (Math.abs(deltaX) > DRAG_CLICK_THRESHOLD_PX) {
      dragRef.current.didMove = true;
    }

    setDragOffset(clampDragOffset(deltaX));

    if (dragRef.current.didMove) {
      event.preventDefault();
    }
  };

  const endStageDrag = (event) => {
    if (!dragRef.current.isActive) return;

    const stage = stageRef.current;
    if (stage?.hasPointerCapture(event.pointerId)) {
      stage.releasePointerCapture(event.pointerId);
    }

    const deltaX = event.clientX - dragRef.current.startX;

    if (deltaX <= -SWIPE_THRESHOLD_PX) {
      goToNext();
    } else if (deltaX >= SWIPE_THRESHOLD_PX) {
      goToPrevious();
    }

    dragRef.current.isActive = false;
    dragRef.current.didMove = false;
    setDragOffset(0);
    setIsDragging(false);
  };

  const stageStyle = {
    "--drag-offset-x": `${dragOffset}px`,
  };

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className={`section ${styles.section}`}
      aria-labelledby="testimonials-title"
    >
      <div className={styles.background} aria-hidden="true">
        <div
          className={styles.parallaxImageWrap}
          style={{ transform: `translate3d(0, ${parallaxOffset}px, 0)` }}
        >
          <Image
            src="/images/testimonials/testimonials-background.jpg"
            alt=""
            fill
            quality={100}
            unoptimized
            sizes="100vw"
            className={styles.parallaxImage}
          />
        </div>
        <div className={styles.overlay} />
      </div>

      <div className={styles.inner}>
        <header className={styles.intro}>
          <p className="eyebrow eyebrow--on-dark">Client Stories</p>
          <h2 id="testimonials-title" className={styles.title}>
            Testimonials
          </h2>
        </header>

        <div className={styles.carousel}>
          <button
            type="button"
            className={`${styles.navButton} ${styles.navPrev}`}
            onClick={goToPrevious}
            aria-label="Previous testimonial"
          >
            <ChevronLeftIcon />
          </button>

          <div
            ref={stageRef}
            className={`${styles.stage} ${isDragging ? styles.stageDragging : ""}`}
            style={stageStyle}
            onPointerDown={handleStagePointerDown}
            onPointerMove={handleStagePointerMove}
            onPointerUp={endStageDrag}
            onPointerCancel={endStageDrag}
          >
            <ul className={styles.track} aria-live="polite">
              {TESTIMONIALS.map((testimonial, index) => {
                const position = getCardPosition(index);
                const isActive = position === 0;

                return (
                  <li
                    key={testimonial.id}
                    className={styles.cardSlot}
                    data-position={position}
                    aria-hidden={!isActive}
                  >
                    <article
                      className={styles.card}
                      aria-label={`Testimonial from ${testimonial.name}`}
                    >
                      <div className={styles.cardHeader}>
                        <div className={styles.avatarWrap}>
                          <Image
                            src={testimonial.avatar}
                            alt=""
                            width={56}
                            height={56}
                            className={styles.avatar}
                          />
                        </div>
                      </div>
                      <p className={styles.quoteMark} aria-hidden="true">
                        &ldquo;
                      </p>
                      <blockquote className={styles.quote}>
                        <p>{testimonial.quote}</p>
                      </blockquote>
                      <footer className={styles.attribution}>
                        <span
                          className={styles.attributionRule}
                          aria-hidden="true"
                        />
                        <div className={styles.attributionText}>
                          <cite className={styles.name}>{testimonial.name}</cite>
                          <p className={styles.meta}>
                            {testimonial.role} | {testimonial.location}
                          </p>
                        </div>
                      </footer>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            type="button"
            className={`${styles.navButton} ${styles.navNext}`}
            onClick={goToNext}
            aria-label="Next testimonial"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
