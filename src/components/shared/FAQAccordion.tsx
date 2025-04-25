
import React from 'react';
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export function FAQAccordion({ items, className }: FAQAccordionProps) {
  return (
    <Accordion type="single" collapsible className={cn("w-full", className)}>
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
          <AccordionTrigger className="text-white text-left">{item.question}</AccordionTrigger>
          <AccordionContent className="text-white/70">{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
