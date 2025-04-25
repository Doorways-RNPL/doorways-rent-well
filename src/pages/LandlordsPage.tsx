
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DevicePreview } from "@/components/shared/DevicePreview";
import { StatisticCard } from "@/components/shared/StatisticCard";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { FAQAccordion } from "@/components/shared/FAQAccordion";
import { Building, Calendar, CreditCard, Home, Percent, PieChart, Users } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const LandlordsPage = () => {
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

  // FAQ data
  const faqItems = [
    {
      question: "How does Doorways protect me as a landlord?",
      answer: "Doorways provides guaranteed monthly payments, thorough tenant screening, insurance coverage for property damage, and a dedicated support team to handle any issues that may arise.",
    },
    {
      question: "What happens if a tenant can't make their payments?",
      answer: "As a landlord, you will still receive your monthly rent payment regardless of the tenant's payment status. Doorways assumes the risk and handles any payment recovery with the tenant directly.",
    },
    {
      question: "How quickly can I get my property listed?",
      answer: "Most properties can be listed within 24 hours of completing our simple online application process. Our team works quickly to review your property details and make it available to potential tenants.",
    },
    {
      question: "What types of properties can I list on Doorways?",
      answer: "Doorways accepts a wide range of residential properties including apartments, houses, condos, townhouses, and multi-family units. Commercial properties are not currently supported.",
    },
    {
      question: "Are there any fees for landlords?",
      answer: "Doorways charges a small percentage of the monthly rent as a service fee, which covers tenant screening, payment guarantees, and property marketing. There are no upfront costs to list your property.",
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
                The Better Way to Manage Your Rental Properties
              </h1>
              <p className="text-xl text-white/70">
                List your properties, find reliable tenants, and receive guaranteed monthly payments with our Rent Now, Pay Later solution.
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

        {/* Statistics Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
              Landlord Dashboard Highlights
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatisticCard
                icon={<Building className="h-6 w-6" />}
                value="100%"
                label="Occupancy Rate"
                description="Maintain full occupancy with our tenant matching system"
              />
              <StatisticCard
                icon={<Calendar className="h-6 w-6" />}
                value="14 Days"
                label="Average Fill Time"
                description="Find pre-qualified tenants for your properties faster"
              />
              <StatisticCard
                icon={<CreditCard className="h-6 w-6" />}
                value="100%"
                label="Payment Guarantee"
                description="Receive your rent payments on time, every time"
              />
              <StatisticCard
                icon={<Percent className="h-6 w-6" />}
                value="24%"
                label="Higher Returns"
                description="Increased annual returns compared to traditional rentals"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
              Powerful Tools for Property Owners
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Home className="h-8 w-8 text-primary" />,
                  title: "Property Management",
                  description: "Easily add and manage multiple properties from a single dashboard with detailed analytics and insights.",
                },
                {
                  icon: <Users className="h-8 w-8 text-primary" />,
                  title: "Tenant Screening",
                  description: "Access comprehensive tenant screening reports including credit, background, and rental history verification.",
                },
                {
                  icon: <CreditCard className="h-8 w-8 text-primary" />,
                  title: "Guaranteed Payments",
                  description: "Receive rent payments on schedule, regardless of when the tenant pays their flexible installments.",
                },
                {
                  icon: <Calendar className="h-8 w-8 text-primary" />,
                  title: "Maintenance Requests",
                  description: "Streamline maintenance communication and tracking through our integrated request system.",
                },
                {
                  icon: <PieChart className="h-8 w-8 text-primary" />,
                  title: "Financial Reporting",
                  description: "Generate detailed financial reports for income tracking, tax purposes, and property performance.",
                },
                {
                  icon: <Building className="h-8 w-8 text-primary" />,
                  title: "Market Insights",
                  description: "Get data-driven recommendations on optimal pricing and amenities based on local market conditions.",
                },
              ].map((feature, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-lg mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-2">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
              What Landlords Are Saying
            </h2>
            
            <Carousel className="max-w-4xl mx-auto">
              <CarouselContent>
                {[
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
                Ready to List Your Property?
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Join thousands of property owners who've increased their rental income and reduced vacancies with Doorways.
              </p>
              <Button size="lg" asChild className="px-8 py-6 text-lg">
                <Link to="/list-property">List Your Property</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandlordsPage;
