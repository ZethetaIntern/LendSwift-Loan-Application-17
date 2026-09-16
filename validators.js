// Core validation primitives for Indian financial-form fields.
// Kept dependency-free and pure so they can be unit tested in isolation.

export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

// 4th character of a PAN indicates the entity/holder type.
export const PAN_ENTITY_TYPES = {
  P: 'Individual',
  C: 'Company',
  H: 'HUF',
  A: 'AOP',
  B: 'BOI',
  G: 'Government',
  J: 'Artificial Juridical Person',
  L: 'Local Authority',
  F: 'Firm',
  T: 'Trust',
};

/**
 * Validates PAN format and, optionally, restricts which entity types are
 * acceptable for the given loan type (e.g. only individuals for personal loans).
 */
export function validatePAN(value, allowedEntityTypes = ['P']) {
  if (!value) return { valid: false, error: 'PAN is required' };
  const upper = value.toUpperCase();
  if (!PAN_REGEX.test(upper)) {
    return { valid: false, error: 'PAN must be in the format AAAAA9999A' };
  }
  const entityChar = upper[3];
  if (!PAN_ENTITY_TYPES[entityChar]) {
    return {
      valid: false,
      error: 'PAN 4th character must indicate entity type (P for Individual, C for Company, etc.)',
    };
  }
  if (!allowedEntityTypes.includes(entityChar)) {
    return {
      valid: false,
      error: `This PAN belongs to a ${PAN_ENTITY_TYPES[entityChar]}; an Individual PAN is required for this loan type`,
    };
  }
  return { valid: true, entityType: PAN_ENTITY_TYPES[entityChar] };
}

// ---- Verhoeff checksum algorithm (used by Aadhaar) ----
const VERHOEFF_D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const VERHOEFF_P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

const VERHOEFF_INV = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

export function verhoeffChecksum(numString) {
  let c = 0;
  const digits = numString.split('').reverse().map(Number);
  digits.forEach((digit, i) => {
    c = VERHOEFF_D[c][VERHOEFF_P[i % 8][digit]];
  });
  return c;
}

export function verhoeffValidate(numString) {
  return verhoeffChecksum(numString) === 0;
}

export function verhoeffGenerateCheckDigit(numStringWithoutCheck) {
  let c = 0;
  const digits = numStringWithoutCheck.split('').reverse().map(Number);
  digits.forEach((digit, i) => {
    c = VERHOEFF_D[c][VERHOEFF_P[(i + 1) % 8][digit]];
  });
  return VERHOEFF_INV[c];
}

export function validateAadhaar(value) {
  if (!value) return { valid: false, error: 'Aadhaar number is required' };
  const digitsOnly = value.replace(/\s/g, '');
  if (!/^\d{12}$/.test(digitsOnly)) {
    return { valid: false, error: 'Aadhaar must be exactly 12 digits' };
  }
  if (!verhoeffValidate(digitsOnly)) {
    return { valid: false, error: 'Aadhaar number failed checksum validation' };
  }
  return { valid: true };
}

export function maskAadhaar(value) {
  const digits = (value || '').replace(/\s/g, '');
  if (digits.length < 4) return digits;
  return `XXXX XXXX ${digits.slice(-4)}`;
}

export function maskPII(value, visibleChars = 4) {
  if (!value) return '';
  if (value.length <= visibleChars) return value;
  return `${'X'.repeat(value.length - visibleChars)}${value.slice(-visibleChars)}`;
}

export const MOBILE_REGEX = /^[6-9]\d{9}$/;

export function validateMobile(value) {
  if (!MOBILE_REGEX.test(value || '')) {
    return { valid: false, error: 'Enter a valid 10-digit mobile number starting with 6-9' };
  }
  return { valid: true };
}

export const NAME_REGEX = /^[A-Za-z][A-Za-z .]{1,99}$/;

export function validateName(value) {
  if (!value || !NAME_REGEX.test(value.trim())) {
    return { valid: false, error: 'Enter 2-100 letters; only spaces and periods are allowed' };
  }
  return { valid: true };
}

export function calculateAge(dobString) {
  if (!dobString) return null;
  const dob = new Date(dobString);
  if (Number.isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
}

/**
 * GST format: 2-digit state code + 10-char PAN + 1 entity number + 'Z' + 1 checksum.
 */
export const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export function validateGST(value) {
  if (!GST_REGEX.test(value || '')) {
    return { valid: false, error: 'GST number must be 15 characters in the standard format' };
  }
  return { valid: true };
}

export function validatePinCode(value) {
  if (!/^\d{6}$/.test(value || '')) {
    return { valid: false, error: 'PIN code must be exactly 6 digits' };
  }
  return { valid: true };
}
