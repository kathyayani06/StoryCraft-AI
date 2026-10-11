import React, { useState } from 'react';
import { GeneratedStory, StoryChapter } from '../types';
import {
  BookOpen,
  Sliders,
  FileDown,
  Edit3,
  Check,
  RotateCcw,
  User,
  MapPin,
  Sparkles,
  ArrowRight,
  Eye,
  Clock,
  BookMarked,
  Share2,
} from 'lucide-react';

interface GeneratedStoryScreenProps {
  story: GeneratedStory;
  onUpdateChapter: (chapterNumber: number, newContent: string) => void;
  onGoToCustomization: (chapterIndex?: number) => void;
  onGoToBook: () => void;
  onRegenerate: () => void;
}

export const GeneratedStoryScreen: React.FC<GeneratedStoryScreenProps> = ({
  story,
  onUpdateChapter,
  onGoToCustomization,
  onGoToBook,
  onRegenerate,
}) => {
  const [activeTab, setActiveTab] = useState<'reader' | 'characters' | 'plot' | 'setting'>('reader');
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [editableContent, setEditableContent] = useState('');

  const currentChapter = story.chapters[selectedChapterIndex] || story.chapters[0];

  const handleStartInlineEdit = () => {
    setEditableContent(currentChapter.content);
    setIsEditingInline(true);
  };

  const handleSaveInlineEdit = () => {
    onUpdateChapter(currentChapter.chapterNumber, editableContent);
    setIsEditingInline(false);
  };

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-stone-900 pb-20">
      {/* Top Banner / Book Metadata */}
      <section className="bg-white border-b border-stone-200 pt-8 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-widest">
                <span>{story.genre}</span>
                <span aria-hidden="true">·</span>
                <span>{story.estimatedReadTime}</span>
                <span aria-hidden="true">·</span>
                <span>{story.totalWords} Words</span>
                <span aria-hidden="true">·</span>
                <span>{story.chapters.length} Chapters</span>
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-950">
                {story.title}
              </h1>

              {story.subtitle && (
                <p className="font-serif italic text-sm sm:text-base text-stone-600">
                  {story.subtitle}
                </p>
              )}

              <p className="text-xs sm:text-sm text-stone-700 font-sans max-w-2xl leading-relaxed">
                {story.logline}
              </p>

              <div className="pt-1 text-xs text-stone-500">
                <span>By <strong>{story.author}</strong></span>
                <span className="mx-2">·</span>
                <span>Audience: {story.audience}</span>
                <span className="mx-2">·</span>
                <span>Tone: {story.tone}</span>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => onGoToCustomization(selectedChapterIndex)}
                className="px-4 py-2.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Sliders className="w-4 h-4 text-amber-700" />
                <span>Customize Chapter (AI)</span>
              </button>

              <button
                onClick={onGoToBook}
                className="px-5 py-2.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Digital Book & PDF</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-stone-200 mt-8 -mb-8 text-xs font-medium gap-6">
            <button
              onClick={() => setActiveTab('reader')}
              className={`pb-3 border-b-2 transition-colors ${
                activeTab === 'reader'
                  ? 'border-amber-600 text-stone-950 font-semibold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Chapter Manuscript ({story.chapters.length})
            </button>
            <button
              onClick={() => setActiveTab('characters')}
              className={`pb-3 border-b-2 transition-colors ${
                activeTab === 'characters'
                  ? 'border-amber-600 text-stone-950 font-semibold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Character Profiles ({story.characters.length})
            </button>
            <button
              onClick={() => setActiveTab('plot')}
              className={`pb-3 border-b-2 transition-colors ${
                activeTab === 'plot'
                  ? 'border-amber-600 text-stone-950 font-semibold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              5-Stage Dramatic Arc
            </button>
            <button
              onClick={() => setActiveTab('setting')}
              className={`pb-3 border-b-2 transition-colors ${
                activeTab === 'setting'
                  ? 'border-amber-600 text-stone-950 font-semibold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              World & Setting
            </button>
          </div>
        </div>
      </section>

      {/* Main Tab Content */}
      <main className="max-w-6xl mx-auto px-6 mt-10">
        {/* TAB 1: CHAPTER MANUSCRIPT READER */}
        {activeTab === 'reader' && (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left: Chapter Navigation List */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 px-1">
                <span>TABLE OF CHAPTERS</span>
                <span>{story.chapters.length} Total</span>
              </div>

              <div className="space-y-2">
                {story.chapters.map((chap, idx) => {
                  const isSelected = idx === selectedChapterIndex;
                  return (
                    <button
                      key={chap.chapterNumber}
                      onClick={() => {
                        setSelectedChapterIndex(idx);
                        setIsEditingInline(false);
                      }}
                      className={`w-full p-4 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-amber-50/80 border-amber-300 shadow-2xs'
                          : 'bg-white border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 mb-1">
                        <span>CHAPTER {chap.chapterNumber}</span>
                        <span>{chap.wordCount} words</span>
                      </div>
                      <h4 className="font-editorial text-sm font-bold text-stone-900 line-clamp-1">
                        {chap.title}
                      </h4>
                      <p className="text-xs text-stone-600 line-clamp-2 mt-1 font-sans">
                        {chap.summary}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 p-4 bg-stone-100/70 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-2">
                <span className="font-semibold text-stone-800 block">Editorial Actions</span>
                <p>
                  You can edit the chapter prose directly or launch the AI customizer to reshape tone and endings.
                </p>
                <button
                  onClick={() => onGoToCustomization(selectedChapterIndex)}
                  className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Customize Chapter {currentChapter.chapterNumber} with AI</span>
                </button>
              </div>
            </div>

            {/* Right: Chapter Prose Viewer / Editor */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-xl border border-stone-200 shadow-sm relative">
              {/* Header inside chapter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                  <span className="text-xs font-mono text-amber-800 uppercase tracking-widest block font-medium">
                    Chapter {currentChapter.chapterNumber} of {story.chapters.length}
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-950 mt-1">
                    {currentChapter.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {isEditingInline ? (
                    <button
                      onClick={handleSaveInlineEdit}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStartInlineEdit}
                      className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Prose</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Chapter Summary kicker */}
              <div className="py-4 text-xs italic text-stone-500 font-serif border-b border-stone-100">
                <strong>Summary:</strong> {currentChapter.summary}
              </div>

              {/* Prose Content */}
              <div className="mt-6">
                {isEditingInline ? (
                  <textarea
                    rows={16}
                    value={editableContent}
                    onChange={(e) => setEditableContent(e.target.value)}
                    className="w-full p-4 font-serif text-base text-stone-800 leading-relaxed border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/20"
                  />
                ) : (
                  <div className="font-prose text-stone-800 text-base leading-[1.8] space-y-4">
                    {currentChapter.content.split(/\n\s*\n/).map((para, i) => (
                      <p key={i} className="text-justify indent-6">
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer navigation between chapters */}
              <div className="mt-10 pt-6 border-t border-stone-200 flex items-center justify-between text-xs">
                <button
                  disabled={selectedChapterIndex === 0}
                  onClick={() => setSelectedChapterIndex((p) => Math.max(0, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none"
                >
                  ← Previous Chapter
                </button>
                <span className="text-stone-400 font-mono">
                  {selectedChapterIndex + 1} / {story.chapters.length}
                </span>
                <button
                  disabled={selectedChapterIndex === story.chapters.length - 1}
                  onClick={() => setSelectedChapterIndex((p) => Math.min(story.chapters.length - 1, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none"
                >
                  Next Chapter →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CHARACTERS */}
        {activeTab === 'characters' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-stone-900">
                  Dramatis Personae & Character Dossiers
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  AI-developed characters with defined archetypes, personalities, and driving motivations.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {story.characters.map((char, i) => (
                <div
                  key={i}
                  className="p-6 bg-white rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-stone-500 mb-1">
                      <span>{char.role}</span>
                    </div>
                    <h4 className="font-editorial text-xl font-bold text-stone-950">
                      {char.name}
                    </h4>
                    <p className="text-xs text-stone-700 leading-relaxed mt-2 font-sans">
                      {char.description}
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 text-xs">
                    <span className="font-semibold text-stone-800 block mb-0.5">Core Motivation:</span>
                    <p className="text-stone-600 italic font-serif">{char.motivation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: 5-STAGE DRAMATIC PLOT ARC */}
        {activeTab === 'plot' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-editorial text-2xl font-bold text-stone-900">
                5-Stage Dramatic Narrative Architecture
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                The structured plot trajectory generated from your story premise.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Exposition', text: story.plotOutline.exposition, step: '01' },
                { label: 'Rising Action', text: story.plotOutline.risingAction, step: '02' },
                { label: 'Climax', text: story.plotOutline.climax, step: '03' },
                { label: 'Falling Action', text: story.plotOutline.fallingAction, step: '04' },
                { label: 'Resolution', text: story.plotOutline.resolution, step: '05' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-white rounded-xl border border-stone-200 flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {item.step}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-stone-900">
                      {item.label}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SETTING & WORLD */}
        {activeTab === 'setting' && (
          <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm space-y-6">
            <h3 className="font-editorial text-2xl font-bold text-stone-900">
              World Architecture & Atmosphere
            </h3>

            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-xs font-mono uppercase text-stone-500 block mb-1">Location</span>
                <p className="font-semibold text-stone-900">{story.setting.place}</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-xs font-mono uppercase text-stone-500 block mb-1">Time Period</span>
                <p className="font-semibold text-stone-900">{story.setting.period}</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-xs font-mono uppercase text-stone-500 block mb-1">Atmosphere</span>
                <p className="font-semibold text-stone-900">{story.setting.atmosphere}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
