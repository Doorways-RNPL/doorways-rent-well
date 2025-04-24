
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    id: 1,
    content: "Doorways RNPL changed my life. I was able to move into my dream apartment without emptying my savings account.",
    author: "Sarah J.",
    role: "Tenant",
  },
  {
    id: 2,
    content: "As a landlord, I've seen a 40% reduction in vacancy periods and haven't had to worry about missed payments since using Doorways.",
    author: "Michael T.",
    role: "Landlord",
  },
  {
    id: 3,
    content: "The platform streamlined our tenant onboarding process and improved our cash flow predictability significantly.",
    author: "Rachel K.",
    role: "Property Manager",
  },
  {
    id: 4,
    content: "We've been able to attract more qualified tenants to our new development thanks to the RNPL option.",
    author: "David L.",
    role: "Developer",
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What People Are Saying</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from tenants, landlords, and partners who have transformed their rental experience.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                    <Card className="border-none shadow-lg bg-gradient-to-br from-white to-soft-purple">
                      <CardContent className="p-8">
                        <div className="flex flex-col items-center text-center">
                          <svg className="w-12 h-12 text-primary/30 mb-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                          <p className="text-lg text-gray-700 mb-6">{testimonial.content}</p>
                          <div className="mt-4">
                            <p className="font-semibold text-gray-900">{testimonial.author}</p>
                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeIndex ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 md:px-0">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/80 backdrop-blur-sm"
                onClick={prevTestimonial}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                <span className="sr-only">Previous</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/80 backdrop-blur-sm"
                onClick={nextTestimonial}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
