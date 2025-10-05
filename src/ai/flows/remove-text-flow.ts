'use server';
/**
 * @fileOverview An AI-powered tool to remove text from an image.
 * 
 * - removeText - A function that takes an image and returns a version with the text removed.
 * - RemoveTextInput - The input type for the removeText function.
 * - RemoveTextOutput - The return type for the removeText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const RemoveTextInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The image to process, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RemoveTextInput = z.infer<typeof RemoveTextInputSchema>;

const RemoveTextOutputSchema = z.object({
  outputImageUri: z.string().describe('The processed image with the text removed, as a data URI.'),
});
export type RemoveTextOutput = z.infer<typeof RemoveTextOutputSchema>;


export async function removeText(input: RemoveTextInput): Promise<RemoveTextOutput> {
  return removeTextFlow(input);
}

const removeTextFlow = ai.defineFlow(
  {
    name: 'removeTextFlow',
    inputSchema: RemoveTextInputSchema,
    outputSchema: RemoveTextOutputSchema,
  },
  async ({imageDataUri}) => {
    
    const prompt = `Given the image, remove any and all text from it. The output should be the image with the text seamlessly removed and the background inpainted.`;

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {media: {url: imageDataUri}},
        {text: prompt},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
        throw new Error('Image processing failed to return an image.');
    }
    
    return {
      outputImageUri: media.url,
    };
  }
);
