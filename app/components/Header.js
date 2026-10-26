"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";

const LOGO_WIDTH = 1024;
const LOGO_HEIGHT = 319;

function LogoMark({ className, priority = false }) {
  return (
    <>
      <Image
        src="/images/logo/logo.webp"
        alt="Marci Metzger - The Ridge Realty Group"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        priority={priority}
        className={className}
      />
      <span className={styles.visuallyHidden} aria-hidden="true">
        Marci Metzger - The Ridge Realty Group
      </span>
    </>
  );
}

const PRIMARY_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Listings", href: "#search" },
  { label: "Let's Move", href: "#services" },
  { label: "About Us", href: "#about" },
];

const MENU_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About Marci", href: "#about" },
  { label: "Home Search", href: "#search" },
  { label: "Properties", href: "#properties" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Blog", href: "#blog" },
  { label: "Contact Us", href: "#contact" },
];

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" fill="none" />
      <path d="m21 21-4.3-4.3" fill="none" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" fill="none" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" fill="none" />
    </svg>
  );
}

function parseCssLength(raw, fallbackPx) {
  const value = raw.trim();
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed)) {
    return fallbackPx;
  }
  if (value.endsWith("rem")) {
    const fontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
    return parsed * fontSize;
  }
  return parsed;
}

function getScrollThreshold() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--header-scroll-threshold",
  );
  return parseCssLength(raw, 40);
}

function getHeaderHeight() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--header-height",
  );
  return parseCssLength(raw, 72);
}

function getScrollDelta() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--header-scroll-delta",
  );
  return parseCssLength(raw, 8);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToId(id) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}

export default function Header() {
  const [isHidden, setIsHidden] = useState(false);
  const [isSolid, setIsSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const hamburgerRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const wasMenuOpenRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const scrollTickingRef = useRef(false);
  const menuOpenRef = useRef(false);
  const headerFocusedRef = useRef(false);
  const isHiddenRef = useRef(false);
  const isSolidRef = useRef(false);

  menuOpenRef.current = menuOpen;
  isHiddenRef.current = isHidden;
  isSolidRef.current = isSolid;

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
  }, []);

  // Passive scroll + rAF: direction-based hide/show; refs hold last Y to limit re-renders.
  useEffect(() => {
    const applyScrollState = () => {
      const y = Math.max(0, window.scrollY);
      const threshold = getScrollThreshold();
      const headerHeight = getHeaderHeight();
      const scrollDelta = getScrollDelta();
      const delta = y - lastScrollYRef.current;

      const setHidden = (next) => {
        if (isHiddenRef.current !== next) {
          isHiddenRef.current = next;
          setIsHidden(next);
        }
      };

      const setSolid = (next) => {
        if (isSolidRef.current !== next) {
          isSolidRef.current = next;
          setIsSolid(next);
        }
      };

      // Top of page: always visible and transparent (clamp iOS bounce to 0).
      if (y <= threshold) {
        setHidden(false);
        setSolid(false);
        lastScrollYRef.current = y;
        return;
      }

      // Menu open or keyboard focus inside header: keep visible.
      if (menuOpenRef.current || headerFocusedRef.current) {
        setHidden(false);
        setSolid(true);
        lastScrollYRef.current = y;
        return;
      }

      // Ignore tiny scroll deltas to avoid jitter.
      if (Math.abs(delta) < scrollDelta) {
        return;
      }

      if (delta > 0 && y > headerHeight) {
        setHidden(true);
        lastScrollYRef.current = y;
        return;
      }

      if (delta < 0) {
        setHidden(false);
        setSolid(true);
        lastScrollYRef.current = y;
        return;
      }

      // Scrolling down but not far enough to hide — still past the transparent zone.
      if (!isHiddenRef.current) {
        setSolid(true);
      }
      lastScrollYRef.current = y;
    };

    const onScroll = () => {
      if (scrollTickingRef.current) return;
      scrollTickingRef.current = true;
      requestAnimationFrame(() => {
        applyScrollState();
        scrollTickingRef.current = false;
      });
    };

    applyScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      isHiddenRef.current = false;
      setIsHidden(false);
    }
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      closeRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll(
        'button, a[href], [tabindex]:not([tabindex="-1"])',
      );
      const items = Array.from(focusables);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    if (wasMenuOpenRef.current && !menuOpen) {
      hamburgerRef.current?.focus();
    }
    wasMenuOpenRef.current = menuOpen;
  }, [menuOpen]);

  const handleSearch = () => {
    scrollToId("search");
  };

  const handlePanelLinkClick = () => {
    closeMenu();
  };

  return (
    <>
      <header
        ref={headerRef}
        className={styles.header}
        data-hidden={isHidden ? "true" : "false"}
        data-solid={isSolid ? "true" : "false"}
        onFocusCapture={() => {
          headerFocusedRef.current = true;
        }}
        onBlurCapture={(event) => {
          if (!headerRef.current?.contains(event.relatedTarget)) {
            headerFocusedRef.current = false;
          }
        }}
      >
        <div className={styles.inner}>
          <a href="#home" className={styles.logo}>
            <LogoMark className={styles.logoImage} priority />
          </a>

          <div className={styles.end}>
            <nav className={styles.nav} aria-label="Primary">
              {PRIMARY_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="nav-link">
                  {link.label}
                </a>
              ))}
            </nav>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Search listings"
                onClick={handleSearch}
              >
                <SearchIcon />
              </button>
              <button
                ref={hamburgerRef}
                type="button"
                className={styles.iconButton}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="site-menu"
                onClick={openMenu}
              >
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`${styles.overlay} ${menuOpen ? "" : styles.overlayHidden}`}
        aria-hidden="true"
        onClick={closeMenu}
      />

      <aside
        id="site-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={`${styles.panel} ${menuOpen ? styles.panelOpen : ""}`}
      >
        <div className={styles.panelHeader}>
          <button
            ref={closeRef}
            type="button"
            className={styles.iconButton}
            aria-label="Close menu"
            tabIndex={menuOpen ? 0 : -1}
            onClick={closeMenu}
          >
            <CloseIcon />
          </button>
        </div>
        <nav className={styles.panelNav} aria-label="Mobile">
          {MENU_LINKS.map((link) => (
            <a
              key={link.href + link.label}
              href={link.href}
              className="nav-link"
              tabIndex={menuOpen ? 0 : -1}
              onClick={handlePanelLinkClick}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
