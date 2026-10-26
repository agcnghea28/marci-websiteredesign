import FeaturedProperties from "./components/FeaturedProperties";
import HomeSellers from "./components/HomeSellers";
import Header from "./components/Header";
import Hero from "./components/Hero";
import GuideToBuyers from "./components/GuideToBuyers";
import MeetMarci from "./components/MeetMarci";
import OurServices from "./components/OurServices";
import TopResidentialSales from "./components/TopResidentialSales";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedProperties />
        <TopResidentialSales />
        <HomeSellers />
        <GuideToBuyers />
        <OurServices />
        <MeetMarci />
        <section id="testimonials" className="section">
          <div className="container">
            <p className="caption">Testimonials (placeholder)</p>
          </div>
        </section>
        <section id="blog" className="section">
          <div className="container">
            <p className="caption">Blog (placeholder)</p>
          </div>
        </section>
        <section id="contact" className="section">
          <div className="container">
            <p className="caption">Contact (placeholder)</p>
          </div>
        </section>
      </main>
    </>
  );
}
