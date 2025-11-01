import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface InlineHelpProps {
  title: string;
  content: string;
  learnMoreUrl?: string;
}

export default function InlineHelp({ title, content, learnMoreUrl }: InlineHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors ml-1"
        aria-label={`Help: ${title}`}
      >
        <HelpCircle className="w-3 h-3" />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-64 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl left-6 top-0">
          <div className="font-semibold text-sm text-slate-900 dark:text-white mb-1">
            {title}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            {content}
          </div>
          {learnMoreUrl && (
            <a
              href={learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Learn more →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
