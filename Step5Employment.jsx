import React from 'react';
import { useFormContext } from 'react-hook-form';
import RadioGroup from '../components/common/RadioGroup';
import Input from '../components/common/Input';

export default function Step5Employment() {
  const { register, watch, formState: { errors } } = useFormContext();
  const employmentType = watch('employmentType');

  return (
    <div className="flex flex-col gap-5">
      <RadioGroup
        label="Employment Type *"
        name="employmentType"
        options={[
          { value: 'Salaried', label: 'Salaried' },
          { value: 'Self-Employed', label: 'Self-Employed' },
          { value: 'Business Owner', label: 'Business Owner' },
        ]}
        {...register('employmentType')}
        error={errors.employmentType?.message}
      />
      <Input id="yearsOfExperience" label="Years of Experience *" type="number" {...register('yearsOfExperience')} error={errors.yearsOfExperience?.message} />

      {employmentType === 'Salaried' && (
        <>
          <Input id="companyName" label="Company Name *" {...register('companyName')} error={errors.companyName?.message} />
          <Input id="designation" label="Designation *" {...register('designation')} error={errors.designation?.message} />
          <Input id="monthlySalary" label="Monthly Net Salary (₹) *" type="number" {...register('monthlySalary')} error={errors.monthlySalary?.message} />
        </>
      )}

      {(employmentType === 'Self-Employed' || employmentType === 'Business Owner') && (
        <>
          <Input id="businessName" label="Business Name *" {...register('businessName')} error={errors.businessName?.message} />
          <Input id="businessType" label="Business Type" {...register('businessType')} error={errors.businessType?.message} />
          <Input id="annualTurnover" label="Annual Turnover (₹) *" type="number" {...register('annualTurnover')} error={errors.annualTurnover?.message} />
          <Input id="yearsInBusiness" label="Years in Business *" type="number" {...register('yearsInBusiness')} error={errors.yearsInBusiness?.message} />
          {employmentType === 'Self-Employed' && (
            <Input id="monthlyIncome" label="Monthly Income (₹) *" type="number" {...register('monthlyIncome')} error={errors.monthlyIncome?.message} />
          )}
          {employmentType === 'Business Owner' && (
            <Input id="gstNumber" label="GST Number *" {...register('gstNumber')} error={errors.gstNumber?.message} />
          )}
        </>
      )}
    </div>
  );
}
