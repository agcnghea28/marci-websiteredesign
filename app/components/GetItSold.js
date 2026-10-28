"use client";

import Image from "next/image";
import { HOME_PROPERTY_SEARCH_HREF } from "../lib/siteRoutes";
import { useCountUp } from "../lib/useCountUp";
import styles from "./GetItSold.module.css";

function AnimatedStat({ end, decimals = 0, formatDisplay }) {
  const { ref, value } = useCountUp(end, { decimals });

  return (
    <p ref={ref} className={styles.statValue}>
      {formatDisplay(value)}
    </p>
  );
}

function StatClients() {
  return (
    <AnimatedStat
      end={90}
      formatDisplay={(value) => `${Math.round(value)}+`}
    />
  );
}

function StatSales() {
  return (
    <AnimatedStat
      end={28.5}
      decimals={1}
      formatDisplay={(value) => `$${value.toFixed(1)}M`}
    />
  );
}

function StatYears() {
  return (
    <AnimatedStat
      end={31}
      formatDisplay={(value) => `${Math.round(value)} Years`}
    />
  );
}

const STATS = [
  {
    id: "clients",
    Value: StatClients,
    label: ["Total clients helped", "in 2021"],
  },
  {
    id: "sales",
    Value: StatSales,
    label: ["Total sales closed", "in 2021"],
  },
  {
    id: "years",
    Value: StatYears,
    label: ["Years of real estate", "experience"],
  },
  {
    id: "realtor",
    Value: function StatRealtor() {
      return <p className={`${styles.statValue} ${styles.statValuePhrase}`}>Top REALTOR®</p>;
    },
    label: ["Recognized for residential", "sales in Pahrump"],
  },
];

const CARDS = [
  {
    id: "sellers",
    eyebrowClass: "eyebrow eyebrow--on-dark",
    eyebrow: "For Home Sellers",
    title: "Don't Just List It",
    copy: [
      "Get it SOLD! Marci exhausts every avenue to ensure her listings are at the fingertips of every possible buyer, helping you get top dollar for your home.",
    ],
    cta: { href: "#contact", label: "Let's Talk About Selling" },
    image: "/images/home-sellers/carousel-01.jpg",
    imageAlt: "Open dining and living area with patio access",
  },
  {
    id: "buyers",
    eyebrowClass: "eyebrow eyebrow--on-dark",
    eyebrow: "For Home Buyers",
    title: "Guide to Buyers",
    copy: [
      "Nobody knows the market like Marci Metzger. Enjoy having a pro at your service, with market analysis, upgrade lists, contractors on speed dial, and more!",
    ],
    cta: { href: HOME_PROPERTY_SEARCH_HREF, label: "Browse Properties" },
    image: "/images/guide-to-buyers/guide-to-buyers.jpg",
    imageAlt: "Hand holding house keys in front of colorful model homes",
  },
];

export default function GetItSold() {
  return (
    <section id="get-it-sold" className={`section ${styles.section}`}>
      <div className={styles.inner}>
        <div className={styles.intro}>
          <div className={styles.introHeading}>
            <p className="eyebrow">Proven Results</p>
            <h2>
              Top Residential Sales
              <br />
              Last 5 Years
            </h2>
          </div>
          <div className={styles.introCopy}>
            <p>
              Marci works hard every day to grow and learn so she can continue
              to excel in the real estate market. Her clients deserve her best,
              and she strives to make her best even better every year.
            </p>
          </div>
        </div>

        <ul className={styles.stats} aria-label="Sales highlights">
          {STATS.flatMap(({ id, Value, label }, index) => {
            const item = (
              <li key={id} className={styles.stat}>
                <Value />
                <p className={styles.statLabel}>
                  {label[0]}
                  <br />
                  {label[1]}
                </p>
              </li>
            );

            if (index === 0) return [item];

            return [
              <li
                key={`${id}-divider`}
                className={styles.statDivider}
                aria-hidden="true"
              />,
              item,
            ];
          })}
        </ul>

        <ul className={styles.cards}>
          {CARDS.map((card) => (
            <li key={card.id}>
              <article className={styles.card}>
                <div className={styles.media}>
                  <Image
                    src={card.image}
                    alt={card.imageAlt}
                    fill
                    quality={100}
                    unoptimized
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className={styles.image}
                  />
                  <span className={styles.overlay} aria-hidden="true" />
                </div>
                <div className={styles.cardBody}>
                  <p className={card.eyebrowClass}>{card.eyebrow}</p>
                  <h3>{card.title}</h3>
                  <div className={styles.cardCopy}>
                    {card.copy.map((paragraph) => (
                      <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                    ))}
                  </div>
                  <a
                    href={card.cta.href}
                    className="btn btn--primary btn--on-dark"
                  >
                    {card.cta.label}
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
