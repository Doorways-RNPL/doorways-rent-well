
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Welcome to Doorways</h1>
            <p className="text-white/70">Let's get started by adding your first property listing.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Add Your First Property</CardTitle>
              <CardDescription>Start by providing basic property details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/70">
                This wizard will guide you through the process of adding your first property listing.
                You'll be able to:
              </p>
              <ul className="list-disc list-inside text-white/70 space-y-1">
                <li>Add property details and specifications</li>
                <li>Upload property images</li>
                <li>Set rental terms and conditions</li>
                <li>Specify tenant requirements</li>
              </ul>
              <div className="flex justify-end">
                <Button type="button" onClick={() => window.location.href = "/landlord/dashboard"}>
                  Start Now
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
