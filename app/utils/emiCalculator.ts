// EMI Calculator Utility Functions

export type CurrencyType = 'BDT' | 'USD';

// Function to calculate EMI
export const calculateEMI = (
  loanAmount: number,
  interestRate: number,
  loanTenure: number
): number => {
  // Convert interest rate from percentage to decimal and then to monthly rate
  const monthlyInterestRate = interestRate / 12 / 100;
  
  // Convert loan tenure from years to months
  const loanTenureInMonths = loanTenure * 12;
  
  // Calculate EMI using the formula: P * r * (1+r)^n / ((1+r)^n - 1)
  // Where P = Principal (loan amount), r = monthly interest rate, n = loan tenure in months
  if (monthlyInterestRate === 0) {
    return loanAmount / loanTenureInMonths;
  }
  
  const emi =
    (loanAmount *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, loanTenureInMonths)) /
    (Math.pow(1 + monthlyInterestRate, loanTenureInMonths) - 1);
    
  return emi;
};

// Function to calculate total payment
export const calculateTotalPayment = (
  emi: number,
  loanTenureInYears: number
): number => {
  const totalPayment = emi * loanTenureInYears * 12;
  return totalPayment;
};

// Function to calculate total interest
export const calculateTotalInterest = (
  totalPayment: number,
  loanAmount: number
): number => {
  const totalInterest = totalPayment - loanAmount;
  return totalInterest;
};

// Function to generate amortization schedule
export interface AmortizationRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export const generateAmortizationSchedule = (
  loanAmount: number,
  interestRate: number,
  loanTenureInYears: number
): AmortizationRow[] => {
  const schedule: AmortizationRow[] = [];
  
  const monthlyInterestRate = interestRate / 12 / 100;
  const loanTenureInMonths = loanTenureInYears * 12;
  const emi = calculateEMI(loanAmount, interestRate, loanTenureInYears);
  
  let remainingBalance = loanAmount;
  
  for (let month = 1; month <= loanTenureInMonths; month++) {
    // Calculate interest for the current month
    const interestForMonth = remainingBalance * monthlyInterestRate;
    
    // Calculate principal for the current month
    const principalForMonth = emi - interestForMonth;
    
    // Update the remaining balance
    remainingBalance = remainingBalance - principalForMonth;
    
    // Add row to the schedule
    schedule.push({
      month,
      emi,
      principal: principalForMonth,
      interest: interestForMonth,
      balance: Math.max(0, remainingBalance), // Ensure balance doesn't go below 0
    });
  }
  
  return schedule;
};

// Format number as currency
export const formatCurrency = (value: number, currencyType: CurrencyType = 'BDT'): string => {
  const currencyConfig: Record<CurrencyType, { locale: string, currency: string }> = {
    BDT: { locale: 'bn-BD', currency: 'BDT' },
    USD: { locale: 'en-US', currency: 'USD' }
  };
  
  const config = currencyConfig[currencyType];
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Get currency symbol
export const getCurrencySymbol = (currencyType: CurrencyType): string => {
  return currencyType === 'BDT' ? '৳' : '$';
}; 