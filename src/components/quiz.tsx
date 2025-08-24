'use client';
import { useState } from 'react';
import type { GenerateQuizQuestionsOutput } from '@/ai/flows/generate-quiz-questions';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, RefreshCw, Trophy, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type QuizProps = {
  questions: GenerateQuizQuestionsOutput['questions'];
};

export function Quiz({ questions }: QuizProps) {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setSubmitted(true);
  };

  const handleReset = () => {
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const getOptionClass = (questionIndex: number, option: string) => {
    if (!submitted) return '';
    const question = questions[questionIndex];
    const isCorrect = option === question.correctAnswer;
    const isSelected = userAnswers[questionIndex] === option;

    if (isCorrect) return 'text-green-700 dark:text-green-400 font-bold';
    if (isSelected && !isCorrect) return 'text-red-700 dark:text-red-400 line-through';
    return 'text-muted-foreground';
  };

  const scorePercentage = (score / questions.length) * 100;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Knowledge Check</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {submitted && (
          <Alert className="border-accent bg-accent/10">
            <Trophy className="h-5 w-5 text-accent-foreground" />
            <AlertTitle className="font-headline text-black">Quiz Complete!</AlertTitle>
            <AlertDescription className="text-black/90">
              You scored {score} out of {questions.length}.
              <Progress value={scorePercentage} className="mt-2 h-2" />
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-4">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="p-4 border rounded-lg">
              <p className="font-semibold mb-3">
                {qIndex + 1}. {q.question}
              </p>
              <RadioGroup
                onValueChange={(value) => handleAnswerChange(qIndex, value)}
                value={userAnswers[qIndex] || ''}
                disabled={submitted}
              >
                {q.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`q${qIndex}o${oIndex}`} />
                    <Label
                      htmlFor={`q${qIndex}o${oIndex}`}
                      className={cn(
                        'flex-1 cursor-pointer transition-colors',
                        submitted && getOptionClass(qIndex, option)
                      )}
                    >
                      {option}
                      {submitted && option === q.correctAnswer && (
                        <CheckCircle2 className="inline-block ml-2 h-4 w-4 text-green-600 dark:text-green-400" />
                      )}
                       {submitted && userAnswers[qIndex] === option && option !== q.correctAnswer && (
                        <XCircle className="inline-block ml-2 h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {submitted ? (
          <Button onClick={handleReset} variant="outline" className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="w-full" disabled={Object.keys(userAnswers).length !== questions.length}>
            Submit Quiz
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
