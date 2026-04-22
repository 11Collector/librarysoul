"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { questions } from "@/data/questions";
import { calculateMBTI } from "@/lib/scoring";
import { db, auth } from "@/lib/firebase";
import { signInAnonymously } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { BookOpen, ArrowLeft, Sparkles, Quote, Wind, Coffee } from "lucide-react";
import { results } from "@/data/results";

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Initialize anonymous auth with proper effect
  useEffect(() => {
    signInAnonymously(auth).catch((err) => {
      console.warn("Anonymous auth disabled in Firebase Console. Using fallback ID.");
    });
  }, []);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = async (value: 'A' | 'B') => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Don't increment index, but trigger the finish logic
      await finishQuiz(newAnswers);
    }
  };

  const finishQuiz = async (finalAnswers: Record<number, 'A' | 'B'>) => {
    setIsSubmitting(true);

    // Cinematic Delay for better immersion
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const mbtiType = calculateMBTI(finalAnswers);
      const resultData = results[mbtiType];

      // 5-second timeout wrapper for Firestore
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore Timeout")), 5000)
      );

      const addDocPromise = addDoc(collection(db, "assessment_results"), {
        userId: auth.currentUser?.uid || "anonymous_" + Math.random().toString(36).substr(2, 9),
        mbtiType,
        answers: Object.values(finalAnswers).map(a => (a === 'A' ? 0 : 1)),
        timestamp: serverTimestamp(),
        readingClass: resultData.title,
        vibe: resultData.vibe,
      });

      // Race between the database write and a 5s timeout
      const docRef = await Promise.race([addDocPromise, timeoutPromise]) as any;

      router.push(`/results/${docRef.id}`);
    } catch (error) {
      console.warn("Connection issue or restricted. Switching to Local Wisdom mode...", error);

      const mbtiType = calculateMBTI(finalAnswers);
      const resultData = results[mbtiType];

      const localResult = {
        mbtiType,
        readingClass: resultData.title,
        vibe: resultData.vibe,
        isLocal: true,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem('library_of_souls_latest', JSON.stringify(localResult));
      router.push(`/results/local`);
    }
    // Removed finally block to prevent "flash" of quiz page before navigation completes
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      router.back();
    }
  };

  return (
    <main className="min-h-screen bg-ghibli-cream flex flex-col p-4 md:p-8 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-ghibli-sunset/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-ghibli-leaf/10 rounded-full blur-3xl opacity-50" />

      {/* Header */}
      <header className="flex items-center justify-between max-w-4xl mx-auto w-full mb-8 pt-4 z-10">
        <motion.button
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBack}
          className="p-3 bg-white/50 backdrop-blur-sm rounded-full text-ghibli-green shadow-sm border border-white/40"
        >
          <ArrowLeft size={28} />
        </motion.button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2 px-4 py-1 bg-ghibli-green/10 rounded-full border border-ghibli-green/20">
            <BookOpen size={16} className="text-ghibli-green" />
            <span className="font-pixel text-ghibli-green text-[10px] tracking-widest uppercase">
              {currentQuestion.dimension} Journey
            </span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((p) => (
              <motion.div
                key={p}
                animate={{
                  scale: Math.ceil((currentIndex + 1) / 5) === p ? [1, 1.2, 1] : 1,
                  opacity: Math.ceil((currentIndex + 1) / 5) >= p ? 1 : 0.2
                }}
                className={`h-2 w-10 rounded-xl ${Math.ceil((currentIndex + 1) / 5) >= p ? 'bg-ghibli-green' : 'bg-ghibli-green/40'
                  }`}
              />
            ))}
          </div>
        </div>

        <div className="w-12 h-12 flex items-center justify-center bg-ghibli-sunset/40 rounded-2xl animate-sway">
          <Coffee size={24} className="text-ghibli-wood" />
        </div>
      </header>

      {/* Progress Path */}
      <div className="max-w-3xl mx-auto w-full mb-12 relative z-10">
        <div className="h-4 bg-white/40 rounded-full border border-white/50 overflow-hidden backdrop-blur-sm shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-ghibli-green to-ghibli-leaf relative"
          >
            <motion.div
              animate={{ opacity: [0, 1, 0], x: ["0%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-white/30"
            />
          </motion.div>
        </div>
        <div className="flex justify-between mt-3 font-pixel text-ghibli-green/60 text-[10px] tracking-widest uppercase">
          <span>Beginning</span>
          <span className="text-ghibli-green">Page {currentIndex + 1} / {questions.length}</span>
          <span>End</span>
        </div>
      </div>

      {/* Main content - Organic Deck */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4">

        <AnimatePresence mode="wait">
          {!isSubmitting && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              transition={{ duration: 0.5, type: "spring", damping: 20 }}
              className="ghibli-card max-w-2xl w-full relative overflow-visible"
            >
              {/* Corner Decorations */}
              <div className="absolute -top-4 -right-4 text-ghibli-sunset animate-float-soft">
                <Sparkles size={32} />
              </div>

              <div className="text-center">
                <div className="mb-4 md:mb-8 opacity-20">
                  <Quote size={40} className="mx-auto text-ghibli-green sm:size-[60px]" />
                </div>

                <h2 className="text-lg sm:text-2xl md:text-4xl font-classic font-medium text-ghibli-ink mb-8 md:mb-12 leading-relaxed">
                  {currentQuestion.text}
                </h2>

                <div className="grid gap-4 md:gap-6">
                  {(['A', 'B'] as const).map((opt, i) => (
                    <motion.button
                      key={opt}
                      initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (i * 0.1) }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(opt)}
                      disabled={isSubmitting}
                      className="rounded-2xl p-4 sm:p-8 text-left bg-white/60 border-2 border-ghibli-green/10 hover:border-ghibli-green/40 hover:bg-white transition-all shadow-md hover:shadow-xl group flex items-center justify-between"
                    >
                      <span className="text-base sm:text-xl md:text-2xl font-kanit font-medium text-ghibli-ink/90 leading-tight pr-4">
                        {currentQuestion.options[opt].text}
                      </span>
                      <div className="flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-ghibli-green/10 group-hover:bg-ghibli-green group-hover:border-ghibli-green transition-all flex items-center justify-center">
                        <Wind className="text-ghibli-green group-hover:text-white transition-colors size-4 sm:size-6" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Decoration */}
      <footer className="max-w-4xl mx-auto w-full text-center py-8 opacity-40 pointer-events-none z-10">
        <div className="flex items-center justify-center gap-4 mb-2">
          <Wind size={16} className="animate-sway" />
          <div className="h-[1px] w-12 bg-ghibli-green/40" />
          <p className="font-pixel text-[10px] tracking-[0.2em] text-ghibli-green uppercase">
            Library of Souls
          </p>
          <div className="h-[1px] w-12 bg-ghibli-green/40" />
          <Wind size={16} className="animate-sway" />
        </div>
      </footer>

      {isSubmitting && (
        <div className="fixed inset-0 bg-ghibli-cream/95 z-50 flex flex-col items-center justify-center backdrop-blur-md">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8 p-12 bg-ghibli-green/10 rounded-3xl"
          >
            <Sparkles size={100} className="text-ghibli-green" />
          </motion.div>
          <h3 className="text-3xl font-kanit font-bold text-ghibli-green tracking-widest text-center px-4 leading-relaxed">
            สัมผัสรอยแยกของจิตวิญญาณ...<br />
            <span className="text-lg opacity-60 font-kanit font-medium">กำลังวาดภาพตัวตนของคุณ</span>
          </h3>

          <motion.div
            animate={{ x: [-20, 20, -20] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="mt-12 text-ghibli-leaf"
          >
            <Leaf size={32} className="animate-sway" />
          </motion.div>
        </div>
      )}
    </main>
  );
}

// Simple Leaf component for loading
function Leaf({ size, className }: { size: number, className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1.8 9.3Z" />
      <path d="M14 15c-1-1-2-1-3-2" />
      <path d="M17 12c-1.5-1-1.5-1.5-3-2" />
    </svg>
  );
}
