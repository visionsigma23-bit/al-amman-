import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected application error occurred.',
    };
  }

  render() {
    if (this.state.hasError) {
      let readableMessage = this.state.errorMessage;
      try {
        const parsed = JSON.parse(this.state.errorMessage);
        if (parsed && parsed.error) {
          readableMessage = `${parsed.error} (${parsed.operationType || 'operation'} at ${parsed.path || 'database'})`;
        }
      } catch {
        // Keep original message
      }

      return (
        <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white border border-slate-200 p-8 shadow-sm">
            <p className="text-xs font-medium tracking-widest uppercase text-[#A98642] mb-2">
              AL-Amaan Developers
            </p>
            <h1 className="font-display text-2xl font-semibold text-[#101B2D] mb-3">
              Something went wrong
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">{readableMessage}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#101B2D] text-white text-sm font-medium hover:bg-[#1A2A44] transition-colors cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
