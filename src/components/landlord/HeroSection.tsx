
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  tagline?: string;
}

const HeroSection = ({ 
  title = "The Better Way to Manage Your Rental Properties",
  subtitle = "List your properties, find reliable tenants, and receive guaranteed monthly payments with our Rent Now, Pay Later solution.",
  tagline 
}: HeroSectionProps) => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            {title}
          </h1>
          <p className="text-xl text-white/70 mb-4">
            {subtitle}
          </p>
          {tagline && (
            <p className="text-lg text-white/60 italic">
              {tagline}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
