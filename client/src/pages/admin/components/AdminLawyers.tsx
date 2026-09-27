import React, { useState, useEffect } from 'react';
import { DocketStrip } from '@/components/ui/docket-strip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { CheckCircle, Eye, EyeOff, ShieldCheck, Users } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';

interface AdminLawyersProps {
  pendingLawyers: any[];
  onApprove: (id: string) => Promise<void>;
}

export function AdminLawyers({ pendingLawyers = [], onApprove }: AdminLawyersProps) {
  const [selectedLawyer, setSelectedLawyer] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const users = await adminService.getAllUsers();
      const lawyersOnly = (users || []).filter((u: any) => u.role === 'lawyer');
      setAllUsers(lawyersOnly);
    } catch {
      // ignore
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async () => {
    if (selectedLawyer) {
      await onApprove(selectedLawyer._id);
      setSelectedLawyer(null);
      fetchUsers();
    }
  };

  const handleToggleVisibility = async (id: string, currentVal: boolean) => {
    const newVal = !currentVal;
    try {
      await adminService.toggleConsultantVisibility(id, newVal);
      setAllUsers(prev => prev.map(u => u._id === id ? { ...u, showInConsultants: newVal } : u));
      toast.success(newVal ? 'Lawyer is now VISIBLE on landing page consultants section' : 'Lawyer is HIDDEN from landing page consultants section');
    } catch {
      toast.error('Failed to update lawyer visibility');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <Tabs defaultValue="consultants" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Lawyer Management</h3>
            <p className="text-sm text-muted-foreground">Manage lawyer approvals and control visibility on the landing page consultants section.</p>
          </div>
          <TabsList className="grid grid-cols-2 w-[340px]">
            <TabsTrigger value="consultants" className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5" />
              Landing Page List
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Pending ({pendingLawyers.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Landing Page Visibility Control */}
        <TabsContent value="consultants" className="space-y-4 pt-2">
          <div className="p-4 bg-muted/20 border border-border rounded-lg text-xs text-muted-foreground flex items-center justify-between">
            <span>Toggle which approved lawyers appear on the live landing page (<strong className="text-foreground">vidhikai.com/consultants</strong>).</span>
            <Button size="sm" variant="ghost" onClick={fetchUsers} className="text-xs">Refresh List</Button>
          </div>

          <div className="space-y-2">
            {loadingUsers ? (
              <div className="p-8 text-center text-xs text-muted-foreground">Loading lawyers...</div>
            ) : allUsers.length === 0 ? (
              <div className="p-12 text-center bg-surface border border-border rounded-md shadow-sm">
                <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No registered lawyers found in database.</p>
              </div>
            ) : (
              allUsers.map((lawyer) => {
                const isVisible = lawyer.showInConsultants !== false && lawyer.isApproved && !lawyer.isSuspended;
                return (
                  <div
                    key={lawyer._id}
                    className="p-4 bg-surface border border-border rounded-lg flex items-center justify-between gap-4 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0">
                        {lawyer.fullName ? lawyer.fullName.substring(0, 2).toUpperCase() : 'LW'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-foreground truncate">{lawyer.fullName}</h4>
                          {lawyer.isApproved ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/15 text-success">APPROVED</span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warning/15 text-warning">PENDING</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{lawyer.email} • {lawyer.expertise || 'General Advocate'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-semibold block text-foreground">
                          {isVisible ? 'Visible on Landing Page' : 'Hidden'}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {isVisible ? 'Listed in /consultants' : 'Not shown'}
                        </span>
                      </div>

                      <Switch
                        checked={lawyer.showInConsultants !== false}
                        onCheckedChange={() => handleToggleVisibility(lawyer._id, lawyer.showInConsultants !== false)}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* Tab 2: Pending Approval Queue */}
        <TabsContent value="pending" className="space-y-4 pt-2">
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
        </TabsContent>
      </Tabs>

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

