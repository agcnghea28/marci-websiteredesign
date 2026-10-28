import HeroBackground from "./HeroBackground";
import heroStyles from "./Hero.module.css";
import styles from "./ComingSoonHero.module.css";

const HERO_IMAGE = "/images/coming-soon/hero.jpg";

export default function ComingSoonHero() {
  return (
    <section className={heroStyles.hero} aria-labelledby="coming-soon-title">
      <HeroBackground imageSrc={HERO_IMAGE} />
      <div className={heroStyles.heroOverlay} aria-hidden="true" />

      <div className={`${heroStyles.heroInner} ${styles.heroInner}`}>
        <div className={`container ${heroStyles.content} ${styles.content}`}>
          <p className="eyebrow eyebrow--on-dark">Stay Tuned</p>
          <h1 id="coming-soon-title" className={styles.title}>
            Coming Soon
          </h1>
          <p className={styles.description}>
            We&apos;re working on bringing you more helpful real estate resources
            and services. This page isn&apos;t ready just yet, but we&apos;d be
            happy to help you with your real estate needs in the meantime.
          </p>
          <div className={`${heroStyles.ctas} ${styles.ctas}`}>
            <a href="/" className="btn btn--primary btn--on-dark">
              Back to Home
            </a>
            <a href="/#contact" className="btn btn--outline btn--on-dark">
              Contact Marci
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
