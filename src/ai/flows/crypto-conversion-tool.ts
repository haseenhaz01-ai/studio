'use server';

/**
 * @fileOverview AI-powered cryptocurrency conversion tool.
 *
 * - convertCrypto - A function that converts between crypto and fiat currencies using AI.
 * - CryptoConversionInput - The input type for the convertCrypto function.
 * - CryptoConversionOutput - The return type for the convertCrypto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CryptoConversionInputSchema = z.object({
  amount: z.number().describe('The amount to convert.'),
  sourceCurrency: z.string().describe('The source currency code (e.g., BTC, ETH, USD).'),
  targetCurrency: z.string().describe('The target currency code (e.g., USD, EUR, BTC).'),
});

export type CryptoConversionInput = z.infer<typeof CryptoConversionInputSchema>;

const CryptoConversionOutputSchema = z.object({
  convertedAmount: z.number().describe('The converted amount in the target currency.'),
});

export type CryptoConversionOutput = z.infer<typeof CryptoConversionOutputSchema>;

export async function convertCrypto(input: CryptoConversionInput): Promise<CryptoConversionOutput> {
  return convertCryptoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cryptoConversionPrompt',
  input: {schema: CryptoConversionInputSchema},
  output: {schema: CryptoConversionOutputSchema},
  prompt: `You are a cryptocurrency conversion expert. You have access to real-time market data.

  The user wants to convert an amount from one currency to another. The currencies can be either crypto or fiat.

  Amount: {{{amount}}}
  Source Currency: {{{sourceCurrency}}}
  Target Currency: {{{targetCurrency}}}

  Using the latest exchange rates, convert the amount from the source currency to the target currency.

  Return ONLY a valid JSON object with the converted amount.
  `,
});

const convertCryptoFlow = ai.defineFlow(
  {
    name: 'convertCryptoFlow',
    inputSchema: CryptoConversionInputSchema,
    outputSchema: CryptoConversionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
