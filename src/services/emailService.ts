import { supabase } from "@/integrations/supabase/client";

export class EmailService {
  static async sendEmail(
    to: string,
    subject: string,
    html: string
  ): Promise<void> {
    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        to,
        subject,
        html
      }
    });

    if (error) throw error;
  }

  static async sendApplicationApprovalEmail(
    to: string,
    firstName: string,
    propertyAddress: string,
    paymentBreakdown: {
      monthlyRent: number;
      tenantUpfrontPayment: number;
      doorwaysCoverage: number;
      repaymentInstallments: {
        amount: number;
        dueDate: string;
      }[];
    }
  ): Promise<void> {
    const html = `
      <h1>Congratulations, ${firstName}!</h1>
      <p>Your application for ${propertyAddress} has been approved!</p>
      
      <h2>Payment Breakdown</h2>
      <ul>
        <li>Monthly Rent: $${paymentBreakdown.monthlyRent}</li>
        <li>Upfront Payment (50%): $${paymentBreakdown.tenantUpfrontPayment.toFixed(2)}</li>
        <li>Doorways Coverage (50%): $${paymentBreakdown.doorwaysCoverage.toFixed(2)}</li>
      </ul>
      
      <h2>Repayment Schedule</h2>
      <ul>
        ${paymentBreakdown.repaymentInstallments.map((installment, index) => `
          <li>Installment ${index + 1}: $${installment.amount.toFixed(2)} (Due: ${installment.dueDate})</li>
        `).join('')}
      </ul>
      
      <p>Please make your upfront payment to proceed with the lease agreement.</p>
      
      <p>Best regards,<br>Doorways Team</p>
    `;

    await this.sendEmail(to, 'Your Application Has Been Approved!', html);
  }
} 