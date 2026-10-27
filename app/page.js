import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import FeaturedProperties from "./components/FeaturedProperties";
import HomeSellers from "./components/HomeSellers";
import Header from "./components/Header";
import Hero from "./components/Hero";
import GuideToBuyers from "./components/GuideToBuyers";
import MeetMarci from "./components/MeetMarci";
import OurServices from "./components/OurServices";
import PhotoGallery from "./components/PhotoGallery";
import Testimonials from "./components/Testimonials";
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
        <Testimonials />
        <PhotoGallery />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
