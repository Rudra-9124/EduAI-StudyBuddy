'use server';
import { generateQuizQuestions, type GenerateQuizQuestionsOutput } from '@/ai/flows/generate-quiz-questions';
import { summarizeTextChunk } from '@/ai/flows/summarize-text-chunk';

type StudyAids = {
  summary: string;
  quiz: GenerateQuizQuestionsOutput['questions'];
};

export async function generateStudyAids(input: {
  textContent: string;
  model?: "gemini" | "local";
}): Promise<{
  data?: StudyAids;
  error?: string;
}> {
  try {
    const { textContent, model = "gemini" } = input;

    if (!textContent.trim()) {
      return { error: 'Input text cannot be empty.' };
    }

    if (model === "gemini") {
      const [quizResult, summaryResult] = await Promise.all([
        generateQuizQuestions({ textContent }),
        summarizeTextChunk({ textChunk: textContent }),
      ]);

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
    } else {
      const summary = await callLocalModel(textContent, "summarize");
      const quiz = await callLocalModel(textContent, "quiz");

      if (!quiz?.length || !summary) {
        return { error: "Local model failed to generate study aids. Try with a different model or input." };
      }

      return {
        data: { summary, quiz },
      };
    }
  } catch (error) {
    console.error('Error in generateStudyAids:', error);
    return { error: 'An unexpected error occurred while generating study aids. Please try again later.' };
  }
}

async function callLocalModel(text: string, task: "summarize" | "quiz") {
  const prompt =
    task === "summarize"
      ? `Summarize the following text into 5 clear bullet points:\n\n${text}`
      : `Generate 5 multiple-choice quiz questions in JSON format.
         Each should look like this:
         {
           "question": "What is ...?",
           "options": ["A", "B", "C", "D"],
           "correctAnswer": "B"
         }

         Text: ${text}`;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "llama3.2", prompt, stream: false }),
  });

  const data = await response.json();

  if (task === "summarize") return data.response;

  try {
    return JSON.parse(data.response);
  } catch {
    console.warn("Local model quiz output not valid JSON:", data.response);
    return [];
  }
}
