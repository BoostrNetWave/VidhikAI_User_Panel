import React, { useState } from 'react';
import { DocketStrip } from '@/components/ui/docket-strip';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Search, Paperclip, Download, ExternalLink, User, ShieldCheck, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface AdminTicketsProps {
  tickets: any[];
  onReply: (id: string, text: string) => Promise<void>;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}

export function AdminTickets({ tickets = [], onReply, onUpdateStatus }: AdminTicketsProps) {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSendReply = async () => {
    if (selectedTicket && replyText.trim()) {
      await onReply(selectedTicket._id, replyText);
      const newReply = { 
        sender: 'admin', 
        message: replyText, 
        text: replyText, 
        createdAt: new Date().toISOString() 
      };
      // Optimistically update local selected ticket for UI responsiveness
      setSelectedTicket({
        ...selectedTicket,
        status: 'Waiting for Customer',
        messages: [...(selectedTicket.messages || selectedTicket.replies || []), newReply],
        replies: [...(selectedTicket.replies || []), newReply]
      });
      setReplyText('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'destructive';
      case 'in progress':
      case 'in_progress': return 'warning';
      case 'waiting for customer': return 'default';
      case 'resolved':
      case 'closed': return 'success';
      default: return 'default';
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (t.subject && t.subject.toLowerCase().includes(term)) ||
      (t._id && t._id.toLowerCase().includes(term)) ||
      (t.user?.email && t.user.email.toLowerCase().includes(term)) ||
      (t.userName && t.userName.toLowerCase().includes(term)) ||
      (t.category && t.category.toLowerCase().includes(term))
    );
  });

  const getFileUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return url.startsWith('/') ? url : `/${url}`;
  };

  // Build unified message list
  const messagesList = selectedTicket ? (
    (selectedTicket.messages && selectedTicket.messages.length > 0)
      ? selectedTicket.messages
      : (selectedTicket.replies || [])
  ) : [];

  return (
    <div className="flex h-[calc(100vh-140px)] border border-border rounded-lg overflow-hidden bg-background animate-in fade-in-50">
      {/* Left Pane: Inbox List */}
      <div className="w-1/3 border-r border-border flex flex-col bg-surface">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Support Inbox</h3>
            <Badge variant="secondary" className="text-xs font-mono">{filteredTickets.length} tickets</Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by subject, email, ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">No tickets found.</div>
            ) : (
              filteredTickets.map(ticket => (
                <div 
                  key={ticket._id} 
                  onClick={() => setSelectedTicket(ticket)}
                  className={`cursor-pointer rounded-lg p-3 border transition-colors ${
                    selectedTicket?._id === ticket._id 
                      ? 'bg-muted/70 border-primary/40 shadow-sm' 
                      : 'border-transparent hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-mono text-xs font-semibold text-primary">
                      #{ticket._id?.substring(ticket._id.length - 6).toUpperCase()}
                    </span>
                    <Badge variant={ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'secondary' : 'default'} className="text-[10px] px-1.5 py-0 h-4">
                      {ticket.status || 'Open'}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm text-foreground line-clamp-1">{ticket.subject || 'Support Request'}</h4>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <span className="truncate max-w-[140px]">{ticket.user?.email || ticket.userEmail || 'Client'}</span>
                    <span className="text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
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
            <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3 bg-surface">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    Ticket #{selectedTicket._id?.substring(selectedTicket._id.length - 6).toUpperCase()}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {selectedTicket.category || 'General'}
                  </Badge>
                  <Badge variant={selectedTicket.priority === 'High' || selectedTicket.priority === 'Urgent' ? 'destructive' : 'secondary'} className="text-xs">
                    {selectedTicket.priority || 'Medium'} Priority
                  </Badge>
                </div>
                <h2 className="font-semibold text-base md:text-lg text-foreground">{selectedTicket.subject || 'Support Request'}</h2>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  User: {selectedTicket.userName || selectedTicket.user?.name || 'Customer'} &lt;{selectedTicket.userEmail || selectedTicket.user?.email || 'N/A'}&gt;
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Status:</span>
                <Select 
                  value={selectedTicket.status || 'Open'} 
                  onValueChange={(val) => {
                    onUpdateStatus(selectedTicket._id, val);
                    setSelectedTicket({...selectedTicket, status: val});
                  }}
                >
                  <SelectTrigger className="w-[170px] h-8 text-xs font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Waiting for Customer">Waiting for Customer</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6 max-w-3xl">
                {/* Initial Ticket Submission */}
                <div className="flex flex-col gap-1.5 max-w-[85%]">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground ml-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{selectedTicket.userName || 'Client'} (Original Request)</span>
                    <span>•</span>
                    <span>{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="bg-muted text-foreground p-4 rounded-2xl rounded-tl-sm text-sm whitespace-pre-wrap shadow-sm border border-border/50">
                    {selectedTicket.description}

                    {/* Ticket File Attachment */}
                    {selectedTicket.attachment && (
                      <div className="mt-3 pt-3 border-t border-border/60">
                        <a
                          href={getFileUrl(selectedTicket.attachment)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-background hover:bg-background/80 text-foreground text-xs font-medium border border-border transition-colors"
                        >
                          <Paperclip className="w-3.5 h-3.5 text-primary" />
                          <span className="truncate max-w-[220px]">
                            {selectedTicket.attachmentName || 'Attachment'}
                          </span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Conversation Thread */}
                {messagesList.map((msg: any, i: number) => {
                  const isAdmin = msg.sender === 'admin' || msg.sender === 'Admin';
                  const text = msg.message || msg.text || '';
                  return (
                    <div key={i} className={`flex flex-col gap-1.5 max-w-[85%] ${isAdmin ? 'ml-auto items-end' : ''}`}>
                      <div className={`flex items-center gap-2 text-xs font-semibold text-muted-foreground ${isAdmin ? 'mr-1' : 'ml-1'}`}>
                        {isAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-primary" /> : <User className="w-3.5 h-3.5" />}
                        <span>{isAdmin ? 'Admin / Support Team' : 'Client'}</span>
                        <span>•</span>
                        <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Just now'}</span>
                      </div>
                      <div className={`p-4 rounded-2xl text-sm whitespace-pre-wrap shadow-sm ${
                        isAdmin 
                          ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                          : 'bg-muted text-foreground rounded-tl-sm border border-border/50'
                      }`}>
                        {text}

                        {/* Message Attachment */}
                        {msg.attachment && (
                          <div className={`mt-3 pt-3 border-t ${isAdmin ? 'border-primary-foreground/20' : 'border-border/60'}`}>
                            <a
                              href={getFileUrl(msg.attachment)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                                isAdmin
                                  ? 'bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30'
                                  : 'bg-background hover:bg-background/80 text-foreground border-border'
                              }`}
                            >
                              <Paperclip className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[220px]">
                                {msg.attachmentName || 'Attachment'}
                              </span>
                              <Download className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-surface">
              <div className="flex flex-col gap-3">
                <textarea 
                  className="w-full bg-background border border-border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[90px] resize-none shadow-sm"
                  placeholder="Type your response to the customer..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={selectedTicket.status === 'Closed'}
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    {selectedTicket.status === 'Closed' ? 'This ticket is closed. Re-open to send messages.' : 'Status will automatically transition to "Waiting for Customer" upon replying.'}
                  </p>
                  <Button 
                    onClick={handleSendReply} 
                    disabled={!replyText.trim() || selectedTicket.status === 'Closed'}
                  >
                    Send Response
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 p-8 text-center">
            <CheckCircle className="h-12 w-12 opacity-20 mb-4" />
            <h4 className="font-semibold text-foreground mb-1">No ticket selected</h4>
            <p className="text-sm text-muted-foreground max-w-sm">
              Select a support ticket from the inbox on the left to view the customer discussion and respond.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
