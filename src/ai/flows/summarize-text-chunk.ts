'use server';
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
  prompt: `Write a detailed and comprehensive summary of the following text in 8-10 bullet points. Each bullet point should start with "• " and be on a separate line. Use clear and concise bullet points to cover all key points:\n\n{{textChunk}}`,
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
