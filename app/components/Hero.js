import HeroBackground from "./HeroBackground";
import { HOME_PROPERTY_SEARCH_HREF } from "../lib/siteRoutes";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <HeroBackground />
      <div className={styles.heroOverlay} aria-hidden="true" />

      <div className={styles.heroInner}>
        <div className={`container ${styles.content}`}>
          <p className="eyebrow eyebrow--on-dark">
            Marci Metzger - The Ridge Realty Group
          </p>
          <h1 className={styles.displayTitle}>PAHRUMP REALTOR</h1>
          <p className={`lead ${styles.lead}`}>
            Your trusted real estate partner in Pahrump, Nevada.
          </p>
          <div className={styles.ctas}>
            <a
              href="tel:+12069196886"
              className="btn btn--primary btn--on-dark"
            >
              Call Now
            </a>
            <a
              href={HOME_PROPERTY_SEARCH_HREF}
              className="btn btn--outline btn--on-dark"
            >
              Search Listings
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
