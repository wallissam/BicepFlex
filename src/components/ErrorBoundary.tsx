import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
                <p className="text-slate-600">We encountered an unexpected error</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-700 font-mono">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary w-full"
              >
                Reload Application
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('bicepflex-storage');
                  window.location.reload();
                }}
                className="btn-secondary w-full"
              >
                Reset and Reload
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Need help?</strong> If this issue persists, try clearing your browser
                cache or using a different browser.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
