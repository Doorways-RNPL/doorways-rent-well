
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-background text-primary min-h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-white/10 opacity-90"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <div className="animate-fade-in">
            <span className="inline-block bg-white/10 text-white border border-white/20 text-sm font-semibold px-3 py-1 rounded-full mb-6">
              How Doorways RNPL Works
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
              Making Housing More Accessible
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              Our Rent Now, Pay Later solution creates a win-win situation for both tenants 
              and landlords through a simple, transparent process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
