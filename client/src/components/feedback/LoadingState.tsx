import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
    text?: string;
    className?: string;
}

export function LoadingState({ text = "Loading...", className }: LoadingStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center p-8 min-h-[200px] text-center", className)}>
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-sm font-medium text-slate-500">{text}</p>
        </div>
    );
}
