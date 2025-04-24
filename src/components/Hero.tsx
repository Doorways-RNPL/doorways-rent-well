
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const rotatingPhrases = [
  "affordable rent.",
  "financial freedom.",
  "secure housing.",
  "flexible payments."
];

const Hero = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setPhraseIndex((prevIndex) => (prevIndex + 1) % rotatingPhrases.length);
        setIsVisible(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-background text-primary min-h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-secondary/30 opacity-90"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto md:mx-0">
          <div className="animate-fade-in">
            <span className="inline-block bg-primary text-background text-sm font-semibold px-3 py-1 rounded-full mb-6">
              Introducing Rent Now, Pay Later
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
              The doorway to{' '}
              <span className="relative overflow-hidden inline-block">
                <span className={`absolute transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} text-primary`}>
                  {rotatingPhrases[phraseIndex]}
                </span>
                <span className="invisible">affordable rent.</span>
              </span>
            </h1>
            
            <p className="text-xl text-foreground/80 mb-8 max-w-2xl">
              Get approved for your dream home with reduced upfront costs. 
              Our Rent Now, Pay Later solution creates a win-win for tenants and landlords.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                variant="secondary" 
                asChild 
                className="text-base px-8 py-6 bg-primary text-background hover:bg-primary/90"
              >
                <Link to="/apply">Apply as Tenant</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="text-base px-8 py-6 border-primary text-primary hover:bg-primary/10"
              >
                <Link to="/list-property">List Your Property</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

