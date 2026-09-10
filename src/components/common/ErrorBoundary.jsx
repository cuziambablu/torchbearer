import React from 'react';
import { AlertTriangle, RotateCcw, Home, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CampusLaunch Application Error Caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleResetStorageAndReload = () => {
    try {
      localStorage.removeItem('campuslaunch_user');
      localStorage.removeItem('campuslaunch_opportunities');
      localStorage.removeItem('campuslaunch_saved_ids');
      localStorage.removeItem('campuslaunch_applications');
      localStorage.removeItem('campuslaunch_submissions');
      localStorage.removeItem('campuslaunch_notifications');
      localStorage.removeItem('campuslaunch_admin_logs');
    } catch (e) {
      console.warn('Could not clear local storage:', e);
    }
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 text-center space-y-6 animate-scale-up">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto border border-rose-200">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Something went wrong
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Torchbearer AI encountered an unexpected runtime error. You can reload the page or reset local cache data.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-900 rounded-2xl text-left overflow-x-auto">
                <p className="text-[11px] font-mono text-rose-400 font-semibold">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetStorageAndReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Cache & Recover</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
