'use server';
/**
 * @fileOverview An AI-powered tool to remove an object from an image based on a text prompt.
 * 
 * - removeObject - A function that takes an image and a prompt, and returns a version with the specified object removed.
 * - ObjectRemoverInput - The input type for the removeObject function.
 * - ObjectRemoverOutput - The return type for the removeObject function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ObjectRemoverInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The image to process, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  prompt: z.string().describe("A text description of the object to remove from the image."),
});
export type ObjectRemoverInput = z.infer<typeof ObjectRemoverInputSchema>;

const ObjectRemoverOutputSchema = z.object({
  outputImageUri: z.string().describe('The processed image with the object removed, as a data URI.'),
});
export type ObjectRemoverOutput = z.infer<typeof ObjectRemoverOutputSchema>;


export async function removeObject(input: ObjectRemoverInput): Promise<ObjectRemoverOutput> {
  return objectRemoverFlow(input);
}

const objectRemoverFlow = ai.defineFlow(
  {
    name: 'objectRemoverFlow',
    inputSchema: ObjectRemoverInputSchema,
    outputSchema: ObjectRemoverOutputSchema,
  },
  async ({imageDataUri, prompt}) => {
    
    const fullPrompt = `Given the image, remove the following object: ${prompt}. The output should be the image with the specified object seamlessly removed and the background inpainted.`;

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {media: {url: imageDataUri}},
        {text: fullPrompt},
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
