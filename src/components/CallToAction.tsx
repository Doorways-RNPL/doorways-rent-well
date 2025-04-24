
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <div className="relative overflow-hidden bg-background text-primary min-h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-white/10 opacity-90"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto md:mx-0">
          <div className="animate-fade-in">
            <span className="inline-block bg-white/10 text-white border border-white/20 text-sm font-semibold px-3 py-1 rounded-full mb-6">
              Join Doorways RNPL Today
            </span>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
              Transform Your Rental Experience
            </h2>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              Whether you're looking for a new place to live or want to list your property, 
              Doorways RNPL is here to make the process smoother and more accessible.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                variant="secondary" 
                asChild 
                className="text-base px-8 py-6 bg-white/10 text-white border border-white/20 hover:bg-white/20"
              >
                <Link to="/apply">Apply as Tenant</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="text-base px-8 py-6 border-white/30 text-white hover:bg-white/10"
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

export default CallToAction;
