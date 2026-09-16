import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Checkbox from '../components/common/Checkbox';
import { usePinCodeLookup } from '../hooks/usePinCodeLookup';

export default function Step4Address() {
  const {
    register, control, watch, setValue, formState: { errors },
  } = useFormContext();
  const { lookup, isLoading, error: pinError } = usePinCodeLookup();
  const [stateMismatch, setStateMismatch] = useState(false);
  const residenceType = watch('residenceType');
  const sameAsPermanent = watch('sameAsPermanent');

  const handlePinBlur = async (e) => {
    const pin = e.target.value;
    if (!/^\d{6}$/.test(pin)) return;
    const result = await lookup(pin);
    if (result) {
      const currentState = watch('state');
      setValue('city', result.city, { shouldValidate: true });
      setValue('state', result.state, { shouldValidate: true });
      setStateMismatch(!!currentState && currentState !== result.state);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Input id="addressLine1" label="Current Address Line 1 *" autoComplete="address-line1" {...register('addressLine1')} error={errors.addressLine1?.message} />
      <Input id="addressLine2" label="Current Address Line 2" autoComplete="address-line2" {...register('addressLine2')} error={errors.addressLine2?.message} />
      <div>
        <Input id="pinCode" label="PIN Code *" autoComplete="postal-code" maxLength={6} {...register('pinCode')} onBlur={handlePinBlur} error={errors.pinCode?.message || pinError} />
        {isLoading && <p className="text-xs text-slate-500 mt-1">Looking up PIN code…</p>}
      </div>
      <Input id="city" label="City *" {...register('city')} error={errors.city?.message} />
      <Input id="state" label="State *" {...register('state')} error={errors.state?.message} />
      {stateMismatch && (
        <p className="text-xs text-warning">The state you entered doesn&apos;t match the PIN code&apos;s state. Please confirm.</p>
      )}
      <Select
        id="residenceType"
        label="Residence Type *"
        placeholder="Select"
        options={['Owned', 'Rented', 'Company', 'Family'].map((v) => ({ value: v, label: v }))}
        {...register('residenceType')}
        error={errors.residenceType?.message}
      />
      {residenceType === 'Rented' && (
        <Input id="rentAmount" label="Monthly Rent (₹) *" type="number" {...register('rentAmount')} error={errors.rentAmount?.message} />
      )}
      <Input id="yearsAtAddress" label="Years at Current Address *" type="number" {...register('yearsAtAddress')} error={errors.yearsAtAddress?.message} />
      <Controller
        name="sameAsPermanent"
        control={control}
        render={({ field }) => (
          <Checkbox
            id="sameAsPermanent"
            label="Permanent address is the same as current address"
            checked={field.value || false}
            onChange={(e) => field.onChange(e.target.checked)}
          />
        )}
      />
      {!sameAsPermanent && (
        <p className="text-xs text-slate-500">
          (Permanent address fields would appear here in a full build — reuse the same field set with a
          `permanent` prefix.)
        </p>
      )}
    </div>
  );
}
