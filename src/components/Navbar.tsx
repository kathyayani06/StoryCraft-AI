import React from 'react';
import { ActiveScreen } from '../types';

interface NavbarProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenReport: () => void;
  hasActiveStory: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onOpenReport,
  hasActiveStory,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element, display font) */}
        <button
          onClick={() => onNavigate('home')}
          className="text-xl font-editorial font-bold tracking-tight text-stone-950 whitespace-nowrap shrink-0 hover:text-amber-800 transition-colors text-left"
        >
          StoryCraft AI
        </button>

        {/* Zone 2: 4-5 single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => onNavigate('home')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-stone-900 ${
              currentScreen === 'home' ? 'text-stone-950 font-semibold' : ''
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('input')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-stone-900 ${
              currentScreen === 'input' ? 'text-stone-950 font-semibold' : ''
            }`}
          >
            Story Studio
          </button>
          {hasActiveStory && (
            <>
              <button
                onClick={() => onNavigate('overview')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-stone-900 ${
                  currentScreen === 'overview' ? 'text-stone-950 font-semibold' : ''
                }`}
              >
                Manuscript
              </button>
              <button
                onClick={() => onNavigate('customization')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-stone-900 ${
                  currentScreen === 'customization' ? 'text-stone-950 font-semibold' : ''
                }`}
              >
                Chapter Customizer
              </button>
              <button
                onClick={() => onNavigate('book')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-stone-900 ${
                  currentScreen === 'book' ? 'text-stone-950 font-semibold' : ''
                }`}
              >
                Digital Book & PDF
              </button>
            </>
          )}
          <button
            onClick={onOpenReport}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-amber-900 text-stone-600"
          >
            Project Report
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('input')}
            className="px-4 py-2 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 active:scale-95"
          >
            Create New Story
          </button>
        </div>
      </div>
    </header>
  );
};
