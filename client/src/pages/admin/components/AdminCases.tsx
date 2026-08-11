import React from 'react';
import { DocketStrip } from '@/components/ui/docket-strip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminCasesProps {
  cases: any[];
}

export function AdminCases({ cases = [] }: AdminCasesProps) {
  // Fake payouts data based on cases for UI demonstration
  const payouts = cases.map((c, i) => ({
    id: `PAY-${c._id.substring(0, 4).toUpperCase()}`,
    lawyer: c.lawyer?.fullName || 'Unknown Lawyer',
    amount: `₹${(Math.random() * 5000 + 1000).toFixed(0)}`,
    status: i % 3 === 0 ? 'PAID' : (i % 2 === 0 ? 'PROCESSING' : 'PENDING'),
    progress: i % 3 === 0 ? 100 : (i % 2 === 0 ? 66 : 33)
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'success';
      case 'PROCESSING': return 'warning';
      case 'PENDING': return 'default';
      default: return 'muted';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Financial Operations: Payouts</h3>
          <p className="text-sm text-muted-foreground">Manage lawyer payouts and commission settlements.</p>
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border pb-4">
          <CardTitle className="text-sm font-semibold">Active Payout Queue</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {payouts.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">No active payouts.</div>
            ) : (
              payouts.map(payout => (
                <div key={payout.id} className="p-4 hover:bg-muted/20 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-6 flex-1">
                    <DocketStrip
                      recordId={payout.id}
                      title={`${payout.lawyer} — ${payout.amount}`}
                      status={payout.status}
                      statusColor={getStatusColor(payout.status) as any}
                      className="border-none shadow-none bg-transparent hover:bg-transparent p-0 w-96 flex-shrink-0"
                    />
                    
                    {/* Inline Progress Bar */}
                    <div className="flex-1 max-w-md hidden md:flex items-center gap-4">
                      <div className="text-xs text-muted-foreground w-24 text-right">Settlement</div>
                      <div className="flex-1 h-1.5 flex gap-1 rounded-full overflow-hidden">
                        <div className={`h-full flex-1 ${payout.progress >= 33 ? 'bg-primary' : 'bg-muted'}`} />
                        <div className={`h-full flex-1 ${payout.progress >= 66 ? 'bg-primary' : 'bg-muted'}`} />
                        <div className={`h-full flex-1 ${payout.progress >= 100 ? 'bg-success' : 'bg-muted'}`} />
                      </div>
                      <div className="text-xs font-mono text-muted-foreground w-12">{payout.progress}%</div>
                    </div>
                  </div>
                  
                  {payout.status !== 'PAID' && (
                    <button className="text-xs font-medium text-primary hover:underline ml-4">
                      Process &rarr;
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
