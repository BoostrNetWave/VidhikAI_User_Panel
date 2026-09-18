import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { Loader2, RefreshCw, ArrowDownRight, ArrowUpRight, CheckCircle2, History } from "lucide-react";
import { format } from "date-fns";

export function CreditUsageHistory() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'deductions' | 'credits'>('all');

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await api.get('/dashboard/credit-usage');
            if (response.data && response.data.success) {
                setHistory(response.data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch credit usage:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const formatFeatureType = (type: string) => {
        switch (type) {
            case 'document_generation': return 'Document Generation';
            case 'document_review': return 'Document Review';
            case 'legal_research': return 'Legal Research';
            case 'lawyer_booking': return 'Lawyer Booking';
            case 'extra_credits_purchase': return 'Credit Pack Purchase';
            case 'subscription_grant': return 'Plan Renewal / Grant';
            case 'refund': return 'Credit Refund';
            default: return type ? type.replace(/_/g, ' ') : 'Usage';
        }
    };

    const filteredRecords = history.filter(record => {
        if (filter === 'deductions') return record.creditsUsed > 0;
        if (filter === 'credits') return record.creditsUsed <= 0;
        return true;
    });

    return (
        <Card className="rounded-3xl border border-border shadow-sm bg-card overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-border bg-muted/10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <History className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl font-bold text-foreground">Credit & Transaction History</CardTitle>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                        Live server-authoritative audit log of all AI credit deductions, plan renewals, and top-up purchases.
                    </CardDescription>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="flex bg-muted rounded-xl p-1 text-xs">
                        <button 
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1 rounded-lg font-medium transition-all ${filter === 'all' ? 'bg-background shadow-xs text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            All ({history.length})
                        </button>
                        <button 
                            onClick={() => setFilter('deductions')}
                            className={`px-3 py-1 rounded-lg font-medium transition-all ${filter === 'deductions' ? 'bg-background shadow-xs text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Usage
                        </button>
                        <button 
                            onClick={() => setFilter('credits')}
                            className={`px-3 py-1 rounded-lg font-medium transition-all ${filter === 'credits' ? 'bg-background shadow-xs text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Credits & Grants
                        </button>
                    </div>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={fetchHistory}
                        disabled={loading}
                        className="rounded-xl h-8 w-8"
                        title="Refresh History"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </CardHeader>
            
            <CardContent className="p-0">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-12 gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground font-semibold">Loading ledger transactions...</span>
                    </div>
                ) : filteredRecords.length === 0 ? (
                    <div className="text-center p-12 text-muted-foreground text-sm">
                        No credit activity found in this view.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/20 border-b border-border hover:bg-muted/20">
                                    <TableHead className="w-[180px] text-xs font-bold text-muted-foreground">Date & Time</TableHead>
                                    <TableHead className="text-xs font-bold text-muted-foreground">Feature / Activity</TableHead>
                                    <TableHead className="text-xs font-bold text-muted-foreground">Type</TableHead>
                                    <TableHead className="text-xs font-bold text-muted-foreground">Plan</TableHead>
                                    <TableHead className="text-right text-xs font-bold text-muted-foreground">Credit Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRecords.map((record) => {
                                    const isDeduction = record.creditsUsed > 0;
                                    const isGrant = record.featureType === 'subscription_grant';
                                    const isPurchase = record.featureType === 'extra_credits_purchase';
                                    const isRefund = record.featureType === 'refund';

                                    return (
                                        <TableRow key={record._id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                            <TableCell className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                                                {format(new Date(record.createdAt), 'MMM dd, yyyy • HH:mm')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-foreground">
                                                        {record.featureName || formatFeatureType(record.featureType)}
                                                    </span>
                                                    {record.notes && (
                                                        <span className="text-[11px] text-muted-foreground line-clamp-1">
                                                            {record.notes}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant={isDeduction ? 'outline' : 'secondary'} 
                                                    className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                                                        isPurchase || isRefund 
                                                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                                                            : isGrant 
                                                            ? 'bg-primary/10 text-primary border-primary/20' 
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {formatFeatureType(record.featureType)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {record.subscriptionPlan || 'Free'}
                                            </TableCell>
                                            <TableCell className="text-right whitespace-nowrap">
                                                {isDeduction ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-destructive">
                                                        <ArrowDownRight className="h-3.5 w-3.5" />
                                                        -{record.creditsUsed} Credits
                                                    </span>
                                                ) : isPurchase || isRefund ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                                        +{Math.abs(record.creditsUsed)} Credits
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Renewed
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
