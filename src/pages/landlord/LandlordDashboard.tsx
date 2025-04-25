
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// This is a placeholder dashboard component that will be expanded in later phases
const LandlordDashboard = () => {
  const { user, isLoading } = useAuth();
  
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
        <h1 className="text-3xl font-bold text-primary mb-6">Landlord Dashboard</h1>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
          <p className="text-white/70">
            Welcome to your landlord dashboard. This is where you'll manage your properties and tenants.
          </p>
          <div className="mt-4">
            <p>Coming soon:</p>
            <ul className="list-disc list-inside text-white/70">
              <li>Property listings management</li>
              <li>Tenant applications</li>
              <li>Payment tracking</li>
              <li>Tenant invitation system</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandlordDashboard;
