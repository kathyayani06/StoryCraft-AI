import React, { useState } from 'react';
import { ActiveScreen, CoverTheme, GeneratedStory } from './types';
import { SAMPLE_STORIES } from './data/sampleStories';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { StoryInputScreen } from './components/StoryInputScreen';
import { ProcessingScreen } from './components/ProcessingScreen';
import { GeneratedStoryScreen } from './components/GeneratedStoryScreen';
import { CustomizationScreen } from './components/CustomizationScreen';
import { FinalBookScreen } from './components/FinalBookScreen';
import { ProjectReportModal } from './components/ProjectReportModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('home');
  const [activeStory, setActiveStory] = useState<GeneratedStory>(SAMPLE_STORIES[0]);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [generationSeedPreview, setGenerationSeedPreview] = useState('');
  const [targetChapterForCustomization, setTargetChapterForCustomization] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Form submission handler
  const handleGenerateStory = async (formData: {
    idea: string;
    genre: string;
    tone: string;
    audience: string;
    length: string;
    setting: string;
    characters: string;
    authorName: string;
  }) => {
    setGenerationError(null);
    setIsGenerating(true);
    setGenerationSeedPreview(formData.idea);
    setCurrentScreen('processing');

    try {
      const response = await fetch('/api/story/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Server error occurred during story generation.');
      }

      // Set the freshly parsed generated story as the active manuscript
      setActiveStory(data);
      setCurrentScreen('overview');
    } catch (err: any) {
      console.error('Error generating story:', err);
      setGenerationError(err?.message || 'Failed to generate story with AI. Please try again.');
      setCurrentScreen('input');
    } finally {
      setIsGenerating(false);
    }
  };

  // Chapter update (direct edit)
  const handleUpdateChapter = (chapterNumber: number, newContent: string) => {
    setActiveStory((prev) => {
      const updatedChapters = prev.chapters.map((ch) => {
        if (ch.chapterNumber === chapterNumber) {
          const words = newContent.split(/\s+/).filter(Boolean).length;
          return {
            ...ch,
            content: newContent,
            wordCount: words,
          };
        }
        return ch;
      });

      let totalWords = 0;
      updatedChapters.forEach((c) => (totalWords += c.wordCount));

      return {
        ...prev,
        chapters: updatedChapters,
        totalWords,
        estimatedReadTime: `${Math.max(1, Math.ceil(totalWords / 200))} min read`,
      };
    });
  };

  // Chapter revision from AI customizer
  const handleApplyChapterRevision = (
    chapterNumber: number,
    revisedContent: string,
    newTitle?: string
  ) => {
    setActiveStory((prev) => {
      const updatedChapters = prev.chapters.map((ch) => {
        if (ch.chapterNumber === chapterNumber) {
          const words = revisedContent.split(/\s+/).filter(Boolean).length;
          return {
            ...ch,
            title: newTitle || ch.title,
            content: revisedContent,
            wordCount: words,
          };
        }
        return ch;
      });

      let totalWords = 0;
      updatedChapters.forEach((c) => (totalWords += c.wordCount));

      return {
        ...prev,
        chapters: updatedChapters,
        totalWords,
        estimatedReadTime: `${Math.max(1, Math.ceil(totalWords / 200))} min read`,
      };
    });
  };

  // Update Cover Theme
  const handleUpdateTheme = (newTheme: CoverTheme) => {
    setActiveStory((prev) => ({
      ...prev,
      coverTheme: newTheme,
    }));
  };

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-stone-900 flex flex-col font-sans">
      {/* Top Bar Contract Navigation */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onOpenReport={() => setIsReportOpen(true)}
        hasActiveStory={Boolean(activeStory)}
      />

      {/* Main Screen Renderer */}
      <div className="flex-1">
        {currentScreen === 'home' && (
          <HomeScreen
            onStartStory={() => setCurrentScreen('input')}
            onSelectStory={(story) => {
              setActiveStory(story);
              setCurrentScreen('overview');
            }}
            onOpenReport={() => setIsReportOpen(true)}
          />
        )}

        {currentScreen === 'input' && (
          <StoryInputScreen
            onBack={() => {
              setGenerationError(null);
              setCurrentScreen('home');
            }}
            onSubmit={handleGenerateStory}
            isGenerating={isGenerating}
            errorMessage={generationError}
          />
        )}

        {currentScreen === 'processing' && (
          <ProcessingScreen ideaPreview={generationSeedPreview} />
        )}

        {currentScreen === 'overview' && activeStory && (
          <GeneratedStoryScreen
            story={activeStory}
            onUpdateChapter={handleUpdateChapter}
            onGoToCustomization={(chapterIndex = 0) => {
              setTargetChapterForCustomization(chapterIndex);
              setCurrentScreen('customization');
            }}
            onGoToBook={() => setCurrentScreen('book')}
            onRegenerate={() => setCurrentScreen('input')}
          />
        )}

        {currentScreen === 'customization' && activeStory && (
          <CustomizationScreen
            story={activeStory}
            initialChapterIndex={targetChapterForCustomization}
            onApplyChapterRevision={handleApplyChapterRevision}
            onBackToManuscript={() => setCurrentScreen('overview')}
            onGoToBook={() => setCurrentScreen('book')}
          />
        )}

        {currentScreen === 'book' && activeStory && (
          <FinalBookScreen
            story={activeStory}
            onUpdateTheme={handleUpdateTheme}
            onBackToManuscript={() => setCurrentScreen('overview')}
            onGoToCustomizer={() => setCurrentScreen('customization')}
          />
        )}
      </div>

      {/* Project Report & Architecture Specs Modal */}
      <ProjectReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onStartStory={() => {
          setIsReportOpen(false);
          setCurrentScreen('input');
        }}
      />
    </div>
  );
}
