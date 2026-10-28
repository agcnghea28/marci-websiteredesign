import ComingSoonHero from "../components/ComingSoonHero";
import Footer from "../components/Footer";
import Header from "../components/Header";

export const metadata = {
  title: "Coming Soon | Marci Metzger Homes",
  description:
    "New real estate resources are on the way. Return to the Marci Metzger homepage or get in touch for help with buying or selling in Pahrump, Nevada.",
};

export default function ComingSoonPage() {
  return (
    <>
      <Header />
      <main>
        <ComingSoonHero />
      </main>
      <Footer />
    </>
  );
}
