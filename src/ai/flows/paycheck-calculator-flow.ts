'use server';
/**
 * @fileOverview An AI-powered paycheck calculator.
 *
 * - calculatePaycheck - A function that calculates net pay after taxes.
 * - PaycheckCalculatorInput - The input type for the calculatePaycheck function.
 * - PaycheckCalculatorOutput - The return type for the calculatePaycheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PaycheckCalculatorInputSchema = z.object({
  grossPay: z.number().describe('The gross pay amount for the period.'),
  payFrequency: z.enum(['annually', 'monthly', 'bi-weekly', 'weekly']).describe('The frequency of the paycheck.'),
  filingStatus: z.enum(['single', 'married_jointly', 'married_separately', 'head_of_household']).describe('The federal tax filing status.'),
  state: z.string().describe('The 2-letter abbreviation for the US state of employment (e.g., CA, NY, TX).'),
});
export type PaycheckCalculatorInput = z.infer<typeof PaycheckCalculatorInputSchema>;

const PaycheckCalculatorOutputSchema = z.object({
  netPay: z.number().describe('The net pay (take-home pay) after all taxes.'),
  grossPay: z.number().describe('The gross pay for the period.'),
  federalTax: z.number().describe('The estimated federal income tax withheld.'),
  stateTax: z.number().describe('The estimated state income tax withheld. 0 for states with no income tax.'),
  socialSecurity: z.number().describe('The Social Security tax (FICA).'),
  medicare: z.number().describe('The Medicare tax (FICA).'),
});
export type PaycheckCalculatorOutput = z.infer<typeof PaycheckCalculatorOutputSchema>;

export async function calculatePaycheck(input: PaycheckCalculatorInput): Promise<PaycheckCalculatorOutput> {
  return paycheckCalculatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'paycheckCalculatorPrompt',
  input: {schema: PaycheckCalculatorInputSchema},
  output: {schema: PaycheckCalculatorOutputSchema},
  prompt: `You are an expert payroll specialist. Calculate the net take-home pay for a paycheck based on the provided information.

  Use the current tax year's rates for all calculations.

  1.  **Determine Annual Gross Pay**: If the pay frequency is not annual, calculate the equivalent annual gross pay.
  2.  **Calculate Federal Taxes**: Based on the annual gross pay and filing status, determine the applicable federal income tax.
  3.  **Calculate State Taxes**: Based on the annual gross pay, filing status, and state, determine the applicable state income tax. Account for states with no income tax.
  4.  **Calculate FICA Taxes**:
      *   Social Security: 6.2% of gross pay up to the annual limit.
      *   Medicare: 1.45% of all gross pay.
  5.  **Calculate Net Pay**: Subtract all calculated taxes from the gross pay for the given pay frequency.
  6.  **Return values per pay period**: All the output values (netPay, federalTax, stateTax, etc.) must be for the specified pay frequency, not the annualized amounts.

  User Input:
  Gross Pay: {{{grossPay}}}
  Pay Frequency: {{{payFrequency}}}
  Filing Status: {{{filingStatus}}}
  State: {{{state}}}

  Return ONLY a valid JSON object with the calculated breakdown for the pay period.
  `,
});

const paycheckCalculatorFlow = ai.defineFlow(
  {
    name: 'paycheckCalculatorFlow',
    inputSchema: PaycheckCalculatorInputSchema,
    outputSchema: PaycheckCalculatorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
