import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint for Cloud Run and load balancer container liveness probes
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime(), port: PORT });
});

// Dynamic Gemini client with telemetry User-Agent as required by skill guidelines
function getAiClient() {
  const key = process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Supported models with automatic high-demand failover
const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

async function generateWithModelFallback(params: {
  contents: string;
  config: any;
}) {
  const ai = getAiClient();
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      console.log(`[StoryCraft AI] Attempting generation with model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      console.log(`[StoryCraft AI] Generation succeeded with model: ${model}`);
      return response;
    } catch (err: any) {
      console.warn(`[StoryCraft AI] Model ${model} encountered error:`, err?.message || err);
      lastError = err;
      // Try next supported candidate model if 503 or transient failure
      continue;
    }
  }

  throw lastError || new Error('All supported Gemini models failed to generate content.');
}

export interface StoryCharacter {
  name: string;
  role: string;
  description: string;
  motivation: string;
}

export interface StoryChapter {
  chapterNumber: number;
  title: string;
  summary: string;
  content: string;
  wordCount: number;
}

export interface GeneratedStory {
  id: string;
  title: string;
  subtitle: string;
  logline: string;
  author: string;
  genre: string;
  tone: string;
  audience: string;
  coverTheme: 'antique-gold' | 'midnight-ink' | 'moss-emerald' | 'crimson-velvet' | 'celestial-sapphire';
  setting: {
    place: string;
    period: string;
    atmosphere: string;
  };
  characters: StoryCharacter[];
  plotOutline: {
    exposition: string;
    risingAction: string;
    climax: string;
    fallingAction: string;
    resolution: string;
  };
  chapters: StoryChapter[];
  totalWords: number;
  estimatedReadTime: string;
  createdAt: string;
}

// Fallback high-quality curated story generator if API key is missing or rate limited
function createCuratedStory(input: {
  idea: string;
  genre?: string;
  tone?: string;
  audience?: string;
  length?: string;
  setting?: string;
  characters?: string;
  authorName?: string;
}): GeneratedStory {
  const author = input.authorName?.trim() || 'Elena Vance';
  const genre = input.genre || 'Mystery & Suspense';
  const isGrandmotherKey = input.idea.toLowerCase().includes('key') || input.idea.toLowerCase().includes('grandmother');
  
  if (isGrandmotherKey) {
    return {
      id: 'story-' + Date.now(),
      title: 'The Brass Key of Ashwood Manor',
      subtitle: 'Secrets Kept in Dusty Floorboards',
      logline: 'When fourteen-year-old Maya discovers an intricate brass key tucked beneath her grandmother’s attic floorboards, she uncovers a legacy of hidden letters and an unsolved family disappearance.',
      author: author,
      genre: genre,
      tone: input.tone || 'Mysterious & Reflective',
      audience: input.audience || 'Young Adult',
      coverTheme: 'antique-gold',
      setting: {
        place: input.setting || 'Ashwood Manor, coastal Devonshire',
        period: 'Late autumn, present day with 1940s historical echoes',
        atmosphere: 'Rain-lashed windowpanes, cedar chests, grandfather clocks, and whispering wind',
      },
      characters: [
        {
          name: 'Maya Lin',
          role: 'Protagonist',
          description: 'A curious fourteen-year-old with an eye for small forgotten details and sketchbooks filled with architecture.',
          motivation: 'To understand the quiet sorrow her grandmother carried and discover what the brass key unlocks.',
        },
        {
          name: 'Grandmother Evelyn',
          role: 'The Matriarch',
          description: 'An eighty-two-year-old former codebreaker with sharp blue eyes and a tendency to change the subject whenever the past is raised.',
          motivation: 'To protect her family from a long-buried sorrow while ensuring the truth isn’t lost forever.',
        },
        {
          name: 'Julian Vance',
          role: 'The Estranged Brother',
          description: 'A botanist from 1944 who went missing just after the great harvest storm, leaving only encrypted journals.',
          motivation: 'To preserve rare coastal flora and safeguard an enduring wartime secret.',
        },
      ],
      plotOutline: {
        exposition: 'Maya is sent to spend November at Evelyn’s drafty manor while her parents travel, finding comfort in the cedar-scented library.',
        risingAction: 'A loose board under the attic window reveals a velvet-wrapped skeleton key marked with a swallow emblem.',
        climax: 'Maya finds the locked mahogany cabinet behind the conservatory trellis, revealing Evelyn’s wartime letters and Julian’s final map.',
        fallingAction: 'Evelyn finds Maya with the letters; instead of anger, relief washes over her as fifty years of silence finally breaks.',
        resolution: 'Together, grandmother and granddaughter plant the preserved heirloom seeds Julian left behind, healing three generations of doubt.',
      },
      chapters: [
        {
          chapterNumber: 1,
          title: 'Floorboards and Whispers',
          summary: 'Maya explores the dusty attic of Ashwood Manor and unearths an antique key with an unusual bird crest.',
          content: `The floorboards of Ashwood Manor always sang in minor chords. Every step Maya took through the third-floor corridor caused the ancient heart-pine planks to groan beneath her sneakers, as if protesting the weight of someone who hadn't yet lived through half a century of winter damp.

Grandmother Evelyn had explicitly said: "Read by the hearth, Maya. Have ginger biscuits. But leave the east wing alone—the rafters are tired."

Naturally, by four in the afternoon, with the rain turning into a steady sheet of grey against the leaded glass, Maya was on her hands and knees beneath the dormer window in the attic. She wasn't looking for trouble; she was looking for a dropped mechanical pencil. 

Her fingers had grazed the gap where the wainscoting met the cedar floor. Instead of smooth varnish, her fingertips caught on a notch. A deliberate bevel. She pressed down, and with a muffled click that sounded like an old watch escapement, an eight-inch panel shifted upward.

Inside lay no jewels or pirate gold. Only a wrapping of faded violet velvet, cool and faintly smelling of dried lavender and motor oil. When she peeled the fabric back, her breath caught.

It was a key. Long, heavy, and cast from dark sea-aged brass. Its bow was carved into the shape of a swallow in mid-glide, its wings curving back to form the loop. Along the stem, four delicate notches had been filed with razor-like precision, resembling musical bar lines rather than ordinary tumbler teeth.

"Whose door did you belong to?" Maya murmured, lifting it to the cold window light. The swallow seemed to gleam, catching the faint twilight. Below, in the hall, the grandfather clock struck five slow, deliberate chimes.`,
          wordCount: 295,
        },
        {
          chapterNumber: 2,
          title: 'The Swallow of the East Wing',
          summary: 'Maya investigates the manor’s architecture and discovers a concealed door behind the conservatory.',
          content: `Dinner that evening was a polite duel of quiet observations. Grandmother Evelyn sliced her roast potatoes with military precision, the silver fork glinting under the chandelier.

"You've been upstairs," Evelyn remarked without looking up.

Maya froze with her glass of cider midway to her lips. "Only looking at the storm from the window."

"The attic smells of rain," Evelyn said softly. "And older things. Your grandfather used to say this house has more hiding places than a badger's warren." She paused, her pale blue eyes settling on Maya with an intensity that made the room feel suddenly smaller. "Be careful what you unearth, little bird. Not every locked box contains a treasure."

That night, Maya couldn't sleep. The swallow key sat beneath her pillow, cold against her palm. She took out her sketchpad and drew the crest from memory. She had seen that exact bird before—not in a book, but carved into the stone lintel overlooking the neglected glass conservatory at the garden's edge.

At dawn, before the kitchen stove had even been lit, Maya slipped through the side pantry into the glasshouse. Vines of dormant wisteria hung like knotted cables from the iron ribs of the roof. At the far end, behind a row of rusted brass watering cans and stacked terracotta pots, she cleared away the dead ivy.

There it was. A low wooden panel embedded flush into the stone foundation wall. In the center, almost obscured by green lichen, was a single brass escutcheon in the shape of a descending bird.`,
          wordCount: 256,
        },
        {
          chapterNumber: 3,
          title: 'The Conservatory Vault',
          summary: 'The key turns, revealing a secret compartment filled with preserved botanical specimens and wartime correspondence.',
          content: `The brass key fit as if it had been forged only yesterday. When Maya turned it clockwise, she felt no grit or resistance—only a deep, satisfying metallic thud that resonated through the stone.

The panel eased forward on hidden counterweights. Behind it sat a zinc-lined dispatch case bearing the stencil: 'MINISTRY OF SUPPLY — COASTAL SURVEY 1943'.

Inside were neither state secrets nor gold. Stacked in orderly compartments were small glass vials sealed with beeswax, each containing tiny dark seeds, and a packet of onion-skin letters tied with faded blue twine. Maya lifted the top letter. The handwriting was swift and upright, addressed to 'My dearest Evie'.

'If the harvest fails this winter,' the letter read, 'do not let them take the salt-marsh barley. It is the only strain that survived the blight. I have hidden the master stock where the frost cannot reach. Trust the swallow.' It was signed: 'Julian'.

"He was my twin brother," a voice spoke from the conservatory doorway.

Maya jumped, nearly dropping the glass vial. Grandmother Evelyn stood in her wool cardigan, leaning slightly on her walking stick, her face pale in the morning mist. But she wasn't angry. A soft, trembling smile touched her lips.

"Fifty-two years," Evelyn whispered, her gaze dropping to the dispatch box. "He was reported lost at sea during the crossing to Portsmouth. The admiralty claimed he carried nothing of value. But he saved our town's agriculture, and he hid his greatest work right here."`,
          wordCount: 247,
        },
        {
          chapterNumber: 4,
          title: 'Seeds of Remembrance',
          summary: 'Grandmother and granddaughter share the truth, replanting the heritage grain and cementing an unbreakable bond.',
          content: `They sat together on the weathered stone bench while the morning kettle whistled from the kitchen. Evelyn ran her frail, work-calloused thumb over the swallow crest on the key.

"I spent decades believing Julian had perished without finishing what he started," Evelyn said, tears catching the sunlight at the corners of her eyes. "I locked the attic and locked my heart because it hurt too much to remember his laugh in these corridors."

Maya reached over and gently closed her fingers over her grandmother's hand. "He finished it, Grandma. He kept his promise."

That spring, the two of them broke ground in the south field behind Ashwood Manor. Row by row, they pressed Julian's hardy coastal seeds into the rich Devon soil. By mid-summer, a sea of amber stalks swayed in the ocean breeze—tall, resilient, and golden in the twilight.

Maya wore the brass swallow key on a silver chain around her neck. It no longer guarded a forgotten secret. Instead, it was an open doorway between generations—proof that stories never truly end so long as someone is brave enough to look beneath the floorboards.`,
          wordCount: 188,
        },
      ],
      totalWords: 987,
      estimatedReadTime: '4 min read',
      createdAt: new Date().toISOString(),
    };
  }

  // Generic creative story
  const title = input.idea.slice(0, 30).trim() || 'The Chronicle of New Horizons';
  return {
    id: 'story-' + Date.now(),
    title: 'Echoes Across the Horizon',
    subtitle: 'A Tale of Discovery and Resilience',
    logline: `A captivating ${genre.toLowerCase()} journey following unlikely heroes faced with choices that redefine their world.`,
    author: author,
    genre: genre,
    tone: input.tone || 'Inspiring & Evocative',
    audience: input.audience || 'General Adult',
    coverTheme: 'celestial-sapphire',
    setting: {
      place: input.setting || 'The high plateaus of Aethelgard',
      period: 'An era of renaissance and sudden discovery',
      atmosphere: 'Vibrant skies, bustling harbor alleys, and distant starry horizons',
    },
    characters: [
      {
        name: 'Rowan Vance',
        role: 'The Visionary',
        description: 'A quiet navigator with an unconventional map of uncharted currents.',
        motivation: 'To prove that the ancient records were true and bring hope to their people.',
      },
      {
        name: 'Kaelen Gray',
        role: 'The Skeptic',
        description: 'A seasoned archivist who trusts only what can be measured in iron and stone.',
        motivation: 'To prevent reckless danger while secretly longing to be proven wrong.',
      },
    ],
    plotOutline: {
      exposition: 'The story begins with an unexpected discovery among forgotten manuscripts.',
      risingAction: 'A daring expedition embarks into uncharted territories against counsel.',
      climax: 'An unexpected obstacle challenges everything the protagonists believed.',
      fallingAction: 'Through collaboration and courage, an ingenious solution emerges.',
      resolution: 'The journey forever transforms their community, opening a new chapter of peace.',
    },
    chapters: [
      {
        chapterNumber: 1,
        title: 'The Parchment in the Tower',
        summary: 'Rowan unearths an uncatalogued star chart that points far beyond the boundary wall.',
        content: `Dust motes danced in the solitary shaft of amber sunlight piercing the archival dome. Rowan had spent three years cataloging trade manifests, but today a binding broke cleanly under his thumb, revealing maps that no sovereign ruler had ever stamped.

The lines were not drawn in ink, but pressed with luminous powder that reacted to warmth. When Rowan placed his palm against the vellum, constellations flared to life across the page like waking fireflies.`,
        wordCount: 82,
      },
      {
        chapterNumber: 2,
        title: 'Beyond the Great Ridge',
        summary: 'The expedition departs at dawn, confronting the elements and unforeseen wonder.',
        content: `The mountain pass smelled of sharp ozone and crushed mint. Kaelen kept his walking staff steady, muttering about the folly of following starlight when one could follow roads.

Yet as the clouds parted over the valley below, even Kaelen stopped in his tracks. Sprawled before them was a city woven not from stone, but living crystal terraces reflecting the dawn like a kaleidoscope.`,
        wordCount: 71,
      },
      {
        chapterNumber: 3,
        title: 'The Convergence',
        summary: 'The team decodes the beacon, returning with gifts of knowledge for their homeland.',
        content: `At the central dais, the ancient apparatus responded to Rowan’s touch with a harmonic resonance that vibrated through the bedrock. It was not a weapon or a throne—it was an observatory designed to predict rainfall and drought for centuries ahead.

With the records secured in their satchels, they turned back toward home, knowing their world would never be small again.`,
        wordCount: 68,
      },
    ],
    totalWords: 221,
    estimatedReadTime: '2 min read',
    createdAt: new Date().toISOString(),
  };
}

// Endpoint: Generate full story from idea & customizations
app.post('/api/story/generate', async (req: Request, res: Response) => {
  const { idea, genre, tone, audience, length, setting, characters, authorName } = req.body;

  if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
    return res.status(400).json({ error: 'Please provide a story idea or premise.' });
  }

  const currentApiKey = process.env.GEMINI_API_KEY || '';
  if (!currentApiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured in the environment. Please attach a Gemini API key in Settings > Secrets.',
    });
  }

  // Determine chapter count based on user choice
  let chapterCount = 4;
  if (length === 'short' || length === '3-chapters' || length === '3') chapterCount = 3;
  if (length === 'standard' || length === 'medium' || length === '4-chapters' || length === '4') chapterCount = 4;
  if (length === 'long' || length === 'expanded' || length === '5-chapters' || length === '5') chapterCount = 5;

  try {
    const prompt = `You are StoryCraft AI, an award-winning creative writing mentor and book author.
Transform the following user story idea into a structured, publication-ready multi-chapter digital book.

USER STORY INPUTS:
- Core Story Idea: "${idea.trim()}"
- Genre: ${genre || 'General Fiction / Mystery'}
- Tone/Style: ${tone || 'Clear, Engaging & Heartfelt'}
- Target Audience: ${audience || 'Young Readers & General Audience'}
- Requested Chapter Count: Exactly ${chapterCount} chapters. You MUST provide an array of exactly ${chapterCount} chapters.
- Custom Setting: ${setting ? setting.trim() : 'Rich atmospheric setting appropriate to the story'}
- Character Notes: ${characters ? characters.trim() : 'Develop 2 to 3 distinctive characters with clear motivations'}
- Author Name: ${authorName ? authorName.trim() : 'StoryCraft Author'}

CRITICAL LANGUAGE & VOCABULARY RULES:
- USE SIMPLE, CLEAR, AND EASY-TO-UNDERSTAND WORDS.
- Avoid difficult, fancy, archaic, or overly complicated words.
- Write natural, lively, and engaging sentences that anyone, including students and beginner readers, can read and understand smoothly.
- Keep dialogues and emotions warm, relatable, and clear.

REQUIREMENTS:
1. Provide an evocative book title and subtitle directly based on the user's idea ("${idea.trim()}").
2. Formulate a 1-sentence logline using clear, straightforward language.
3. Define 2-3 deep characters with distinct roles, personality descriptions, and motivations explained in simple words.
4. Construct a 5-beat plot outline (exposition, risingAction, climax, fallingAction, resolution).
5. Generate exactly ${chapterCount} chapters in sequential order.
   - For each chapter provide: chapterNumber (1, 2, ... up to ${chapterCount}), title, summary (1-2 sentences), and rich prose content (around 180-320 words per chapter written with simple, clear, and vivid words).
6. Pick an appropriate coverTheme from: "antique-gold", "midnight-ink", "moss-emerald", "crimson-velvet", "celestial-sapphire".

Return strictly valid JSON adhering to the schema.`;

    const response = await generateWithModelFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            logline: { type: Type.STRING },
            author: { type: Type.STRING },
            genre: { type: Type.STRING },
            tone: { type: Type.STRING },
            audience: { type: Type.STRING },
            coverTheme: {
              type: Type.STRING,
              enum: ['antique-gold', 'midnight-ink', 'moss-emerald', 'crimson-velvet', 'celestial-sapphire'],
            },
            setting: {
              type: Type.OBJECT,
              properties: {
                place: { type: Type.STRING },
                period: { type: Type.STRING },
                atmosphere: { type: Type.STRING },
              },
              required: ['place', 'period', 'atmosphere'],
            },
            characters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  description: { type: Type.STRING },
                  motivation: { type: Type.STRING },
                },
                required: ['name', 'role', 'description', 'motivation'],
              },
            },
            plotOutline: {
              type: Type.OBJECT,
              properties: {
                exposition: { type: Type.STRING },
                risingAction: { type: Type.STRING },
                climax: { type: Type.STRING },
                fallingAction: { type: Type.STRING },
                resolution: { type: Type.STRING },
              },
              required: ['exposition', 'risingAction', 'climax', 'fallingAction', 'resolution'],
            },
            chapters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  chapterNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  content: { type: Type.STRING },
                },
                required: ['chapterNumber', 'title', 'summary', 'content'],
              },
            },
          },
          required: ['title', 'subtitle', 'logline', 'author', 'genre', 'tone', 'audience', 'coverTheme', 'setting', 'characters', 'plotOutline', 'chapters'],
        },
      },
    });

    let cleanText = response.text?.trim() || '';
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(cleanText);

    // Calculate word counts & estimated reading time
    let totalWords = 0;
    const chaptersWithMeta: StoryChapter[] = (parsed.chapters || []).map((ch: any, idx: number) => {
      const words = (ch.content || '').split(/\s+/).filter(Boolean).length;
      totalWords += words;
      return {
        chapterNumber: ch.chapterNumber || idx + 1,
        title: ch.title || `Chapter ${idx + 1}`,
        summary: ch.summary || '',
        content: ch.content || '',
        wordCount: words,
      };
    });

    const readMinutes = Math.max(1, Math.ceil(totalWords / 200));

    const finalStory: GeneratedStory = {
      id: 'story-' + Date.now(),
      title: parsed.title || 'Untitled Chronicle',
      subtitle: parsed.subtitle || '',
      logline: parsed.logline || '',
      author: authorName?.trim() || parsed.author || 'StoryCraft Author',
      genre: genre || parsed.genre || 'Fiction',
      tone: tone || parsed.tone || 'Reflective',
      audience: audience || parsed.audience || 'General',
      coverTheme: parsed.coverTheme || 'antique-gold',
      setting: parsed.setting || { place: 'Unknown', period: 'Modern', atmosphere: 'Evocative' },
      characters: parsed.characters || [],
      plotOutline: parsed.plotOutline || { exposition: '', risingAction: '', climax: '', fallingAction: '', resolution: '' },
      chapters: chaptersWithMeta,
      totalWords,
      estimatedReadTime: `${readMinutes} min read`,
      createdAt: new Date().toISOString(),
    };

    return res.json(finalStory);
  } catch (err: any) {
    console.error('[StoryCraft AI] Story generation failed:', err?.message || err);
    return res.status(500).json({
      error: `AI Story Generation failed: ${err?.message || 'Could not contact AI service. Please verify your internet connection or try again.'}`,
    });
  }
});

// Endpoint: Chapter-level customization / AI rewrite (Section 5 & 8 of Project Report)
app.post('/api/story/customize-chapter', async (req: Request, res: Response) => {
  const { storyTitle, chapter, instruction, customEnding, genre, tone } = req.body;

  if (!chapter || !chapter.content) {
    return res.status(400).json({ error: 'Chapter content is required for customization.' });
  }

  const currentApiKey = process.env.GEMINI_API_KEY || '';
  if (!currentApiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured in the environment.',
    });
  }

  const promptDirective = instruction || 'Enhance the emotional nuance and sensory imagery of this chapter';

  try {
    const prompt = `You are an expert novel editor revising a specific chapter in the book "${storyTitle || 'The Story'}".
Genre: ${genre || 'Fiction'}
Tone: ${tone || 'Literary'}

EXISTING CHAPTER ${chapter.chapterNumber}: "${chapter.title}"
Summary: ${chapter.summary}
Content:
"""
${chapter.content}
"""

REVISION INSTRUCTION FROM USER:
"${promptDirective}"
${customEnding ? `SPECIFIC ENDING DIRECTION: "${customEnding}"` : ''}

TASK:
Rewrite this chapter incorporating the instruction while preserving narrative continuity with the overall story.
IMPORTANT: Use simple, clear, and easy-to-understand words. Avoid overly complicated or fancy vocabulary so the story remains effortless and pleasant to read.
Maintain warm emotional depth, natural prose rhythm, and engaging character dialogue.

Return strictly JSON format:
{
  "title": "revised chapter title (or keep current)",
  "summary": "updated 1-2 sentence chapter summary",
  "content": "the complete rewritten chapter prose",
  "editorialNotes": "1 concise sentence explaining the adjustments made"
}`;

    const response = await generateWithModelFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let cleanText = response.text?.trim() || '';
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(cleanText);
    const content = parsed.content || chapter.content;
    const words = content.split(/\s+/).filter(Boolean).length;

    return res.json({
      chapterNumber: chapter.chapterNumber,
      title: parsed.title || chapter.title,
      summary: parsed.summary || chapter.summary,
      content: content,
      wordCount: words,
      notes: parsed.editorialNotes || 'Chapter successfully updated.',
    });
  } catch (err: any) {
    console.error('[StoryCraft AI] Error in chapter customization:', err?.message || err);
    return res.status(500).json({
      error: `Chapter customization failed: ${err?.message || 'Could not process rewrite.'}`,
    });
  }
});

// Endpoint: Brainstorm story seed suggestions (Characters, Setting, Twists)
app.post('/api/story/brainstorm', async (req: Request, res: Response) => {
  const { idea, genre } = req.body;
  const seed = idea || 'A girl finds an old key in her grandmother house';

  const currentApiKey = process.env.GEMINI_API_KEY || '';
  if (!currentApiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured in the environment.',
    });
  }

  try {
    const prompt = `Given the story idea: "${seed}" in genre "${genre || 'Mystery'}", suggest:
1. 3 evocative setting locations
2. 3 character ideas with names and distinctive traits
3. 2 compelling plot twists

Return strictly JSON:
{
  "suggestedSettings": ["string", "string", "string"],
  "characterSuggestions": ["string", "string", "string"],
  "plotTwists": ["string", "string"]
}`;

    const response = await generateWithModelFallback({
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    let cleanText = response.text?.trim() || '';
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }

    return res.json(JSON.parse(cleanText));
  } catch (e: any) {
    console.error('[StoryCraft AI] Error in brainstorming:', e?.message || e);
    return res.status(500).json({
      error: `Brainstorming failed: ${e?.message || 'AI service error.'}`,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(distPath);
  const isProd = process.env.NODE_ENV === 'production' || hasDist;

  if (isProd && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    try {
      const { createServer } = await import('vite');
      const vite = await createServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn('Vite dev middleware could not start, checking static dist fallback:', err);
      if (hasDist) {
        app.use(express.static(distPath));
        app.get('*', (_req, res) => {
          res.sendFile(path.resolve(distPath, 'index.html'));
        });
      }
    }
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`StoryCraft AI server running on http://0.0.0.0:${PORT}`);
  });

  // Graceful termination for Cloud Run container lifecycle
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
      process.exit(0);
    });
  });
}

startServer();
