import React, { useState } from 'react';
import { CoverTheme, GeneratedStory, StoryChapter } from '../types';
import { CoverArt } from './CoverArt';
import { exportStoryToPdf } from '../utils/pdfGenerator';
import {
  BookOpen,
  FileDown,
  ArrowLeft,
  Sliders,
  Printer,
  Copy,
  Check,
  Palette,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  BookMarked,
} from 'lucide-react';

interface FinalBookScreenProps {
  story: GeneratedStory;
  onUpdateTheme: (newTheme: CoverTheme) => void;
  onBackToManuscript: () => void;
  onGoToCustomizer: () => void;
}

const COVER_THEMES: Array<{ id: CoverTheme; label: string; previewColor: string }> = [
  { id: 'antique-gold', label: 'Antique Gold & Ebony', previewColor: 'bg-[#231d17] border-[#c8a951]' },
  { id: 'midnight-ink', label: 'Midnight Blue & Silver', previewColor: 'bg-[#0f172a] border-sky-400' },
  { id: 'moss-emerald', label: 'Moss Emerald & Ivy', previewColor: 'bg-[#14261c] border-emerald-400' },
  { id: 'crimson-velvet', label: 'Crimson Velvet & Rose', previewColor: 'bg-[#330c14] border-rose-400' },
  { id: 'celestial-sapphire', label: 'Celestial Indigo & Stars', previewColor: 'bg-[#171b3d] border-amber-300' },
];

export const FinalBookScreen: React.FC<FinalBookScreenProps> = ({
  story,
  onUpdateTheme,
  onBackToManuscript,
  onGoToCustomizer,
}) => {
  // Navigation within the digital book:
  // 0: Cover
  // 1: Title & Dedication
  // 2: Characters & TOC
  // 3+: Chapters (3 = Chapter 1, 4 = Chapter 2, etc.)
  const [pageIndex, setPageIndex] = useState(0);
  const [paperTheme, setPaperTheme] = useState<'cream' | 'white' | 'dark'>('cream');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [copiedToast, setCopiedToast] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const totalPages = 3 + story.chapters.length;

  const handleDownloadPdf = () => {
    setIsExportingPdf(true);
    try {
      exportStoryToPdf(story);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setTimeout(() => setIsExportingPdf(false), 800);
    }
  };

  const handleDownloadMarkdown = () => {
    const md = `# ${story.title}\n\n*${story.subtitle || ''}*\n\n**A Novel by ${story.author}**\n\n**Genre:** ${story.genre} | **Audience:** ${story.audience}\n\n---\n\n## Setting\n${story.setting.place} — ${story.setting.atmosphere}\n\n---\n\n## Characters\n${story.characters.map((c) => `- **${c.name}** (${c.role}): ${c.description}`).join('\n')}\n\n---\n\n${story.chapters.map((ch) => `### Chapter ${ch.chapterNumber}: ${ch.title}\n\n*Summary: ${ch.summary}*\n\n${ch.content}\n\n---\n`).join('\n')}\n\n*Generated with StoryCraft AI*\n`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-manuscript.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyAll = () => {
    const fullText = `${story.title}\n${story.subtitle}\nBy ${story.author}\n\n${story.chapters.map((c) => `Chapter ${c.chapterNumber}: ${c.title}\n\n${c.content}`).join('\n\n')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const paperStyles = {
    cream: 'bg-[#fbf7ee] text-stone-900 border-[#e8dfcf]',
    white: 'bg-white text-stone-900 border-stone-200',
    dark: 'bg-[#181615] text-stone-100 border-stone-800',
  }[paperTheme];

  const fontSizes = {
    sm: 'text-sm leading-[1.7]',
    base: 'text-base leading-[1.8]',
    lg: 'text-lg leading-[1.9]',
  }[fontSize];

  return (
    <div className="min-h-screen bg-[#f4f1eb] text-stone-900 pb-20 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-300">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToManuscript}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Manuscript</span>
            </button>
            <span className="text-stone-300">|</span>
            <button
              onClick={onGoToCustomizer}
              className="inline-flex items-center gap-1 text-xs text-amber-800 hover:underline font-medium"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Fine-Tune Chapters</span>
            </button>
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 text-xs font-medium bg-white text-stone-700 border border-stone-300 rounded-lg hover:bg-stone-50 flex items-center gap-1.5 transition-colors"
            >
              {copiedToast ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedToast ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="px-3 py-1.5 text-xs font-medium bg-white text-stone-700 border border-stone-300 rounded-lg hover:bg-stone-50 flex items-center gap-1.5 transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Markdown (.md)</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="px-4 py-1.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 active:scale-95"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isExportingPdf ? 'Binding PDF...' : 'Download Book PDF (A5)'}</span>
            </button>
          </div>
        </div>

        {/* Customization Toolbar: Cover Theme + Reader Settings */}
        <div className="p-4 bg-white rounded-xl border border-stone-300/80 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Cover Style Picker */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-amber-700" />
              <span>Cover Art Theme:</span>
            </span>
            <div className="flex items-center gap-1.5">
              {COVER_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onUpdateTheme(theme.id)}
                  title={theme.label}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${theme.previewColor} ${
                    story.coverTheme === theme.id ? 'scale-125 ring-2 ring-amber-500' : 'opacity-80 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Reading Page Settings */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500">Page Color:</span>
              <button
                onClick={() => setPaperTheme('cream')}
                className={`px-2 py-1 rounded text-[11px] font-medium border ${
                  paperTheme === 'cream' ? 'bg-[#fbf7ee] border-amber-600 font-bold' : 'border-stone-200'
                }`}
              >
                Cream
              </button>
              <button
                onClick={() => setPaperTheme('white')}
                className={`px-2 py-1 rounded text-[11px] font-medium border ${
                  paperTheme === 'white' ? 'bg-white border-amber-600 font-bold' : 'border-stone-200'
                }`}
              >
                White
              </button>
              <button
                onClick={() => setPaperTheme('dark')}
                className={`px-2 py-1 rounded text-[11px] font-medium border ${
                  paperTheme === 'dark' ? 'bg-stone-900 text-white border-amber-600 font-bold' : 'border-stone-200'
                }`}
              >
                Night
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-stone-500">Font:</span>
              <button
                onClick={() => setFontSize('sm')}
                className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${
                  fontSize === 'sm' ? 'bg-stone-200' : 'text-stone-500'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`w-5 h-5 rounded flex items-center justify-center font-bold text-xs ${
                  fontSize === 'base' ? 'bg-stone-200' : 'text-stone-500'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`w-5 h-5 rounded flex items-center justify-center font-bold text-sm ${
                  fontSize === 'lg' ? 'bg-stone-200' : 'text-stone-500'
                }`}
              >
                A
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Book Viewer Container */}
        <div className="relative flex justify-center py-4">
          <div
            className={`w-full max-w-2xl min-h-[620px] rounded-lg shadow-2xl border p-8 sm:p-14 flex flex-col justify-between transition-colors duration-300 relative ${paperStyles}`}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), inset 6px 0 16px rgba(0,0,0,0.04)',
            }}
          >
            {/* Soft gutter shadow on the left */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/5 via-black/2 to-transparent pointer-events-none" />

            {/* PAGE CONTENT ROUTER */}
            {/* PAGE 0: FRONT COVER */}
            {pageIndex === 0 && (
              <div className="flex flex-col items-center justify-center my-auto py-4">
                <CoverArt
                  title={story.title}
                  subtitle={story.subtitle}
                  author={story.author}
                  genre={story.genre}
                  theme={story.coverTheme}
                  size="hero"
                />
                <span className="mt-4 text-xs font-mono text-stone-500">
                  Cover Art & Bindings · StoryCraft AI
                </span>
              </div>
            )}

            {/* PAGE 1: TITLE PAGE & COLOPHON */}
            {pageIndex === 1 && (
              <div className="flex flex-col justify-between h-full py-6 text-center space-y-8 my-auto">
                <div className="space-y-4 pt-8">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-stone-500">
                    {story.genre}
                  </span>
                  <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight">
                    {story.title}
                  </h1>
                  {story.subtitle && (
                    <p className="font-serif italic text-base opacity-80">
                      {story.subtitle}
                    </p>
                  )}
                  <div className="w-16 h-px bg-stone-400 mx-auto my-4 opacity-50" />
                  <p className="font-sans text-sm font-semibold tracking-wide">
                    By {story.author}
                  </p>
                </div>

                <div className="space-y-3 py-6 text-xs opacity-75 font-serif italic max-w-md mx-auto">
                  <p>
                    “For every reader who has ever stared at an unopened door, wondered at dusty attics, or believed in stories waiting to be born.”
                  </p>
                </div>

                <div className="pt-8 border-t border-stone-200/60 text-[11px] font-mono opacity-60 space-y-1">
                  <p>Setting: {story.setting.place}</p>
                  <p>Atmosphere: {story.setting.atmosphere}</p>
                  <p className="pt-2">First Edition · StoryCraft AI Learning Block Project</p>
                </div>
              </div>
            )}

            {/* PAGE 2: DRAMATIS PERSONAE & TABLE OF CONTENTS */}
            {pageIndex === 2 && (
              <div className="space-y-8 py-4">
                {/* Dramatis Personae */}
                <div>
                  <h3 className="font-editorial text-lg font-bold border-b border-stone-300 pb-1.5 mb-3">
                    Dramatis Personae
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    {story.characters.map((c, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="font-semibold">
                          {c.name} <span className="font-normal opacity-70">({c.role})</span>
                        </span>
                        <span className="opacity-80 font-serif italic text-[11px]">{c.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Table of Contents */}
                <div>
                  <h3 className="font-editorial text-lg font-bold border-b border-stone-300 pb-1.5 mb-3">
                    Table of Contents
                  </h3>
                  <div className="space-y-2 text-xs font-serif">
                    {story.chapters.map((ch, idx) => (
                      <button
                        key={ch.chapterNumber}
                        onClick={() => setPageIndex(3 + idx)}
                        className="w-full flex items-center justify-between text-left hover:text-amber-800 transition-colors py-1 group"
                      >
                        <span className="group-hover:underline">
                          Chapter {ch.chapterNumber}: {ch.title}
                        </span>
                        <span className="font-mono text-[11px] opacity-60">Page {idx + 4}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PAGE 3+: CHAPTER SPREADS */}
            {pageIndex >= 3 && (() => {
              const currentChap = story.chapters[pageIndex - 3];
              if (!currentChap) return null;

              return (
                <div className="space-y-6 py-2">
                  {/* Running Header */}
                  <div className="flex items-center justify-between text-[11px] font-mono opacity-50 border-b border-stone-200 pb-2">
                    <span>{story.title.toUpperCase()}</span>
                    <span>CHAPTER {currentChap.chapterNumber}</span>
                  </div>

                  {/* Chapter Title Block */}
                  <div className="text-center pt-2 space-y-1">
                    <span className="font-mono text-xs uppercase tracking-widest text-amber-700 font-semibold block">
                      Chapter {currentChap.chapterNumber}
                    </span>
                    <h2 className="font-editorial text-2xl font-bold tracking-tight">
                      {currentChap.title}
                    </h2>
                    <div className="w-10 h-px bg-current opacity-30 mx-auto my-2" />
                  </div>

                  {/* Chapter Prose */}
                  <div className={`font-prose space-y-4 ${fontSizes}`}>
                    {currentChap.content.split(/\n\s*\n/).map((para, i) => (
                      <p key={i} className="text-justify indent-6">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Bottom Book Page Footer */}
            <div className="pt-8 flex items-center justify-between text-xs font-mono opacity-50 border-t border-stone-200/60 mt-auto">
              <span>{pageIndex === 0 ? 'Cover' : pageIndex === 1 ? 'Title Page' : pageIndex === 2 ? 'Contents' : `Chapter ${pageIndex - 2}`}</span>
              <span>— {pageIndex + 1} —</span>
            </div>
          </div>
        </div>

        {/* Page Flipping Control Bar */}
        <div className="flex items-center justify-center gap-4 py-2">
          <button
            disabled={pageIndex === 0}
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            className="p-2.5 rounded-full bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-stone-600">
            <span>Page {pageIndex + 1} of {totalPages}</span>
          </div>

          <button
            disabled={pageIndex === totalPages - 1}
            onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
            className="p-2.5 rounded-full bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs"
            aria-label="Next Page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
