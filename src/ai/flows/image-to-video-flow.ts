'use server';
/**
 * @fileOverview An AI-powered tool to generate a short video from an image and a prompt.
 *
 * - imageToVideo - A function that takes an image and a text prompt and returns a video.
 * - ImageToVideoInput - The input type for the imageToVideo function.
 * - ImageToVideoOutput - The return type for the imageToVideo function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/google-genai';

const ImageToVideoInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The source image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  prompt: z.string().describe("A text prompt describing the desired video generation."),
});
export type ImageToVideoInput = z.infer<typeof ImageToVideoInputSchema>;

const ImageToVideoOutputSchema = z.object({
  outputVideoUri: z.string().describe('The generated video as a data URI.'),
});
export type ImageToVideoOutput = z.infer<typeof ImageToVideoOutputSchema>;


export async function imageToVideo(input: ImageToVideoInput): Promise<ImageToVideoOutput> {
  return imageToVideoFlow(input);
}

const imageToVideoFlow = ai.defineFlow(
  {
    name: 'imageToVideoFlow',
    inputSchema: ImageToVideoInputSchema,
    outputSchema: ImageToVideoOutputSchema,
  },
  async ({ imageDataUri, prompt }) => {
    
    let { operation } = await ai.generate({
        model: googleAI.model('veo-2.0-generate-001'),
        prompt: [
            { text: prompt },
            { media: { url: imageDataUri } },
        ],
        config: {
            durationSeconds: 5,
            aspectRatio: '16:9',
            personGeneration: 'allow_adult',
        },
    });

    if (!operation) {
        throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes.
    while (!operation.done) {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
        operation = await ai.checkOperation(operation);
    }

    if (operation.error) {
        throw new Error(`Failed to generate video: ${operation.error.message}`);
    }

    const videoPart = operation.output?.message?.content.find((p) => !!p.media && p.media.contentType?.startsWith('video/'));
    
    if (!videoPart || !videoPart.media?.url) {
        throw new Error('Failed to find the generated video in the operation result.');
    }
    
    // The URL from Veo is a temporary download link, we need to fetch it and convert to a data URI.
    const fetch = (await import('node-fetch')).default;
    const videoDownloadResponse = await fetch(
        `${videoPart.media.url}&key=${process.env.GEMINI_API_KEY}`
    );

    if (!videoDownloadResponse.ok || !videoDownloadResponse.body) {
        throw new Error(`Failed to download the generated video. Status: ${videoDownloadResponse.status}`);
    }
    
    const videoBuffer = await videoDownloadResponse.arrayBuffer();
    const videoBase64 = Buffer.from(videoBuffer).toString('base64');
    
    return {
      outputVideoUri: `data:${videoPart.media.contentType};base64,${videoBase64}`,
    };
  }
);
