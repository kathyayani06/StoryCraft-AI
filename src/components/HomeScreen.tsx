import React from 'react';
import { GeneratedStory } from '../types';
import { CoverArt } from './CoverArt';
import { SAMPLE_STORIES } from '../data/sampleStories';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Sliders,
  FileDown,
  Layers,
  Wand2,
  BookmarkCheck,
  Compass,
  CheckCircle2,
} from 'lucide-react';

interface HomeScreenProps {
  onStartStory: () => void;
  onSelectStory: (story: GeneratedStory) => void;
  onOpenReport: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartStory,
  onSelectStory,
  onOpenReport,
}) => {
  const canonicalStory = SAMPLE_STORIES[0];

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-stone-900 pb-20">
      {/* Hero Section: 2-Column Split */}
      <section className="border-b border-stone-200/80 bg-gradient-to-b from-[#f7f4ee] to-[#fbfaf8] pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Typographic Hierarchy */}
            <div className="lg:col-span-7 space-y-6">
              {/* Unboxed metadata kicker */}
              <div className="flex items-center gap-2 text-xs text-stone-600 font-mono tracking-wide">
                <span>StoryCraft AI</span>
                <span aria-hidden="true">·</span>
                <span>Personalized Story-to-Book Platform</span>
                <span aria-hidden="true">·</span>
                <span>Learning Block 1</span>
              </div>

              <h1
                className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-950 leading-[1.08]"
                style={{ textWrap: 'balance' }}
              >
                From a single whisper of an idea to a bound digital book.
              </h1>

              <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-sans max-w-2xl">
                Convert short creative ideas into fully expanded, multi-chapter books with distinct characters, dramatic plot arcs, chapter-level tone customization, and print-ready PDF export.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onStartStory}
                  className="px-6 py-3 text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 active:scale-95"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Start Crafting Your Book</span>
                </button>

                <button
                  onClick={() => onSelectStory(canonicalStory)}
                  className="px-5 py-3 text-sm font-medium text-stone-700 bg-white hover:bg-stone-100 rounded-lg border border-stone-300 transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  <span>Explore Canonical Example</span>
                </button>
              </div>

              {/* Feature Checklist */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-stone-600 border-t border-stone-200/80">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Idea-to-Prose Expansion</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Chapter-Level Rewriting</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>A5 Formatted PDF Export</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Featured Book Mockup */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div
                onClick={() => onSelectStory(canonicalStory)}
                className="group cursor-pointer relative transition-transform duration-300 hover:-translate-y-1"
                title="Click to read the complete canonical story"
              >
                <CoverArt
                  title={canonicalStory.title}
                  subtitle={canonicalStory.subtitle}
                  author={canonicalStory.author}
                  genre={canonicalStory.genre}
                  theme={canonicalStory.coverTheme}
                  size="hero"
                />
                <div className="mt-3 text-center">
                  <span className="text-xs font-medium text-amber-800 group-hover:underline flex items-center justify-center gap-1">
                    <span>Click to open & explore this book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Architecture Strip (from Section 5 & 6 of Project Report) */}
      <section className="py-12 border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-stone-500 block">
                System Methodology
              </span>
              <h2 className="font-editorial text-2xl font-bold text-stone-900 mt-1">
                How StoryCraft AI Operates
              </h2>
            </div>
            <button
              onClick={onOpenReport}
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 self-start"
            >
              <span>View System Architecture & Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200/80 space-y-2">
              <div className="w-7 h-7 rounded-md bg-stone-200 text-stone-800 flex items-center justify-center font-mono text-xs font-bold">
                01
              </div>
              <h3 className="font-semibold text-sm text-stone-900">Story Starter</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Accepts user story idea with genre, setting, tone, and character preferences.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200/80 space-y-2">
              <div className="w-7 h-7 rounded-md bg-stone-200 text-stone-800 flex items-center justify-center font-mono text-xs font-bold">
                02
              </div>
              <h3 className="font-semibold text-sm text-stone-900">GenAI Expansion</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Gemini constructs character motivations, 5-stage plot arc, and chapter prose.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200/80 space-y-2">
              <div className="w-7 h-7 rounded-md bg-stone-200 text-stone-800 flex items-center justify-center font-mono text-xs font-bold">
                03
              </div>
              <h3 className="font-semibold text-sm text-stone-900">Chapter Tuning</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Allows granular chapter edits: make emotional, ramp up suspense, or alter ending.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200/80 space-y-2">
              <div className="w-7 h-7 rounded-md bg-stone-200 text-stone-800 flex items-center justify-center font-mono text-xs font-bold">
                04
              </div>
              <h3 className="font-semibold text-sm text-stone-900">Digital Book & PDF</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Formats completed manuscript into a bound digital book with downloadable A5 PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Book Showcase */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-stone-500 block">
                Sample Library
              </span>
              <h2 className="font-editorial text-3xl font-bold text-stone-900 mt-1">
                Generated Stories Ready to Read
              </h2>
            </div>
            <p className="text-xs text-stone-600 max-w-md">
              Each book demonstrates complete AI plot development, character profiles, formatted chapters, and instant PDF download.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {SAMPLE_STORIES.map((story) => (
              <div
                key={story.id}
                onClick={() => onSelectStory(story)}
                className="group cursor-pointer p-6 bg-white rounded-xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 items-center sm:items-start"
              >
                <div className="shrink-0 group-hover:scale-[1.02] transition-transform duration-200">
                  <CoverArt
                    title={story.title}
                    subtitle={story.subtitle}
                    author={story.author}
                    genre={story.genre}
                    theme={story.coverTheme}
                    size="md"
                  />
                </div>

                <div className="flex flex-col justify-between h-full space-y-3 text-left">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-mono mb-1">
                      <span>{story.genre}</span>
                      <span aria-hidden="true">·</span>
                      <span>{story.estimatedReadTime}</span>
                      <span aria-hidden="true">·</span>
                      <span>{story.chapters.length} Chapters</span>
                    </div>

                    <h3 className="font-editorial text-xl font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                      {story.title}
                    </h3>

                    {story.subtitle && (
                      <p className="text-xs italic text-stone-600 font-serif mb-2">
                        {story.subtitle}
                      </p>
                    )}

                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {story.logline}
                    </p>
                  </div>

                  {/* Setting & Characters preview */}
                  <div className="pt-2 border-t border-stone-100 text-xs text-stone-500 space-y-1">
                    <div>
                      <strong className="text-stone-700">Setting:</strong> {story.setting.place}
                    </div>
                    <div>
                      <strong className="text-stone-700">Cast:</strong>{' '}
                      {story.characters.map((c) => c.name).join(', ')}
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-xs font-semibold text-amber-800 group-hover:underline inline-flex items-center gap-1">
                      <span>Read book & export PDF</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-6 pt-6">
        <div className="p-8 sm:p-12 rounded-2xl bg-stone-900 text-stone-100 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
              Have an idea waiting to become a book?
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed font-sans">
              Enter a few sentences describing your concept. StoryCraft AI will weave characters, construct chapter beats, and format your story into a digital publication.
            </p>
          </div>
          <button
            onClick={onStartStory}
            className="px-6 py-3.5 text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shrink-0 active:scale-95 shadow-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Story Studio</span>
          </button>
        </div>
      </section>
    </div>
  );
};
