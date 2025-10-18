'use server';
/**
 * @fileOverview An AI-powered tool to generate a transcript from a YouTube video URL.
 *
 * - generateYoutubeTranscript - A function that takes a YouTube URL and returns its transcript.
 * - YoutubeTranscriptInput - The input type for the generateYoutubeTranscript function.
 * - YoutubeTranscriptOutput - The return type for the generateYoutubeTranscript function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const YoutubeTranscriptInputSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid YouTube URL.' }),
});
export type YoutubeTranscriptInput = z.infer<typeof YoutubeTranscriptInputSchema>;

const YoutubeTranscriptOutputSchema = z.object({
  transcript: z.string().describe('The full transcript of the YouTube video.'),
});
export type YoutubeTranscriptOutput = z.infer<typeof YoutubeTranscriptOutputSchema>;

export async function generateYoutubeTranscript(input: YoutubeTranscriptInput): Promise<YoutubeTranscriptOutput> {
  return youtubeTranscriptGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'youtubeTranscriptGeneratorPrompt',
  input: { schema: YoutubeTranscriptInputSchema },
  output: { schema: YoutubeTranscriptOutputSchema },
  prompt: `You are an expert at extracting video transcripts.

  Given the following YouTube URL, please provide the full text transcript of the video.

  YouTube URL: {{{url}}}

  Return ONLY a valid JSON object with the transcript.
  `,
});

const youtubeTranscriptGeneratorFlow = ai.defineFlow(
  {
    name: 'youtubeTranscriptGeneratorFlow',
    inputSchema: YoutubeTranscriptInputSchema,
    outputSchema: YoutubeTranscriptOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
