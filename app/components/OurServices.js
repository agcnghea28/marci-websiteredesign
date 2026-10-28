import ServiceCard from "./ServiceCard";
import styles from "./OurServices.module.css";

const SERVICES = [
  {
    id: "real-estate-done-right",
    title: "Real Estate Done Right",
    description:
      "Nervous about your property adventure? Don\u2019t be. Whether you're getting ready to buy or sell your home, exploring investment properties, or just curious about the market, Marci is here to help you have the best experience possible!",
    image: "/images/our-services/real-estate-done-right.jpg",
    imageAlt:
      "Clients shaking hands at a real estate closing with a laptop on the table",
    imagePosition: "center",
  },
  {
    id: "commercial-residential",
    title: "Commercial & Residential",
    description:
      "Large or small, condo or mansion, Marci can find it and get it at the price that's right. Fixer-uppers? Luxury? Marci can help with all of it! She lives, works, and plays in this community. She's happy to help you find where to put your hard-earned dollars.",
    image: "/images/our-services/commercial-residential.jpg",
    imageAlt:
      "Modern home with pool and mountain views",
    imagePosition: "center",
  },
  {
    id: "rely-on-expertise",
    title: "Rely on Expertise",
    description:
      "If you have questions about affordability, credit, or loan options, Marci can connect you with the right professionals to get the answers you need in a timely manner. She wants to make sure you feel confident and informed every step of the way.",
    image: "/images/our-services/rely-on-expertise.jpg",
    imageAlt: "Stylish living room coffee table with plants and decor",
    imagePosition: "center",
  },
];

export default function OurServices() {
  return (
    <section id="services" className={`section ${styles.section}`}>
      <div className={styles.inner}>
        <header className={styles.intro}>
          <p className="eyebrow eyebrow--on-dark">Real Estate Services</p>
          <h2 className={styles.heading}>What Marci Offers</h2>
        </header>
        <ul className={styles.grid}>
          {SERVICES.map((service, index) => (
            <li key={service.id}>
              <ServiceCard service={service} index={index + 1} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
