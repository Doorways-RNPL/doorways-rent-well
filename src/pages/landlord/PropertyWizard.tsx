
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// This is a placeholder for the property listing wizard that will be implemented in Phase 2
const PropertyWizard = () => {
  const { user, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-6 text-center">Add Your Property</h1>
          <Card>
            <CardHeader>
              <CardTitle>Property Listing Wizard</CardTitle>
              <CardDescription>Coming in Phase 2</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/70">
                This wizard will guide you through the process of adding a new property listing.
              </p>
              <p className="text-white/70">
                You'll be able to add property details, upload images, set rental terms, and more.
              </p>
              <div className="flex justify-end">
                <Button type="button" onClick={() => window.location.href = "/landlord/dashboard"}>
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyWizard;
