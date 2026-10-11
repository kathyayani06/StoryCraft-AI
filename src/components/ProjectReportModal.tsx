import React, { useState } from 'react';
import { PROJECT_REPORT_DATA } from '../data/reportData';
import { BookOpen, CheckCircle, FileText, Layers, X, Cpu, ArrowRight } from 'lucide-react';

interface ProjectReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartStory: () => void;
}

export const ProjectReportModal: React.FC<ProjectReportModalProps> = ({
  isOpen,
  onClose,
  onStartStory,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'architecture' | 'full-report'>('summary');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#fdfbf7] rounded-xl shadow-2xl border border-stone-300 flex flex-col overflow-hidden text-stone-900">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-100/70">
          <div>
            <h2 className="text-base font-editorial font-bold text-stone-900">
              StoryCraft AI — Project Report & Architecture
            </h2>
            <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
              <span>{PROJECT_REPORT_DATA.header.block}</span>
              <span aria-hidden="true">·</span>
              <span>{PROJECT_REPORT_DATA.header.department}</span>
              <span aria-hidden="true">·</span>
              <span>Academic Year {PROJECT_REPORT_DATA.header.academicYear}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
            aria-label="Close report"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200 px-6 bg-stone-50 text-xs font-medium">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'summary'
                ? 'border-amber-600 text-stone-950 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Executive Summary
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'architecture'
                ? 'border-amber-600 text-stone-950 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            System Architecture & Flow
          </button>
          <button
            onClick={() => setActiveTab('full-report')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'full-report'
                ? 'border-amber-600 text-stone-950 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Learning Block 1 Document (Full Index)
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-stone-700">
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Submission info box */}
              <div className="p-4 bg-stone-100 rounded-lg border border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-stone-500 block">Submitted by</span>
                  <span className="font-semibold text-stone-800">{PROJECT_REPORT_DATA.header.submittedBy}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Department</span>
                  <span className="font-semibold text-stone-800">{PROJECT_REPORT_DATA.header.department}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Academic Year</span>
                  <span className="font-semibold text-stone-800">{PROJECT_REPORT_DATA.header.academicYear}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Guided by</span>
                  <span className="font-semibold text-stone-800">{PROJECT_REPORT_DATA.header.guidedBy}</span>
                </div>
              </div>

              {/* Core concept */}
              <div>
                <h3 className="font-editorial text-lg font-bold text-stone-900 mb-2">
                  1. The Practical Purpose
                </h3>
                <p className="leading-relaxed text-stone-700">
                  Many students, beginner writers, and creative learners have brilliant core story ideas but struggle to develop them into a complete, organized manuscript. StoryCraft AI bridges this gap by leveraging Generative AI to expand concise ideas into multi-chapter books with distinct characters, dramatic arcs, chapter-level tone customization, and publication-ready digital binding.
                </p>
              </div>

              {/* Canonical Example from Report */}
              <div className="p-4 bg-amber-50/80 rounded-lg border border-amber-200">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-800 font-semibold block mb-1">
                  Canonical Example from Section 1
                </span>
                <p className="text-xs text-amber-950 mb-1">
                  <strong>User Input:</strong> “A girl finds an old key in her grandmother's house.”
                </p>
                <p className="text-xs text-amber-900">
                  <strong>System Output:</strong> A multi-chapter mystery titled <em>The Brass Key of Ashwood Manor</em> with historical Devonshire setting, codebreaker grandmother character, garden vault discovery, and downloadable A5 PDF book.
                </p>
              </div>

              {/* 5 Core Objectives */}
              <div>
                <h3 className="font-editorial text-lg font-bold text-stone-900 mb-3">
                  Key Objectives Achieved
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded border border-stone-200 flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Convert short user-provided ideas into rich multi-chapter narratives.</span>
                  </div>
                  <div className="p-3 bg-white rounded border border-stone-200 flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Generate cast profiles with archetypes, traits, and driving motivations.</span>
                  </div>
                  <div className="p-3 bg-white rounded border border-stone-200 flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Chapter-level customization studio for emotional depth and ending rewrites.</span>
                  </div>
                  <div className="p-3 bg-white rounded border border-stone-200 flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Generate formatted digital PDF books with custom covers and typography.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-editorial text-lg font-bold text-stone-900 mb-2">
                  System Workflow Representation
                </h3>
                <div className="p-4 bg-stone-900 text-stone-100 rounded-lg font-mono text-xs overflow-x-auto whitespace-nowrap leading-relaxed">
                  USER → STORY IDEA → CUSTOMIZATION → PROMPT CONSTRUCTION → GENAI MODEL/API → CHARACTERS + PLOT → CHAPTERS → USER EDITING → BOOK FORMATTER → PDF/eBOOK
                </div>
              </div>

              {/* Architectural Layers Table */}
              <div>
                <h3 className="font-editorial text-base font-bold text-stone-900 mb-2">
                  Architecture Layers & Responsibilities
                </h3>
                <div className="border border-stone-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                      <tr>
                        <th className="py-2.5 px-4">Layer</th>
                        <th className="py-2.5 px-4">Main Responsibility</th>
                        <th className="py-2.5 px-4">Tech Implementation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 bg-white">
                      <tr>
                        <td className="py-2.5 px-4 font-medium text-stone-900">User Interface</td>
                        <td className="py-2.5 px-4 text-stone-600">Collect story idea, genre, setting, character, and length preferences.</td>
                        <td className="py-2.5 px-4 font-mono text-stone-500">React 19 + Tailwind</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-medium text-stone-900">Backend Server</td>
                        <td className="py-2.5 px-4 text-stone-600">Receive requests, manage story context, and handle API routing.</td>
                        <td className="py-2.5 px-4 font-mono text-stone-500">Express (TypeScript)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-medium text-stone-900">Prompt Construction</td>
                        <td className="py-2.5 px-4 text-stone-600">Combine user parameters and story context into structured prompt schema.</td>
                        <td className="py-2.5 px-4 font-mono text-stone-500">Strict JSON Schemas</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-medium text-stone-900">GenAI Model / API</td>
                        <td className="py-2.5 px-4 text-stone-600">Generate characters, 5-beat plot, multi-chapter prose, and requested revisions.</td>
                        <td className="py-2.5 px-4 font-mono text-stone-500">@google/genai (Flash)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-medium text-stone-900">Story Management</td>
                        <td className="py-2.5 px-4 text-stone-600">Maintain generated content and support chapter-level granular rewrites.</td>
                        <td className="py-2.5 px-4 font-mono text-stone-500">In-Memory & State</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-medium text-stone-900">Book Formatter</td>
                        <td className="py-2.5 px-4 text-stone-600">Arrange title, author, chapters, TOC, and cover into final digital PDF book.</td>
                        <td className="py-2.5 px-4 font-mono text-stone-500">jsPDF A5 Engine</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'full-report' && (
            <div className="space-y-6">
              {PROJECT_REPORT_DATA.sections.map((section) => (
                <div key={section.id} className="border-b border-stone-200 pb-5">
                  <h4 className="font-editorial text-base font-bold text-stone-900 mb-2">
                    {section.number}. {section.title}
                  </h4>
                  <div className="space-y-2 text-stone-700 text-xs leading-relaxed">
                    {section.content.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>

                  {section.table && (
                    <div className="mt-3 border border-stone-200 rounded-lg overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                          <tr>
                            {section.table.headers.map((h, i) => (
                              <th key={i} className="py-2 px-3">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 bg-white">
                          {section.table.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="py-2 px-3 text-stone-600">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-100/70 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Project Report · StoryCraft AI Learning Block 1
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-200 hover:bg-stone-300 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onStartStory();
              }}
              className="px-4 py-2 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Test Story Studio Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
