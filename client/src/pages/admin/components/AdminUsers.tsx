import React, { useState } from 'react';
import { flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AdminUsersProps {
  users: any[];
  onVerifyUser: (id: string) => Promise<void>;
  onUpdateSubscription: (id: string, sub: string) => Promise<void>;
  onSuspendUser: (id: string, isSuspended: boolean) => Promise<void>;
  onSendEmail: (id: string, subject: string, body: string) => Promise<void>;
  onReverifyUser: (id: string) => Promise<void>;
}

export function AdminUsers({ 
  users = [], 
  onVerifyUser, 
  onUpdateSubscription,
  onSuspendUser,
  onSendEmail,
  onReverifyUser
}: AdminUsersProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  const columns = [
    {
      accessorKey: '_id',
      header: 'User ID',
      cell: ({ row }: any) => <span className="font-mono text-xs text-muted-foreground">{String(row.getValue('_id')).substring(0, 8)}</span>
    },
    {
      accessorKey: 'fullName',
      header: 'Name',
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium text-foreground">{row.getValue('fullName')}</div>
          <div className="text-xs text-muted-foreground">{row.original.email}</div>
        </div>
      )
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }: any) => {
        const role = row.getValue('role');
        return <Badge variant="outline" className="capitalize text-[10px]">{role}</Badge>
      }
    },
    {
      accessorKey: 'subscription',
      header: 'Plan',
      cell: ({ row }: any) => (
        <span className="text-sm text-foreground">{row.getValue('subscription') || 'Free'}</span>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }: any) => (
        <span className="font-mono text-xs text-muted-foreground">
          {new Date(row.getValue('createdAt')).toLocaleDateString()}
        </span>
      )
    }
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting }
  });

  return (
    <div className="space-y-4 animate-in fade-in-50">
      <div className="border border-border rounded-md bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-3 font-medium text-muted-foreground">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {table.getRowModel().rows.map(row => (
              <tr 
                key={row.id} 
                className="hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => setSelectedUser(row.original)}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedUser && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl flex items-center gap-2">
                  {selectedUser.fullName}
                  <Badge variant="outline" className="text-[10px]">{selectedUser.role}</Badge>
                </SheetTitle>
                <SheetDescription className="font-mono text-xs">
                  ID: {selectedUser._id} • {selectedUser.email}
                </SheetDescription>
              </SheetHeader>

              <Tabs defaultValue="overview">
                <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0 mb-6 space-x-4">
                  <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2">Overview</TabsTrigger>
                  <TabsTrigger value="cases" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2">Cases</TabsTrigger>
                  <TabsTrigger value="docs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2">Documents</TabsTrigger>
                  <TabsTrigger value="subscription" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2">Subscription</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-border bg-muted/20 rounded-md">
                      <p className="text-xs text-muted-foreground mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${selectedUser.isVerified ? 'bg-success' : 'bg-warning'}`} />
                        <span className="text-sm font-medium">{selectedUser.isVerified ? 'Verified' : 'Pending Verification'}</span>
                      </div>
                    </div>
                    <div className="p-4 border border-border bg-muted/20 rounded-md">
                      <p className="text-xs text-muted-foreground mb-1">Joined Date</p>
                      <p className="text-sm font-mono">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {!selectedUser.isVerified && (
                    <div className="flex items-center justify-between p-4 border border-warning/30 bg-warning/5 rounded-md">
                      <div>
                        <h4 className="text-sm font-semibold text-warning">Manual Email Verification</h4>
                        <p className="text-xs text-muted-foreground">Bypass standard verification for this user.</p>
                      </div>
                      <Switch 
                        checked={false} 
                        onCheckedChange={() => {
                          if (confirm("Are you sure you want to manually verify this user?")) {
                            onVerifyUser(selectedUser._id);
                            setSelectedUser({...selectedUser, isVerified: true});
                          }
                        }} 
                      />
                    </div>
                  )}

                  <div className="mt-8 space-y-4 pt-6 border-t border-border">
                    <h3 className="text-sm font-semibold">Administrative Actions</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {/* Suspend User */}
                      <div className="flex items-center justify-between p-4 border border-destructive/30 bg-destructive/5 rounded-md">
                        <div>
                          <h4 className="text-sm font-semibold text-destructive">Suspend Account</h4>
                          <p className="text-xs text-muted-foreground">Instantly block this user from accessing their account and APIs.</p>
                        </div>
                        <Switch 
                          checked={selectedUser.isSuspended || false} 
                          onCheckedChange={async (val) => {
                            if (confirm(`Are you sure you want to ${val ? 'suspend' : 'unsuspend'} this user?`)) {
                              await onSuspendUser(selectedUser._id, val);
                              setSelectedUser({...selectedUser, isSuspended: val});
                            }
                          }} 
                        />
                      </div>

                      {/* Request Re-verification */}
                      <div className="flex items-center justify-between p-4 border border-border bg-surface rounded-md">
                        <div>
                          <h4 className="text-sm font-semibold">Request Re-verification</h4>
                          <p className="text-xs text-muted-foreground">Revoke current verification status and require the user to verify again.</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={async () => {
                            if (confirm("Revoke verification and send new OTP?")) {
                              await onReverifyUser(selectedUser._id);
                              setSelectedUser({...selectedUser, isVerified: false});
                            }
                          }}
                        >
                          Revoke Verification
                        </Button>
                      </div>

                      {/* Send Direct Email */}
                      <div className="flex items-center justify-between p-4 border border-border bg-surface rounded-md">
                        <div>
                          <h4 className="text-sm font-semibold">Send Direct Email</h4>
                          <p className="text-xs text-muted-foreground">Send a custom email directly to {selectedUser.email}.</p>
                        </div>
                        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="default" size="sm">Compose Email</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Send Email to {selectedUser.fullName}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input 
                                  id="subject" 
                                  placeholder="Email Subject" 
                                  value={emailSubject}
                                  onChange={(e) => setEmailSubject(e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="body">Message Body</Label>
                                <Textarea 
                                  id="body" 
                                  placeholder="Type your message here..." 
                                  rows={5}
                                  value={emailBody}
                                  onChange={(e) => setEmailBody(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>Cancel</Button>
                              <Button onClick={async () => {
                                await onSendEmail(selectedUser._id, emailSubject, emailBody);
                                setEmailSubject("");
                                setEmailBody("");
                                setIsEmailDialogOpen(false);
                              }}>Send Email</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>

                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="subscription" className="space-y-6 mt-0">
                  <div className="p-4 border border-border rounded-md bg-surface space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold">Current Plan</h4>
                      <p className="text-2xl font-semibold mt-1 capitalize text-primary">{selectedUser.subscription || 'Free'}</p>
                      {selectedUser.role === 'lawyer' && (
                        <div className="mt-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                          ✓ Unlimited Chamber Access Active: This lawyer has no active case capacity limits or blog posting caps.
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t border-border space-y-3">
                      <h4 className="text-sm font-semibold text-destructive">Subscription Override</h4>
                      <p className="text-xs text-muted-foreground">Manually override this user's subscription plan. This is a consequential action.</p>
                      
                      <div className="flex gap-2">
                        {['free', 'pro', 'enterprise'].map(plan => (
                          <Button 
                            key={plan}
                            variant={selectedUser.subscription === plan ? 'default' : 'outline'}
                            size="sm"
                            className="capitalize"
                            onClick={() => {
                              const reason = prompt(`Reason for overriding plan to ${plan}?`);
                              if (reason) {
                                onUpdateSubscription(selectedUser._id, plan);
                                setSelectedUser({...selectedUser, subscription: plan});
                              }
                            }}
                          >
                            {plan}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Placeholders for cases and docs */}
                <TabsContent value="cases" className="text-sm text-muted-foreground p-4 text-center">
                  Case history will appear here.
                </TabsContent>
                <TabsContent value="docs" className="text-sm text-muted-foreground p-4 text-center">
                  Document history will appear here.
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
