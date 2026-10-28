"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { COMING_SOON_PATH } from "../lib/siteRoutes";
import styles from "./Footer.module.css";

const LOGO_WIDTH = 1024;
const LOGO_HEIGHT = 319;
const PHONE_DISPLAY = "(206) 919-6886";
const PHONE_TEL = "+12069196886";
const PHONE_HREF = `tel:${PHONE_TEL}`;
const ADDRESS = "3190 HW-160, Suite F, Pahrump, Nevada 89048, United States";
const MAP_LAT = 36.184249;
const MAP_LNG = -115.955253;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  ADDRESS,
)}`;

const EXPLORE_LINKS = [
  { label: "Home", href: "https://marci-websiteredesign.vercel.app/" },
  { label: "Listings", href: COMING_SOON_PATH },
  { label: "Meet Marci", href: COMING_SOON_PATH },
  {
    label: "Photo Gallery",
    href: COMING_SOON_PATH,
  },
  { label: "Let's Move", href: COMING_SOON_PATH },
];

const SOCIALS = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/MarciHomes/",
    iconSrc: "/images/social/footer/facebook.png",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/marcimetzger_theridge/",
    iconSrc: "/images/social/footer/instagram.png",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/marci-metzger-30642496/",
    iconSrc: "/images/social/footer/linkedin.png",
  },
  {
    id: "yelp",
    label: "Yelp",
    href: "https://www.yelp.com/biz/xr3yQN_m2SgO0R_7S6p62w",
    iconSrc: "/images/social/footer/yelp.png",
  },
];

const DAILY_HOURS = "8:00 am – 7:00 pm";

const WEEK_HOURS = [
  { id: "sunday", label: "Sunday" },
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
];

function PinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 8h.01" />
    </svg>
  );
}

export default function Footer() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [todayIndex, setTodayIndex] = useState(null);
  const [showAllHours, setShowAllHours] = useState(false);

  useEffect(() => {
    setYear(new Date().getFullYear());
    setTodayIndex(new Date().getDay());
  }, []);

  const todayLabel = WEEK_HOURS[todayIndex]?.label ?? "today";

  return (
    <footer className={`section ${styles.footer}`}>
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to Make Your Next Move?</h2>
        <div className={styles.actions}>
          <a href={COMING_SOON_PATH} className="btn btn--primary btn--on-dark">
            Find a Home
          </a>
          <a
            href={COMING_SOON_PATH}
            className="btn btn--outline btn--on-dark"
            aria-label="Let's talk — visit our coming soon page"
          >
            Let&apos;s Talk
          </a>
        </div>
      </div>

      <hr className={styles.rule} />

      <div className={styles.columns}>
        <div className={styles.brand}>
          <a
            href="https://marci-websiteredesign.vercel.app/"
            className={styles.logo}
            aria-label="Marci Metzger - The Ridge Realty Group"
          >
            <Image
              src="/images/logo/logo.webp"
              alt="Marci Metzger - The Ridge Realty Group"
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              className={styles.logoImage}
            />
          </a>
          <h3>Marci Metzger</h3>
          <p>
            Your trusted partner for buying and selling
            <br />
            homes in Pahrump, Nevada.
          </p>
          <ul className={styles.socials}>
            {SOCIALS.map((social) => (
              <li key={social.id}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <Image
                    src={social.iconSrc}
                    alt=""
                    width={24}
                    height={24}
                    unoptimized
                    className={`${styles.socialIcon} ${
                      social.id === "instagram" ? styles.socialIconInstagram : ""
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className={styles.explore} aria-label="Explore">
          <p className="eyebrow eyebrow--on-dark">Explore</p>
          <ul className={styles.linkList}>
            {EXPLORE_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.contact}>
          <p className="eyebrow eyebrow--on-dark">Get in Touch</p>
          <a
            className={`${styles.address} ${styles.detailLink}`}
            href={MAP_LINK}
            target="_blank"
            rel="noreferrer"
          >
            <PinIcon />
            <span>{ADDRESS}</span>
          </a>
          <a
            className={styles.detailLink}
            href={PHONE_HREF}
            aria-label={`Call Marci at ${PHONE_DISPLAY}`}
          >
            <ClockIcon />
            <span>{PHONE_DISPLAY}</span>
          </a>
          <hr className={styles.hoursRule} />
          <div className={styles.hours}>
            <ClockIcon />
            <div className={styles.hoursCopy}>
            <p className={styles.hoursTitle}>Office Hours</p>
            <p>
              Open today: {todayLabel}, {DAILY_HOURS}
            </p>
            <div className={styles.dailyRow}>
              <p>Open daily: {DAILY_HOURS}</p>
              <button
                type="button"
                className={styles.hoursChevron}
                aria-expanded={showAllHours}
                aria-controls="footer-office-hours"
                aria-label={showAllHours ? "Hide other times" : "Show other times"}
                onClick={() => setShowAllHours((open) => !open)}
              >
                <ChevronIcon />
              </button>
              <div className={styles.infoWrap}>
                <button
                  type="button"
                  className={styles.infoButton}
                  aria-describedby="footer-hours-note"
                >
                  <InfoIcon />
                  <span className="visually-hidden">
                    Appointments outside office hours
                  </span>
                </button>
                <p id="footer-hours-note" className={styles.infoTip} role="note">
                  Appointments outside office hours available upon request. Just
                  call!
                </p>
              </div>
            </div>
            {showAllHours ? (
              <ul id="footer-office-hours" className={styles.hoursList}>
                {WEEK_HOURS.map((day, index) => (
                  <li
                    key={day.id}
                    className={
                      index === todayIndex ? styles.hoursToday : undefined
                    }
                    aria-current={index === todayIndex ? "date" : undefined}
                  >
                    <span>{day.label}</span>
                    <span>{DAILY_HOURS}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className={styles.hoursHint}>
              Click the chevron &amp; hover over information icon for more
              information.
            </p>
            </div>
          </div>
        </div>
      </div>

      <hr className={styles.rule} />

      <div className={styles.legal}>
        <p>
          Copyright © {year} Marci METZGER • All Rights Reserved
        </p>
        <p className={styles.policies}>
          <a id="privacy-policy" href={COMING_SOON_PATH}>
            Privacy Policy
          </a>
          <span aria-hidden="true">|</span>
          <a id="terms-and-conditions" href={COMING_SOON_PATH}>
            Terms and Conditions
          </a>
        </p>
      </div>
    </footer>
  );
}
