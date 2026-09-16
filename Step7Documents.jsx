import React from 'react';
import { useFormContext } from 'react-hook-form';
import FileUpload from '../components/common/FileUpload';
import SignatureCanvasField from '../components/common/SignatureCanvasField';

export default function Step7Documents() {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const loanType = watch('loanType');
  const employmentType = watch('employmentType');
  const panVerified = watch('panVerified');

  const docs = [
    { key: 'docPan', label: 'PAN Card Copy', accept: { 'image/*': [], 'application/pdf': [] }, required: !panVerified },
    { key: 'docAadhaar', label: 'Aadhaar Card (Front + Back)', accept: { 'image/*': [], 'application/pdf': [] }, required: true },
    { key: 'docPhoto', label: 'Photograph (passport size)', accept: { 'image/*': [] }, maxSizeMB: 2, required: true },
    { key: 'docBankStatements', label: 'Bank Statements (last 6 months)', accept: { 'application/pdf': [] }, maxSizeMB: 10, required: true },
  ];

  if (employmentType === 'Salaried') {
    docs.push({ key: 'docSalarySlips', label: 'Salary Slips (last 3 months)', accept: { 'application/pdf': [] }, required: true });
  } else {
    docs.push({ key: 'docITR', label: 'ITR (last 2 years)', accept: { 'application/pdf': [] }, required: true });
  }

  if (loanType === 'Home') {
    docs.push({ key: 'docProperty', label: 'Property Documents', accept: { 'application/pdf': [] }, maxSizeMB: 10, required: true });
  }
  if (loanType === 'Business') {
    docs.push({ key: 'docBizReg', label: 'Business Registration Certificate', accept: { 'application/pdf': [] }, required: true });
    docs.push({ key: 'docGST', label: 'GST Returns (last 4 quarters)', accept: { 'application/pdf': [] }, required: true });
  }

  return (
    <div className="flex flex-col gap-6">
      {docs.map((doc) => (
        <FileUpload
          key={doc.key}
          label={doc.label}
          accept={doc.accept}
          maxSizeMB={doc.maxSizeMB}
          required={doc.required}
          onFileAccepted={(file) => setValue(doc.key, file)}
          error={errors[doc.key]?.message}
        />
      ))}
      <SignatureCanvasField
        label="E-Signature *"
        onChange={(dataUrl) => setValue('signature', dataUrl, { shouldValidate: true })}
        error={errors.signature?.message}
      />
    </div>
  );
}
