import Image from "next/image";
import ListingSearch from "./ListingSearch";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.heroBackground} aria-hidden="true">
        <Image
          src="/images/hero/hero.webp"
          alt=""
          fill
          priority
          quality={80}
          sizes="100vw"
          className={styles.heroImage}
        />
      </div>
      <div className={styles.heroOverlay} aria-hidden="true" />

      <div className={styles.heroInner}>
        <div className={`container ${styles.content}`}>
          <p className="eyebrow eyebrow--on-dark">
            MARCI METZGER - THE RIDGE REALTY GROUP
          </p>
          <h1 className={styles.displayTitle}>Pahrump Realtor</h1>
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
          </div>
        </div>
        <div className={`container ${styles.searchWrap}`}>
          <ListingSearch />
        </div>
      </div>
    </section>
  );
}
