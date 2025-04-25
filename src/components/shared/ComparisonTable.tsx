
import React from 'react';
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface ComparisonFeature {
  feature: string;
  traditional: boolean | string;
  flexible: boolean | string;
}

interface ComparisonTableProps {
  features: ComparisonFeature[];
  className?: string;
}

export function ComparisonTable({ features, className }: ComparisonTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-background text-left p-4 text-white font-medium border-b border-white/10">Feature</th>
            <th className="bg-background text-center p-4 text-white font-medium border-b border-white/10">Traditional Rental</th>
            <th className="bg-background text-center p-4 text-white font-medium border-b border-white/10">Doorways Flexible Rental</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-white/5" : "bg-background"}>
              <td className="p-4 text-white border-b border-white/10">{feature.feature}</td>
              <td className="p-4 text-center border-b border-white/10">
                {typeof feature.traditional === 'boolean' ? (
                  feature.traditional ? (
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  )
                ) : (
                  <span className="text-white/70">{feature.traditional}</span>
                )}
              </td>
              <td className="p-4 text-center border-b border-white/10">
                {typeof feature.flexible === 'boolean' ? (
                  feature.flexible ? (
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  )
                ) : (
                  <span className="text-white/70">{feature.flexible}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
