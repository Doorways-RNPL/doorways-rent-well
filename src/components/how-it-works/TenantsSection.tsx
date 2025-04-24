
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TenantsSection = () => {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-16 text-center">For Tenants</h2>
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            {[
              {
                icon: "📝",
                title: "Apply Online",
                description: "Fill out our simple online application form with your personal details, rental history, and income information."
              },
              {
                icon: "✅",
                title: "Get Approved",
                description: "Our team reviews your application and provides a quick decision on your RNPL eligibility, typically within 24-48 hours."
              },
              {
                icon: "💰",
                title: "Pay Reduced Upfront Amount",
                description: "Once approved, you'll pay a significantly reduced initial amount compared to traditional move-in costs."
              },
              {
                icon: "🏠",
                title: "Move In & Pay Over Time",
                description: "Move into your new home and pay the remainder of your initial costs over time, based on your personalized payment plan."
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
  );
};

export default TenantsSection;
