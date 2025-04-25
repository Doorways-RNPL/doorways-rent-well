
import React from "react";
import { StatisticCard } from "@/components/shared/StatisticCard";
import { BuildingIcon, CalendarIcon, CreditCardIcon, PercentIcon } from "lucide-react";

const StatisticsSection = () => {
  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
          Landlord Dashboard Highlights
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatisticCard
            icon={<BuildingIcon className="h-6 w-6" />}
            value="100%"
            label="Occupancy Rate"
            description="Maintain full occupancy with our tenant matching system"
          />
          <StatisticCard
            icon={<CalendarIcon className="h-6 w-6" />}
            value="14 Days"
            label="Average Fill Time"
            description="Find pre-qualified tenants for your properties faster"
          />
          <StatisticCard
            icon={<CreditCardIcon className="h-6 w-6" />}
            value="100%"
            label="Payment Guarantee"
            description="Receive your rent payments on time, every time"
          />
          <StatisticCard
            icon={<PercentIcon className="h-6 w-6" />}
            value="24%"
            label="Higher Returns"
            description="Increased annual returns compared to traditional rentals"
          />
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
