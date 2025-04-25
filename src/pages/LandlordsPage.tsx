
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landlord/HeroSection";
import StatisticsSection from "@/components/landlord/StatisticsSection";
import FeaturesSection from "@/components/landlord/FeaturesSection";
import TestimonialsSection from "@/components/landlord/TestimonialsSection";
import FAQSection from "@/components/landlord/FAQSection";
import CTASection from "@/components/landlord/CTASection";

const LandlordsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <StatisticsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandlordsPage;
