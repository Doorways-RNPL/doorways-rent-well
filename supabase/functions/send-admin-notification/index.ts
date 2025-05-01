
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const ADMIN_EMAIL = "thando@doorways.co.za";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  applicationId: string;
  propertyAddress: string;
  tenantName: string;
  landlordName: string;
  status: string;
  notificationType: "application_status_change" | "offer_created";
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      applicationId, 
      propertyAddress, 
      tenantName, 
      landlordName,
      status,
      notificationType 
    }: NotificationRequest = await req.json();

    console.log(`Processing ${notificationType} notification for application: ${applicationId}`);

    let subject: string;
    let htmlContent: string;

    if (notificationType === "application_status_change") {
      subject = `Application ${status.toUpperCase()}: ${propertyAddress}`;
      htmlContent = `
        <h1>Application Status Updated</h1>
        <p>A landlord has ${status} an application.</p>
        <ul>
          <li><strong>Property:</strong> ${propertyAddress}</li>
          <li><strong>Tenant:</strong> ${tenantName}</li>
          <li><strong>Landlord:</strong> ${landlordName}</li>
          <li><strong>Status:</strong> ${status}</li>
          <li><strong>Application ID:</strong> ${applicationId}</li>
        </ul>
        <p>Please log into the admin dashboard to take appropriate action.</p>
      `;
    } else {
      subject = `New Offer Ready: ${propertyAddress}`;
      htmlContent = `
        <h1>Offer Generation Requested</h1>
        <p>A new application has been approved and is ready for offer generation.</p>
        <ul>
          <li><strong>Property:</strong> ${propertyAddress}</li>
          <li><strong>Tenant:</strong> ${tenantName}</li>
          <li><strong>Landlord:</strong> ${landlordName}</li>
          <li><strong>Application ID:</strong> ${applicationId}</li>
        </ul>
        <p>Please log into the admin dashboard to generate the offer.</p>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Doorways Application Notifications <notifications@doorways.co.za>",
      to: [ADMIN_EMAIL],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, message: "Notification sent" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in admin notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
