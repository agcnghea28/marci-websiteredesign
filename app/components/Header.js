"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  COMING_SOON_PATH,
  HOME_HERO_HREF,
} from "../lib/siteRoutes";
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
  { label: "Home", href: HOME_HERO_HREF },
  { label: "Listings", href: COMING_SOON_PATH },
  { label: "Let's Move", href: COMING_SOON_PATH },
  { label: "About Marci", href: COMING_SOON_PATH },
];

const MENU_LINKS = [
  { label: "Home", href: HOME_HERO_HREF },
  { label: "About Marci", href: COMING_SOON_PATH },
  { label: "Home Search", href: COMING_SOON_PATH },
  { label: "Properties", href: COMING_SOON_PATH },
  { label: "Testimonials", href: COMING_SOON_PATH },
  { label: "Contact Us", href: COMING_SOON_PATH },
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [wideNavLayout, setWideNavLayout] = useState(false);
  const headerRef = useRef(null);
  const hamburgerRef = useRef(null);
  const searchToggleRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchWrapRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const wasMenuOpenRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const scrollTickingRef = useRef(false);
  const menuOpenRef = useRef(false);
  const searchOpenRef = useRef(false);
  const headerFocusedRef = useRef(false);
  const isHiddenRef = useRef(false);
  const isSolidRef = useRef(false);

  menuOpenRef.current = menuOpen;
  searchOpenRef.current = searchOpen;
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
      if (
        menuOpenRef.current ||
        searchOpenRef.current ||
        headerFocusedRef.current
      ) {
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
      setSearchOpen(false);
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!searchOpen) return undefined;

    isHiddenRef.current = false;
    setIsHidden(false);
    setIsSolid(true);

    const onPointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (
        searchWrapRef.current?.contains(target) ||
        searchToggleRef.current?.contains(target)
      ) {
        return;
      }

      setSearchOpen(false);
      searchToggleRef.current?.focus();
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSearchOpen(false);
        searchToggleRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");
    const update = () => setWideNavLayout(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

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

  const toggleSearch = () => {
    setSearchOpen((open) => !open);
  };

  const handleHeaderSearchSubmit = (event) => {
    event.preventDefault();
    setSearchOpen(false);
    window.location.assign(COMING_SOON_PATH);
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
          <a href={HOME_HERO_HREF} className={styles.logo}>
            <LogoMark className={styles.logoImage} priority />
          </a>

          <div
            className={`${styles.end} ${searchOpen ? styles.endSearchOpen : ""}`}
          >
            <nav
              className={`${styles.nav} ${searchOpen ? styles.navWithSearch : ""}`}
              aria-label="Primary"
              aria-hidden={searchOpen && !wideNavLayout ? "true" : undefined}
            >
              {PRIMARY_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="nav-link"
                  tabIndex={searchOpen && !wideNavLayout ? -1 : undefined}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className={styles.actions}>
              <div ref={searchWrapRef} className={styles.headerSearch}>
                {searchOpen ? (
                  <form
                    className={styles.headerSearchForm}
                    role="search"
                    aria-label="Search listings"
                    onSubmit={handleHeaderSearchSubmit}
                  >
                    <label
                      className={styles.visuallyHidden}
                      htmlFor="header-search"
                    >
                      Search
                    </label>
                    <input
                      ref={searchInputRef}
                      id="header-search"
                      type="search"
                      name="header-search"
                      className={styles.headerSearchInput}
                      placeholder="Search"
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      className={styles.headerSearchIconButton}
                      aria-label="Search listings"
                    >
                      <SearchIcon />
                    </button>
                  </form>
                ) : (
                  <button
                    ref={searchToggleRef}
                    type="button"
                    className={styles.iconButton}
                    aria-label="Search listings"
                    aria-expanded="false"
                    aria-controls="header-search"
                    onClick={toggleSearch}
                  >
                    <SearchIcon />
                  </button>
                )}
              </div>
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
              key={link.label}
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
