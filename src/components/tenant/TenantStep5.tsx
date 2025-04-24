
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface TenantStep5Props {
  data: {
    idDocument: File | null;
    proofOfIncome: File | null;
    leaseAgreement: File | null;
  };
  updateData: (data: Partial<TenantStep5Props['data']>) => void;
}

const FileUpload = ({ 
  id, 
  label, 
  description, 
  currentFile, 
  onFileChange 
}: { 
  id: string; 
  label: string; 
  description: string; 
  currentFile: File | null; 
  onFileChange: (file: File | null) => void;
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    onFileChange(file || null);
  };

  return (
    <div className="p-6 bg-white/5 border border-dashed border-white/20 rounded-lg">
      <div className="space-y-2 mb-4">
        <Label htmlFor={id}>{label}</Label>
        <p className="text-sm text-white/50">{description}</p>
      </div>
      
      {currentFile ? (
        <div className="bg-white/10 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-white truncate">{currentFile.name}</p>
                <p className="text-xs text-white/50">{(currentFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
              onClick={() => onFileChange(null)}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <input
            id={id}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf"
          />
          <label
            htmlFor={id}
            className="flex flex-col items-center justify-center h-32 border border-dashed border-white/20 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50 mb-2">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
              <path d="M12 12v9"></path>
              <path d="m16 16-4-4-4 4"></path>
            </svg>
            <span className="text-sm text-white/70">Click to upload or drag and drop</span>
            <span className="text-xs text-white/50 mt-1">PDF, JPG, or PNG (max. 10MB)</span>
          </label>
        </div>
      )}
    </div>
  );
};

const TenantStep5 = ({ data, updateData }: TenantStep5Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Document Uploads</h2>
        <p className="text-white/70 mb-6">Please upload the required documents to verify your application.</p>
      </div>

      <div className="space-y-6">
        <FileUpload
          id="idDocument"
          label="Identification Document"
          description="Valid government-issued photo ID (driver's license, passport, etc.)"
          currentFile={data.idDocument}
          onFileChange={(file) => updateData({ idDocument: file })}
        />
        
        <FileUpload
          id="proofOfIncome"
          label="Proof of Income"
          description="Recent pay stub, employment offer letter, or bank statement"
          currentFile={data.proofOfIncome}
          onFileChange={(file) => updateData({ proofOfIncome: file })}
        />
        
        <FileUpload
          id="leaseAgreement"
          label="Lease Agreement"
          description="Copy of your lease agreement (if available)"
          currentFile={data.leaseAgreement}
          onFileChange={(file) => updateData({ leaseAgreement: file })}
        />
      </div>
      
      <div className="bg-white/5 p-4 rounded-lg mt-6">
        <p className="text-sm text-white/70">
          <span className="font-medium text-primary">Note:</span> For security purposes, 
          your documents will be encrypted and stored securely. They will only be used for 
          verifying your RNPL application and will not be shared with third parties without 
          your consent.
        </p>
      </div>
    </div>
  );
};

export default TenantStep5;
