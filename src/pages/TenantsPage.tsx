
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DevicePreview } from "@/components/shared/DevicePreview";
import { ComparisonTable } from "@/components/shared/ComparisonTable";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { FAQAccordion } from "@/components/shared/FAQAccordion";
import { 
  ArrowRight, 
  Calculator, 
  CreditCard, 
  Home, 
  LineChart, 
  SearchCheck, 
  ThumbsUp 
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";

const TenantsPage = () => {
  // Mock data for device previews
  const laptopScreenshots = [
    "/lovable-uploads/186c9a9d-8021-4de0-a5d7-b56ac22e40a1.png",
    "/lovable-uploads/186c9a9d-8021-4de0-a5d7-b56ac22e40a1.png", 
    "/lovable-uploads/186c9a9d-8021-4de0-a5d7-b56ac22e40a1.png",
  ];

  const phoneScreenshots = [
    "/lovable-uploads/186c9a9d-8021-4de0-a5d7-b56ac22e40a1.png",
    "/lovable-uploads/186c9a9d-8021-4de0-a5d7-b56ac22e40a1.png",
    "/lovable-uploads/186c9a9d-8021-4de0-a5d7-b56ac22e40a1.png",
  ];

  // Comparison table data
  const comparisonFeatures = [
    { 
      feature: "Upfront Move-in Costs",
      traditional: "3-4x monthly rent",
      flexible: "As low as 1x monthly rent"
    },
    { 
      feature: "Credit Building",
      traditional: false,
      flexible: true
    },
    { 
      feature: "Payment Flexibility",
      traditional: false,
      flexible: true
    },
    { 
      feature: "Access to Premium Properties",
      traditional: false,
      flexible: true
    },
    { 
      feature: "Transparent Fee Structure",
      traditional: false,
      flexible: true
    },
    { 
      feature: "No Hidden Charges",
      traditional: false,
      flexible: true
    },
  ];

  // FAQ data
  const faqItems = [
    {
      question: "How does the approval process work?",
      answer: "Our streamlined approval process reviews your application, income, and rental history. Most applicants receive a decision within 24-48 hours, and we consider more factors than just credit score.",
    },
    {
      question: "What if I don't have perfect credit?",
      answer: "Doorways considers multiple factors beyond just credit scores. Our flexible qualification criteria looks at income stability, rental payment history, and other financial indicators to determine eligibility.",
    },
    {
      question: "How much can I save on move-in costs?",
      answer: "With our Rent Now, Pay Later solution, you can save up to 70% on initial move-in costs compared to traditional rentals, which typically require first month's rent, last month's rent, and a security deposit.",
    },
    {
      question: "Can I build my credit score with Doorways?",
      answer: "Yes! We report your on-time payments to credit bureaus, helping you build or improve your credit score over time as you make your regular payments through our platform.",
    },
    {
      question: "What happens if I need to break my lease?",
      answer: "Doorways offers more flexibility than traditional leases. While standard lease terms still apply, we work with you on transfer options, subletting solutions, or early termination paths with lower penalties in many cases.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Rent Your Dream Home with Less Upfront Cost
              </h1>
              <p className="text-xl text-white/70">
                Access better housing with our flexible payment plans and reduced move-in costs. Build credit while you rent.
              </p>
            </div>

            <div className="mt-16">
              <DevicePreview
                laptopScreenshots={laptopScreenshots}
                phoneScreenshots={phoneScreenshots}
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
              How Doorways Works for Tenants
            </h2>
            
            <div className="max-w-4xl mx-auto">
              {[
                {
                  number: "01",
                  title: "Apply Online",
                  description: "Complete our simple application with your personal and financial details. We consider factors beyond just credit score.",
                  icon: <SearchCheck className="h-8 w-8 text-primary" />
                },
                {
                  number: "02",
                  title: "Get Approved",
                  description: "Receive a decision within 24-48 hours, including your approved flexible payment plan options.",
                  icon: <ThumbsUp className="h-8 w-8 text-primary" />
                },
                {
                  number: "03",
                  title: "Choose Your Payment Plan",
                  description: "Select a payment schedule that works for your budget with reduced upfront costs.",
                  icon: <Calculator className="h-8 w-8 text-primary" />
                },
                {
                  number: "04",
                  title: "Move In & Build Credit",
                  description: "Move into your new home with minimal upfront cost and build your credit as you make payments.",
                  icon: <Home className="h-8 w-8 text-primary" />
                }
              ].map((step, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full bg-white/5 border border-white/10">
                      <span className="text-xl font-bold text-primary">{step.number}</span>
                    </div>
                    <div className="flex-grow pt-2">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg">
                          {step.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-primary">{step.title}</h3>
                      </div>
                      <p className="text-white/70">{step.description}</p>
                    </div>
                  </div>
                  {index < 3 && (
                    <div className="ml-8 my-4 h-8 border-l-2 border-dashed border-white/10"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator/Payment Estimator */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 text-center">
                See How Much You Can Save
              </h2>
              <p className="text-xl text-white/70 mb-12 text-center">
                Compare traditional rental costs with Doorways' flexible payment options.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Traditional Rental</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">First Month's Rent</span>
                      <span className="text-white font-semibold">$2,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Security Deposit</span>
                      <span className="text-white font-semibold">$2,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Last Month's Rent</span>
                      <span className="text-white font-semibold">$2,000</span>
                    </div>
                    <Separator className="bg-white/10" />
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Total Upfront Cost</span>
                      <span className="text-2xl font-bold text-white">$6,000</span>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/30 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-primary mb-4">Doorways Flexible Rental</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">First Month's Rent</span>
                      <span className="text-white font-semibold">$2,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Security Deposit</span>
                      <span className="text-white font-semibold">$0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Last Month's Rent</span>
                      <span className="text-white font-semibold">$0</span>
                    </div>
                    <Separator className="bg-white/10" />
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Total Upfront Cost</span>
                      <span className="text-2xl font-bold text-primary">$2,000</span>
                    </div>
                    <div className="text-center mt-2">
                      <span className="bg-primary/20 text-primary text-sm font-medium px-2 py-1 rounded">
                        Save $4,000 upfront
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <Button asChild size="lg">
                  <Link to="/apply">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
              Benefits for Tenants
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <CreditCard className="h-8 w-8 text-primary" />,
                  title: "Reduced Upfront Costs",
                  description: "Move in with significantly less money down than traditional rentals require.",
                },
                {
                  icon: <LineChart className="h-8 w-8 text-primary" />,
                  title: "Build Your Credit",
                  description: "Improve your credit score with on-time rent payments reported to credit bureaus.",
                },
                {
                  icon: <Home className="h-8 w-8 text-primary" />,
                  title: "Better Housing Options",
                  description: "Access properties that might otherwise be out of reach due to high move-in costs.",
                },
                {
                  icon: <Calculator className="h-8 w-8 text-primary" />,
                  title: "Flexible Payment Schedule",
                  description: "Choose a payment plan that aligns with your income schedule and financial situation.",
                },
                {
                  icon: <SearchCheck className="h-8 w-8 text-primary" />,
                  title: "Streamlined Application",
                  description: "Our application process considers more factors than just credit score for approval.",
                },
                {
                  icon: <ThumbsUp className="h-8 w-8 text-primary" />,
                  title: "Transparent Terms",
                  description: "Clear pricing with no hidden fees or unexpected charges throughout your lease.",
                },
              ].map((benefit, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-lg mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-2">{benefit.title}</h3>
                  <p className="text-white/70">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
              How We Compare
            </h2>
            
            <ComparisonTable features={comparisonFeatures} />
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
              What Our Tenants Say
            </h2>
            
            <Carousel className="max-w-4xl mx-auto">
              <CarouselContent>
                {[
                  {
                    quote: "Doorways literally changed my life. I was able to move into an apartment I never thought I could afford because of the reduced upfront costs.",
                    author: "Jessica T.",
                    role: "Marketing Manager"
                  },
                  {
                    quote: "I was struggling with a low credit score, but Doorways gave me a chance. Now I'm building credit with every rent payment and my score has improved significantly.",
                    author: "Marcus L.",
                    role: "Software Developer"
                  },
                  {
                    quote: "The flexible payment schedule works perfectly with my irregular freelance income. I can finally budget properly without stress.",
                    author: "Alicia R.",
                    role: "Freelance Designer"
                  }
                ].map((testimonial, index) => (
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

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
                Frequently Asked Questions
              </h2>
              
              <FAQAccordion items={faqItems} />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Ready to Find Your New Home?
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Join thousands of tenants who are saving on move-in costs and building credit with Doorways.
              </p>
              <Button size="lg" asChild className="px-8 py-6 text-lg">
                <Link to="/apply">Apply as Tenant</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TenantsPage;
