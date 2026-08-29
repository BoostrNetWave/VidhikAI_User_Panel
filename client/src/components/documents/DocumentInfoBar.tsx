import React from 'react';
interface DocumentInfoBarProps {
    content: string;
}
import { Clock, ListChecks, ShieldCheck } from "lucide-react";

export const DocumentInfoBar: React.FC<DocumentInfoBarProps> = ({ content }) => {
    const wordCount = content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    const clauseCount = (content.match(/<h[23]/gi) || []).length;

    return (
        <div className="bg-slate-50 border-b px-8 py-3 flex flex-wrap items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Est. Read Time: <strong>{readTime} min</strong></span>
            </div>
            <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" />
                <span>Clauses: <strong>{clauseCount} Sections</strong></span>
            </div>
            <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span className="text-green-700 font-medium">Legally Structured</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/90 animate-pulse"></span>
                <span className="text-xs uppercase tracking-wider font-bold text-primary">Review Mode</span>
            </div>
        </div>
    );
};
