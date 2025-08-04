'use server';
/**
 * @fileOverview An AI agent that summarizes a text chunk.
 *
 * - summarizeTextChunk - A function that summarizes a given text chunk.
 * - SummarizeTextChunkInput - The input type for the summarizeTextChunk function.
 * - SummarizeTextChunkOutput - The return type for the summarizeTextChunk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTextChunkInputSchema = z.object({
  textChunk: z.string().describe('The text chunk to summarize.'),
});
export type SummarizeTextChunkInput = z.infer<typeof SummarizeTextChunkInputSchema>;

const SummarizeTextChunkOutputSchema = z.object({
  summary: z.string().describe('The summary of the text chunk.'),
});
export type SummarizeTextChunkOutput = z.infer<typeof SummarizeTextChunkOutputSchema>;

export async function summarizeTextChunk(input: SummarizeTextChunkInput): Promise<SummarizeTextChunkOutput> {
  return summarizeTextChunkFlow(input);
}

const summarizeTextChunkPrompt = ai.definePrompt({
  name: 'summarizeTextChunkPrompt',
  input: {schema: SummarizeTextChunkInputSchema},
  output: {schema: SummarizeTextChunkOutputSchema},
  prompt: `Summarize the following text chunk:\n\n{{textChunk}}`,
});

const summarizeTextChunkFlow = ai.defineFlow(
  {
    name: 'summarizeTextChunkFlow',
    inputSchema: SummarizeTextChunkInputSchema,
    outputSchema: SummarizeTextChunkOutputSchema,
  },
  async input => {
    const {output} = await summarizeTextChunkPrompt(input);
    return output!;
  }
);
