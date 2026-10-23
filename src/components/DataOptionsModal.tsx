import React, { useState } from 'react';
import { storage } from '../utils/storage';
import {
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
  X,
  CheckCircle2,
} from 'lucide-react';

interface DataOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReload: () => void;
}

export const DataOptionsModal: React.FC<DataOptionsModalProps> = ({
  isOpen,
  onClose,
  onDataReload,
}) => {
  const [importJsonText, setImportJsonText] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    try {
      const dataStr = storage.exportBackup();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `microbuddy-study-progress-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setFeedbackMessage({ text: 'Progress exported successfully!', isError: false });
    } catch {
      setFeedbackMessage({ text: 'Failed to export data', isError: true });
    }
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const success = storage.importBackup(importJsonText);
    if (success) {
      setFeedbackMessage({ text: 'Study data imported successfully!', isError: false });
      setImportJsonText('');
      onDataReload();
    } else {
      setFeedbackMessage({ text: 'Invalid JSON format. Please verify your backup data.', isError: true });
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to reset all topics, flashcards, and timer stats to default values?')) {
      storage.resetAll();
      onDataReload();
      setFeedbackMessage({ text: 'All data restored to default microbiology syllabus!', isError: false });
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0b1322] border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#09101d]">
          <h3 className="text-base sm:text-lg font-bold text-white font-display">
            Data Options & Local Storage
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs sm:text-sm">
          {feedbackMessage && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 text-xs ${
                feedbackMessage.isError
                  ? 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
                  : 'bg-teal-950/40 border border-teal-500/40 text-teal-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedbackMessage.text}</span>
            </div>
          )}

          {/* Export section */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-white block">Export Backup</span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Download a JSON file containing all your topics, flashcards, and scores.
                </p>
              </div>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg shadow transition-colors shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Import section */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="font-semibold text-white block">Import Progress</span>
            <p className="text-xs text-slate-400">
              Paste previously exported JSON text below to restore your progress:
            </p>
            <textarea
              rows={2}
              placeholder="Paste JSON content here..."
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="w-full p-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-teal-500 resize-none"
            />
            <button
              onClick={handleImport}
              disabled={!importJsonText.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-teal-400" />
              <span>Restore from Text</span>
            </button>
          </div>

          {/* Danger zone: Reset */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 flex items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Reset All to Defaults
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Restores original Gram staining, cell structure, and sterilization topics.
              </p>
            </div>
            <button
              onClick={handleResetToDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-300 hover:text-white bg-rose-900/40 hover:bg-rose-900/80 border border-rose-800/80 rounded-lg transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end px-6 py-3.5 border-t border-slate-800 bg-[#09101d]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
