
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            The Better Way to Manage Your Rental Properties
          </h1>
          <p className="text-xl text-white/70">
            List your properties, find reliable tenants, and receive guaranteed monthly payments with our Rent Now, Pay Later solution.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
