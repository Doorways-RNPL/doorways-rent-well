import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from "@/components/AuthProvider";
import { ArrowRight, User, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const rotatingPhrases = [
  "affordable rent.",
  "financial freedom.",
  "secure housing.",
  "flexible payments."
];

const Hero = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { user } = useAuth();

  // Check if user already has a role
  useEffect(() => {
    const role = localStorage.getItem("user-role");
    setUserRole(role);
  }, []);

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
    <div className="relative overflow-hidden bg-background text-primary min-h-[90vh] flex items-center py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-white/10 opacity-90"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-12">
            <div className="animate-fade-in space-y-8">
              <span className="inline-block bg-white/10 text-white border border-white/20 text-sm font-semibold px-3 py-1 rounded-full">
                Introducing Rent Now, Pay Later
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
                The doorway to{' '}
                <span className="relative overflow-hidden inline-block">
                  <span className={`absolute transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} text-white/90`}>
                    {rotatingPhrases[phraseIndex]}
                  </span>
                  <span className="invisible">affordable rent.</span>
                </span>
              </h1>
              
              <p className="text-xl text-white/80 max-w-2xl">
                Get approved for your dream home with reduced upfront costs. 
                Our Rent Now, Pay Later solution creates a win-win for tenants and landlords.
              </p>
              
              {!user ? (
                <>
                  <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
                    <Card className="border-white/20 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer">
                      <Link to="/auth" className="block h-full">
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 mb-2">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <CardTitle className="text-base text-primary">I'm Looking for a Home</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <CardDescription className="text-white/70 text-sm">
                            Apply as a tenant with reduced upfront costs and flexible payment options.
                          </CardDescription>
                          <div className="flex items-center mt-3 text-primary text-sm">
                            <span>Get started</span>
                            <ArrowRight className="ml-2 h-3 w-3" />
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                    
                    <Card className="border-white/20 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer">
                      <Link to="/auth" className="block h-full">
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 mb-2">
                            <Home className="h-4 w-4 text-primary" />
                          </div>
                          <CardTitle className="text-base text-primary">I'm a Property Owner</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <CardDescription className="text-white/70 text-sm">
                            List your property and find reliable tenants while reducing vacancy rates.
                          </CardDescription>
                          <div className="flex items-center mt-3 text-primary text-sm">
                            <span>List your property</span>
                            <ArrowRight className="ml-2 h-3 w-3" />
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-start pt-4">
                    <Button 
                      size="lg" 
                      asChild 
                      className="text-base px-6 py-5 bg-primary text-black hover:bg-primary/90"
                    >
                      <Link to="/auth">Create an Account</Link>
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      asChild 
                      className="text-base px-6 py-5 border-white/30 text-white hover:bg-white/10"
                    >
                      <Link to="/how-it-works">Learn How It Works</Link>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  {userRole === 'tenant' ? (
                    <>
                      <Button 
                        size="lg" 
                        asChild 
                        className="text-base px-8 py-6 bg-primary text-black hover:bg-primary/90"
                      >
                        <Link to="/tenant/application">Continue Application</Link>
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        asChild 
                        className="text-base px-8 py-6 border-white/30 text-white hover:bg-white/10"
                      >
                        <Link to="/tenant/dashboard">View Dashboard</Link>
                      </Button>
                    </>
                  ) : userRole === 'landlord' ? (
                    <>
                      <Button 
                        size="lg" 
                        asChild 
                        className="text-base px-8 py-6 bg-primary text-black hover:bg-primary/90"
                      >
                        <Link to="/list-property">List Your Property</Link>
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        asChild 
                        className="text-base px-8 py-6 border-white/30 text-white hover:bg-white/10"
                      >
                        <Link to="/landlord/dashboard">View Dashboard</Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        size="lg" 
                        asChild 
                        className="text-base px-8 py-6 bg-primary text-black hover:bg-primary/90"
                      >
                        <Link to="/auth">Select Your Role</Link>
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        asChild 
                        className="text-base px-8 py-6 border-white/30 text-white hover:bg-white/10"
                      >
                        <Link to="/how-it-works">Learn How It Works</Link>
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:block relative">
            <img
              src="/lovable-uploads/fcea98fc-fc7e-498e-92eb-f1631063dfdb.png"
              alt="Modern living room interior"
              className="rounded-lg w-full object-cover shadow-2xl"
              style={{ height: '600px' }}
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-background/80 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
