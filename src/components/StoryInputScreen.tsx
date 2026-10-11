import React, { useState } from 'react';
import { Sparkles, Wand2, ArrowLeft, RefreshCw, Lightbulb, User, MapPin, Feather, AlertCircle, Loader2 } from 'lucide-react';

interface StoryInputScreenProps {
  onBack: () => void;
  onSubmit: (formData: {
    idea: string;
    genre: string;
    tone: string;
    audience: string;
    length: string;
    setting: string;
    characters: string;
    authorName: string;
  }) => void;
  isGenerating?: boolean;
  errorMessage?: string | null;
}

const INSPIRATION_SEEDS = [
  {
    label: "Grandmother's Key (Canonical)",
    idea: "A girl finds an old brass key in her grandmother's house tucked beneath loose attic floorboards.",
    genre: "Mystery & Suspense",
    setting: "Coastal Devonshire manor with weathered glass conservatory",
  },
  {
    label: "Starlight Astrolabe",
    idea: "An apprentice astronomer notices that stars in Cygnus are subtly drifting into a geometric navigation cipher.",
    genre: "Science Fiction & Wonder",
    setting: "High-altitude mountain observatory above sea of clouds",
  },
  {
    label: "Clockmaker's Secret",
    idea: "An eccentric clockmaker in 1912 repairs a pocket watch that freezes room temperature and time for twelve seconds.",
    genre: "Historical Fantasy",
    setting: "Cobblestone alleyway in autumn Vienna, filled with ticking mechanisms",
  },
  {
    label: "The Memory Baker",
    idea: "A quiet village baker inherits sourdough starters that trigger forgotten childhood memories in anyone who tastes the bread.",
    genre: "Cozy Magical Realism",
    setting: "A flour-dusted kitchen with copper kettles in the Scottish Highlands",
  },
];

const GENRES = [
  'Mystery & Suspense',
  'Science Fiction & Wonder',
  'Fantasy & Folklore',
  'Historical Fiction',
  'Cozy Drama & Fable',
  'Adventure & Expedition',
  'Children’s Fairy Tale',
];

const AUDIENCES = [
  'Children (Ages 7–11)',
  'Young Adult (Ages 12–18)',
  'General Adult Fiction',
  'Literary & Scholarly',
];

const TONES = [
  'Simple, Clear & Easy Words',
  'Atmospheric & Reflective',
  'Whimsical & Heartwarming',
  'Suspenseful & Tense',
  'Epic & Adventurous',
  'Lyrical & Poetic',
  'Dark & Haunting',
];

export const StoryInputScreen: React.FC<StoryInputScreenProps> = ({
  onBack,
  onSubmit,
  isGenerating = false,
  errorMessage = null,
}) => {
  const [idea, setIdea] = useState('');
  const [genre, setGenre] = useState('Fantasy & Folklore');
  const [tone, setTone] = useState('Simple, Clear & Easy Words');
  const [audience, setAudience] = useState('Young Adult (Ages 12–18)');
  const [length, setLength] = useState('4-chapters');
  const [setting, setSetting] = useState('');
  const [characters, setCharacters] = useState('');
  const [authorName, setAuthorName] = useState('StoryCraft Author');

  const [isBrainstorming, setIsBrainstorming] = useState(false);
  const [brainstormResults, setBrainstormResults] = useState<{
    suggestedSettings?: string[];
    characterSuggestions?: string[];
    plotTwists?: string[];
  } | null>(null);

  const handleApplySeed = (seed: typeof INSPIRATION_SEEDS[0]) => {
    setIdea(seed.idea);
    setGenre(seed.genre);
    setSetting(seed.setting);
    setBrainstormResults(null);
  };

  const handleBrainstorm = async () => {
    if (!idea.trim()) return;
    setIsBrainstorming(true);
    try {
      const res = await fetch('/api/story/brainstorm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, genre }),
      });
      const data = await res.json();
      setBrainstormResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsBrainstorming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    onSubmit({
      idea,
      genre,
      tone,
      audience,
      length,
      setting,
      characters,
      authorName,
    });
  };

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-stone-900 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Top return link */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </button>

        {/* Page Header */}
        <div className="mb-8 border-b border-stone-200 pb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-widest mb-1">
            <span>Story Studio</span>
            <span aria-hidden="true">·</span>
            <span>Screen 2 of 6</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-950">
            Design Your Story Blueprint
          </h1>
          <p className="text-sm text-stone-600 mt-2 font-sans max-w-2xl">
            Supply your core story idea and customization parameters. StoryCraft AI will construct dramatic plot beats, develop distinct characters, and write chapters ready for publication.
          </p>
        </div>

        {/* Error alert if previous generation failed */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-950 text-xs flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-rose-900 block text-sm">Story Generation Notice</span>
              <p className="text-rose-800 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Quick Inspiration Starters */}
        <div className="mb-8 p-5 bg-amber-50/70 rounded-xl border border-amber-200/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 mb-2.5">
            <Lightbulb className="w-4 h-4 text-amber-700" />
            <span>Story Starter Inspirations (Click to Populate)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {INSPIRATION_SEEDS.map((seed, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplySeed(seed)}
                className="px-3 py-1.5 text-xs bg-white text-stone-800 rounded-lg border border-amber-300/80 hover:bg-amber-100/60 transition-colors shadow-2xs font-medium text-left"
              >
                {seed.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-sm">
          {/* Section 1: The Core Story Idea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="idea" className="block text-sm font-semibold text-stone-900">
                1. Core Story Idea / Premise <span className="text-amber-700">*</span>
              </label>
              <button
                type="button"
                onClick={handleBrainstorm}
                disabled={isBrainstorming || isGenerating || !idea.trim()}
                className="text-xs text-amber-800 hover:text-amber-900 flex items-center gap-1 font-medium disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isBrainstorming ? 'animate-spin' : ''}`} />
                <span>AI Brainstorm Suggestions</span>
              </button>
            </div>
            <textarea
              id="idea"
              rows={3}
              required
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. A girl discovers a magical pencil that brings her drawings to life and saves her village from a drought..."
              className="w-full p-3.5 rounded-lg border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-sm text-stone-900 placeholder:text-stone-400 font-sans"
            />
            <p className="text-xs text-stone-500">
              Provide a few lines describing an idea. The GenAI model will expand it into rich narrative prose.
            </p>
          </div>

          {/* AI Brainstorm drawer (if requested) */}
          {brainstormResults && (
            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3 text-xs">
              <div className="flex items-center justify-between text-stone-700 font-semibold">
                <span>Brainstormed Story Elements</span>
                <button
                  type="button"
                  onClick={() => setBrainstormResults(null)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  Dismiss
                </button>
              </div>

              {brainstormResults.suggestedSettings && (
                <div>
                  <span className="font-medium text-stone-600 block mb-1">Suggested Settings:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {brainstormResults.suggestedSettings.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSetting(s)}
                        className="px-2 py-1 bg-white border border-stone-300 rounded text-stone-700 hover:border-amber-600 text-left"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {brainstormResults.characterSuggestions && (
                <div>
                  <span className="font-medium text-stone-600 block mb-1">Character Sparks:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {brainstormResults.characterSuggestions.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCharacters((prev) => (prev ? `${prev}; ${c}` : c))}
                        className="px-2 py-1 bg-white border border-stone-300 rounded text-stone-700 hover:border-amber-600 text-left"
                      >
                        + {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section 2: Genre & Tone */}
          <div className="grid sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-2">
                2. Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 bg-white"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-2">
                3. Narrative Tone & Style
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 bg-white"
              >
                {TONES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 3: Target Audience & Story Length */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-2">
                4. Target Audience
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 bg-white"
              >
                {AUDIENCES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-2">
                5. Book Length / Chapters
              </label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 bg-white"
              >
                <option value="3-chapters">Short Story (3 Chapters)</option>
                <option value="4-chapters">Standard Novella (4 Chapters)</option>
                <option value="5-chapters">Expanded Volume (5 Chapters)</option>
              </select>
            </div>
          </div>

          {/* Section 4: World & Setting */}
          <div className="space-y-2 pt-2">
            <label htmlFor="setting" className="block text-sm font-semibold text-stone-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-stone-500" />
              <span>6. Setting & Atmosphere</span>
            </label>
            <input
              id="setting"
              type="text"
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
              placeholder="e.g. Ashwood Manor, rain-lashed coastal Devonshire with hidden conservatory"
              className="w-full p-2.5 rounded-lg border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-sm text-stone-900"
            />
          </div>

          {/* Section 5: Characters Customization */}
          <div className="space-y-2">
            <label htmlFor="characters" className="block text-sm font-semibold text-stone-900 flex items-center gap-1.5">
              <User className="w-4 h-4 text-stone-500" />
              <span>7. Character Preferences (Names, Roles, Traits)</span>
            </label>
            <input
              id="characters"
              type="text"
              value={characters}
              onChange={(e) => setCharacters(e.target.value)}
              placeholder="e.g. Maya (14yo artist granddaughter), Evelyn (82yo former codebreaker grandmother)"
              className="w-full p-2.5 rounded-lg border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-sm text-stone-900"
            />
          </div>

          {/* Section 6: Author Name */}
          <div className="space-y-2">
            <label htmlFor="author" className="block text-sm font-semibold text-stone-900 flex items-center gap-1.5">
              <Feather className="w-4 h-4 text-stone-500" />
              <span>8. Author Name (For Title Page & Cover)</span>
            </label>
            <input
              id="author"
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name or pen name"
              className="w-full p-2.5 rounded-lg border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-sm text-stone-900"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-stone-500">
              Generates complete characters, 5-stage dramatic arc, chapters, and digital book.
            </span>
            <button
              type="submit"
              disabled={isGenerating || !idea.trim()}
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-900" />
                  <span>Generating Story with Gemini...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Story & Book</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
