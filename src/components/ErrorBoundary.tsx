import { Component, type ErrorInfo, type ReactNode } from 'react';

interface State { error?: Error }

/** Catches render errors anywhere below it (including lazy-chunk load failures). */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = {};
  static getDerivedStateFromError(error: Error): State { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error(error, info.componentStack); }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="mx-auto max-w-md p-8 text-center">
        <h1 className="text-lg font-semibold">Something went wrong</h1>
        <p className="muted mt-2 text-sm">{this.state.error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button className="btn btn-primary" onClick={() => this.setState({ error: undefined })}>Try again</button>
          <button className="btn" onClick={() => { localStorage.removeItem('lexi-v1'); location.reload(); }}>
            Reset saved data
          </button>
        </div>
      </div>
    );
  }
}
