import React from 'react';
import { CardContent, Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Lightbulb, MessageSquare } from "lucide-react";

interface DocumentSidebarProps {
    description: string;
    tips: { title: string; content: string }[];
}

export const DocumentSidebar: React.FC<DocumentSidebarProps> = ({ description, tips }) => {
    return (
        <Card className="sticky top-24 overflow-hidden">
            <div className="p-4 border-b bg-secondary/50 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-gray-900">Vidhik AI Assistant</h3>
            </div>

            <CardContent className="p-5 space-y-6">
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider">HELP & TIPS</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {description}
                    </p>
                </div>

                <Separator />

                <div className="space-y-4">
                    {tips.map((tip, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                            <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <h5 className="text-sm font-semibold text-gray-900">{tip.title}</h5>
                                <p className="text-xs text-muted-foreground mt-1">{tip.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <Button variant="outline" className="w-full gap-2 border-dashed">
                    <MessageSquare className="h-4 w-4" />
                    Ask Assistant a question
                </Button>
            </CardContent>
        </Card>
    );
};
