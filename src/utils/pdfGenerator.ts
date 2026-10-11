import { jsPDF } from 'jspdf';
import { GeneratedStory, StoryChapter } from '../../server.ts';

// Color palette map for PDF themes
const THEME_COLORS: Record<string, { bg: [number, number, number]; accent: [number, number, number]; text: [number, number, number] }> = {
  'antique-gold': {
    bg: [35, 28, 20],
    accent: [212, 175, 55],
    text: [248, 246, 240],
  },
  'midnight-ink': {
    bg: [15, 23, 42],
    accent: [147, 197, 253],
    text: [248, 250, 252],
  },
  'moss-emerald': {
    bg: [20, 36, 26],
    accent: [167, 243, 208],
    text: [240, 253, 244],
  },
  'crimson-velvet': {
    bg: [45, 15, 20],
    accent: [253, 164, 175],
    text: [255, 241, 242],
  },
  'celestial-sapphire': {
    bg: [16, 24, 52],
    accent: [250, 204, 21],
    text: [248, 250, 252],
  },
};

export function exportStoryToPdf(story: GeneratedStory) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5', // Standard published novella / book trim size: 148 x 210 mm
  });

  const pageWidth = 148;
  const pageHeight = 210;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  const themeKey = story.coverTheme || 'antique-gold';
  const theme = THEME_COLORS[themeKey] || THEME_COLORS['antique-gold'];

  // ==========================================
  // PAGE 1: BOOK COVER
  // ==========================================
  // Background fill
  doc.setFillColor(theme.bg[0], theme.bg[1], theme.bg[2]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative double border
  doc.setDrawColor(theme.accent[0], theme.accent[1], theme.accent[2]);
  doc.setLineWidth(0.8);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  doc.setLineWidth(0.3);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Corner ornaments
  const corners = [
    [12, 12],
    [pageWidth - 12, 12],
    [12, pageHeight - 12],
    [pageWidth - 12, pageHeight - 12],
  ];
  corners.forEach(([cx, cy]) => {
    doc.circle(cx, cy, 1.5, 'S');
  });

  // Genre kicker
  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(theme.accent[0], theme.accent[1], theme.accent[2]);
  doc.text((story.genre || 'LITERARY FICTION').toUpperCase(), pageWidth / 2, 42, { align: 'center' });

  // Book Title
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(theme.text[0], theme.text[1], theme.text[2]);
  const splitTitle = doc.splitTextToSize(story.title || 'Untitled Chronicle', contentWidth - 10);
  doc.text(splitTitle, pageWidth / 2, 60, { align: 'center' });

  // Subtitle
  if (story.subtitle) {
    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(210, 210, 210);
    const splitSubtitle = doc.splitTextToSize(story.subtitle, contentWidth - 10);
    doc.text(splitSubtitle, pageWidth / 2, 75 + (splitTitle.length - 1) * 7, { align: 'center' });
  }

  // Emblem / Decorative Star
  doc.setDrawColor(theme.accent[0], theme.accent[1], theme.accent[2]);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 25, 115, pageWidth / 2 + 25, 115);
  doc.circle(pageWidth / 2, 115, 2, 'S');

  // Author byline
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(theme.accent[0], theme.accent[1], theme.accent[2]);
  doc.text('A NOVEL BY', pageWidth / 2, 148, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(theme.text[0], theme.text[1], theme.text[2]);
  doc.text(story.author || 'Author', pageWidth / 2, 156, { align: 'center' });

  // Footer mark
  doc.setFont('times', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text('STORYCRAFT AI · DIGITAL FIRST EDITION', pageWidth / 2, 192, { align: 'center' });

  // ==========================================
  // PAGE 2: TITLE & COPYRIGHT PAGE
  // ==========================================
  doc.addPage();
  doc.setFillColor(254, 252, 248); // Soft warm book paper
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(30, 25, 20);
  doc.text(story.title, pageWidth / 2, 50, { align: 'center' });

  if (story.subtitle) {
    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(90, 80, 70);
    doc.text(story.subtitle, pageWidth / 2, 60, { align: 'center' });
  }

  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(50, 45, 40);
  doc.text(`By ${story.author}`, pageWidth / 2, 80, { align: 'center' });

  // Dividing rule
  doc.setDrawColor(180, 170, 150);
  doc.setLineWidth(0.3);
  doc.line(pageWidth / 2 - 20, 95, pageWidth / 2 + 20, 95);

  // Metadata block
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 90, 80);
  doc.text(`Genre: ${story.genre}`, pageWidth / 2, 110, { align: 'center' });
  doc.text(`Setting: ${story.setting.place}`, pageWidth / 2, 116, { align: 'center' });
  doc.text(`Audience: ${story.audience} · Tone: ${story.tone}`, pageWidth / 2, 122, { align: 'center' });

  // Dedication
  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(80, 70, 60);
  doc.text('For every reader who has ever peered into dark attics,', pageWidth / 2, 150, { align: 'center' });
  doc.text('gazed at distant stars, or wondered what secrets keys might hold.', pageWidth / 2, 156, { align: 'center' });

  // Colophon at bottom
  doc.setFont('times', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(130, 120, 110);
  doc.text(`StoryCraft AI Learning Block Project · Published ${new Date().getFullYear()}`, pageWidth / 2, 192, { align: 'center' });

  // ==========================================
  // PAGE 3: DRAMATIS PERSONAE & TABLE OF CONTENTS
  // ==========================================
  doc.addPage();
  doc.setFillColor(254, 252, 248);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFont('times', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(30, 25, 20);
  doc.text('Characters & Cast', margin, 32);

  doc.setDrawColor(180, 170, 150);
  doc.setLineWidth(0.3);
  doc.line(margin, 36, pageWidth - margin, 36);

  let curY = 44;
  story.characters.slice(0, 4).forEach((char) => {
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(40, 35, 30);
    doc.text(`${char.name} (${char.role})`, margin, curY);

    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(80, 75, 70);
    const desc = doc.splitTextToSize(char.description, contentWidth);
    doc.text(desc, margin, curY + 4.5);
    curY += 7 + desc.length * 4;
  });

  // Table of Contents Section
  curY = Math.max(curY + 6, 110);
  doc.setFont('times', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(30, 25, 20);
  doc.text('Table of Contents', margin, curY);
  doc.line(margin, curY + 4, pageWidth - margin, curY + 4);
  curY += 12;

  story.chapters.forEach((chap, idx) => {
    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(50, 45, 40);
    const chapterLabel = `Chapter ${chap.chapterNumber}: ${chap.title}`;
    const pageNum = `${idx + 4}`;
    doc.text(chapterLabel, margin, curY);
    doc.text(pageNum, pageWidth - margin, curY, { align: 'right' });
    curY += 7.5;
  });

  // ==========================================
  // CHAPTER PAGES
  // ==========================================
  story.chapters.forEach((chapter, index) => {
    doc.addPage();
    doc.setFillColor(254, 252, 248);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Running top header
    doc.setFont('times', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(140, 130, 120);
    doc.text(story.title.toUpperCase(), pageWidth / 2, 16, { align: 'center' });
    doc.setDrawColor(210, 200, 185);
    doc.setLineWidth(0.2);
    doc.line(margin, 19, pageWidth - margin, 19);

    // Chapter Header
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(130, 95, 45); // Warm bronze
    doc.text(`CHAPTER ${romanNumeral(chapter.chapterNumber)}`, pageWidth / 2, 34, { align: 'center' });

    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(30, 25, 20);
    const splitChapTitle = doc.splitTextToSize(chapter.title, contentWidth);
    doc.text(splitChapTitle, pageWidth / 2, 43, { align: 'center' });

    // Decorative mini divider
    doc.setDrawColor(180, 170, 150);
    doc.line(pageWidth / 2 - 12, 51, pageWidth / 2 + 12, 51);

    // Chapter Prose Content
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(40, 35, 30);
    doc.setLineHeightFactor(1.4);

    const paragraphs = chapter.content.split(/\n\s*\n/);
    let proseY = 60;

    paragraphs.forEach((p) => {
      const trimmed = p.trim();
      if (!trimmed) return;
      const lines = doc.splitTextToSize(trimmed, contentWidth);

      // Page overflow check
      if (proseY + lines.length * 5.2 > pageHeight - 20) {
        doc.addPage();
        doc.setFillColor(254, 252, 248);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        proseY = 25;
      }

      doc.text(lines, margin, proseY);
      proseY += lines.length * 5.2 + 4;
    });

    // Page Number at bottom center
    const pageNumber = index + 4;
    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120, 110, 100);
    doc.text(`— ${pageNumber} —`, pageWidth / 2, pageHeight - 12, { align: 'center' });
  });

  // Save the PDF
  const sanitizedTitle = (story.title || 'StoryCraft-Book')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');
  doc.save(`${sanitizedTitle}-storycraft.pdf`);
}

function romanNumeral(num: number): string {
  const map: Record<number, string> = {
    1: 'I',
    2: 'II',
    3: 'III',
    4: 'IV',
    5: 'V',
    6: 'VI',
    7: 'VII',
    8: 'VIII',
    9: 'IX',
    10: 'X',
  };
  return map[num] || String(num);
}
