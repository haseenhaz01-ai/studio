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

export const investmentCalculatorSchema = z.object({
  initialAmount: z.coerce.number().min(0, { message: 'Initial amount must be positive.' }),
  monthlyContribution: z.coerce.number().min(0, { message: 'Monthly contribution must be positive.' }),
  interestRate: z.coerce.number().min(0.1, { message: 'Interest rate must be positive.' }).max(100, { message: 'Interest rate cannot exceed 100%.' }),
  tenure: z.coerce.number().min(1, { message: 'Tenure must be at least 1 year.' }).max(50, { message: 'Tenure cannot exceed 50 years.' }),
});

export const contributionMarginSchema = z.object({
  totalSales: z.coerce.number().min(0, { message: 'Total sales must be a positive number.' }),
  totalVariableCosts: z.coerce.number().min(0, { message: 'Total variable costs must be a positive number.' }),
}).refine(data => data.totalSales > data.totalVariableCosts, {
  message: "Total Sales must be greater than Total Variable Costs.",
  path: ["totalSales"],
});

export const cogsSchema = z.object({
  beginningInventory: z.coerce.number().min(0, { message: 'Beginning inventory must be a positive number.' }),
  purchases: z.coerce.number().min(0, { message: 'Purchases must be a positive number.' }),
  endingInventory: z.coerce.number().min(0, { message: 'Ending inventory must be a positive number.' }),
});

export const cpcCpmSchema = z.object({
  totalCost: z.coerce.number().min(0.01, 'Total Cost must be positive'),
  totalClicks: z.coerce.number().min(1, 'Total Clicks must be at least 1').optional(),
  totalImpressions: z.coerce.number().min(1, 'Total Impressions must be at least 1').optional(),
});

export const exitRateSchema = z.object({
  totalExits: z.coerce.number().min(0, { message: 'Total exits must be a positive number.' }),
  totalPageviews: z.coerce.number().min(1, { message: 'Total pageviews must be at least 1.' }),
}).refine(data => data.totalPageviews >= data.totalExits, {
  message: 'Total Pageviews must be greater than or equal to Total Exits.',
  path: ['totalPageviews'],
});

export const adsenseSchema = z.object({
  pageImpressions: z.coerce.number().min(1, { message: 'Page impressions must be at least 1.' }),
  ctr: z.coerce.number().min(0, { message: 'CTR must be a positive number.' }).max(100, { message: 'CTR cannot be more than 100%.' }),
  cpc: z.coerce.number().min(0.01, { message: 'CPC must be a positive number.' }),
});

export const grpSchema = z.object({
  reach: z.coerce.number().min(0, { message: 'Reach must be a positive number.' }).max(100, { message: 'Reach cannot be more than 100%.' }),
  averageFrequency: z.coerce.number().min(0.1, { message: 'Average frequency must be a positive number.' }),
});
