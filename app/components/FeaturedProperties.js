"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { HOME_PROPERTY_SEARCH_HREF } from "../lib/siteRoutes";
import styles from "./FeaturedProperties.module.css";

const EXPLORE_ALL_URL = HOME_PROPERTY_SEARCH_HREF;

function googleMapsSearchUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address,
  )}`;
}

const PROPERTIES = [
  {
    id: "the-luxury-estate",
    status: "Active",
    title: "The Luxury Estate",
    location: "4751 W Adkisson Street, Pahrump, Nevada 89060-3541",
    beds: 4,
    baths: 5,
    garages: 4,
    sqft: "5,530",
    price: "$1,850,000",
    image: "/images/featured/01-the-luxury-estate.jpg",
    href:
      "https://theridgerealty.idxbroker.com/idx/details/listing/c015/2743604/4751-W-Adkisson-Street-Pahrump-NV-89060",
  },
  {
    id: "broken-arrows-ranch",
    status: "Active",
    title: "Broken Arrows Ranch",
    location: "4892 Quail Run Road, Pahrump, Nevada 89060-3002",
    beds: 3,
    baths: 2,
    garages: 3,
    sqft: "1,950",
    price: "$1,080,000",
    image: "/images/featured/02-broken-arrows-ranch.jpg",
    href:
      "https://theridgerealty.idxbroker.com/idx/details/listing/c015/2779103/4892-Quail-Run-Road-Pahrump-NV-89060",
  },
  {
    id: "the-peggy-estate",
    status: "Active",
    title: "The Peggy Estate",
    location: "3200 Peggy Avenue, Pahrump, Nevada 89048-9465",
    beds: 4,
    baths: 3,
    garages: 2,
    sqft: "2,886",
    price: "$814,000",
    image: "/images/featured/03-the-peggy-estate.jpg",
    href:
      "https://theridgerealty.idxbroker.com/idx/details/listing/c015/2743294/3200-Peggy-Avenue-Pahrump-NV-89048",
  },
  {
    id: "the-winery-residence",
    status: "Active",
    title: "The Winery Residence",
    location: "2181 E Winery Road, Pahrump, Nevada 89048-6294",
    beds: 5,
    baths: 5,
    garages: 2,
    sqft: "3,716",
    price: "$777,777",
    image: "/images/featured/04-the-winery-residence.jpg",
    href:
      "https://theridgerealty.idxbroker.com/idx/details/listing/c015/2807457/2181-E-Winery-Road-Pahrump-NV-89048",
  },
  {
    id: "the-greenbriar-retreat",
    status: "Active",
    title: "The Greenbriar Retreat",
    location: "6671 Greenbriar Court, Pahrump, Nevada 89061-7774",
    beds: 5,
    baths: 3,
    garages: 3,
    sqft: "3,402",
    price: "$789,000",
    image: "/images/featured/05-the-greenbriar-retreat.jpg",
    href:
      "https://theridgerealty.idxbroker.com/idx/details/listing/c015/2808336/6671-Greenbriar-Court-Pahrump-NV-89061",
  },
];

function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}

function BedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
      <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
      <path d="M12 4v6" />
      <path d="M2 18h20" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M4 12h16a1 1 0 0 1 1 1v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3a1 1 0 0 1 1-1z" />
      <path d="M6 12V5a2 2 0 0 1 2-2h1" />
      <path d="M4 20v1M20 20v1" />
    </svg>
  );
}

function GarageIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M3 10 12 3l9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

function FloorPlanIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M4 4h16v16H4z" />
      <path d="M4 12h8v8M12 4v12h8" />
    </svg>
  );
}

function formatBedLabel(count) {
  return `${count} ${count === 1 ? "Bedroom" : "Bedrooms"}`;
}

function formatBathLabel(count) {
  return `${count} ${count === 1 ? "Bathroom" : "Bathrooms"}`;
}

function formatGarageLabel(count) {
  return `${count} ${count === 1 ? "Garage" : "Garages"}`;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const DRAG_CLICK_THRESHOLD_PX = 6;

export default function FeaturedProperties() {
  const trackRef = useRef(null);
  const dragRef = useRef({
    isActive: false,
    didMove: false,
    startX: 0,
    scrollLeft: 0,
    pointerId: null,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const updateActiveIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return;

    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;

    let closest = 0;
    let closestDistance = Infinity;

    Array.from(track.children).forEach((child, index) => {
      const rect = child.getBoundingClientRect();
      const childCenter = rect.left + rect.width / 2;
      const distance = Math.abs(childCenter - trackCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = index;
      }
    });

    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateActiveIndex();
    track.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);

    return () => {
      track.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [updateActiveIndex]);

  const scrollToIndex = (index) => {
    const track = trackRef.current;
    const card = track?.children[index];
    if (!card) return;
    card.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      inline: "start",
      block: "nearest",
    });
    setActiveIndex(index);
  };

  const handleTrackPointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const target = event.target;
    if (
      target instanceof Element &&
      target.closest("a, button, input, textarea, select")
    ) {
      return;
    }

    const track = trackRef.current;
    if (!track) return;

    dragRef.current = {
      isActive: true,
      didMove: false,
      startX: event.clientX,
      scrollLeft: track.scrollLeft,
      pointerId: event.pointerId,
    };
    setIsDragging(true);
    track.setPointerCapture(event.pointerId);
  };

  const handleTrackPointerMove = (event) => {
    if (!dragRef.current.isActive) return;

    const track = trackRef.current;
    if (!track) return;

    const deltaX = event.clientX - dragRef.current.startX;
    if (Math.abs(deltaX) > DRAG_CLICK_THRESHOLD_PX) {
      dragRef.current.didMove = true;
    }

    track.scrollLeft = dragRef.current.scrollLeft - deltaX;

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

  const handleTrackClickCapture = (event) => {
    if (!dragRef.current.didMove) return;

    event.preventDefault();
    event.stopPropagation();
    dragRef.current.didMove = false;
  };

  return (
    <section id="properties" className="section">
      <div className={styles.inner}>
      <div className={styles.intro}>
        <div className={styles.introText}>
          <p className="eyebrow">Featured Listings</p>
          <h2>Featured Properties</h2>
          <p className={styles.description}>
            Explore homes and properties available in Pahrump, Nevada.
          </p>
        </div>
        <a
          href={EXPLORE_ALL_URL}
          className={`btn btn--outline ${styles.exploreAll}`}
        >
          Explore All
          <ArrowRightIcon />
        </a>
      </div>

      <div className={styles.carousel}>
        <ul
          className={`${styles.track} ${isDragging ? styles.trackDragging : ""}`}
          ref={trackRef}
          aria-label="Featured properties"
          onPointerDown={handleTrackPointerDown}
          onPointerMove={handleTrackPointerMove}
          onPointerUp={endTrackDrag}
          onPointerCancel={endTrackDrag}
          onClickCapture={handleTrackClickCapture}
        >
          {PROPERTIES.map((property) => (
            <li key={property.id} className={styles.card}>
              <div className={styles.imageWrap}>
                <span className={styles.status}>{property.status}</span>
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  draggable={false}
                  quality={100}
                  sizes="(min-width: 1024px) 32vw, (min-width: 768px) 42vw, 88vw"
                  className={styles.image}
                />
              </div>
              <div className={styles.body}>
                <h3 className={styles.title}>{property.title}</h3>
                <p className={styles.location}>
                  <MapPinIcon />
                  <a
                    href={googleMapsSearchUrl(property.location)}
                    className={styles.locationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {property.location}
                  </a>
                </p>
                <dl className={styles.specGrid}>
                  <div className={styles.specItem}>
                    <dt className={styles.specIcon}>
                      <BedIcon />
                    </dt>
                    <dd className={styles.specLabel}>
                      {formatBedLabel(property.beds)}
                    </dd>
                  </div>
                  <div className={styles.specItem}>
                    <dt className={styles.specIcon}>
                      <BathIcon />
                    </dt>
                    <dd className={styles.specLabel}>
                      {formatBathLabel(property.baths)}
                    </dd>
                  </div>
                  <div className={styles.specItem}>
                    <dt className={styles.specIcon}>
                      <FloorPlanIcon />
                    </dt>
                    <dd className={styles.specLabel}>{property.sqft} Sq Ft</dd>
                  </div>
                  <div className={styles.specItem}>
                    <dt className={styles.specIcon}>
                      <GarageIcon />
                    </dt>
                    <dd className={styles.specLabel}>
                      {formatGarageLabel(property.garages)}
                    </dd>
                  </div>
                </dl>
                <div className={styles.cardFooter}>
                  <p className={styles.price}>{property.price}</p>
                  <a
                    href={property.href}
                    className={`btn btn--primary ${styles.viewProperty}`}
                  >
                    View Property
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <nav className={styles.navigation} aria-label="Featured properties carousel">
        <ol className={styles.dots}>
          {PROPERTIES.map((property, index) => (
            <li key={property.id}>
              <button
                type="button"
                className={
                  index === activeIndex ? styles.dotActive : styles.dot
                }
                aria-label={`Show ${property.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => scrollToIndex(index)}
              />
            </li>
          ))}
        </ol>
      </nav>
      </div>
    </section>
  );
}
