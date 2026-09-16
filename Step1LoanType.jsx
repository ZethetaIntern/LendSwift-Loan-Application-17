import React from 'react';
import { useFormContext } from 'react-hook-form';
import RadioGroup from '../components/common/RadioGroup';
import Input from '../components/common/Input';
import Select from '../components/common/Select';

const PURPOSES = {
  Personal: ['Medical', 'Travel', 'Wedding', 'Education', 'Debt Consolidation', 'Other'],
  Home: ['Purchase', 'Construction', 'Renovation', 'Plot Purchase'],
  Business: ['Working Capital', 'Equipment Purchase', 'Expansion', 'Inventory'],
};

export default function Step1LoanType() {
  const { register, watch, formState: { errors } } = useFormContext();
  const loanType = watch('loanType');

  return (
    <div className="flex flex-col gap-5">
      <RadioGroup
        label="Loan Type *"
        name="loanType"
        options={[
          { value: 'Personal', label: 'Personal Loan' },
          { value: 'Home', label: 'Home Loan' },
          { value: 'Business', label: 'Business Loan' },
        ]}
        {...register('loanType')}
        error={errors.loanType?.message}
      />
      <Input
        id="loanAmount"
        label="Loan Amount (₹) *"
        type="number"
        {...register('loanAmount')}
        error={errors.loanAmount?.message}
      />
      <Input
        id="loanTenure"
        label="Loan Tenure (months) *"
        type="number"
        {...register('loanTenure')}
        error={errors.loanTenure?.message}
      />
      <Select
        id="loanPurpose"
        label="Loan Purpose *"
        placeholder="Select purpose"
        options={(PURPOSES[loanType] || []).map((p) => ({ value: p, label: p }))}
        {...register('loanPurpose')}
        error={errors.loanPurpose?.message}
      />
      <Input
        id="referralCode"
        label="Referral Code (optional)"
        {...register('referralCode')}
        error={errors.referralCode?.message}
      />
    </div>
  );
}
