
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LandlordsSection = () => {
  return (
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
            {[
              {
                icon: "📋",
                title: "List Your Property",
                description: "Create an account and add your property details to our platform, including rent amount, property images, and amenities."
              },
              {
                icon: "👥",
                title: "Review Applications",
                description: "Receive applications from pre-screened tenants and review their profiles, including RNPL eligibility status."
              },
              {
                icon: "✨",
                title: "Accept Tenants",
                description: "Select the tenant that's right for your property with the confidence that they've been vetted by our system."
              },
              {
                icon: "💸",
                title: "Receive Guaranteed Payments",
                description: "Enjoy consistent, on-time rent payments while we manage the tenant's RNPL arrangement."
              }
            ].map((step, index) => (
              <div key={index} className="animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full text-2xl">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-2">{step.title}</h3>
                    <p className="text-white/70">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-6">
              <Button asChild size="lg" className="bg-white/10 text-white border border-white/20 hover:bg-white/20">
                <Link to="/list-property">List Your Property</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandlordsSection;
