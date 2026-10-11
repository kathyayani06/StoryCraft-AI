import React, { useState } from 'react';
import { GeneratedStory, StoryChapter } from '../types';
import {
  Sliders,
  Sparkles,
  ArrowLeft,
  Check,
  RotateCcw,
  BookOpen,
  Wand2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface CustomizationScreenProps {
  story: GeneratedStory;
  initialChapterIndex?: number;
  onApplyChapterRevision: (chapterNumber: number, revisedContent: string, newTitle?: string) => void;
  onBackToManuscript: () => void;
  onGoToBook: () => void;
}

const PRESET_DIRECTIVES = [
  {
    label: 'Use Simple & Easy Words',
    prompt: 'Rewrite this chapter using simple, clear, and easy-to-understand words. Avoid complex or difficult vocabulary so it is effortless and pleasant to read.',
  },
  {
    label: 'Deepen Emotion & Heart',
    prompt: 'Make this chapter significantly more emotional, poignant, and reflective, exploring inner grief and quiet joy.',
  },
  {
    label: 'Ramp Up Suspense & Danger',
    prompt: 'Increase urgency, pacing, and suspense with unexpected atmospheric noises, ticking clocks, and an edge-of-seat cliffhanger.',
  },
  {
    label: 'Expand Dialogue & Chemistry',
    prompt: 'Add more rich character dialogue and conversational chemistry between the protagonists with authentic subtext.',
  },
  {
    label: 'Change the Chapter Ending',
    prompt: 'Change the ending of this chapter to introduce an unforeseen discovery that completely shifts the investigation.',
  },
  {
    label: 'Vivid Sensory Imagery',
    prompt: 'Enrich with vivid sensory descriptions: cold rain on leaded glass, scent of dried lavender and cedar, creaking timbers.',
  },
];

export const CustomizationScreen: React.FC<CustomizationScreenProps> = ({
  story,
  initialChapterIndex = 0,
  onApplyChapterRevision,
  onBackToManuscript,
  onGoToBook,
}) => {
  const [selectedIdx, setSelectedIdx] = useState(initialChapterIndex);
  const [instruction, setInstruction] = useState(PRESET_DIRECTIVES[0].prompt);
  const [customEnding, setCustomEnding] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [revisedResult, setRevisedResult] = useState<{
    content: string;
    title: string;
    notes: string;
  } | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  const currentChapter = story.chapters[selectedIdx] || story.chapters[0];

  const handleRunCustomize = async () => {
    setIsProcessing(true);
    setRevisedResult(null);

    try {
      const res = await fetch('/api/story/customize-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyTitle: story.title,
          genre: story.genre,
          tone: story.tone,
          chapter: currentChapter,
          instruction: instruction,
          customEnding: customEnding,
        }),
      });

      const data = await res.json();
      setRevisedResult({
        content: data.content,
        title: data.title || currentChapter.title,
        notes: data.notes || 'Chapter revision synthesized successfully.',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    if (!revisedResult) return;
    onApplyChapterRevision(currentChapter.chapterNumber, revisedResult.content, revisedResult.title);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-stone-900 pb-20 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToManuscript}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Manuscript</span>
          </button>

          <button
            onClick={onGoToBook}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 transition-colors"
          >
            <span>View Bound Book & PDF</span>
            <BookOpen className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Header */}
        <div className="mb-8 border-b border-stone-200 pb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-widest mb-1">
            <span>Chapter-Level Customization Studio</span>
            <span aria-hidden="true">·</span>
            <span>Screen 5 of 6</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-950">
            Fine-Tune & Reshape Chapters
          </h1>
          <p className="text-sm text-stone-600 mt-2 font-sans max-w-2xl">
            As outlined in the Project Methodology, you don't need to regenerate the whole book. Instruct the GenAI model to enrich emotional undertones, amplify suspense, or redirect the ending for any specific chapter.
          </p>
        </div>

        {/* Chapter Selection Bar */}
        <div className="mb-8 p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <label className="block text-xs font-mono uppercase text-stone-500 mb-2 font-semibold">
            Select Chapter to Edit
          </label>
          <div className="flex flex-wrap gap-2">
            {story.chapters.map((ch, idx) => (
              <button
                key={ch.chapterNumber}
                onClick={() => {
                  setSelectedIdx(idx);
                  setRevisedResult(null);
                }}
                className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all text-left ${
                  idx === selectedIdx
                    ? 'bg-amber-400 text-stone-950 border-amber-400 font-semibold shadow-2xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                Chapter {ch.chapterNumber}: {ch.title}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Working Area */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Directives Form & AI Controls */}
          <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <h3 className="font-editorial text-lg font-bold text-stone-900 mb-1">
                Editing Chapter {currentChapter.chapterNumber}
              </h3>
              <p className="text-xs text-stone-500">
                "{currentChapter.title}" ({currentChapter.wordCount} words)
              </p>
            </div>

            {/* Quick Directive Presets */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-2">
                Quick Editorial Directives
              </label>
              <div className="space-y-1.5">
                {PRESET_DIRECTIVES.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setInstruction(preset.prompt)}
                    className={`w-full p-2.5 text-left text-xs rounded-lg border transition-colors ${
                      instruction === preset.prompt
                        ? 'bg-amber-50 border-amber-300 text-amber-950 font-semibold'
                        : 'bg-stone-50/70 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Prompt Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-800">
                Custom Revision Instruction
              </label>
              <textarea
                rows={3}
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Describe how the AI should rewrite or adjust this chapter..."
                className="w-full p-3 text-xs border border-stone-300 rounded-lg text-stone-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              />
            </div>

            {/* Optional Ending Redirection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-800">
                Optional: Change the Ending Direction
              </label>
              <input
                type="text"
                value={customEnding}
                onChange={(e) => setCustomEnding(e.target.value)}
                placeholder="e.g. Maya hears someone unlock the garden gate from the outside"
                className="w-full p-2.5 text-xs border border-stone-300 rounded-lg text-stone-900"
              />
              <span className="text-[11px] text-stone-400 block">
                Give specific instructions if you want to alter the chapter's final scene or cliffhanger.
              </span>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunCustomize}
              disabled={isProcessing}
              className="w-full py-3 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-98"
            >
              <Wand2 className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Rewriting with GenAI...' : 'Execute Chapter Rewrite'}</span>
            </button>

            {successToast && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Chapter {currentChapter.chapterNumber} updated in manuscript!</span>
              </div>
            )}
          </div>

          {/* Right Column: Comparative Prose Diff / Preview */}
          <div className="lg:col-span-7 space-y-6">
            {/* If a revision was generated, show side-by-side or comparison */}
            {revisedResult ? (
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-amber-300 shadow-md space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <span className="text-xs font-mono uppercase text-amber-800 font-semibold block">
                      AI-Generated Chapter Revision
                    </span>
                    <h3 className="font-editorial text-xl font-bold text-stone-900 mt-0.5">
                      {revisedResult.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRevisedResult(null)}
                      className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 rounded-md border border-stone-200"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleApply}
                      className="px-4 py-1.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-md shadow-2xs flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept Revision</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 text-xs text-amber-900 italic font-serif">
                  {revisedResult.notes}
                </div>

                {/* Prose content */}
                <div className="font-prose text-stone-800 text-sm leading-[1.8] space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {revisedResult.content.split(/\n\s*\n/).map((p, i) => (
                    <p key={i} className="text-justify indent-4">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              /* Current Active Chapter */
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <span className="text-xs font-mono uppercase text-stone-500 block">
                      Current Manuscript Version
                    </span>
                    <h3 className="font-editorial text-xl font-bold text-stone-900 mt-0.5">
                      {currentChapter.title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-stone-500">
                    {currentChapter.wordCount} words
                  </span>
                </div>

                <div className="font-prose text-stone-800 text-sm leading-[1.8] space-y-3 max-h-[550px] overflow-y-auto pr-2">
                  {currentChapter.content.split(/\n\s*\n/).map((p, i) => (
                    <p key={i} className="text-justify indent-4">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
