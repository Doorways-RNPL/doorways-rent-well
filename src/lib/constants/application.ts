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
      const isCurrentResidence = data.residenceType === 'current';
      const leaseDuration = parseInt(data.leaseDuration);
      
      if (isCurrentResidence && leaseDuration < 2) return false;
      if (!isCurrentResidence && leaseDuration < 12) return false;
      
      if (!data.propertyId || !data.propertyAddress || !data.propertyCity || !data.monthlyRent || !data.leaseStartDate) return false;
      return true;
    case 5:
      return true; // Documents are optional in demo
    case 6:
      return !!(data.agreeToTerms && data.agreeToCredit && data.agreeToBackground);
    default:
      return false;
  }
};
