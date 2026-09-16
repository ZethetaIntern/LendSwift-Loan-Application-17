import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Checkbox from '../components/common/Checkbox';
import { getLoanSummary, formatINR, checkEmiAffordability } from '../utils/emiCalculator';
import { maskPII, maskAadhaar } from '../utils/validators';

export default function Step8Review({ onEditStep }) {
  const {
    control, watch, formState: { errors },
  } = useFormContext();
  const values = watch();
  const summary = getLoanSummary(values);
  const combinedIncome = Number(values.monthlySalary || values.monthlyIncome || 0)
    + Number(values.coApplicantIncome || 0);
  const affordability = checkEmiAffordability(summary.emi, combinedIncome);

  const Section = ({ title, step, children }) => (
    <div className="border border-slate-200 rounded-md p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{title}</h3>
        <button type="button" className="text-sm text-primary underline" onClick={() => onEditStep(step)}>Edit</button>
      </div>
      <div className="text-sm text-slate-600 grid gap-1">{children}</div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <Section title="Loan Details" step={1}>
        <p>{values.loanType} Loan — {formatINR(Number(values.loanAmount))} for {values.loanTenure} months</p>
      </Section>
      <Section title="Personal Information" step={2}>
        <p>{values.fullName} · {values.email} · {values.mobile}</p>
      </Section>
      <Section title="Identity Verification" step={3}>
        <p>PAN: {maskPII(values.panNumber)} · Aadhaar: {maskAadhaar(values.aadhaarNumber)}</p>
      </Section>
      <Section title="Address" step={4}>
        <p>{values.addressLine1}, {values.city}, {values.state} - {values.pinCode}</p>
      </Section>
      <Section title="Employment & Income" step={5}>
        <p>{values.employmentType}</p>
      </Section>

      <div className="border border-primary rounded-md p-4 bg-blue-50">
        <h3 className="font-semibold mb-2">Pre-Approval Summary (Key Fact Statement)</h3>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt>Loan Amount</dt><dd>{formatINR(Number(values.loanAmount))}</dd>
          <dt>Tenure</dt><dd>{values.loanTenure} months</dd>
          <dt>Indicative Interest Rate</dt><dd>{summary.interestRate}% p.a.</dd>
          <dt>Estimated EMI</dt><dd>{formatINR(summary.emi, { decimals: 0 })}</dd>
          <dt>Total Cost of Borrowing</dt><dd>{formatINR(summary.totalCost, { decimals: 0 })}</dd>
          <dt>Processing Fee</dt><dd>{formatINR(summary.processingFee, { decimals: 0 })}</dd>
        </dl>
        {!affordability.withinLimit && (
          <p className="text-xs text-warning mt-2">
            Your estimated EMI exceeds 50% of monthly income. You may still submit, but approval isn&apos;t guaranteed.
          </p>
        )}
      </div>

      {values.signature && (
        <div>
          <p className="text-sm font-medium mb-1">Your Signature</p>
          <img src={values.signature} alt="Captured signature" className="border border-slate-200 rounded h-20" />
        </div>
      )}

      <div className="flex flex-col gap-2">
        {[
          ['consentAccurate', 'I confirm all information provided is accurate.'],
          ['consentCreditCheck', 'I authorise LendSwift to check my credit score via CIBIL/Equifax.'],
          ['consentTerms', 'I agree to the Terms and Conditions.'],
          ['consentComms', 'I consent to receive communications regarding this application.'],
        ].map(([name, label]) => (
          <Controller
            key={name}
            name={name}
            control={control}
            render={({ field }) => (
              <Checkbox
                id={name}
                label={label}
                checked={field.value || false}
                onChange={(e) => field.onChange(e.target.checked)}
                error={errors[name]?.message}
              />
            )}
          />
        ))}
      </div>
    </div>
  );
}
