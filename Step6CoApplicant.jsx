import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Checkbox from '../components/common/Checkbox';

export default function Step6CoApplicant() {
  const {
    register, control, watch, formState: { errors },
  } = useFormContext();
  const maritalStatus = watch('maritalStatus');

  const relationshipOptions = ['Spouse', 'Parent', 'Sibling', 'Business Partner'].map((v) => ({ value: v, label: v }));

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-slate-600">
        Because of your loan type and amount, a co-applicant is required for this application.
      </p>
      <Input id="coApplicantName" label="Co-Applicant Name *" {...register('coApplicantName')} error={errors.coApplicantName?.message} />
      <Select
        id="relationship"
        label="Relationship *"
        placeholder="Select"
        options={relationshipOptions}
        defaultValue={maritalStatus === 'Married' ? 'Spouse' : ''}
        {...register('relationship')}
        error={errors.relationship?.message}
      />
      <Input id="coApplicantPAN" label="Co-Applicant PAN *" maxLength={10} {...register('coApplicantPAN')} error={errors.coApplicantPAN?.message} />
      <Input id="coApplicantIncome" label="Co-Applicant Monthly Income (₹) *" type="number" {...register('coApplicantIncome')} error={errors.coApplicantIncome?.message} />
      <Controller
        name="coApplicantConsent"
        control={control}
        render={({ field }) => (
          <Checkbox
            id="coApplicantConsent"
            label="The co-applicant consents to being included in this loan application."
            checked={field.value || false}
            onChange={(e) => field.onChange(e.target.checked)}
            error={errors.coApplicantConsent?.message}
          />
        )}
      />
    </div>
  );
}
