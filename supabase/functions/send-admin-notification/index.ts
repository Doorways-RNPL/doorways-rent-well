
// Add logging to the function
console.log("Starting send-admin-notification function");

// Note: This function needs the Resend API key to be properly configured
import { Resend } from "resend";
const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");

Deno.serve(async (req) => {
  try {
    // Log the request received
    console.log("Admin notification function called");
    
    // Extract notification data from request
    const data = await req.json();
    console.log("Received notification data:", data);
    
    const {
      applicationId,
      propertyAddress,
      tenantName,
      landlordName,
      status,
      notificationType
    } = data;
    
    // This is a mock implementation since we don't have email set up properly
    // In a real implementation, this would send an email using Resend
    console.log("Would send notification:", {
      to: "admin@doorways.co.za",
      subject: notificationType === "application_status_change" 
        ? `Application Status Changed: ${status}` 
        : "Offer Created",
      message: `
        Application ID: ${applicationId}
        Property: ${propertyAddress}
        Tenant: ${tenantName}
        Landlord: ${landlordName}
        Status: ${status}
      `
    });
    
    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: "Notification processed" }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Log and return error
    console.error("Error in send-admin-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
