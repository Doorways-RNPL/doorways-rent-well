
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import StakeholderValue from "@/components/StakeholderValue";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <HowItWorks />
        <StakeholderValue />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
