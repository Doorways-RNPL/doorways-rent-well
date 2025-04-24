
import { Check } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: "Apply Online",
    description: "Complete our simple online application form with your details and property preferences.",
    icon: "📝",
  },
  {
    id: 2,
    title: "Get Approved",
    description: "Our team reviews your application and provides a quick decision on your RNPL eligibility.",
    icon: "✅",
  },
  {
    id: 3,
    title: "Move In",
    description: "Pay a reduced upfront amount and move into your new home without the financial strain.",
    icon: "🏠",
  },
  {
    id: 4,
    title: "Pay Later",
    description: "Spread your payments over time with our flexible rent-now-pay-later arrangements.",
    icon: "💰",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Doorways RNPL Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our simple process makes renting accessible with reduced upfront costs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-soft-purple rounded-full mb-4 text-3xl">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                
                {step.id < steps.length && (
                  <div className="hidden lg:block w-24 h-1 border-t-2 border-dashed border-primary/30 absolute right-[-3rem] top-1/2"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
