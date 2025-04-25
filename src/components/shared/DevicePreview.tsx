
import React, { useState } from 'react';
import { DeviceFrame } from './DeviceFrame';
import { Button } from "@/components/ui/button";
import { Laptop, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";

interface DevicePreviewProps {
  laptopScreenshots: string[];
  phoneScreenshots: string[];
  className?: string;
  defaultDevice?: 'laptop' | 'phone';
}

export function DevicePreview({ 
  laptopScreenshots, 
  phoneScreenshots, 
  className,
  defaultDevice = 'laptop'
}: DevicePreviewProps) {
  const [deviceType, setDeviceType] = useState<'laptop' | 'phone'>(defaultDevice);
  
  const screenshots = deviceType === 'laptop' ? laptopScreenshots : phoneScreenshots;

  // Check if screenshots array is empty
  const hasScreenshots = screenshots && screenshots.length > 0;

  return (
    <div className={cn("flex flex-col items-center space-y-6", className)}>
      <div className="flex items-center justify-center space-x-2">
        <Button 
          variant={deviceType === 'laptop' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setDeviceType('laptop')}
        >
          <Laptop className="h-4 w-4 mr-2" />
          Desktop
        </Button>
        <Button 
          variant={deviceType === 'phone' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setDeviceType('phone')}
        >
          <Smartphone className="h-4 w-4 mr-2" />
          Mobile
        </Button>
      </div>
      
      <div className="w-full max-w-3xl">
        <Carousel>
          <CarouselContent>
            {hasScreenshots ? (
              screenshots.map((screenshot, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    {deviceType === 'laptop' ? (
                      <DeviceFrame type="laptop">
                        <AspectRatio ratio={16/10}>
                          <img 
                            src={screenshot} 
                            alt={`Dashboard preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </AspectRatio>
                      </DeviceFrame>
                    ) : (
                      <div className="flex justify-center">
                        <div className="w-[50%]">
                          <DeviceFrame type="phone">
                            <AspectRatio ratio={9/16}>
                              <img 
                                src={screenshot} 
                                alt={`Dashboard preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </AspectRatio>
                          </DeviceFrame>
                        </div>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <div className="p-1">
                  {deviceType === 'laptop' ? (
                    <DeviceFrame type="laptop">
                      <AspectRatio ratio={16/10}>
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center text-primary p-6">
                          <p className="text-center">Dashboard preview not available</p>
                        </div>
                      </AspectRatio>
                    </DeviceFrame>
                  ) : (
                    <div className="flex justify-center">
                      <div className="w-[50%]">
                        <DeviceFrame type="phone">
                          <AspectRatio ratio={9/16}>
                            <div className="w-full h-full bg-gray-900 flex items-center justify-center text-primary p-6">
                              <p className="text-center">Dashboard preview not available</p>
                            </div>
                          </AspectRatio>
                        </DeviceFrame>
                      </div>
                    </div>
                  )}
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          <div className="flex justify-center mt-4">
            <CarouselPrevious className="relative -left-0 translate-y-0 position-static mr-2" />
            <CarouselNext className="relative -right-0 translate-y-0 position-static" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
