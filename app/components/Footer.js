"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
  { label: "Listings", href: "https://marcimetzger.com/listings" },
  { label: "Meet Marci", href: "https://marcimetzger.com/about-us" },
  {
    label: "Photo Gallery",
    href: "https://marci-websiteredesign.vercel.app/#gallery",
  },
  { label: "Let's Move", href: "https://marcimetzger.com/lets-move" },
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

export default function Footer() {
  const [year, setYear] = useState(() => new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className={`section ${styles.footer}`}>
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to Make Your Next Move?</h2>
        <div className={styles.actions}>
          <a
            href="https://marcimetzger.com/listings"
            className="btn btn--primary btn--on-dark"
          >
            Find a Home
          </a>
          <a
            href={PHONE_HREF}
            className="btn btn--outline btn--on-dark"
            aria-label={`Let's talk — call ${PHONE_DISPLAY}`}
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
        </div>

        <nav className={styles.explore} aria-label="Explore">
          <p className="eyebrow eyebrow--on-dark">Explore</p>
          <ul className={styles.linkList}>
            {EXPLORE_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.contact}>
          <p className="eyebrow eyebrow--on-dark">Get in Touch</p>
          <a
            className={styles.address}
            href={MAP_LINK}
            target="_blank"
            rel="noreferrer"
          >
            {ADDRESS}
          </a>
          <a href={PHONE_HREF} aria-label={`Call Marci at ${PHONE_DISPLAY}`}>
            {PHONE_DISPLAY}
          </a>
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
      </div>

      <hr className={styles.rule} />

      <div className={styles.legal}>
        <p>
          Copyright © {year} Marci METZGER • All Rights Reserved
        </p>
        <p className={styles.policies}>
          <a id="privacy-policy" href="#">
            Privacy Policy
          </a>
          <span aria-hidden="true">|</span>
          <a id="terms-and-conditions" href="#">
            Terms and Conditions
          </a>
        </p>
      </div>
    </footer>
  );
}
