
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TenantStep6Props {
  data: {
    agreeToTerms: boolean;
    agreeToCredit: boolean;
    agreeToBackground: boolean;
  };
  updateData: (data: Partial<TenantStep6Props['data']>) => void;
}

const TenantStep6 = ({ data, updateData }: TenantStep6Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Terms & Consent</h2>
        <p className="text-white/70 mb-6">Please review and agree to the following terms to complete your application.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Rent Now, Pay Later (RNPL) Explained</h3>
        <div className="space-y-4 text-white/70">
          <p>
            The Doorways RNPL program allows you to move into your rental with reduced upfront costs. 
            Instead of paying the traditional security deposit, first month's rent, and fees all at once, 
            you'll pay a smaller initial amount and spread the remaining costs over time.
          </p>
          <p>
            <strong className="text-white">Here's how it works:</strong>
          </p>
          <ol className="list-decimal ml-5 space-y-2">
            <li>Upon approval, you'll pay approximately 25% of the traditional move-in costs.</li>
            <li>The remaining balance will be split into equal monthly payments over your chosen term.</li>
            <li>These payments will be made in addition to your regular monthly rent.</li>
            <li>Making timely payments builds your rental history and may qualify you for rewards.</li>
          </ol>
          <p className="mt-4">
            <strong className="text-white">Example:</strong> For a $1,200/month apartment with $3,600 in total move-in costs, 
            you might pay $900 upfront and the remaining $2,700 over 6 months ($450/month in addition to your rent).
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-3">
          <Checkbox 
            id="agreeToTerms" 
            checked={data.agreeToTerms}
            onCheckedChange={(checked) => updateData({ agreeToTerms: checked === true })}
          />
          <div>
            <Label 
              htmlFor="agreeToTerms" 
              className="font-medium text-white"
            >
              I agree to the RNPL Terms & Conditions
            </Label>
            <p className="text-sm text-white/50 mt-1">
              I have read and agree to the full <a href="#" className="text-primary underline">Terms & Conditions</a> and 
              <a href="#" className="text-primary underline"> Privacy Policy</a>.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Checkbox 
            id="agreeToCredit" 
            checked={data.agreeToCredit}
            onCheckedChange={(checked) => updateData({ agreeToCredit: checked === true })}
          />
          <div>
            <Label 
              htmlFor="agreeToCredit" 
              className="font-medium text-white"
            >
              I consent to a credit check
            </Label>
            <p className="text-sm text-white/50 mt-1">
              I authorize Doorways RNPL to obtain my credit report to evaluate my application.
              This will be a soft inquiry and will not affect my credit score.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Checkbox 
            id="agreeToBackground" 
            checked={data.agreeToBackground}
            onCheckedChange={(checked) => updateData({ agreeToBackground: checked === true })}
          />
          <div>
            <Label 
              htmlFor="agreeToBackground" 
              className="font-medium text-white"
            >
              I consent to background verification
            </Label>
            <p className="text-sm text-white/50 mt-1">
              I authorize Doorways RNPL to verify my employment, income, and rental history
              as part of the application process.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mt-6">
        <p className="text-sm text-white/70">
          By submitting this application, you confirm that all information provided is accurate and complete.
          Providing false information may result in application rejection.
        </p>
      </div>
    </div>
  );
};

export default TenantStep6;
