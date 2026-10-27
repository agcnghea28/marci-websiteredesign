import Image from "next/image";
import styles from "./OurServices.module.css";

function formatCardIndex(position) {
  return String(position).padStart(2, "0");
}

export default function ServiceCard({ service, index }) {
  const cardIndex = formatCardIndex(index);

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Image
          src={service.image}
          alt={service.imageAlt ?? ""}
          fill
          quality={100}
          unoptimized
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className={styles.image}
          style={{ objectPosition: service.imagePosition }}
        />
        <span className={styles.overlay} aria-hidden="true" />
      </div>
      <div className={styles.cardHeader}>
        <span className={styles.cardIndex}>{cardIndex}</span>
        <span className={styles.cardIndexLine} aria-hidden="true" />
      </div>
      <div className={styles.content}>
        <h3 className={styles.cardTitle}>{service.title}</h3>
        <p className={styles.description}>{service.description}</p>
      </div>
    </article>
  );
}
