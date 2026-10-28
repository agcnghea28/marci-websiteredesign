import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import FeaturedProperties from "./components/FeaturedProperties";
import GetItSold from "./components/GetItSold";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MeetMarci from "./components/MeetMarci";
import OurServices from "./components/OurServices";
import PhotoGallery from "./components/PhotoGallery";
import PropertySearch from "./components/PropertySearch";
import Testimonials from "./components/Testimonials";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <MeetMarci />
        <FeaturedProperties />
        <Testimonials />
        <GetItSold />
        <OurServices />
        <PhotoGallery />
        <PropertySearch />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
