import React, { useState, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import ProgressBar from './ProgressBar';
import StepNavigation from './StepNavigation';
import ResumeModal from './ResumeModal';
import SuccessModal from './SuccessModal';
import Step1LoanType from '../steps/Step1LoanType';
import Step2PersonalInfo from '../steps/Step2PersonalInfo';
import Step3KYC from '../steps/Step3KYC';
import Step4Address from '../steps/Step4Address';
import Step5Employment from '../steps/Step5Employment';
import Step6CoApplicant from '../steps/Step6CoApplicant';
import Step7Documents from '../steps/Step7Documents';
import Step8Review from '../steps/Step8Review';
import {
  getStep1Schema, step2Schema, step3Schema, step4Schema, getStep5Schema,
  step6Schema, step8Schema, shouldShowStep6,
} from '../schemas/stepSchemas';
import { useAutoSave, clearDraft } from '../hooks/useAutoSave';
import { useFormPersistence } from '../hooks/useFormPersistence';

const DEFAULT_VALUES = {
  loanType: '', loanAmount: '', loanTenure: '', loanPurpose: '', referralCode: '',
  fullName: '', dob: '', gender: '', maritalStatus: '', fatherName: '', motherName: '',
  email: '', mobile: '', alternateMobile: '',
  panNumber: '', panVerified: false, aadhaarNumber: '', aadhaarVerified: false,
  aadhaarConsent: false, voterID: '', passport: '',
  addressLine1: '', addressLine2: '', pinCode: '', city: '', state: '',
  residenceType: '', rentAmount: '', yearsAtAddress: '', sameAsPermanent: false,
  employmentType: '', yearsOfExperience: '', companyName: '', designation: '', monthlySalary: '',
  businessName: '', businessType: '', annualTurnover: '', yearsInBusiness: '', monthlyIncome: '',
  gstNumber: '',
  coApplicantName: '', relationship: '', coApplicantPAN: '', coApplicantIncome: '', coApplicantConsent: false,
  signature: '',
  consentAccurate: false, consentCreditCheck: false, consentTerms: false, consentComms: false,
};

const STEP_META = [
  { number: 1, label: 'Loan Type' },
  { number: 2, label: 'Personal Info' },
  { number: 3, label: 'Identity (KYC)' },
  { number: 4, label: 'Address' },
  { number: 5, label: 'Employment & Income' },
  { number: 6, label: 'Co-Applicant' },
  { number: 7, label: 'Documents & Signature' },
  { number: 8, label: 'Review & Submit' },
];

export default function Wizard() {
  const methods = useForm({ defaultValues: DEFAULT_VALUES, mode: 'onBlur' });
  const {
    watch, getValues, setError, clearErrors, handleSubmit, reset,
  } = methods;

  const [currentStep, setCurrentStep] = useState(1);
  const [referenceNumber, setReferenceNumber] = useState(null);

  const loanType = watch('loanType');
  const loanAmount = Number(watch('loanAmount')) || 0;
  const showStep6 = shouldShowStep6(loanType, loanAmount);

  const steps = useMemo(() => STEP_META.map((s) => ({
    ...s,
    active: s.number !== 6 || showStep6,
  })), [showStep6]);

  const { showToast } = useAutoSave(watch(), currentStep, loanType);
  const { draft, checked, dismissDraft } = useFormPersistence(loanType);
  const [resumeDismissed, setResumeDismissed] = useState(false);

  const validateStep = (stepNumber) => {
    const data = getValues();
    let schema;
    switch (stepNumber) {
      case 1: schema = getStep1Schema(data.dob); break;
      case 2: schema = step2Schema; break;
      case 3: schema = step3Schema; break;
      case 4: schema = step4Schema; break;
      case 5: schema = getStep5Schema(data.loanType); break;
      case 6: schema = step6Schema; break;
      case 8: schema = step8Schema; break;
      default: return true;
    }
    const result = schema.safeParse(data);
    clearErrors();
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        setError(issue.path[0], { type: 'manual', message: issue.message });
      });
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    const activeNumbers = steps.filter((s) => s.active).map((s) => s.number);
    const idx = activeNumbers.indexOf(currentStep);
    if (idx === activeNumbers.length - 1) {
      handleFinalSubmit();
      return;
    }
    setCurrentStep(activeNumbers[idx + 1]);
    window.scrollTo(0, 0);
  };

  const goPrevious = () => {
    const activeNumbers = steps.filter((s) => s.active).map((s) => s.number);
    const idx = activeNumbers.indexOf(currentStep);
    if (idx > 0) setCurrentStep(activeNumbers[idx - 1]);
    window.scrollTo(0, 0);
  };

  const handleFinalSubmit = handleSubmit(() => {
    if (!validateStep(8)) return;
    const ref = uuidv4();
    setReferenceNumber(ref);
    clearDraft(loanType);
  });

  const handleResume = () => {
    reset(draft.data);
    setCurrentStep(draft.metadata.step || 1);
    dismissDraft();
    setResumeDismissed(true);
  };

  const handleStartFresh = () => {
    clearDraft(loanType);
    dismissDraft();
    setResumeDismissed(true);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1LoanType />;
      case 2: return <Step2PersonalInfo />;
      case 3: return <Step3KYC />;
      case 4: return <Step4Address />;
      case 5: return <Step5Employment />;
      case 6: return <Step6CoApplicant />;
      case 7: return <Step7Documents />;
      case 8: return <Step8Review onEditStep={setCurrentStep} />;
      default: return null;
    }
  };

  if (referenceNumber) {
    return <SuccessModal referenceNumber={referenceNumber} onClose={() => window.location.reload()} />;
  }

  return (
    <FormProvider {...methods}>
      {checked && draft && !resumeDismissed && (
        <ResumeModal loanType={draft.metadata.loanType} onResume={handleResume} onStartFresh={handleStartFresh} />
      )}
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <h1 className="text-xl font-semibold text-primary mb-1">LendSwift Loan Application</h1>
        <p className="text-sm text-slate-500 mb-6">A simulated production loan flow — LendSwift is a fictional NBFC.</p>
        <ProgressBar steps={steps} currentStep={currentStep} />
        <form onSubmit={(e) => e.preventDefault()}>
          {renderStep()}
          <StepNavigation
            onPrevious={goPrevious}
            onNext={goNext}
            onSaveDraft={() => {}}
            isFirst={currentStep === steps.filter((s) => s.active)[0].number}
            isLast={currentStep === steps.filter((s) => s.active).slice(-1)[0].number}
          />
        </form>
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-slate-900 text-white text-sm px-4 py-2 rounded-md" role="status">
            Draft saved
          </div>
        )}
      </div>
    </FormProvider>
  );
}
