import Image from "next/image";
import styles from "./TopResidentialSales.module.css";

export default function TopResidentialSales() {
  return (
    <section id="sales" className="section">
      <div className={styles.layout}>
        <div className={styles.imageWrap}>
          <Image
            src="/images/top-residential-sales/top-residential-sales-v1.jpg"
            alt="Homes in the Pahrump, Nevada area"
            fill
            quality={100}
            sizes="(min-width: 768px) 42%, 100%"
            className={styles.image}
          />
        </div>
        <div className={styles.content}>
          <p className="eyebrow">Proven Results</p>
          <h2>Top Residential Sales Last 5 Years</h2>
          <div className={styles.copy}>
            <p>
              We helped nearly 90 clients in 2021, and closed 28.5 million in
              sales!
            </p>
            <p>
              Our team works hard everyday to grow and learn, so that we may
              continue to excel in our market. Our clients deserve our best,
              &amp; we want to make sure our best is better every year.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
