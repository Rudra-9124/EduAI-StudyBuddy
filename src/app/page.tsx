'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, BrainCircuit, FileText, HelpCircle, Lightbulb, Loader2, Pilcrow, Terminal } from 'lucide-react';
import type { GenerateQuizQuestionsOutput } from '@/ai/flows/generate-quiz-questions';
import { Quiz } from '@/components/quiz';
import { generateStudyAids } from '@/app/actions';
import logo from '@/app/favicon.ico';

type StudyAids = {
  summary: string;
  quiz: GenerateQuizQuestionsOutput['questions'];
};

export default function Home() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<StudyAids | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Please enter some text to generate study aids.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const result = await generateStudyAids({ textContent: text });
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setResults(result.data);
      }
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b">
        <div className="container mx-auto flex items-center gap-4">
          {/* <BrainCircuit className="h-8 w-8 text-primary" /> */}
          <Image src={logo} alt="Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold tracking-tight">EduAI StudyBuddy</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText />
                Your Study Material
              </CardTitle>
              <CardDescription>Paste your text content below. The AI will generate a summary and a quiz to help you learn.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your notes, article, or any text here..."
                className="min-h-[400px] text-base resize-y"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                <Pilcrow className="h-4 w-4" />
                <span>{wordCount} words</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Study Aids'
                )}
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-4">
            {isLoading && <ResultsSkeleton />}
            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {results && (
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="summary"><Lightbulb className="mr-2 h-4 w-4" />Summary</TabsTrigger>
                  <TabsTrigger value="quiz"><HelpCircle className="mr-2 h-4 w-4" />Quiz</TabsTrigger>
                </TabsList>
                <TabsContent value="summary">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen />
                        AI-Generated Summary
                      </CardTitle>
                      <CardDescription>A concise overview of your provided text.</CardDescription>
                    </CardHeader>
                    <CardContent className="prose prose-sm max-w-none text-foreground leading-relaxed">
                      {results.summary}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="quiz">
                  <Quiz questions={results.quiz} />
                </TabsContent>
              </Tabs>
            )}
             {!isLoading && !results && !error && (
               <Card className="shadow-lg flex flex-col items-center justify-center min-h-[400px] text-center p-8">
                  <div className="p-4 bg-secondary rounded-full mb-4">
                     {/* <BrainCircuit className="h-12 w-12 text-primary" /> */}
                     <Image src={logo} alt="Logo" width={100} height={100} />
                  </div>
                  <h2 className="text-xl font-bold">Your Study Aids Appear Here</h2>
                  <p className="text-muted-foreground mt-2">
                     Enter your text and click "Generate" to get started.
                  </p>
               </Card>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}

const ResultsSkeleton = () => (
  <Card className="shadow-lg">
    <CardHeader>
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </CardContent>
  </Card>
);
