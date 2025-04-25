
import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  image?: string;
  className?: string;
}

export function TestimonialCard({ quote, author, role, image, className }: TestimonialCardProps) {
  return (
    <Card className={cn("border-white/10 bg-white/5", className)}>
      <CardContent className="p-6">
        <div className="mb-6">
          <svg width="45" height="36" className="text-primary/60 mb-4">
            <path
              fillRule="nonzero"
              d="M13.415.043c6.852 0 11.468 4.185 11.468 9.66 0 5.51-4.244 10.658-11.468 10.658-7.325 0-11.5-5.116-11.5-10.658C1.916 4.298 6.493.043 13.415.043zm22.415 0c6.9 0 11.468 4.185 11.468 9.66 0 5.51-4.215 10.658-11.468 10.658-7.325 0-11.5-5.116-11.5-10.658C24.83 4.298 29.437.043 35.83.043z"
              fill="currentColor"
            />
          </svg>
          <p className="text-lg text-white leading-relaxed">{quote}</p>
        </div>
        <div className="flex items-center">
          {image && (
            <div className="mr-4">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <img src={image} alt={author} className="h-full w-full object-cover" />
              </div>
            </div>
          )}
          <div>
            <div className="font-semibold text-primary">{author}</div>
            <div className="text-sm text-white/70">{role}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
