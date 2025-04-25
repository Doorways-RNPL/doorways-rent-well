
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landlord/HeroSection";
import StatisticsSection from "@/components/landlord/StatisticsSection";
import FeaturesSection from "@/components/landlord/FeaturesSection";
import TestimonialsSection from "@/components/landlord/TestimonialsSection";
import FAQSection from "@/components/landlord/FAQSection";
import CTASection from "@/components/landlord/CTASection";
import { ComparisonTable } from "@/components/shared/ComparisonTable";

const LandlordsPage = () => {
  const comparisonFeatures = [
    { 
      feature: "First Month's Rent",
      traditional: "R6,000",
      flexible: "R6,000"
    },
    { 
      feature: "Security Deposit",
      traditional: "R6,000",
      flexible: "R0"
    },
    { 
      feature: "Admin / Lease Fees",
      traditional: "R1,000",
      flexible: "R0"
    },
    { 
      feature: "Total Upfront Cost",
      traditional: "R13,000",
      flexible: "R6,000"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection 
          title="Why Pay R13,000 Just to Move In?"
          subtitle="Doorways cuts the upfront cost — not the comfort."
          tagline="Save When You Move with Doorways."
        />
        <StatisticsSection />
        <FeaturesSection />
        
        {/* Comparison Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
              Compare the Old Way vs. the Smart Way
            </h2>
            
            <ComparisonTable features={comparisonFeatures} />
          </div>
        </section>

        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandlordsPage;
