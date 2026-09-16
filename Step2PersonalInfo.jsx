import React from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '../components/common/Input';
import RadioGroup from '../components/common/RadioGroup';
import Select from '../components/common/Select';

export default function Step2PersonalInfo() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="flex flex-col gap-5">
      <Input id="fullName" label="Full Name (as per PAN) *" autoComplete="name" {...register('fullName')} error={errors.fullName?.message} />
      <Input id="dob" label="Date of Birth *" type="date" autoComplete="bday" {...register('dob')} error={errors.dob?.message} />
      <RadioGroup
        label="Gender *"
        name="gender"
        options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]}
        {...register('gender')}
        error={errors.gender?.message}
      />
      <Select
        id="maritalStatus"
        label="Marital Status *"
        placeholder="Select status"
        options={[{ value: 'Single', label: 'Single' }, { value: 'Married', label: 'Married' }, { value: 'Other', label: 'Other' }]}
        {...register('maritalStatus')}
        error={errors.maritalStatus?.message}
      />
      <Input id="fatherName" label="Father's Name *" {...register('fatherName')} error={errors.fatherName?.message} />
      <Input id="motherName" label="Mother's Name *" {...register('motherName')} error={errors.motherName?.message} />
      <Input id="email" label="Email *" type="email" autoComplete="email" {...register('email')} error={errors.email?.message} />
      <Input id="mobile" label="Mobile Number *" type="tel" autoComplete="tel" {...register('mobile')} error={errors.mobile?.message} />
      <Input id="alternateMobile" label="Alternate Mobile (optional)" type="tel" {...register('alternateMobile')} error={errors.alternateMobile?.message} />
    </div>
  );
}
