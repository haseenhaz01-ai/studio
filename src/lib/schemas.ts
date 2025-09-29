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

export const lernerIndexSchema = z.object({
  price: z.coerce.number().min(0.01, { message: 'Price must be a positive number.' }),
  marginalCost: z.coerce.number().min(0, { message: 'Marginal cost must be a positive number.' }),
}).refine(data => data.price > data.marginalCost, {
  message: "Price must be greater than Marginal Cost.",
  path: ["price"],
});

export const liquidNetWorthSchema = z.object({
  cashAndInvestments: z.coerce.number().min(0, { message: 'Cash and investments must be a positive number.' }),
  shortTermLiabilities: z.coerce.number().min(0, { message: 'Short-term liabilities must be a positive number.' }),
});

export const manHoursSchema = z.object({
  numberOfWorkers: z.coerce.number().min(1, { message: 'Number of workers must be at least 1.' }),
  hoursPerWorker: z.coerce.number().min(0.1, { message: 'Hours per worker must be a positive number.' }),
  numberOfDays: z.coerce.number().min(0.1, { message: 'Number of days must be a positive number.' }),
});

export const ctrSchema = z.object({
  totalClicks: z.coerce.number().min(0, { message: 'Total clicks must be a positive number.' }),
  totalImpressions: z.coerce.number().min(1, { message: 'Total impressions must be at least 1.' }),
}).refine(data => data.totalImpressions >= data.totalClicks, {
  message: 'Total Impressions must be greater than or equal to Total Clicks.',
  path: ['totalImpressions'],
});

export const avmSchema = z.object({
  totalWatchTime: z.coerce.number().min(0.1, { message: 'Total watch time must be a positive number.' }),
  totalViews: z.coerce.number().min(1, { message: 'Total views must be at least 1.' }),
});

export const evmSchema = z.object({
    plannedValue: z.coerce.number().min(0, { message: 'Planned Value (PV) must be a positive number.' }),
    earnedValue: z.coerce.number().min(0, { message: 'Earned Value (EV) must be a positive number.' }),
    actualCost: z.coerce.number().min(0, { message: 'Actual Cost (AC) must be a positive number.' }),
});

const differenceSchema = z.object({
  mode: z.literal('difference'),
  fromDate: z.date(),
  toDate: z.date(),
});

const addSubtractSchema = z.object({
  mode: z.literal('add-subtract'),
  startDate: z.date(),
  operation: z.enum(['add', 'subtract']),
  years: z.coerce.number().int().min(0).optional(),
  months: z.coerce.number().int().min(0).optional(),
  weeks: z.coerce.number().int().min(0).optional(),
  days: z.coerce.number().int().min(0).optional(),
});

export const dateTimeSchema = z.discriminatedUnion('mode', [
  differenceSchema,
  addSubtractSchema,
]);

export const timeCalculatorSchema = z.object({
  times: z.array(z.object({
    hours: z.coerce.number().min(0).optional().default(0),
    minutes: z.coerce.number().min(0).max(59).optional().default(0),
    seconds: z.coerce.number().min(0).max(59).optional().default(0),
    operation: z.enum(['add', 'subtract']),
  })).min(1, 'Please add at least one time entry.'),
});

export const ageSchema = z.object({
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

export const printingCalculatorSchema = z.object({
  value: z.coerce.number(),
  operation: z.enum(['add', 'subtract']),
});

export const scientificCalculatorSchema = z.object({
  expression: z.string(),
});

export const graphingCalculatorSchema = z.object({
    expression: z.string().min(1, { message: "Please enter a function." }),
    xMin: z.coerce.number(),
    xMax: z.coerce.number(),
}).refine(data => data.xMax > data.xMin, {
    message: "xMax must be greater than xMin.",
    path: ["xMax"],
});

export const statisticsCalculatorSchema = z.object({
  data: z.string().min(1, { message: 'Please enter at least one number.' })
    .refine(data => {
      const numbers = data.split(/[\s,]+/).filter(Boolean).map(Number);
      return numbers.length > 0 && numbers.every(n => !isNaN(n));
    }, { message: 'Please enter a valid list of numbers separated by spaces or commas.' }),
});

const metricBmiSchema = z.object({
  unit: z.literal('metric'),
  heightCm: z.coerce.number().positive("Height must be positive."),
  weightKg: z.coerce.number().positive("Weight must be positive."),
});

const imperialBmiSchema = z.object({
    unit: z.literal('imperial'),
    heightFt: z.coerce.number().positive("Height must be positive."),
    heightIn: z.coerce.number().min(0, "Inches must be positive.").max(11.99),
    weightLb: z.coerce.number().positive("Weight must be positive."),
});

export const bmiSchema = z.discriminatedUnion('unit', [
    metricBmiSchema,
    imperialBmiSchema,
]);