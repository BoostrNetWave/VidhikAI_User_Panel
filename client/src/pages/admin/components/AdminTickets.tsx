import React, { useState } from 'react';
import { DocketStrip } from '@/components/ui/docket-strip';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AdminTicketsProps {
  tickets: any[];
  onReply: (id: string, text: string) => Promise<void>;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}

export function AdminTickets({ tickets = [], onReply, onUpdateStatus }: AdminTicketsProps) {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = async () => {
    if (selectedTicket && replyText.trim()) {
      await onReply(selectedTicket._id, replyText);
      setReplyText('');
      // Optimistically update local selected ticket for UI responsiveness
      setSelectedTicket({
        ...selectedTicket,
        replies: [...(selectedTicket.replies || []), { text: replyText, sender: 'admin', createdAt: new Date() }]
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'open': return 'destructive';
      case 'in_progress': return 'warning';
      case 'closed': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] border border-border rounded-lg overflow-hidden bg-background animate-in fade-in-50">
      {/* Left Pane: Inbox List */}
      <div className="w-1/3 border-r border-border flex flex-col bg-surface">
        <div className="p-4 border-b border-border bg-muted/20">
          <h3 className="font-semibold text-foreground mb-4">Support Inbox</h3>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search tickets..." 
              className="w-full bg-background border border-border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">No tickets found.</div>
            ) : (
              tickets.map(ticket => (
                <div 
                  key={ticket._id} 
                  onClick={() => setSelectedTicket(ticket)}
                  className={`cursor-pointer rounded-md p-1 ${selectedTicket?._id === ticket._id ? 'bg-muted' : 'hover:bg-muted/50'}`}
                >
                  <DocketStrip
                    recordId={`TCK-${ticket._id.substring(0, 4).toUpperCase()}`}
                    title={ticket.subject || 'Support Request'}
                    status={ticket.status || 'OPEN'}
                    statusColor={getStatusColor(ticket.status || 'OPEN') as any}
                    className="border-none shadow-none bg-transparent hover:bg-transparent"
                  />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Pane: Thread View */}
      <div className="flex-1 flex flex-col bg-background">
        {selectedTicket ? (
          <>
            <div className="p-4 border-b border-border flex items-center justify-between bg-surface">
              <div>
                <h2 className="font-semibold text-lg">{selectedTicket.subject || 'Support Request'}</h2>
                <p className="text-xs text-muted-foreground font-mono mt-1">From: {selectedTicket.user?.email || 'Unknown User'}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">Status:</span>
                <Select 
                  value={selectedTicket.status || 'Open'} 
                  onValueChange={(val) => {
                    onUpdateStatus(selectedTicket._id, val);
                    setSelectedTicket({...selectedTicket, status: val});
                  }}
                >
                  <SelectTrigger className="w-[140px] h-8 text-xs font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In_Progress">In Progress</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                <div className="flex flex-col gap-1 max-w-[80%]">
                  <span className="text-xs font-semibold text-muted-foreground ml-1">Client • {new Date(selectedTicket.createdAt).toLocaleString()}</span>
                  <div className="bg-muted text-foreground p-4 rounded-2xl rounded-tl-sm text-sm whitespace-pre-wrap shadow-sm">
                    {selectedTicket.description}
                  </div>
                </div>

                {selectedTicket.replies?.map((reply: any, i: number) => (
                  <div key={i} className={`flex flex-col gap-1 max-w-[80%] ${reply.sender === 'admin' ? 'ml-auto items-end' : ''}`}>
                    <span className={`text-xs font-semibold text-muted-foreground ${reply.sender === 'admin' ? 'mr-1' : 'ml-1'}`}>
                      {reply.sender === 'admin' ? 'Support Team' : 'Client'} • {new Date(reply.createdAt).toLocaleString()}
                    </span>
                    <div className={`p-4 rounded-2xl text-sm whitespace-pre-wrap shadow-sm ${
                      reply.sender === 'admin' 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : 'bg-muted text-foreground rounded-tl-sm'
                    }`}>
                      {reply.text || reply.message}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-surface">
              <div className="flex flex-col gap-3">
                <textarea 
                  className="w-full bg-background border border-border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none shadow-sm"
                  placeholder="Type your reply to the client..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={selectedTicket.status === 'Closed'}
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    {selectedTicket.status === 'Closed' ? 'Cannot reply to a closed ticket.' : 'Press Cmd+Enter to send.'}
                  </p>
                  <Button 
                    onClick={handleSendReply} 
                    disabled={!replyText.trim() || selectedTicket.status === 'Closed'}
                  >
                    Send Reply
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/10">
            <CheckCircle className="h-12 w-12 opacity-20 mb-4" />
            <p>Select a ticket from the inbox to view the thread</p>
          </div>
        )}
      </div>
    </div>
  );
}
