import React, { useEffect, useState } from 'react';
import { BookOpen, Sparkles, Feather, Compass, Layers } from 'lucide-react';

interface ProcessingScreenProps {
  ideaPreview: string;
}

const STAGES = [
  { label: 'Deconstructing story seed & setting parameters...', icon: Compass },
  { label: 'Casting characters & developing inner motivations...', icon: Feather },
  { label: 'Structuring multi-chapter dramatic plot arc...', icon: Layers },
  { label: 'Weaving narrative prose, dialogue & sensory depth...', icon: BookOpen },
  { label: 'Binding digital book layout & cover typography...', icon: Sparkles },
];

const LITERARY_QUOTES = [
  { text: '“There is no greater agony than bearing an untold story inside you.”', author: 'Maya Angelou' },
  { text: '“A word after a word after a word is power.”', author: 'Margaret Atwood' },
  { text: '“The secret of getting ahead is getting started.”', author: 'Mark Twain' },
  { text: '“Stories are wild creatures. When you let them out, who knows what they will do?”', author: 'Patrick Ness' },
];

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ ideaPreview }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setCurrentStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 2400);

    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % LITERARY_QUOTES.length);
    }, 4500);

    return () => {
      clearInterval(stageTimer);
      clearInterval(quoteTimer);
    };
  }, []);

  const progressPercent = Math.min(100, Math.round(((currentStageIndex + 1) / STAGES.length) * 100));

  return (
    <div className="min-h-screen bg-[#fbfaf8] flex flex-col items-center justify-center p-6 text-stone-900">
      <div className="max-w-xl w-full bg-white p-8 sm:p-10 rounded-2xl border border-stone-200 shadow-xl text-center space-y-8">
        {/* Animated literary icon */}
        <div className="relative mx-auto w-16 h-16 rounded-full bg-amber-100/80 flex items-center justify-center text-amber-800">
          <BookOpen className="w-8 h-8 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-widest">
            <span>AI Generation in Progress</span>
            <span aria-hidden="true">·</span>
            <span>Screen 3 of 6</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-950">
            Crafting Your Book Manuscript
          </h2>
          <p className="text-xs text-stone-600 line-clamp-2 italic font-serif max-w-md mx-auto">
            "{ideaPreview}"
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-stone-500 font-mono">
            <span>Step {currentStageIndex + 1} of {STAGES.length}</span>
            <span>{progressPercent}% Complete</span>
          </div>
        </div>

        {/* Current Stage Indicator */}
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 text-left space-y-3">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCurrent = idx === currentStageIndex;
            const isDone = idx < currentStageIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                  isCurrent
                    ? 'text-stone-950 font-semibold'
                    : isDone
                    ? 'text-stone-400'
                    : 'text-stone-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                    isCurrent
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : isDone
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-400'
                  }`}
                >
                  {isDone ? '✓' : idx + 1}
                </div>
                <span className="flex-1">{stage.label}</span>
              </div>
            );
          })}
        </div>

        {/* Literary Quote Ticker */}
        <div className="pt-2 border-t border-stone-100">
          <blockquote className="text-xs italic font-serif text-stone-600 leading-relaxed">
            {LITERARY_QUOTES[quoteIndex].text}
          </blockquote>
          <span className="block text-[11px] font-sans text-stone-400 mt-1">
            — {LITERARY_QUOTES[quoteIndex].author}
          </span>
        </div>
      </div>
    </div>
  );
};
