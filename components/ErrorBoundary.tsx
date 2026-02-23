
import * as React from 'react';

interface CardErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  key?: React.Key;
}

interface CardErrorBoundaryState {
  hasError: boolean;
}

class CardErrorBoundary extends React.Component<CardErrorBoundaryProps, CardErrorBoundaryState> {
  constructor(props: CardErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): CardErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('CardErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded-xl text-red-400 text-xs">
          Something went wrong rendering this item.
        </div>
      );
    }

    return this.props.children;
  }
}

export default CardErrorBoundary;
