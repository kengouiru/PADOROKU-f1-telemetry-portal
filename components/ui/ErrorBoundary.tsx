'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  sectionName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-6 my-4 bg-slate-900/50 border border-red-500/30 rounded-2xl animate-fade-in">
          <span className="text-4xl mb-3">⚠️</span>
          <h3 className="text-sm font-racing font-bold text-slate-200 mb-1">
            {this.props.sectionName ? `${this.props.sectionName}の` : ''}読み込みに失敗しました
          </h3>
          <p className="text-xs text-slate-400 mb-4 text-center max-w-md">
            データの一部に不備があるか、予期せぬエラーが発生しました。
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors border border-white/10"
          >
            🔄 再読み込み
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mt-4 p-3 bg-black/50 text-red-400 text-[10px] rounded-lg max-w-full overflow-x-auto text-left">
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
