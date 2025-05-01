
// Add logging to the function
console.log("Starting send-admin-notification function");

// Note: This function needs the Resend API key to be properly configured
import { Resend } from "npm:resend@1.0.0";

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Initialize Resend with proper error handling
let resend: any = null;
const resendApiKey = Deno.env.get("RESEND_API_KEY");

if (resendApiKey) {
  try {
    resend = new Resend(resendApiKey);
    console.log("Resend client initialized");
  } catch (err) {
    console.error("Failed to initialize Resend client:", err);
  }
} else {
  console.warn("RESEND_API_KEY environment variable is not set!");
}

Deno.serve(async (req) => {
  console.log(`Received ${req.method} request to send-admin-notification`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request with CORS headers");
    return new Response(null, { 
      status: 204, // Use explicit 204 status for OPTIONS
      headers: corsHeaders 
    });
  }
  
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
    
    // Prepare notification message
    const notificationData = {
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
    };
    
    // Attempt to send email only if Resend is properly initialized
    if (resend) {
      try {
        const emailResult = await resend.emails.send({
          from: 'Doorways <notifications@doorways.co.za>',
          to: notificationData.to,
          subject: notificationData.subject,
          text: notificationData.message
        });
        
        console.log("Email sent successfully:", emailResult);
      } catch (emailError) {
        console.error("Error sending email via Resend:", emailError);
        console.log("Using fallback notification method (log only)");
      }
    } else {
      // Fallback to logging only if Resend is not available
      console.log("Would send notification (RESEND_API_KEY not configured):", notificationData);
    }
    
    // Return success response - always return success even if email fails
    // This ensures the application approval process continues
    return new Response(
      JSON.stringify({ success: true, message: "Notification processed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Log and return error
    console.error("Error in send-admin-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
