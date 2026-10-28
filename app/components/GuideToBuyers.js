import Image from "next/image";
import { COMING_SOON_PATH } from "../lib/siteRoutes";
import styles from "./TopResidentialSales.module.css";

export default function GuideToBuyers() {
  return (
    <section id="buyers" className="section">
      <div className={styles.layout}>
        <div className={styles.imageWrap}>
          <Image
            src="/images/guide-to-buyers/guide-to-buyers.jpg"
            alt="Hand holding house keys in front of colorful model homes"
            fill
            quality={100}
            unoptimized
            sizes="(min-width: 768px) 42%, 100vw"
            className={styles.image}
          />
        </div>
        <div className={styles.content}>
          <p className="eyebrow">For Home Buyers</p>
          <h2>Guide to Buyers</h2>
          <div className={styles.copy}>
            <p>
              Nobody knows the market like we do. Enjoy having a pro at your
              service. Market analysis, upgrades lists, contractors on speed
              dial, &amp; more!
            </p>
          </div>
          <a href={COMING_SOON_PATH} className="btn btn--primary">
            Browse Properties
          </a>
        </div>
      </div>
    </section>
  );
}
