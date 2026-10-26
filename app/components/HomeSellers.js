import Image from "next/image";
import styles from "./HomeSellers.module.css";

export default function HomeSellers() {
  return (
    <section id="sellers" className="section">
      <div className={styles.layout}>
        <div className={styles.content}>
          <p className="eyebrow eyebrow--on-dark">For Home Sellers</p>
          <h2>Don&apos;t Just List It</h2>
          <div className={styles.copy}>
            <p>Get it SOLD!</p>
            <p>
              We exhaust every avenue to ensure our listings are at the
              fingertips of every possible buyer, getting you top dollar for your
              home.
            </p>
          </div>
          <a href="#contact" className="btn btn--primary btn--on-dark">
            Let&apos;s Talk About Selling
          </a>
        </div>
        <div className={styles.imageWrap}>
          <Image
            src="/images/hero/hero.webp"
            alt=""
            fill
            sizes="(min-width: 768px) 50%, 100%"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
