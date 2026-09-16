import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import MaskedInput from '../components/common/MaskedInput';
import Checkbox from '../components/common/Checkbox';
import Input from '../components/common/Input';
import { useVerification } from '../hooks/useVerification';
import {
  validatePAN, validateAadhaar, maskPII, maskAadhaar,
} from '../utils/validators';

export default function Step3KYC() {
  const {
    register, control, watch, setValue, formState: { errors },
  } = useFormContext();
  const loanType = watch('loanType');
  const panVerification = useVerification();
  const aadhaarVerification = useVerification();

  const handlePanBlur = async (e) => {
    const value = e.target.value.toUpperCase();
    setValue('panNumber', value);
    const allowed = loanType === 'Business' ? ['P', 'C', 'F'] : ['P'];
    const result = validatePAN(value, allowed);
    const ok = await panVerification.verify(result.valid);
    setValue('panVerified', ok, { shouldValidate: true });
  };

  const handleAadhaarBlur = async (e) => {
    const value = e.target.value.replace(/\s/g, '');
    setValue('aadhaarNumber', value);
    const result = validateAadhaar(value);
    const ok = await aadhaarVerification.verify(result.valid);
    setValue('aadhaarVerified', ok, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <MaskedInput
          id="panNumber"
          label="PAN Number *"
          verified={panVerification.isVerified}
          verifiedValue={maskPII(watch('panNumber'))}
          onReveal={() => setValue('panVerified', false)}
          maxLength={10}
          {...register('panNumber')}
          onBlur={handlePanBlur}
          error={errors.panNumber?.message || errors.panVerified?.message}
        />
        {panVerification.isVerifying && <p className="text-xs text-slate-500 mt-1">Verifying with NSDL…</p>}
      </div>

      <div>
        <MaskedInput
          id="aadhaarNumber"
          label="Aadhaar Number *"
          verified={aadhaarVerification.isVerified}
          verifiedValue={maskAadhaar(watch('aadhaarNumber'))}
          onReveal={() => setValue('aadhaarVerified', false)}
          maxLength={12}
          {...register('aadhaarNumber')}
          onBlur={handleAadhaarBlur}
          error={errors.aadhaarNumber?.message || errors.aadhaarVerified?.message}
        />
        {aadhaarVerification.isVerifying && <p className="text-xs text-slate-500 mt-1">Verifying with UIDAI…</p>}
      </div>

      <Controller
        name="aadhaarConsent"
        control={control}
        render={({ field }) => (
          <Checkbox
            id="aadhaarConsent"
            label="I explicitly consent to LendSwift verifying my Aadhaar details for this application."
            checked={field.value || false}
            onChange={(e) => field.onChange(e.target.checked)}
            error={errors.aadhaarConsent?.message}
          />
        )}
      />

      <Input id="voterID" label="Voter ID (optional)" {...register('voterID')} error={errors.voterID?.message} />
      {loanType === 'Home' && watch('loanAmount') > 5000000 && (
        <Input id="passport" label="Passport (optional)" {...register('passport')} error={errors.passport?.message} />
      )}
    </div>
  );
}
