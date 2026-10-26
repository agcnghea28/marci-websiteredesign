import ServiceCard from "./ServiceCard";
import styles from "./OurServices.module.css";

const SERVICES = [
  {
    id: "real-estate-done-right",
    title: "Real Estate Done Right",
    description:
      "Nervous about your property adventure? Don\u2019t be. Whether you're getting ready to buy or sell your residence, looking at investment properties, or just curious about the markets, our team ensures you get the best experience possible!",
    image: "/images/hero/hero.webp",
    imagePosition: "center",
  },
  {
    id: "commercial-residential",
    title: "Commercial & Residential",
    description:
      "Large or small, condo or mansion, we can find it and get at the price that's right. Fixer-uppers? Luxury? We can help with all of it! We live, work, and play in this community. Happy to help you find where to put you hard-earned dollars.",
    image: "/images/hero/hero.webp",
    imagePosition: "80% center",
  },
  {
    id: "rely-on-expertise",
    title: "Rely on Expertise",
    description:
      "If you have questions about affordability, credit, and loan options, trust us to connect you with the right people to get the answers you need in a timely fashion. We make sure you feel confident and educated every step of the way.",
    image: "/images/hero/hero.webp",
    imagePosition: "20% center",
  },
];

export default function OurServices() {
  return (
    <section id="services" className={`section ${styles.section}`}>
      <h2 className={styles.heading}>Our Services</h2>
      <ul className={styles.grid}>
        {SERVICES.map((service, index) => (
          <li key={service.id}>
            <ServiceCard service={service} index={index + 1} />
          </li>
        ))}
      </ul>
    </section>
  );
}
