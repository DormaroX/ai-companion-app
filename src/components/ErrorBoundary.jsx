import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
          <h1 className="text-2xl font-bold mb-4">Etwas ist schiefgelaufen</h1>
          <div className="bg-red-900 bg-opacity-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap">
              {this.state.error && this.state.error.toString()}
            </pre>
          </div>
          <button 
            className="mt-4 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
            onClick={() => window.location.reload()}
          >
            Neu laden
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
