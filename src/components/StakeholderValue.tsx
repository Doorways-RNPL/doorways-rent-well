
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const stakeholders = [
  {
    id: 1,
    title: "Tenants",
    description: "Access housing affordably with reduced upfront costs.",
    benefits: [
      "Lower initial payment to move in",
      "Flexible payment schedules",
      "Build credit through on-time payments",
      "Access better quality housing",
    ],
    bgColor: "bg-soft-purple",
  },
  {
    id: 2,
    title: "Landlords",
    description: "Secure reliable tenants and consistent income.",
    benefits: [
      "Guaranteed monthly payments",
      "Larger pool of qualified tenants",
      "Reduced vacancy periods",
      "Protection against payment defaults",
    ],
    bgColor: "bg-soft-blue",
  },
  {
    id: 3,
    title: "Property Managers",
    description: "Streamline operations and increase property value.",
    benefits: [
      "Simplified tenant screening process",
      "Reduced administrative burden",
      "Decreased turnover rates",
      "Enhanced property appeal",
    ],
    bgColor: "bg-soft-green",
  },
  {
    id: 4,
    title: "Developers",
    description: "Attract more buyers and increase property marketability.",
    benefits: [
      "Differentiate your properties in the market",
      "Accelerate sales process",
      "Increase buyer confidence",
      "Create additional value proposition",
    ],
    bgColor: "bg-soft-orange",
  },
];

const StakeholderValue = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Who Doorways RNPL Is For</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Our platform creates value for everyone in the rental ecosystem.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stakeholders.map((stakeholder) => (
            <Card key={stakeholder.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <CardHeader className="p-6">
                <CardTitle className="text-xl font-bold text-primary">{stakeholder.title}</CardTitle>
                <CardDescription className="text-white/70 mt-2">
                  {stakeholder.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {stakeholder.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="text-white/80">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StakeholderValue;
