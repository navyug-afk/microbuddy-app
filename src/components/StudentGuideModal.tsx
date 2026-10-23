import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  Database,
  Smartphone,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Terminal,
  X,
  ExternalLink,
} from 'lucide-react';

interface StudentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDataOptions: () => void;
}

export const StudentGuideModal: React.FC<StudentGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenDataOptions,
}) => {
  const [activeSection, setActiveSection] = useState<'testing' | 'errors' | 'storage' | 'cheatsheet'>('testing');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0b1322] border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#09101d]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                Beginner Guide: Testing & Troubleshooting
              </h3>
              <p className="text-xs text-slate-400">
                Step-by-step instructions to verify functionality and resolve browser errors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-[#09101d] overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSection('testing')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSection === 'testing'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. How to Test Features
          </button>
          <button
            onClick={() => setActiveSection('storage')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSection === 'storage'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. LocalStorage Persistence
          </button>
          <button
            onClick={() => setActiveSection('errors')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSection === 'errors'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Fixing Common Errors
          </button>
          <button
            onClick={() => setActiveSection('cheatsheet')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSection === 'cheatsheet'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Microbiology Reference
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-slate-300 text-xs sm:text-sm">
          
          {/* SECTION 1: HOW TO TEST */}
          {activeSection === 'testing' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-400" />
                Testing Checklist (Try these in order):
              </h4>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="font-semibold text-teal-300 block mb-1">
                    Step A: Study Tracker & Topic Completion
                  </span>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    1. Go to the <strong>Study Tracker</strong> tab.<br />
                    2. Click any circle checkbox next to a topic. Notice the checkmark turns green, the title gets a strikethrough, and the progress bar increases.<br />
                    3. Click <strong>Add Topic</strong> to add your own test topic (e.g., &quot;Acid-Fast Staining&quot;). Check that it appears in the list.<br />
                    4. Try searching with the search bar or filtering by category (e.g. &quot;Sterilization&quot;).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="font-semibold text-teal-300 block mb-1">
                    Step B: Flashcards Flip & Recall
                  </span>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    1. Switch to <strong>Flashcards</strong>.<br />
                    2. Click the card or press <strong>Spacebar</strong> to flip and view the answer, takeaway, and mnemonic.<br />
                    3. Click <strong>Next</strong> or <strong>Previous</strong> (or keyboard arrow keys) to cycle through.<br />
                    4. Click <strong>Mark Mastered</strong> and watch the mastered tally increment.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="font-semibold text-teal-300 block mb-1">
                    Step C: Microbiology Quiz Challenge
                  </span>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    1. Click <strong>Quiz Challenge</strong>.<br />
                    2. Pick answers for the 8 questions. In instant mode, green or red highlights will immediately show whether your choice was correct, accompanied by a detailed explanation.<br />
                    3. Complete the quiz to see your final percentage score and full review.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="font-semibold text-teal-300 block mb-1">
                    Step D: Study Timer & Chimes
                  </span>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    1. Open <strong>Study Timer</strong>.<br />
                    2. Switch to &quot;Custom&quot; and set it to 1 minute, or press <strong>Start Timer</strong>.<br />
                    3. Press Pause, Resume, and Reset to confirm timer controls operate cleanly.<br />
                    4. When the timer reaches 00:00, listen for the Web Audio chime.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: LOCAL STORAGE PERSISTENCE */}
          {activeSection === 'storage' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-teal-400" />
                How Data Stays Saved (LocalStorage)
              </h4>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                MicroBuddy uses your browser&apos;s built-in <strong>localStorage</strong> engine. This means your completed topics, flashcard scores, and quiz history are saved directly on your computer or phone without requiring an external server or account login.
              </p>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="font-semibold text-teal-300 block text-xs">
                  How to verify persistence yourself:
                </span>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-400">
                  <li>Check off 2 topics in the Study Tracker.</li>
                  <li>Press <strong>F5</strong> (or the browser Refresh button) to reload the page.</li>
                  <li>Observe that your checked topics, quiz scores, and flashcard progress are still exactly as you left them!</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="font-semibold text-teal-300 block text-xs">
                  Inspecting data in Chrome / Edge / Safari / Firefox Developer Tools:
                </span>
                <p className="text-xs text-slate-400">
                  Press <strong>F12</strong> (or right-click anywhere and select <em>Inspect</em>) &rarr; go to the <strong>Application</strong> tab (in Firefox: <em>Storage</em>) &rarr; click <strong>Local Storage</strong> &rarr; find your website URL. You will see keys like:
                </p>
                <div className="bg-slate-950 p-2.5 rounded font-mono text-[11px] text-teal-300 space-y-1">
                  <div>microbuddy_topics_v1</div>
                  <div>microbuddy_flashcards_v1</div>
                  <div>microbuddy_quiz_history_v1</div>
                  <div>microbuddy_study_stats_v1</div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: FIXING COMMON ERRORS */}
          {activeSection === 'errors' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Diagnosing & Fixing Common Issues
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="font-semibold text-amber-300 block mb-1">
                    Issue 1: &quot;I want to start fresh or I deleted all topics by mistake&quot;
                  </span>
                  <p className="text-slate-400 leading-relaxed mb-2">
                    Click the <strong>Data Options</strong> button in the top navigation, then click <strong>Reset All to Defaults</strong>. This clears corrupt data and restores the complete college microbiology syllabus.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenDataOptions();
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded transition-colors"
                  >
                    Open Data Options Modal
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="font-semibold text-amber-300 block mb-1">
                    Issue 2: &quot;How do I see JavaScript errors in the browser?&quot;
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    1. Press <strong>F12</strong> or <strong>Ctrl + Shift + I</strong> (on Mac: <strong>Cmd + Option + I</strong>).<br />
                    2. Click the <strong>Console</strong> tab at the top.<br />
                    3. If there is an issue, you will see a red error message indicating the exact line number and function.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="font-semibold text-amber-300 block mb-1">
                    Issue 3: &quot;How to test Android tablet and phone responsiveness?&quot;
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    1. Open DevTools with <strong>F12</strong>.<br />
                    2. Press <strong>Ctrl + Shift + M</strong> (or click the phone/tablet icon in the top left of DevTools).<br />
                    3. Select <em>Samsung Galaxy</em>, <em>Pixel 7</em>, or <em>iPad Air</em> from the top dropdown to test touch layouts and small-screen menus.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="font-semibold text-amber-300 block mb-1">
                    Issue 4: &quot;I don&apos;t hear the timer chime sound&quot;
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    Modern browsers require at least one click on the page before playing Web Audio to prevent unwanted sounds. Make sure your device volume is turned up and the &quot;Audio Chime On&quot; button is active.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: MICROBIOLOGY REFERENCE CHEAT SHEET */}
          {activeSection === 'cheatsheet' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-400" />
                Quick Microbiology Laboratory Cheat Sheet
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-purple-300 block">
                    Gram Stain Protocol & Colors
                  </span>
                  <p className="text-slate-400">
                    <strong>1. Crystal Violet (1 min)</strong>: Primary basic stain (all cells purple).<br />
                    <strong>2. Gram’s Iodine (1 min)</strong>: Mordant forms CV-I complex.<br />
                    <strong>3. 95% Ethanol (10–15 sec)</strong>: Decolorizer. Strips outer membrane of G-; dehydrates thick G+ wall.<br />
                    <strong>4. Safranin (1 min)</strong>: Counterstain.<br />
                    <span className="text-teal-300 font-medium">Result: G+ = Purple/Violet | G- = Pink/Red</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-teal-300 block">
                    Autoclave Standard Numbers
                  </span>
                  <p className="text-slate-400">
                    <strong>Temperature</strong>: 121°C (250°F)<br />
                    <strong>Pressure</strong>: 15 psi (103 kPa)<br />
                    <strong>Holding Time</strong>: 15–20 minutes<br />
                    <strong>Biological Indicator</strong>: <em>Geobacillus stearothermophilus</em> endospores.<br />
                    <strong>Mechanism</strong>: Moist steam denatures structural and enzymatic proteins.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-[#09101d]">
          <span className="text-xs text-slate-500">
            MicroBuddy · Built for College Microbiology
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
