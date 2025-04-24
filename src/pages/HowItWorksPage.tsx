
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/how-it-works/HeroSection";
import TenantsSection from "@/components/how-it-works/TenantsSection";
import LandlordsSection from "@/components/how-it-works/LandlordsSection";
import CallToActionSection from "@/components/how-it-works/CallToActionSection";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <TenantsSection />
        <LandlordsSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
