
import React from "react";
import {
  Award,
  BarChart2,
  DollarSign,
  Lock,
  MessageSquare,
  TrendingUp,
  Users,
  HeadphonesIcon,
} from "lucide-react";

const features = [
  {
    icon: <Lock className="h-8 w-8 text-primary" />,
    title: "Reliable, On-Time Payments",
    description: "Get paid every month without chasing tenants. Payments are guaranteed through the RNPL model with lower default risk due to tenant vetting and reward incentives.",
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    title: "Fill Vacancies Faster",
    description: "Attract a broader pool of renters, including reliable but cash-constrained tenants. Higher occupancy means better rental yield and asset performance.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Pre-Vetted Tenants",
    description: "All RNPL applicants are screened for risk using employment, lease, and payment history. View a scorecard with supporting documents before accepting a tenant.",
  },
  {
    icon: <BarChart2 className="h-8 w-8 text-primary" />,
    title: "Less Admin, More Control",
    description: "List properties in minutes, invite tenants via shareable links, track payment history, and reduce back-and-forth via clear tenant status updates.",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: "Tenant Engagement Tools",
    description: "Send reminders or announcements via platform. Chat function and status badges improve communication without needing WhatsApp or SMS.",
  },
  {
    icon: <DollarSign className="h-8 w-8 text-primary" />,
    title: "Data-Driven Insights",
    description: "Visual dashboards show monthly collections, occupancy trends, and unit performance. Export reports for tax, accounting, or performance tracking.",
  },
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: "Reputation Building & Priority Listing",
    description: "Consistently participating landlords can be marked as 'Preferred' or 'Top Rated'. Their properties get priority visibility to high-quality tenants.",
  },
  {
    icon: <HeadphonesIcon className="h-8 w-8 text-primary" />,
    title: "Support for Growth",
    description: "RNPL opens the door for portfolio landlords and developers to lease faster and at scale. Ideal for off-plan or newly completed projects.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
          Powerful Tools for Landlords
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
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
  );
};

export default FeaturesSection;
