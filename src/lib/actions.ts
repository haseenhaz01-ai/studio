'use server';

import { convertCurrency } from '@/ai/flows/currency-conversion-tool';
import { convertCrypto } from '@/ai/flows/crypto-conversion-tool';
import { calculatePaycheck } from '@/ai/flows/paycheck-calculator-flow';
import { removeBackground } from '@/ai/flows/background-remover-flow';
import { upscaleImage } from '@/ai/flows/image-upscaler-flow';
import { imageToText } from '@/ai/flows/image-to-text-flow';
import { imageToVideo } from '@/ai/flows/image-to-video-flow';
import { currencyConversionSchema, paycheckCalculatorSchema, cryptoConversionSchema, backgroundRemoverSchema } from '@/lib/schemas';
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

export async function handleBackgroundRemoval(values: { imageDataUri: string, backgroundColor: string }) {
    try {
        const result = await removeBackground({ 
            imageDataUri: values.imageDataUri, 
            backgroundColor: values.backgroundColor 
        });
        return { success: result };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to remove background. Please try again.' };
    }
}

export async function handleImageUpscaling(values: { imageDataUri: string }) {
    try {
        const result = await upscaleImage({ imageDataUri: values.imageDataUri });
        return { success: result };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to upscale image. Please try again.' };
    }
}

export async function handleImageToText(values: { imageDataUri: string }) {
    try {
        const result = await imageToText({ imageDataUri: values.imageDataUri });
        return { success: result };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to extract text from image. Please try again.' };
    }
}

export async function handleImageToVideo(values: { imageDataUri: string, prompt: string }) {
    try {
        const result = await imageToVideo(values);
        return { success: result };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to generate video. Please try again.' };
    }
}
