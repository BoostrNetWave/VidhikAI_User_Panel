import React from 'react';
import { MessageSquare, FileText, Gavel } from 'lucide-react';
import { CardContent } from "@/components/ui/card";

interface DocumentGeneratorLoaderProps {
    progress: number;
}

export const DocumentGeneratorLoader: React.FC<DocumentGeneratorLoaderProps> = ({ progress }) => {
    return (
        <CardContent className="flex flex-col items-center justify-center py-16 space-y-10 min-h-[500px] relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-50/50 via-white to-zinc-100/50" />
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900/10 opacity-20" />

            {/* Logo & Branding */}
            <div className="relative flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700">
                <div className="relative">
                    <div className="absolute inset-0 bg-zinc-900/10 blur-2xl opacity-20 animate-pulse rounded-full" />
                    <div className="h-24 w-24 bg-zinc-900 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-zinc-300/50 border-4 border-white/50 ring-1 ring-zinc-200 relative z-10">
                        <Gavel className="h-12 w-12 animate-[bounce_3s_infinite]" />
                    </div>
                </div>
                <div className="text-center space-y-2 z-10">
                    <h2 className="text-4xl font-extrabold text-zinc-900 tracking-tight">Vidhik AI</h2>
                    <p className="text-sm font-semibold text-zinc-600 uppercase tracking-[0.2em] bg-zinc-100 px-3 py-1 rounded-full border border-border">Legal Intelligence</p>
                </div>
            </div>

            {/* Progress Section */}
            <div className="w-full max-w-lg space-y-8 relative z-10">
                {/* Detailed Status Steps */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                        { label: "Analyzing", progress: 30, icon: <MessageSquare className="h-4 w-4" /> },
                        { label: "Drafting", progress: 60, icon: <FileText className="h-4 w-4" /> },
                        { label: "Finalizing", progress: 90, icon: <Gavel className="h-4 w-4" /> }
                    ].map((step, idx) => {
                        const isActive = progress >= step.progress - 30 && progress < step.progress;
                        const isCompleted = progress >= step.progress;

                        return (
                            <div key={idx} className={`flex flex-col items-center gap-2 transition-all duration-500 ${isActive || isCompleted ? 'opacity-100 transform scale-105' : 'opacity-40 grayscale scale-95'}`}>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isActive ? 'bg-secondary/80 border-primary text-primary animate-pulse' : isCompleted ? 'bg-primary border-primary text-white' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                                    {step.icon}
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-gray-400'}`}>{step.label}</span>
                            </div>
                        )
                    })}
                </div>

                {/* Main Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end px-1">
                        <span className="text-sm font-medium text-foreground">
                            {progress < 30 ? "Analyzing requirements..." :
                                progress < 60 ? "Drafting legal clauses..." :
                                    "Polishing document..."}
                        </span>
                        <span className="text-2xl font-black text-primary">{progress}%</span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-4 overflow-hidden shadow-inner border border-zinc-200 p-0.5">
                        <div
                            className="h-full rounded-full bg-zinc-900 shadow-sm transition-all duration-300 ease-out relative overflow-hidden"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] transform -skew-x-12" />
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    );
};
