
import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatisticCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  description?: string;
  className?: string;
}

export function StatisticCard({ icon, value, label, description, className }: StatisticCardProps) {
  return (
    <Card className={cn("overflow-hidden border-white/10 bg-white/5", className)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 rounded-full bg-primary/20 p-3 text-primary">
            {icon}
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">{value}</div>
            <div className="text-lg font-medium text-white mt-1">{label}</div>
            {description && (
              <p className="mt-2 text-sm text-white/70">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
