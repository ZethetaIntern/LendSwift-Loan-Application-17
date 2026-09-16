import { z } from 'zod';
import { calculateAge, validateGST } from '../utils/validators';

const LOAN_LIMITS = {
  Personal: { min: 50000, max: 1000000, tenureMin: 12, tenureMax: 60 },
  Home: { min: 50000, max: 10000000, tenureMin: 60, tenureMax: 360 },
  Business: { min: 50000, max: 5000000, tenureMin: 12, tenureMax: 120 },
};

export function getStep1Schema(dob) {
  return z.object({
    loanType: z.enum(['Personal', 'Home', 'Business'], { required_error: 'Select a loan type' }),
    loanAmount: z.coerce.number().min(1, 'Loan amount is required'),
    loanTenure: z.coerce.number().min(1, 'Loan tenure is required'),
    loanPurpose: z.string().min(1, 'Select a loan purpose'),
    referralCode: z.string().optional().refine(
      (v) => !v || /^[A-Za-z0-9]{6,10}$/.test(v),
      'Referral code must be 6-10 alphanumeric characters',
    ),
  }).superRefine((data, ctx) => {
    const limits = LOAN_LIMITS[data.loanType];
    if (!limits) return;
    if (data.loanAmount < limits.min || data.loanAmount > limits.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['loanAmount'],
        message: `Amount must be between ₹${limits.min.toLocaleString('en-IN')} and ₹${limits.max.toLocaleString('en-IN')} for ${data.loanType} loans`,
      });
    }
    if (data.loanTenure < limits.tenureMin || data.loanTenure > limits.tenureMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['loanTenure'],
        message: `Tenure must be between ${limits.tenureMin} and ${limits.tenureMax} months for ${data.loanType} loans`,
      });
    }
    if (dob) {
      const age = calculateAge(dob);
      if (age !== null && age + data.loanTenure / 12 > 65) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['loanTenure'],
          message: 'Age plus tenure must not exceed 65 years',
        });
      }
    }
  });
}

export const step2Schema = z.object({
  fullName: z.string().min(2).max(100).regex(/^[A-Za-z][A-Za-z .]+$/, 'Only letters, spaces and periods allowed'),
  dob: z.string().min(1, 'Date of birth is required').refine((v) => {
    const age = calculateAge(v);
    return age !== null && age >= 21 && age <= 65;
  }, 'Applicant must be between 21 and 65 years old'),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Select a gender' }),
  maritalStatus: z.string().min(1, 'Select marital status'),
  fatherName: z.string().min(2).max(100).regex(/^[A-Za-z][A-Za-z .]+$/, "Enter father's name"),
  motherName: z.string().min(2).max(100).regex(/^[A-Za-z][A-Za-z .]+$/, "Enter mother's name"),
  email: z.string().email('Enter a valid email address'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  alternateMobile: z.string().optional().refine(
    (v) => !v || /^[6-9]\d{9}$/.test(v),
    'Enter a valid 10-digit mobile number',
  ),
}).refine((d) => !d.alternateMobile || d.alternateMobile !== d.mobile, {
  message: 'Alternate mobile must differ from primary',
  path: ['alternateMobile'],
});

export const step3Schema = z.object({
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN format'),
  panVerified: z.boolean().refine((v) => v, 'Please verify your PAN'),
  aadhaarNumber: z.string().regex(/^\d{12}$/, 'Aadhaar must be 12 digits'),
  aadhaarVerified: z.boolean().refine((v) => v, 'Please verify your Aadhaar'),
  aadhaarConsent: z.boolean().refine((v) => v, 'Consent is required to proceed'),
  voterID: z.string().optional().refine((v) => !v || /^[A-Z]{3}[0-9]{7}$/.test(v), 'Invalid Voter ID format'),
  passport: z.string().optional().refine((v) => !v || /^[A-Z][0-9]{7}$/.test(v), 'Invalid passport format'),
});

export const step4Schema = z.object({
  addressLine1: z.string().min(5).max(200),
  addressLine2: z.string().optional(),
  pinCode: z.string().regex(/^\d{6}$/, 'PIN code must be 6 digits'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  residenceType: z.enum(['Owned', 'Rented', 'Company', 'Family'], { required_error: 'Select residence type' }),
  rentAmount: z.coerce.number().optional(),
  yearsAtAddress: z.coerce.number().min(0).max(50),
  sameAsPermanent: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.residenceType === 'Rented' && (!data.rentAmount || data.rentAmount <= 0)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['rentAmount'], message: 'Rent amount is required' });
  }
});

export function getStep5Schema(loanType) {
  const base = z.object({
    employmentType: z.enum(['Salaried', 'Self-Employed', 'Business Owner'], {
      required_error: 'Select employment type',
    }),
    yearsOfExperience: z.coerce.number().min(0).max(50),
    companyName: z.string().optional(),
    designation: z.string().optional(),
    monthlySalary: z.coerce.number().optional(),
    businessName: z.string().optional(),
    businessType: z.string().optional(),
    annualTurnover: z.coerce.number().optional(),
    yearsInBusiness: z.coerce.number().optional(),
    monthlyIncome: z.coerce.number().optional(),
    gstNumber: z.string().optional(),
  });

  return base.superRefine((data, ctx) => {
    if (loanType === 'Business' && data.employmentType === 'Salaried') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['employmentType'],
        message: 'Business loans require Business Owner or Self-Employed status',
      });
    }
    if (data.employmentType === 'Salaried') {
      if (!data.companyName) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['companyName'], message: 'Company name is required' });
      if (!data.designation) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['designation'], message: 'Designation is required' });
      if (!data.monthlySalary || data.monthlySalary < 15000) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['monthlySalary'], message: 'Minimum monthly salary is ₹15,000' });
      }
    } else {
      if (!data.businessName) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['businessName'], message: 'Business name is required' });
      if (!data.annualTurnover || data.annualTurnover < 300000) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['annualTurnover'], message: 'Minimum annual turnover is ₹3,00,000' });
      }
      if (!data.yearsInBusiness || data.yearsInBusiness < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['yearsInBusiness'], message: 'Minimum 2 years in business required' });
      }
      if (data.employmentType === 'Self-Employed' && !data.monthlyIncome) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['monthlyIncome'], message: 'Monthly income is required' });
      }
      if (data.employmentType === 'Business Owner') {
        const gst = validateGST(data.gstNumber);
        if (!gst.valid) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['gstNumber'], message: gst.error });
      }
    }
  });
}

export const step6Schema = z.object({
  coApplicantName: z.string().min(2, "Co-applicant's name is required"),
  relationship: z.string().min(1, 'Select relationship'),
  coApplicantPAN: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN format'),
  coApplicantIncome: z.coerce.number().min(1, "Co-applicant's income is required"),
  coApplicantConsent: z.boolean().refine((v) => v, 'Co-applicant consent is required'),
});

export const step8Schema = z.object({
  consentAccurate: z.boolean().refine((v) => v, 'Required'),
  consentCreditCheck: z.boolean().refine((v) => v, 'Required'),
  consentTerms: z.boolean().refine((v) => v, 'Required'),
  consentComms: z.boolean().refine((v) => v, 'Required'),
  signature: z.string().min(1, 'Signature is required'),
});

export function shouldShowStep6(loanType, loanAmount) {
  if (loanType === 'Home') return true;
  if (loanType === 'Personal') return loanAmount > 500000;
  if (loanType === 'Business') return loanAmount > 2000000;
  return false;
}

export { LOAN_LIMITS };
