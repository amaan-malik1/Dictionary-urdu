import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to an error reporting service
        console.error('Error caught:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // You could also send this to a logging service like Sentry
        // if (window.Sentry) {
        //   window.Sentry.captureException(error);
        // }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>

                        <p className="text-gray-600 mb-6">
                            We're sorry, but there was a problem loading this page. Our team has been notified.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Refresh Page
                            </button>

                            <Link
                                to={ROUTES.HOME}
                                className="block w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Go to Home Page
                            </Link>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="mt-6 text-left">
                                    <p className="text-sm font-bold text-red-500">Error Details (Development Only):</p>
                                    <pre className="mt-2 text-xs bg-gray-100 p-4 rounded overflow-auto max-h-40">
                                        {this.state.error.toString()}
                                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 