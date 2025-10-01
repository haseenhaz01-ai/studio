import { z } from 'zod';

export const currencyConversionSchema = z.object({
  amount: z.coerce.number().min(0.01, { message: 'Amount must be greater than 0.' }),
  sourceCurrency: z.string().min(3, { message: 'Please select a source currency.' }),
  targetCurrency: z.string().min(3, { message: 'Please select a target currency.' }),
});

export const loanCalculatorSchema = z.object({
    loanAmount: z.coerce.number().min(1, { message: 'Loan amount must be at least 1.' }),
    interestRate: z.coerce.number().min(0.1, { message: 'Interest rate must be positive.' }).max(100, { message: 'Interest rate cannot exceed 100%.' }),
    tenure: z.coerce.number().min(1, { message: 'Tenure must be at least 1 year.' }).max(50, { message: 'Tenure cannot exceed 50 years.' }),
});

export const simpleCalculatorSchema = z.object({
  number1: z.coerce.number(),
  number2: z.coerce.number(),
  operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
});

export const retirementCalculatorSchema = z.object({
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

export const paycheckCalculatorSchema = z.object({
    grossPay: z.coerce.number().positive("Gross pay must be a positive number."),
    payFrequency: z.enum(['annually', 'monthly', 'bi-weekly', 'weekly']),
    filingStatus: z.enum(['single', 'married_jointly', 'married_separately', 'head_of_household']),
    state: z.string().min(2, "Please select a state."),
  });

export const calorieCalculatorSchema = z.object({
  gender: z.enum(['male', 'female']),
  age: z.coerce.number().int().min(1, "Age must be at least 1.").max(120),
  heightCm: z.coerce.number().positive("Height must be positive."),
  weightKg: z.coerce.number().positive("Weight must be positive."),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
});

export const lengthConversionSchema = z.object({
  amount: z.coerce.number(),
  fromUnit: z.string().min(1, { message: 'Please select a source unit.' }),
  toUnit: z.string().min(1, { message: 'Please select a target unit.' }),
});

export const temperatureConversionSchema = z.object({
  amount: z.coerce.number(),
  fromUnit: z.enum(['celsius', 'fahrenheit', 'kelvin']),
  toUnit: z.enum(['celsius', 'fahrenheit', 'kelvin']),
});

export const fractionSchema = z.object({
    numerator1: z.coerce.number().int(),
    denominator1: z.coerce.number().int().refine(n => n !== 0, { message: "Cannot be zero." }),
    numerator2: z.coerce.number().int(),
    denominator2: z.coerce.number().int().refine(n => n !== 0, { message: "Cannot be zero." }),
    operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
});

export const quadraticSchema = z.object({
  a: z.coerce.number().refine(n => n !== 0, { message: 'Coefficient "a" cannot be zero.' }),
  b: z.coerce.number(),
  c: z.coerce.number(),
});

export const inflationCalculatorSchema = z.object({
  initialAmount: z.coerce.number().min(0, { message: 'Initial amount must be a positive number.' }),
  inflationRate: z.coerce.number().min(0, { message: 'Inflation rate must be a positive number.' }),
  startYear: z.coerce.number().int().min(1900, { message: 'Start year must be after 1900.' }),
  endYear: z.coerce.number().int(),
}).refine(data => data.endYear >= data.startYear, {
    message: "End year must be greater than or equal to start year.",
    path: ["endYear"],
});

export const salesTaxSchema = z.object({
  amount: z.coerce.number().min(0.01, { message: 'Amount must be a positive number.' }),
  taxRate: z.coerce.number().min(0, { message: 'Tax rate must be a positive number.' }),
});

const percentOfSchema = z.object({
  mode: z.literal('percentOf'),
  percentage: z.coerce.number().min(0, "Percentage must be positive."),
  baseValue: z.coerce.number().min(0, "Base value must be positive."),
});

const isWhatPercentSchema = z.object({
  mode: z.literal('isWhatPercent'),
  partValue: z.coerce.number().min(0, "Value must be positive."),
  totalValue: z.coerce.number().min(0, "Total value must be positive."),
});

const percentChangeSchema = z.object({
  mode: z.literal('percentChange'),
  initialValue: z.coerce.number().min(0, "Initial value must be positive."),
  finalValue: z.coerce.number().min(0, "Final value must be positive."),
});

export const percentageCalculatorSchema = z.discriminatedUnion('mode', [
  percentOfSchema,
  isWhatPercentSchema,
  percentChangeSchema,
]);

export const randomNumberGeneratorSchema = z.object({
  min: z.coerce.number().int(),
  max: z.coerce.number().int(),
}).refine(data => data.max > data.min, {
  message: "Max must be greater than min.",
  path: ["max"],
});

export const triangleCalculatorSchema = z.object({
  sideA: z.coerce.number().positive("Side A must be positive."),
  sideB: z.coerce.number().positive("Side B must be positive."),
  sideC: z.coerce.number().positive("Side C must be positive."),
}).refine(data => data.sideA + data.sideB > data.sideC, {
  message: "The sum of any two sides must be greater than the third side.",
  path: ["root"],
}).refine(data => data.sideA + data.sideC > data.sideB, {
  message: "The sum of any two sides must be greater than the third side.",
  path: ["root"],
}).refine(data => data.sideB + data.sideC > data.sideA, {
  message: "The sum of any two sides must be greater than the third side.",
  path: ["root"],
});

const bodyFatBaseSchema = z.object({
    unit: z.enum(['metric', 'imperial']),
    age: z.coerce.number().int().min(18, "Must be 18 or older.").max(100),
    height: z.coerce.number().positive("Height must be positive."),
    neck: z.coerce.number().positive("Neck measurement must be positive."),
    waist: z.coerce.number().positive("Waist measurement must be positive."),
  });
  
  const maleSchema = bodyFatBaseSchema.extend({
    gender: z.literal('male'),
  });
  
  const femaleSchema = bodyFatBaseSchema.extend({
    gender: z.literal('female'),
    hip: z.coerce.number().positive("Hip measurement must be positive."),
  });
  
  export const bodyFatCalculatorSchema = z.discriminatedUnion('gender', [
    maleSchema,
    femaleSchema,
  ]);

  const idealWeightBaseSchema = z.object({
    gender: z.enum(['male', 'female']),
    unit: z.enum(['metric', 'imperial']),
  });
  
  const idealWeightMetricSchema = idealWeightBaseSchema.extend({
    unit: z.literal('metric'),
    heightCm: z.coerce.number().positive("Height must be positive."),
  });
  
  const idealWeightImperialSchema = idealWeightBaseSchema.extend({
    unit: z.literal('imperial'),
    heightFt: z.coerce.number().positive("Feet must be positive."),
    heightIn: z.coerce.number().min(0, "Inches must be non-negative.").max(11.99),
  });
  
  export const idealWeightSchema = z.discriminatedUnion('unit', [
    idealWeightMetricSchema,
    idealWeightImperialSchema,
  ]);

  export const paceCalculatorSchema = z.object({
    distance: z.coerce.number().positive("Distance must be positive."),
    distanceUnit: z.enum(['km', 'miles']),
    hours: z.coerce.number().min(0).optional(),
    minutes: z.coerce.number().min(0).optional(),
    seconds: z.coerce.number().min(0).optional(),
  }).refine(data => (data.hours || 0) + (data.minutes || 0) + (data.seconds || 0) > 0, {
      message: "Total time must be greater than zero.",
      path: ["hours"],
  });

  export const pregnancyCalculatorSchema = z.object({
    lmp: z.date({
      required_error: "Last menstrual period date is required.",
    }),
  });

  export const gpaCalculatorSchema = z.object({
    courses: z.array(z.object({
      name: z.string().optional(),
      grade: z.string().min(1, { message: "Select grade." }),
      credits: z.coerce.number().min(0.5, { message: "Credits must be > 0." }),
    })).min(1, 'Please add at least one course.'),
  });

  export const concreteCalculatorSchema = z.object({
    unit: z.enum(['imperial', 'metric']),
    length: z.coerce.number().positive("Length must be positive."),
    width: z.coerce.number().positive("Width must be positive."),
    thickness: z.coerce.number().positive("Thickness must be positive."),
});

const ipAddressRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const cidrRegex = /^([0-9]|[1-2][0-9]|3[0-2])$/;

export const subnetCalculatorSchema = z.object({
  ipAddress: z.string().regex(ipAddressRegex, { message: "Invalid IPv4 address format." }),
  subnet: z.string().refine(value => {
    return cidrRegex.test(value) || ipAddressRegex.test(value);
  }, { message: "Invalid CIDR or subnet mask." }),
});

export const passwordGeneratorSchema = z.object({
  length: z.coerce.number().min(4, "Must be at least 4.").max(128, "Cannot exceed 128."),
  uppercase: z.boolean(),
  lowercase: z.boolean(),
  numbers: z.boolean(),
  symbols: z.boolean(),
}).refine(data => data.uppercase || data.lowercase || data.numbers || data.symbols, {
  message: "At least one character type must be selected.",
  path: ["uppercase"],
});

export const paypalFeeSchema = z.object({
  amount: z.coerce.number().positive("Amount must be a positive number."),
});

export const imageCompressorSchema = z.object({
  quality: z.coerce.number().min(0).max(1),
});
