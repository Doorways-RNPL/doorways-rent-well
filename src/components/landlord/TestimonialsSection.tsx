
import React from "react";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    quote: "Since using Doorways, my vacancy periods have dropped by 80%. The guaranteed payments give me peace of mind I never had before.",
    author: "Michael Johnson",
    role: "Property Owner, 12 Units"
  },
  {
    quote: "The tenant screening process is thorough and the payment guarantee means I never have to worry about late rent again.",
    author: "Sarah Williams",
    role: "Real Estate Investor"
  },
  {
    quote: "Doorways has completely transformed how I manage my rental properties. The dashboard gives me visibility I never had before.",
    author: "David Chen",
    role: "Property Manager, 30+ Units"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
          What Landlords Are Saying
        </h2>
        
        <Carousel className="max-w-4xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <TestimonialCard
                    quote={testimonial.quote}
                    author={testimonial.author}
                    role={testimonial.role}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-6">
            <CarouselPrevious className="relative static translate-y-0 mr-2" />
            <CarouselNext className="relative static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
