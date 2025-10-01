'use server';

import { convertCurrency } from '@/ai/flows/currency-conversion-tool';
import { convertCrypto } from '@/ai/flows/crypto-conversion-tool';
import { calculatePaycheck } from '@/ai/flows/paycheck-calculator-flow';
import { currencyConversionSchema, paycheckCalculatorSchema, cryptoConversionSchema } from '@/lib/schemas';
import { z } from 'zod';

export async function handleCurrencyConversion(values: z.infer<typeof currencyConversionSchema>) {
  const validatedFields = currencyConversionSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const { amount, sourceCurrency, targetCurrency } = validatedFields.data;
    
    // Mock user data for the AI to infer local currency if source is not provided.
    // In a real app, this could come from user's profile, browser locale, or GeoIP.
    const userData = JSON.stringify({
      locale: 'en-US',
      timeZone: 'America/New_York',
      ip_address: '73.71.224.162' // Example IP from New York
    });

    const result = await convertCurrency({
      amount,
      sourceCurrency,
      targetCurrency,
      userData,
    });
    
    return { success: result };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to convert currency. Please try again.' };
  }
}

export async function handleCryptoConversion(values: z.infer<typeof cryptoConversionSchema>) {
  const validatedFields = cryptoConversionSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const result = await convertCrypto(validatedFields.data);
    return { success: result };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to convert cryptocurrency. Please try again.' };
  }
}

export async function handleIncomeTaxCalculation(values: z.infer<typeof paycheckCalculatorSchema>) {
  const validatedFields = paycheckCalculatorSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const result = await calculatePaycheck(validatedFields.data);
    return { success: result };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to calculate paycheck. Please try again.' };
  }
}
