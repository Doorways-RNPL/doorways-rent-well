
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Ready to List Your Property?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Join thousands of property owners who've increased their rental income and reduced vacancies with Doorways.
          </p>
          <Button size="lg" asChild className="px-8 py-6 text-lg">
            <Link to="/landlord/signup">List Your Property</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
