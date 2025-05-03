import { supabase } from "@/integrations/supabase/client";

export class WhatsAppService {
  static async sendMessage(
    to: string,
    message: string
  ): Promise<void> {
    const { error } = await supabase.functions.invoke('send-whatsapp', {
      body: {
        to,
        message
      }
    });

    if (error) throw error;
  }

  static async sendApplicationApprovalMessage(
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
    const message = `
🎉 Congratulations, ${firstName}!

Your application for ${propertyAddress} has been approved!

Payment Breakdown:
• Monthly Rent: $${paymentBreakdown.monthlyRent}
• Upfront Payment (50%): $${paymentBreakdown.tenantUpfrontPayment.toFixed(2)}
• Doorways Coverage (50%): $${paymentBreakdown.doorwaysCoverage.toFixed(2)}

Repayment Schedule:
${paymentBreakdown.repaymentInstallments.map((installment, index) => `
• Installment ${index + 1}: $${installment.amount.toFixed(2)} (Due: ${installment.dueDate})`).join('\n')}

Please make your upfront payment to proceed with the lease agreement.

Best regards,
Doorways Team
    `.trim();

    await this.sendMessage(to, message);
  }
} 