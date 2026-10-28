import LogoMarquee from "./LogoMarquee";
import { COMING_SOON_PATH } from "../lib/siteRoutes";
import styles from "./MeetMarci.module.css";

const PHONE_DISPLAY = "(206) 919-6886";
const PHONE_HREF = "tel:+12069196886";

export default function MeetMarci() {
  return (
    <section id="about" className="section">
      <div className={styles.inner}>
      <div className={styles.layout}>
        <div
          className={styles.imageWrap}
          role="img"
          aria-label="Marci J. Metzger, Ridge Realty REALTOR®"
        >
          <span className={styles.imageLayer} aria-hidden="true" />
        </div>
        <div className={styles.content}>
          <div className={styles.titleBlock}>
            <p className="eyebrow">Meet Marci</p>
            <h2>Marci J. Metzger</h2>
            <p className={styles.subtitle}>REALTOR® for Nearly 3 Decades</p>
          </div>
          <div className={styles.copy}>
            <p>
              With a real estate career dating back to 1995, Marci J. Metzger
              brings years of experience helping buyers and sellers across
              different markets. She previously worked as a REALTOR® and licensed
              Broker in Washington State before bringing her knowledge and
              expertise to Southern Nevada.
            </p>
            <p>
              Now based in Pahrump, Marci appreciates the small-town atmosphere,
              local amenities, and lifestyle the community offers. Her familiarity
              with the area helps her guide clients as they explore their options
              and find a home that suits their needs.
            </p>
          </div>
          <div className={styles.actions}>
            <a
              href={PHONE_HREF}
              className="btn btn--primary"
              aria-label={`Call Marci today at ${PHONE_DISPLAY}`}
            >
              Call Marci Today
            </a>
            <a href={COMING_SOON_PATH} className="btn btn--outline">
              Learn More
            </a>
          </div>
        </div>
      </div>
      </div>
      <LogoMarquee />
    </section>
  );
}
