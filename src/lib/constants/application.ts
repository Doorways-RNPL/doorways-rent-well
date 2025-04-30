export const stepTitles = [
  "Personal Info", 
  "Address History", 
  "Employment", 
  "Lease Details", 
  "Documents", 
  "Review & Submit"
];

export const validateStep = (step: number, data: any) => {
  switch(step) {
    case 1:
      return !!(data.firstName && data.lastName && data.dateOfBirth && data.idNumber);
    case 2:
      return !!(data.currentAddress && data.currentCity && data.moveInDate);
    case 3:
      return !!(data.employerName && data.jobTitle && data.monthlyIncome);
    case 4:
      // Updated validation for Step 4
      // Only check for fields that are actually collected in the TenantStep4 component
      if (!data.propertyId || !data.leaseStartDate || !data.leaseDuration) {
        return false;
      }
      
      // Monthly rent is auto-populated when property is selected, so we can keep this check
      if (!data.monthlyRent) {
        return false;
      }
      
      // No longer checking for landlord information that isn't collected in the form
      return true;
    case 5:
      return true; // Documents are optional in demo
    case 6:
      return !!(data.agreeToTerms && data.agreeToCredit && data.agreeToBackground);
    default:
      return false;
  }
};
