
import React from 'react';
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface DeviceFrameProps {
  children: React.ReactNode;
  type: 'laptop' | 'phone';
  className?: string;
}

export function DeviceFrame({ children, type, className }: DeviceFrameProps) {
  if (type === 'laptop') {
    return (
      <div className={cn("relative mx-auto", className)}>
        <div className="relative z-10 rounded-[2rem] border-[0.6rem] border-gray-800 bg-gray-800 shadow-xl">
          <div className="absolute left-1/2 top-0 z-10 h-[0.5rem] w-[8rem] -translate-x-1/2 -translate-y-[0.3rem] rounded-b-lg bg-gray-800"></div>
          <div className="rounded-[1.4rem] bg-white overflow-hidden">
            {children}
          </div>
        </div>
        <div className="relative z-0 mx-auto h-[1rem] w-[20%] -translate-y-[0.4rem] rounded-b-xl bg-gray-800"></div>
      </div>
    );
  }

  return (
    <div className={cn("relative mx-auto", className)}>
      <div className="relative z-10 overflow-hidden rounded-[2.5rem] border-[0.5rem] border-gray-800 bg-white shadow-xl">
        <div className="absolute left-1/2 top-0 z-10 h-[1rem] w-[8rem] -translate-x-1/2 rounded-b-xl bg-gray-800"></div>
        <div className="h-full w-full overflow-hidden rounded-[2rem]">
          {children}
        </div>
      </div>
    </div>
  );
}
