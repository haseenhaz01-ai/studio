import { z } from 'zod';

export const currencyConversionSchema = z.object({
  amount: z.coerce.number().min(0.01, { message: 'Amount must be greater than 0.' }),
  sourceCurrency: z.string().min(3, { message: 'Please select a source currency.' }),
  targetCurrency: z.string().min(3, { message: 'Please select a target currency.' }),
});

export const emiCalculatorSchema = z.object({
    loanAmount: z.coerce.number().min(1, { message: 'Loan amount must be at least 1.' }),
    interestRate: z.coerce.number().min(0.1, { message: 'Interest rate must be positive.' }).max(100, { message: 'Interest rate cannot exceed 100%.' }),
    tenure: z.coerce.number().min(1, { message: 'Tenure must be at least 1 year.' }).max(50, { message: 'Tenure cannot exceed 50 years.' }),
});

export const simpleCalculatorSchema = z.object({
  number1: z.coerce.number(),
  number2: z.coerce.number(),
  operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
});
