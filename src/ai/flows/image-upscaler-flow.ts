'use server';
/**
 * @fileOverview An AI-powered tool to upscale and enhance an image.
 *
 * - upscaleImage - A function that takes an image and returns a higher-quality version.
 * - ImageUpscalerInput - The input type for the upscaleImage function.
 * - ImageUpscalerOutput - The return type for the upscaleImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ImageUpscalerInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The image to process, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ImageUpscalerInput = z.infer<typeof ImageUpscalerInputSchema>;

const ImageUpscalerOutputSchema = z.object({
  outputImageUri: z.string().describe('The processed, upscaled image as a data URI.'),
});
export type ImageUpscalerOutput = z.infer<typeof ImageUpscalerOutputSchema>;


export async function upscaleImage(input: ImageUpscalerInput): Promise<ImageUpscalerOutput> {
  return imageUpscalerFlow(input);
}

const imageUpscalerFlow = ai.defineFlow(
  {
    name: 'imageUpscalerFlow',
    inputSchema: ImageUpscalerInputSchema,
    outputSchema: ImageUpscalerOutputSchema,
  },
  async ({ imageDataUri }) => {
    const prompt = `Upscale and enhance the quality of this image. Increase the resolution and clarity while maintaining the original subject and style.`;

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        { media: { url: imageDataUri } },
        { text: prompt },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
        throw new Error('Image upscaling failed to return an image.');
    }
    
    return {
      outputImageUri: media.url,
    };
  }
);
