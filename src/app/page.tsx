'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BookOpen, 
  BrainCircuit, 
  FileText, 
  HelpCircle, 
  Lightbulb, 
  Loader2, 
  Pilcrow, 
  Terminal,
  Sparkles,
  Zap,
  Star,
  ArrowRight,
  CheckCircle,
  UploadCloud,
  Target,        
  TrendingUp,    
  Brain,         
  Bookmark,
  XCircle, X,
} from 'lucide-react';
import type { GenerateQuizQuestionsOutput } from '@/ai/flows/generate-quiz-questions';
import { Quiz } from '@/components/quiz';
import { generateStudyAids } from '@/app/actions';
import logo from '@/app/favicon.ico';
import pdfToText from 'react-pdftotext'; 

type StudyAids = {
  summary: string;
  quiz: GenerateQuizQuestionsOutput['questions'];
};

const parseSummaryBullets = (summary: string) => {
  return summary
    .split('\n')
    .filter(line => line.trim())
    .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
    .filter(line => line.length > 0);
};

export default function Home() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<StudyAids | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      setIsExtracting(true);
      setExtractionError(null);
      const text = await pdfToText(file);
      return text;
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF. Please ensure it\'s a valid PDF file.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    try {
      setPdfFile(file);
      setText(''); // Clear existing text
      const extractedText = await extractTextFromPDF(file);
      setText(extractedText);
      setError(null);
    } catch (error) {
      setExtractionError(error instanceof Error ? error.message : 'PDF extraction failed');
      setPdfFile(null);
    }
  };

  // Add this function to clear PDF and switch to text mode
  const clearPDF = () => {
    setPdfFile(null);
    setText('');
    setError(null);
    setExtractionError(null);
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Please enter some text or upload a PDF to generate study aids.');
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900 dark:to-violet-900">
      {/* Header with glassmorphism effect */}
      <header className="relative backdrop-blur-md bg-white/30 border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative bg-white rounded-full p-2">
                <Image src={logo} alt="Logo" width={32} height={32} />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                EduAI StudyBuddy
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Transform your learning with AI</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <Sparkles className="h-12 w-12 text-purple-600 mx-auto animate-pulse" />
              </div>
            </div>
          </div>
          <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Learn Smarter, Not Harder
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Paste your content and let our AI create personalized summaries and interactive quizzes to accelerate your learning journey.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Card with enhanced styling */}
          <Card className="relative overflow-hidden backdrop-blur-md bg-white/70 border-0 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>
            <div className="relative">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Your Study Material
                  </span>
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Paste any text content below. Our AI will analyze it and create personalized study aids just for you.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* PDF Upload Section */}
                <div className="relative">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePDFUpload}
                    className="hidden"
                    id="pdf-upload"
                    disabled={isExtracting}
                  />
                  
                  <label
                    htmlFor="pdf-upload"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${
                      isExtracting
                        ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                        : pdfFile
                        ? 'border-green-400 bg-green-50 hover:bg-green-100'
                        : 'border-purple-300 bg-purple-50 hover:bg-purple-100'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isExtracting ? (
                        <>
                          <Loader2 className="w-8 h-8 mb-3 text-purple-500 animate-spin" />
                          <p className="text-sm text-gray-600">Extracting text from PDF...</p>
                        </>
                      ) : pdfFile ? (
                        <>
                          <CheckCircle className="w-8 h-8 mb-3 text-green-500" />
                          <p className="text-sm font-medium text-green-700">{pdfFile.name}</p>
                          <p className="text-xs text-green-600">Text extracted successfully</p>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-8 h-8 mb-3 text-purple-500" />
                          <p className="text-sm font-medium text-purple-700">Upload PDF File</p>
                          <p className="text-xs text-purple-600">Click to browse or drag and drop</p>
                        </>
                      )}
                    </div>
                  </label>

                  {pdfFile && (
                    <button
                      onClick={clearPDF}
                      className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                      title="Remove PDF"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* OR Divider */}
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 text-sm text-gray-500 bg-white px-2">OR</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Text Input Area (existing) */}
                <div className="relative">
                  <Textarea
                    placeholder={pdfFile ? "✨ Text extracted from your PDF appears here..." : "✨ Paste your notes, articles, textbook chapters, research papers, or any learning material here..."}
                    className="min-h-[300px] text-base resize-y border-2 border-purple-200 focus:border-purple-500 transition-colors duration-300 bg-white/50 backdrop-blur-sm"
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      if (pdfFile && e.target.value !== text) {
                        // Clear PDF when user manually edits extracted text
                        setPdfFile(null);
                      }
                    }}
                    disabled={isExtracting}
                  />
                  {text && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        <CheckCircle className="inline h-3 w-3 mr-1" />
                        Ready to analyze
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Display for PDF Extraction */}
                {extractionError && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <Terminal className="h-4 w-4" />
                    <AlertDescription>{extractionError}</AlertDescription>
                  </Alert>
                )}
                
                {/* Word Count and Stats (existing) */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Pilcrow className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">{wordCount} words</span>
                    {pdfFile && <span className="text-blue-600">• From PDF: {pdfFile.name}</span>}
                    {wordCount > 0 && (
                      <span className="text-green-600">
                        • Perfect for analysis
                      </span>
                    )}
                  </div>
                  
                  {wordCount > 0 && (
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${wordCount > star * 50 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={handleGenerate} 
                  disabled={isLoading || isExtracting || !text.trim()} 
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Creating your study aids...</span>
                    </div>
                  ) : isExtracting ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Extracting PDF text...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5" />
                      <span>Generate Study Aids</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>
              </CardFooter>
            </div>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {isLoading && <EnhancedResultsSkeleton />}
            
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50/80 backdrop-blur-sm">
                <Terminal className="h-5 w-5" />
                <AlertTitle className="text-lg">Oops! Something went wrong</AlertTitle>
                <AlertDescription className="text-base">{error}</AlertDescription>
              </Alert>
            )}
            
            {results && (
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/60 backdrop-blur-md p-1 rounded-xl shadow-lg border-0">
                  <TabsTrigger 
                    value="summary" 
                    className="flex items-center gap-2 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-300"
                  >
                    <Lightbulb className="h-4 w-4" />
                    Summary
                  </TabsTrigger>
                  <TabsTrigger 
                    value="quiz"
                    className="flex items-center gap-2 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-300"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Quiz
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary" className="mt-6">
                  <Card className="backdrop-blur-md bg-white/70 border-0 shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10"></div>
                    <div className="relative">
                      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-100">
                        <CardTitle className="flex items-center gap-3 text-2xl">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500">
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                          <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            AI-Generated Summary
                          </span>
                        </CardTitle>
                        <CardDescription className="text-lg">
                          Key insights and takeaways from your content • {parseSummaryBullets(results.summary).length} points
                        </CardDescription>
                      </CardHeader>

                      {/* Make just this area scrollable */}
                      <CardContent className="p-6 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="space-y-3">
                          {parseSummaryBullets(results.summary).map((point, index) => (
                            <div 
                              key={index} 
                              className="flex gap-4 p-4 bg-gradient-to-r from-green-50/80 to-blue-50/80 rounded-lg border border-green-100/50 hover:from-green-100/80 hover:to-blue-100/80 transition-all duration-200"
                            >
                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-sm">
                                {index + 1}
                              </div>
                              <p className="flex-1 text-gray-700 leading-relaxed font-medium">
                                {point}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </TabsContent>
                                
                <TabsContent value="quiz" className="mt-6">
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    <Quiz questions={results.quiz} />
                  </div>
                </TabsContent>
              </Tabs>
            )}
            
            {!isLoading && !results && !error && (
              <Card className="backdrop-blur-md bg-white/60 border-0 shadow-2xl">
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-purple-100 to-blue-100 rounded-full p-8">
                      <Image src={logo} alt="Logo" width={80} height={80} />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Your Study Aids Appear Here
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 max-w-md">
                    Enter your learning material and watch the magic happen. AI-powered summaries and quizzes await!
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span>AI-Powered</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span>Lightning Fast</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Personalized</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const EnhancedResultsSkeleton = () => (
  <Card className="backdrop-blur-md bg-white/60 border-0 shadow-2xl">
    <CardHeader>
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="space-y-2 pt-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </CardContent>
  </Card>
);
