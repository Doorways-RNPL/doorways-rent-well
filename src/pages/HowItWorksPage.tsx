
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">How Doorways RNPL Works</h1>
            <p className="text-xl text-gray-600">
              Our Rent Now, Pay Later solution makes housing more accessible by reducing upfront costs and 
              creating a win-win for tenants and landlords.
            </p>
          </div>
          
          <div className="space-y-24 mb-16">
            {/* For Tenants */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">For Tenants</h2>
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-4">1. Apply Online</h3>
                  <p className="text-gray-600 mb-6">
                    Fill out our simple online application form with your personal details, rental history, and income information.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-primary mb-4">2. Get Approved</h3>
                  <p className="text-gray-600 mb-6">
                    Our team reviews your application and provides a quick decision on your RNPL eligibility, typically within 24-48 hours.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-primary mb-4">3. Pay Reduced Upfront Amount</h3>
                  <p className="text-gray-600 mb-6">
                    Once approved, you'll pay a significantly reduced initial amount compared to traditional move-in costs.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-primary mb-4">4. Move In & Pay Over Time</h3>
                  <p className="text-gray-600 mb-6">
                    Move into your new home and pay the remainder of your initial costs over time, based on your personalized payment plan.
                  </p>
                  
                  <div className="mt-8">
                    <Button asChild>
                      <Link to="/apply">Apply as Tenant</Link>
                    </Button>
                  </div>
                </div>
                <div className="bg-soft-purple rounded-xl p-8">
                  <h3 className="text-xl font-semibold mb-6">Benefits for Tenants:</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span>Significantly reduced upfront move-in costs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span>Access to better quality housing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span>Flexible payment plans tailored to your needs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span>Build your credit score through on-time payments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span>Transparent payment timeline with no hidden fees</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
            
            {/* For Landlords */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">For Landlords</h2>
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1 bg-soft-blue rounded-xl p-8">
                  <h3 className="text-xl font-semibold mb-6">Benefits for Landlords:</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span>Guaranteed monthly payments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span>Larger pool of qualified tenants</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span>Reduced vacancy periods</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span>Protection against payment defaults</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span>Simplified tenant management process</span>
                    </li>
                  </ul>
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="text-xl font-semibold text-primary mb-4">1. List Your Property</h3>
                  <p className="text-gray-600 mb-6">
                    Create an account and add your property details to our platform, including rent amount, property images, and amenities.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-primary mb-4">2. Review Applications</h3>
                  <p className="text-gray-600 mb-6">
                    Receive applications from pre-screened tenants and review their profiles, including RNPL eligibility status.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-primary mb-4">3. Accept Tenants</h3>
                  <p className="text-gray-600 mb-6">
                    Select the tenant that's right for your property with the confidence that they've been vetted by our system.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-primary mb-4">4. Receive Guaranteed Payments</h3>
                  <p className="text-gray-600 mb-6">
                    Enjoy consistent, on-time rent payments while we manage the tenant's RNPL arrangement.
                  </p>
                  
                  <div className="mt-8">
                    <Button asChild>
                      <Link to="/list-property">List Your Property</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </div>
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Whether you're looking for a new place to live or want to list your property, 
              Doorways RNPL is here to make the process smoother and more accessible.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild className="text-base px-8">
                <Link to="/apply">Apply as Tenant</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8">
                <Link to="/list-property">List Your Property</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
