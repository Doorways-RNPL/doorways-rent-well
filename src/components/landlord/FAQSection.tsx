
import React from "react";
import { FAQAccordion } from "@/components/shared/FAQAccordion";

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

const FAQSection = () => {
  return (
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
  );
};

export default FAQSection;
