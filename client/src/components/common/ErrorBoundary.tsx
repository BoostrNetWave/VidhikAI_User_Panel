import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
    }

    private handleReload = () => {
        window.location.reload();
    };

    private handleGoHome = () => {
        window.location.href = '/user/dashboard';
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 text-center space-y-6">
                        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
                            <AlertTriangle className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                An unexpected issue occurred while rendering this page. You can refresh the view or return to your dashboard.
                            </p>
                            {this.state.error?.message && (
                                <p className="text-xs font-mono text-red-500 bg-red-50/70 p-2.5 rounded-lg border border-red-100 break-all text-left mt-2">
                                    {this.state.error.message}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center justify-center gap-3 pt-2">
                            <Button 
                                variant="outline" 
                                onClick={this.handleReload}
                                className="gap-2 text-xs h-10 px-4"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Refresh Page
                            </Button>
                            <Button 
                                onClick={this.handleGoHome}
                                className="gap-2 text-xs h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Home className="h-4 w-4" />
                                Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

