'use server';
/**
 * @fileOverview An AI-powered tool to extract text from an image (OCR).
 *
 * - imageToText - A function that takes an image and returns the text found within it.
 * - ImageToTextInput - The input type for the imageToText function.
 * - ImageToTextOutput - The return type for the imageToText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ImageToTextInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image containing text, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ImageToTextInput = z.infer<typeof ImageToTextInputSchema>;

const ImageToTextOutputSchema = z.object({
  extractedText: z.string().describe('The text extracted from the image.'),
});
export type ImageToTextOutput = z.infer<typeof ImageToTextOutputSchema>;


export async function imageToText(input: ImageToTextInput): Promise<ImageToTextOutput> {
  return imageToTextFlow(input);
}

const imageToTextFlow = ai.defineFlow(
  {
    name: 'imageToTextFlow',
    inputSchema: ImageToTextInputSchema,
    outputSchema: ImageToTextOutputSchema,
  },
  async ({ imageDataUri }) => {
    const prompt = `Perform OCR (Optical Character Recognition) on this image. Extract all text from the image accurately. Preserve line breaks.`;

    const { output } = await ai.generate({
      prompt: [
        { media: { url: imageDataUri } },
        { text: prompt },
      ],
      output: {
          format: "text"
      }
    });

    if (!output) {
        throw new Error('Text extraction failed to return any text.');
    }
    
    return {
      extractedText: output,
    };
  }
);
