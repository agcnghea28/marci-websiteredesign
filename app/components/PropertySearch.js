import HeroBackground from "./HeroBackground";
import ListingSearch from "./ListingSearch";
import heroStyles from "./Hero.module.css";
import styles from "./PropertySearch.module.css";

const BACKGROUND_IMAGE = "/images/property-search/the-peggy-estate.jpg";

export default function PropertySearch() {
  return (
    <section id="property-search" className={`section ${styles.section}`}>
      <HeroBackground imageSrc={BACKGROUND_IMAGE} />
      <div className={heroStyles.heroOverlay} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={`container ${styles.content}`}>
          <p className="eyebrow eyebrow--on-dark">Property Search</p>
          <h2>Find Your Dream Home</h2>
          <p className={styles.description}>
            Explore available properties in Pahrump, Nevada, and find a home
            that fits your needs.
          </p>
          <div className={styles.searchWrap}>
            <ListingSearch />
          </div>
        </div>
      </div>
    </section>
  );
}
