'use server';

/**
 * @fileOverview AI-powered currency conversion tool.
 *
 * - convertCurrency - A function that converts currencies using AI.
 * - CurrencyConversionInput - The input type for the convertCurrency function.
 * - CurrencyConversionOutput - The return type for the convertCurrency function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CurrencyConversionInputSchema = z.object({
  amount: z.number().describe('The amount to convert.'),
  sourceCurrency: z.string().describe('The source currency code (e.g., USD).'),
  targetCurrency: z.string().describe('The target currency code (e.g., EUR).'),
  userData: z.string().optional().describe('Optional user data to help determine the source currency automatically.'),
});

export type CurrencyConversionInput = z.infer<typeof CurrencyConversionInputSchema>;

const CurrencyConversionOutputSchema = z.object({
  convertedAmount: z.number().describe('The converted amount in the target currency.'),
});

export type CurrencyConversionOutput = z.infer<typeof CurrencyConversionOutputSchema>;

export async function convertCurrency(input: CurrencyConversionInput): Promise<CurrencyConversionOutput> {
  return convertCurrencyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'currencyConversionPrompt',
  input: {schema: CurrencyConversionInputSchema},
  output: {schema: CurrencyConversionOutputSchema},
  prompt: `You are a currency conversion expert.

  The user wants to convert an amount from one currency to another.

  Amount: {{{amount}}}
  Source Currency: {{{sourceCurrency}}}
  Target Currency: {{{targetCurrency}}}
  User Data: {{{userData}}}

  If the source currency is not provided, attempt to determine it from the user data.  The user data may contain information about the user's location, IP address, or other identifying information that can be used to infer the currency.

  Using the latest exchange rates, convert the amount from the source currency to the target currency.

  Return ONLY a valid JSON object with the converted amount.
  `,
});

const convertCurrencyFlow = ai.defineFlow(
  {
    name: 'convertCurrencyFlow',
    inputSchema: CurrencyConversionInputSchema,
    outputSchema: CurrencyConversionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
