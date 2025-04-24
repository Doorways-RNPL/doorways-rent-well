
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Rental Experience?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you're looking for a new place to live or want to list your property, 
            Doorways RNPL is here to make the process smoother and more accessible.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild className="text-base px-8 py-6 bg-white text-primary hover:bg-white/90">
              <Link to="/apply">Apply as Tenant</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base px-8 py-6 border-white text-white hover:bg-white/10">
              <Link to="/list-property">List Your Property</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
