// Reducing-balance EMI math and India-specific number formatting.

export const INTEREST_RATES = {
  Personal: 10.5,
  Home: 8.5,
  Business: 14,
};

/**
 * Standard reducing-balance EMI formula:
 * EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 * where r is the *monthly* rate and n is the tenure in months.
 */
export function calculateEMI(principal, annualRatePercent, tenureMonths) {
  if (!principal || !tenureMonths) return 0;
  const r = annualRatePercent / 12 / 100;
  if (r === 0) return principal / tenureMonths;
  const factor = (1 + r) ** tenureMonths;
  return (principal * r * factor) / (factor - 1);
}

export function calculateProcessingFee(principal) {
  const fee = principal * 0.01;
  return Math.min(Math.max(fee, 2000), 25000);
}

export function calculateTotalCostOfBorrowing(emi, tenureMonths, principal) {
  return emi * tenureMonths - principal;
}

export function getLoanSummary({ loanType, loanAmount, loanTenure }) {
  const rate = INTEREST_RATES[loanType] ?? INTEREST_RATES.Personal;
  const emi = calculateEMI(loanAmount, rate, loanTenure);
  const totalCost = calculateTotalCostOfBorrowing(emi, loanTenure, loanAmount);
  const processingFee = calculateProcessingFee(loanAmount);
  return {
    interestRate: rate,
    emi,
    totalCost,
    processingFee,
  };
}

/** Formats a number using the Indian numbering system, e.g. 1050000 -> "10,50,000". */
export function formatINR(value, { withSymbol = true, decimals = 0 } = {}) {
  if (value === null || value === undefined || Number.isNaN(value)) return '-';
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
  return withSymbol ? `₹${formatted}` : formatted;
}

/** EMI-to-income affordability check: combined EMI must not exceed 50% of income. */
export function checkEmiAffordability(emi, monthlyIncome) {
  if (!monthlyIncome) return { withinLimit: true, ratio: 0 };
  const ratio = emi / monthlyIncome;
  return { withinLimit: ratio <= 0.5, ratio };
}
