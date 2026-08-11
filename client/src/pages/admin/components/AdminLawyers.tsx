import React, { useState } from 'react';
import { DocketStrip } from '@/components/ui/docket-strip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle } from 'lucide-react';

interface AdminLawyersProps {
  pendingLawyers: any[];
  onApprove: (id: string) => Promise<void>;
}

export function AdminLawyers({ pendingLawyers = [], onApprove }: AdminLawyersProps) {
  const [selectedLawyer, setSelectedLawyer] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = async () => {
    if (selectedLawyer) {
      await onApprove(selectedLawyer._id);
      setSelectedLawyer(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Lawyer Approval Queue</h3>
        <p className="text-sm text-muted-foreground">Review and approve new lawyer registrations. These accounts remain inactive until verified.</p>
      </div>

      <div className="space-y-2">
        {pendingLawyers.length === 0 ? (
          <div className="p-12 text-center bg-surface border border-border rounded-md shadow-sm">
            <CheckCircle className="h-10 w-10 text-success mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium text-muted-foreground">No pending approvals at the moment.</p>
          </div>
        ) : (
          pendingLawyers.map(lawyer => (
            <DocketStrip
              key={lawyer._id}
              recordId={`LAW-${lawyer._id.substring(0, 4).toUpperCase()}`}
              title={`${lawyer.fullName} — ${lawyer.expertise || 'General Practice'}`}
              status="PENDING"
              statusColor="warning"
              actionText="Review"
              onAction={() => setSelectedLawyer(lawyer)}
            />
          ))
        )}
      </div>

      <Dialog open={!!selectedLawyer} onOpenChange={(open) => !open && setSelectedLawyer(null)}>
        <DialogContent className="sm:max-w-3xl flex flex-col h-[80vh] p-0 overflow-hidden">
          {selectedLawyer && (
            <div className="flex h-full">
              {/* Left Side: Documents */}
              <div className="w-2/3 bg-muted/30 border-r border-border flex flex-col">
                <div className="p-4 border-b border-border bg-surface">
                  <DialogTitle className="text-lg">{selectedLawyer.fullName}</DialogTitle>
                  <DialogDescription className="font-mono text-xs">{selectedLawyer.email}</DialogDescription>
                </div>
                <div className="flex-1 p-4 overflow-hidden flex flex-col">
                  <Tabs defaultValue="license" className="h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="license">Bar License</TabsTrigger>
                      <TabsTrigger value="id">Government ID</TabsTrigger>
                      <TabsTrigger value="degree">Degree</TabsTrigger>
                    </TabsList>
                    <TabsContent value="license" className="flex-1 bg-surface border border-border rounded-md mt-2 p-8 flex items-center justify-center text-muted-foreground">
                      [Document Viewer Placeholder]
                    </TabsContent>
                    <TabsContent value="id" className="flex-1 bg-surface border border-border rounded-md mt-2 p-8 flex items-center justify-center text-muted-foreground">
                      [ID Viewer Placeholder]
                    </TabsContent>
                    <TabsContent value="degree" className="flex-1 bg-surface border border-border rounded-md mt-2 p-8 flex items-center justify-center text-muted-foreground">
                      [Degree Viewer Placeholder]
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              {/* Right Side: Decision Panel */}
              <div className="w-1/3 flex flex-col p-6 bg-surface">
                <h3 className="font-semibold mb-4">Decision Panel</h3>
                
                <div className="space-y-4 flex-1">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Expertise</label>
                    <p className="text-sm font-medium">{selectedLawyer.expertise || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Experience</label>
                    <p className="text-sm font-medium">{selectedLawyer.experience || '0'} years</p>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <label className="text-xs font-semibold text-destructive uppercase mb-2 block">Rejection Reason</label>
                    <textarea 
                      className="w-full border border-border rounded-md p-2 text-sm h-24 focus:ring-2 focus:ring-ring focus:outline-none"
                      placeholder="Required if rejecting..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <Button onClick={handleApprove} className="w-full bg-success hover:bg-success/90 text-white">
                    Approve Lawyer
                  </Button>
                  <Button variant="outline" className="w-full text-warning border-warning hover:bg-warning/10">
                    Request Changes
                  </Button>
                  <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive/10" disabled={!rejectReason}>
                    Reject Application
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
