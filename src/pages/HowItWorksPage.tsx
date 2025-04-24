
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-background text-primary min-h-[90vh] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-white/10 opacity-90"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="animate-fade-in">
                <span className="inline-block bg-white/10 text-white border border-white/20 text-sm font-semibold px-3 py-1 rounded-full mb-6">
                  How Doorways RNPL Works
                </span>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
                  Making Housing More Accessible
                </h1>
                
                <p className="text-xl text-white/80 mb-8 max-w-2xl">
                  Our Rent Now, Pay Later solution creates a win-win situation for both tenants 
                  and landlords through a simple, transparent process.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* For Tenants Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-16 text-center">For Tenants</h2>
            
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="animate-fade-in">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full text-2xl">
                      📝
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-2">Apply Online</h3>
                      <p className="text-white/70">
                        Fill out our simple online application form with your personal details, rental history, and income information.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="animate-fade-in [--tw-animate-delay:200ms]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full text-2xl">
                      ✅
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-2">Get Approved</h3>
                      <p className="text-white/70">
                        Our team reviews your application and provides a quick decision on your RNPL eligibility, typically within 24-48 hours.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="animate-fade-in [--tw-animate-delay:400ms]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full text-2xl">
                      💰
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-2">Pay Reduced Upfront Amount</h3>
                      <p className="text-white/70">
                        Once approved, you'll pay a significantly reduced initial amount compared to traditional move-in costs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="animate-fade-in [--tw-animate-delay:600ms]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full text-2xl">
                      🏠
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-2">Move In & Pay Over Time</h3>
                      <p className="text-white/70">
                        Move into your new home and pay the remainder of your initial costs over time, based on your personalized payment plan.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button asChild size="lg" className="bg-white/10 text-white border border-white/20 hover:bg-white/20">
                    <Link to="/apply">Apply as Tenant</Link>
                  </Button>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-8 border border-white/10">
                <h3 className="text-xl font-semibold text-primary mb-6">Benefits for Tenants:</h3>
                <ul className="space-y-4">
                  {[
                    "Significantly reduced upfront move-in costs",
                    "Access to better quality housing",
                    "Flexible payment plans tailored to your needs",
                    "Build your credit score through on-time payments",
                    "Transparent payment timeline with no hidden fees"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-black mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="text-white/70">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* For Landlords Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-16 text-center">For Landlords</h2>
            
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="bg-white/5 rounded-xl p-8 border border-white/10 order-2 md:order-1">
                <h3 className="text-xl font-semibold text-primary mb-6">Benefits for Landlords:</h3>
                <ul className="space-y-4">
                  {[
                    "Guaranteed monthly payments",
                    "Larger pool of qualified tenants",
                    "Reduced vacancy periods",
                    "Protection against payment defaults",
                    "Simplified tenant management process"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-black mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="text-white/70">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-8 order-1 md:order-2">
                <div className="animate-fade-in">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full text-2xl">
                      📋
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-2">List Your Property</h3>
                      <p className="text-white/70">
                        Create an account and add your property details to our platform, including rent amount, property images, and amenities.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="animate-fade-in [--tw-animate-delay:200ms]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full text-2xl">
                      👥
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-2">Review Applications</h3>
                      <p className="text-white/70">
                        Receive applications from pre-screened tenants and review their profiles, including RNPL eligibility status.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="animate-fade-in [--tw-animate-delay:400ms]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full text-2xl">
                      ✨
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-2">Accept Tenants</h3>
                      <p className="text-white/70">
                        Select the tenant that's right for your property with the confidence that they've been vetted by our system.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="animate-fade-in [--tw-animate-delay:600ms]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full text-2xl">
                      💸
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-2">Receive Guaranteed Payments</h3>
                      <p className="text-white/70">
                        Enjoy consistent, on-time rent payments while we manage the tenant's RNPL arrangement.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button asChild size="lg" className="bg-white/10 text-white border border-white/20 hover:bg-white/20">
                    <Link to="/list-property">List Your Property</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="relative overflow-hidden bg-background text-primary min-h-[50vh] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-white/10 opacity-90"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="animate-fade-in">
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                  Ready to Get Started?
                </h2>
                
                <p className="text-xl text-white/80 mb-8">
                  Whether you're looking for a new place to live or want to list your property, 
                  Doorways RNPL is here to make the process smoother and more accessible.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    asChild 
                    className="text-base px-8 py-6 bg-white/10 text-white border border-white/20 hover:bg-white/20"
                  >
                    <Link to="/apply">Apply as Tenant</Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    asChild 
                    className="text-base px-8 py-6 border-white/30 text-white hover:bg-white/10"
                  >
                    <Link to="/list-property">List Your Property</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
