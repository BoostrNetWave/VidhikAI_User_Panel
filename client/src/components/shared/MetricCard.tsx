import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: string;
        positive?: boolean;
    };
    className?: string;
}

export function MetricCard({ title, value, icon: Icon, description, trend, className }: MetricCardProps) {
    return (
        <div className={cn("p-6 rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col", className)}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-auto">
                <p className="text-3xl font-bold tracking-tight">{value}</p>
                {(description || trend) && (
                    <div className="flex items-center mt-2 gap-2 text-sm">
                        {trend && (
                            <span className={cn(
                                "font-medium", 
                                trend.positive ? "text-success" : (trend.positive === false ? "text-destructive" : "text-slate-600")
                            )}>
                                {trend.value}
                            </span>
                        )}
                        {description && (
                            <span className="text-muted-foreground">{description}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
