export interface ReportSection {
  id: string;
  number: string;
  title: string;
  content: string[];
  table?: { headers: string[]; rows: string[][] };
}

export const PROJECT_REPORT_DATA = {
  header: {
    title: 'STORYCRAFT AI',
    subtitle: 'A Generative AI-Based Personalized Story-to-Book Creation Platform',
    block: 'Learning Block 1 – Project Report',
    academicYear: '2026–2027',
    department: 'Data Science / CSE',
    submittedBy: 'Kathyayani Voruganti',
    rollNo: '22A91A05XX',
    college: 'Aditya Engineering College / Institute of Technology',
    guidedBy: 'Faculty Mentor',
  },
  sections: [
    {
      id: 'intro',
      number: '1',
      title: 'Introduction',
      content: [
        'StoryCraft AI is a Generative AI-based web application that converts a user\'s short story idea into a structured and customizable digital book. The user can provide a few lines describing an idea, select options such as genre, setting, and story length, and receive an expanded story with characters and chapters.',
        'The practical purpose of the application is to help students, beginner writers, creative users and other people who have story ideas but find it difficult to develop those ideas into a complete, organized story.',
        'Generative AI performs the major content-generation tasks, including story expansion, character development and chapter generation.',
      ],
      highlights: [
        'Story Starter – accepts a short story idea from the user.',
        'Story Expansion – expands the idea into a longer story with characters and plots.',
        'Genre and Character Customization – allows the user to control important story details.',
        'Automatic Chapter Generation – organizes the story into chapters.',
        'Book Creation – formats the completed story into a digital PDF/eBook.',
      ],
      canonicalExample: {
        input: '“A girl finds an old key in her grandmother\'s house.”',
        output: 'A complete mystery story with characters, plot development, chapters and a final digital book.',
      },
    },
    {
      id: 'problem',
      number: '2',
      title: 'Problem Statement',
      content: [
        'Many people have creative story ideas but face difficulty transforming a short idea into a complete and well-structured story. Developing characters, maintaining a consistent plot, dividing a story into chapters and preparing a finished book can require considerable time and writing effort.',
        'StoryCraft AI addresses this problem by using Generative AI to automate much of the content-development process. Instead of manually writing every section, the user supplies the core idea and customization choices, while the system generates and organizes the story.',
      ],
    },
    {
      id: 'objectives',
      number: '3',
      title: 'Objectives',
      content: [
        'Develop a functional GenAI-based web application for story and book creation.',
        'Convert short user-provided ideas into expanded stories.',
        'Generate characters, plots, settings and chapters using Generative AI.',
        'Allow users to customize and edit generated content.',
        'Generate a structured digital book from the completed story.',
        'Evaluate the relevance and quality of AI-generated stories.',
      ],
    },
    {
      id: 'scope',
      number: '4',
      title: 'Project Scope',
      content: [
        'Target Users: Students, Beginner writers, Children and creative learners, Creative writers, Users who have story ideas but struggle with writing.',
        'Supported Input: Story idea/text, Genre, Character information, Setting, Story length, Author name.',
        'Expected Output: Expanded story, Characters, Chapters, Book title, Book cover design/placeholder, Final PDF/eBook.',
        'Boundaries: The initial implementation focuses on text-to-story-to-PDF generation with chapter-level customization and digital binding.',
      ],
    },
    {
      id: 'methodology',
      number: '5',
      title: 'Proposed System / Methodology',
      content: [
        '1. User enters a short story idea.',
        '2. User selects genre, length, setting and character preferences.',
        '3. The backend constructs a structured prompt from the supplied information.',
        '4. The GenAI model generates story elements such as characters, plot and chapters.',
        '5. The generated story is shown to the user for review.',
        '6. The user can edit, regenerate or request changes to selected sections.',
        '7. The completed story is formatted into a digital book.',
        '8. The system generates a final PDF/eBook.',
      ],
      workflowString: 'USER → STORY IDEA → CUSTOMIZATION → PROMPT CONSTRUCTION → GENAI MODEL/API → CHARACTERS + PLOT → CHAPTERS → USER EDITING → BOOK FORMATTER → PDF/eBOOK',
    },
    {
      id: 'architecture',
      number: '6',
      title: 'System Architecture / Workflow',
      content: [
        'The architecture organizes responsibilities into distinct layers ensuring separation of concerns, prompt safety, and responsive generation.',
      ],
      table: {
        headers: ['Layer', 'Main Responsibility'],
        rows: [
          ['User Interface', 'Collect story idea, genre, setting, character and length preferences.'],
          ['Backend Server', 'Receive requests, manage story data and communicate with AI service.'],
          ['Prompt Construction', 'Combine user inputs and story context into structured prompts.'],
          ['GenAI Model / API', 'Generate characters, plot, chapters and requested revisions.'],
          ['Story Management', 'Maintain generated content and support chapter-level changes.'],
          ['Book Formatter', 'Arrange title, author, chapters and other content into a final PDF/eBook.'],
        ],
      },
    },
    {
      id: 'implementation',
      number: '7',
      title: 'Implementation & Technology Stack',
      content: [
        'The system is implemented as a full-stack web application leveraging modern TypeScript, React, Express, and Google GenAI.',
      ],
      table: {
        headers: ['Component', 'Proposed Technology in Report', 'Active Implementation'],
        rows: [
          ['Frontend UI', 'HTML, CSS and JavaScript', 'React 19 + TypeScript + Tailwind CSS'],
          ['Backend Server', 'Python / Flask', 'Express.js + Node.js (Full-stack TypeScript)'],
          ['AI Integration', 'Generative AI API/model', '@google/genai SDK (Gemini 3.8 Flash)'],
          ['PDF Generation', 'Python PDF generation library', 'jsPDF (A5 trim size, dual-column cover, TOC, headers)'],
          ['Story Management', 'SQLite (if required)', 'Structured state with in-memory & session persistence'],
        ],
      },
    },
    {
      id: 'screens',
      number: '8',
      title: 'User Interface / 6 Recommended Screens',
      content: [
        '1. Home Screen — Landing page containing project name and a clear entry point to create a story.',
        '2. Story Input Screen — Form where user enters the story idea and selects genre, length, setting and character details.',
        '3. AI Processing Screen — Loading or progress interface shown while the story is being generated.',
        '4. Generated Story Screen — Displays title, story content and chapters, with options to edit or regenerate.',
        '5. Customization Screen — Allows chapter-level changes such as making a chapter more emotional or changing the ending.',
        '6. Final Book Screen — Displays completed book and provides an option to generate/download the PDF.',
      ],
    },
    {
      id: 'future',
      number: '11',
      title: 'Future Scope',
      content: [
        '• AI-generated illustrations for selected chapters and scenes.',
        '• Automatic AI-generated book covers with fine-grained style controls.',
        '• Voice input for creating stories from spoken ideas.',
        '• Telugu and English multilingual story generation.',
        '• Text-to-speech audiobook generation with multi-character voices.',
        '• Mobile application support (PWA).',
        '• Improved long-term character and plot memory for multi-volume series.',
      ],
    },
  ],
};
