'use server';
/**
 * @fileOverview An AI-powered tool to remove the background from an image.
 * 
 * - removeBackground - A function that takes an image and returns a version with the background removed.
 * - BackgroundRemoverInput - The input type for the removeBackground function.
 * - BackgroundRemoverOutput - The return type for the removeBackground function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BackgroundRemoverInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The image to process, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  backgroundColor: z.string().describe("The desired background for the output image. This can be 'transparent' or a hex color code (e.g., '#FFFFFF')."),
});
export type BackgroundRemoverInput = z.infer<typeof BackgroundRemoverInputSchema>;

const BackgroundRemoverOutputSchema = z.object({
  outputImageUri: z.string().describe('The processed image with the background removed, as a data URI.'),
});
export type BackgroundRemoverOutput = z.infer<typeof BackgroundRemoverOutputSchema>;


export async function removeBackground(input: BackgroundRemoverInput): Promise<BackgroundRemoverOutput> {
  return backgroundRemoverFlow(input);
}

const backgroundRemoverFlow = ai.defineFlow(
  {
    name: 'backgroundRemoverFlow',
    inputSchema: BackgroundRemoverInputSchema,
    outputSchema: BackgroundRemoverOutputSchema,
  },
  async ({imageDataUri, backgroundColor}) => {
    
    const prompt = `Given the image, remove the background. The new background should be ${backgroundColor}. The output should only contain the main subject of the image with the new background.`;

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {media: {url: imageDataUri}},
        {text: prompt},
      ],
      config: {
        responseModalities: ['IMAGE'],
      },
    });

    if (!media.url) {
        throw new Error('Image generation failed to return an image.');
    }
    
    return {
      outputImageUri: media.url,
    };
  }
);
