'use server';

import { generateQuizQuestions, type GenerateQuizQuestionsOutput } from '@/ai/flows/generate-quiz-questions';
import { summarizeTextChunk } from '@/ai/flows/summarize-text-chunk';

type StudyAids = {
  summary: string;
  quiz: GenerateQuizQuestionsOutput['questions'];
};

export async function generateStudyAids(input: {
  textContent: string;
}): Promise<{
  data?: StudyAids;
  error?: string;
}> {
  try {
    if (!input.textContent.trim()) {
      return { error: 'Input text cannot be empty.' };
    }

    // Run both AI flows in parallel to speed up the process
    const [quizResult, summaryResult] = await Promise.all([
      generateQuizQuestions({ textContent: input.textContent }),
      summarizeTextChunk({ textChunk: input.textContent }),
    ]);

    // Validate the AI output
    if (!quizResult?.questions?.length || !summaryResult?.summary) {
      return {
        error:
          'Failed to generate content from AI. The model may have returned an empty or invalid response. Please try modifying your text.',
      };
    }

    return {
      data: {
        summary: summaryResult.summary,
        quiz: quizResult.questions,
      },
    };
  } catch (error) {
    console.error('Error in generateStudyAids:', error);
    // Return a user-friendly error message
    return { error: 'An unexpected error occurred while communicating with the AI. Please try again later.' };
  }
}
