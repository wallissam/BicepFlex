import { useState, useEffect } from 'react';
import { useProjectStore } from '../store/projectStore';
import { Save, Clock, CheckCircle } from 'lucide-react';

export default function AutoSaveIndicator() {
  const { project } = useProjectStore();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');

  useEffect(() => {
    // Simulate auto-save on project changes
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      setLastSaved(new Date());
      setSaveStatus('saved');
      
      // Reset to idle after showing saved status
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);

    return () => clearTimeout(timer);
  }, [project]);

  const getTimeAgo = (date: Date | null): string => {
    if (!date) return 'Never';
    
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 10) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  if (saveStatus === 'idle' && !lastSaved) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-200
        ${saveStatus === 'saving' ? 'bg-blue-500 text-white' : ''}
        ${saveStatus === 'saved' ? 'bg-green-500 text-white' : ''}
        ${saveStatus === 'idle' ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700' : ''}
      `}>
        {saveStatus === 'saving' && (
          <>
            <Save className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">Saving...</span>
          </>
        )}
        
        {saveStatus === 'saved' && (
          <>
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Saved!</span>
          </>
        )}
        
        {saveStatus === 'idle' && lastSaved && (
          <>
            <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span className="text-xs">
              Last saved: {getTimeAgo(lastSaved)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
