import React, { useState, useEffect } from 'react';
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    HelpCircle,
    Search,
    Plus,
    Clock,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    Loader2,
    Eye,
    LifeBuoy,
    Inbox,
    Filter
} from "lucide-react";
import api from '@/lib/api';
import { toast } from 'sonner';
import { SupportTicketModal } from '@/components/support/SupportTicketModal';
import { TicketDetailsModal } from '@/components/support/TicketDetailsModal';
import { getSocket } from '@/lib/socket';

export default function MySupportTicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await api.get('/support');
            if (res.data.success) {
                setTickets(res.data.data);
            }
        } catch (err: any) {
            console.error("Error fetching support tickets:", err);
            toast.error("Failed to load your support tickets.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    // Listen to real-time ticket updates from Admin
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleTicketUpdated = (updatedTicket: any) => {
            setTickets(prev => {
                const exists = prev.some(t => t._id === updatedTicket._id || t.ticketId === updatedTicket.ticketId);
                if (exists) {
                    return prev.map(t => (t._id === updatedTicket._id || t.ticketId === updatedTicket.ticketId) ? updatedTicket : t);
                }
                return [updatedTicket, ...prev];
            });
        };

        socket.on('TICKET_UPDATED', handleTicketUpdated);
        return () => {
            socket.off('TICKET_UPDATED', handleTicketUpdated);
        };
    }, []);

    const handleOpenTicketDetails = (ticket: any) => {
        setSelectedTicketId(ticket._id || ticket.ticketId);
        setIsDetailsModalOpen(true);
    };

    const handleTicketUpdatedInModal = (updated: any) => {
        setTickets(prev => prev.map(t => (t._id === updated._id || t.ticketId === updated.ticketId) ? updated : t));
    };

    // Calculate metrics
    const totalCount = tickets.length;
    const openCount = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
    const waitingCount = tickets.filter(t => t.status === 'Waiting for Customer').length;
    const resolvedCount = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;

    // Filter tickets
    const filteredTickets = tickets.filter(t => {
        const matchesSearch = (t.ticketId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.category || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || t.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesPriority = priorityFilter === 'all' || (t.priority || '').toLowerCase() === priorityFilter.toLowerCase();

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Open':
                return <Badge className="bg-blue-500/10 text-blue-700 border-blue-200 font-bold hover:bg-blue-500/20">Open</Badge>;
            case 'In Progress':
                return <Badge className="bg-amber-500/10 text-amber-700 border-amber-200 font-bold hover:bg-amber-500/20">In Progress</Badge>;
            case 'Waiting for Customer':
                return <Badge className="bg-purple-500/10 text-purple-700 border-purple-200 font-bold hover:bg-purple-500/20">Waiting for You</Badge>;
            case 'Resolved':
                return <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 font-bold hover:bg-emerald-500/20">Resolved</Badge>;
            case 'Closed':
                return <Badge className="bg-slate-200 text-slate-700 border-slate-300 font-bold hover:bg-slate-300">Closed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'Urgent':
                return <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">Urgent</span>;
            case 'High':
                return <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">High</span>;
            case 'Medium':
                return <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">Medium</span>;
            default:
                return <span className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">Low</span>;
        }
    };

    const formatDate = (dateStr?: string | Date) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Page Title & Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 text-primary rounded-2xl shrink-0">
                            <LifeBuoy className="h-7 w-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                                My Support Tickets
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                                Track ticket progress, view administrator responses, and reply in real time.
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl h-11 px-5 shadow-sm gap-2 shrink-0 self-start sm:self-auto"
                    >
                        <Plus className="h-4 w-4" />
                        Open Support Ticket
                    </Button>
                </div>

                {/* Status Metric Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Tickets</span>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalCount}</div>
                        <span className="text-[11px] text-slate-400 mt-1">Submitted requests</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs flex flex-col bg-blue-50/20">
                        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Active / In Progress</span>
                        <div className="text-2xl sm:text-3xl font-black text-blue-800 mt-2">{openCount}</div>
                        <span className="text-[11px] text-blue-600/80 mt-1">Under investigation</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs flex flex-col bg-purple-50/20">
                        <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Waiting on You</span>
                        <div className="text-2xl sm:text-3xl font-black text-purple-800 mt-2">{waitingCount}</div>
                        <span className="text-[11px] text-purple-600/80 mt-1">Reply requested</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs flex flex-col bg-emerald-50/20">
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Resolved & Closed</span>
                        <div className="text-2xl sm:text-3xl font-black text-emerald-800 mt-2">{resolvedCount}</div>
                        <span className="text-[11px] text-emerald-600/80 mt-1">Completed issues</span>
                    </div>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search by Ticket ID, Subject, or Category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:bg-white transition-all font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs font-bold text-slate-500">Status:</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="h-9 px-3 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 outline-none"
                            >
                                <option value="all">All Statuses</option>
                                <option value="open">Open</option>
                                <option value="in progress">In Progress</option>
                                <option value="waiting for customer">Waiting for You</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs font-bold text-slate-500">Priority:</span>
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="h-9 px-3 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 outline-none"
                            >
                                <option value="all">All Priorities</option>
                                <option value="urgent">Urgent</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tickets Table Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                    {loading ? (
                        <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-500">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm font-medium">Loading your support tickets...</p>
                        </div>
                    ) : filteredTickets.length === 0 ? (
                        <div className="p-16 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                            <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mb-4">
                                <Inbox className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">
                                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                                    ? "No tickets match your filter"
                                    : "No support tickets yet"}
                            </h3>
                            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                                    ? "Try adjusting your filters or search query to find what you're looking for."
                                    : "Whenever you encounter an issue or have a billing inquiry, open a support ticket to get assistance from our dedicated team."}
                            </p>
                            <Button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl h-10 px-5 gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Open Your First Ticket
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/80">
                                    <TableRow className="border-b border-slate-100">
                                        <TableHead className="text-xs font-bold text-slate-600 py-3.5 pl-6">Ticket ID & Subject</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-600">Category</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-600">Current Status</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-600">Priority</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-600">Submitted</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-600">Last Updated</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-600 text-right pr-6">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTickets.map((t) => (
                                        <TableRow
                                            key={t._id}
                                            onClick={() => handleOpenTicketDetails(t)}
                                            className="hover:bg-primary/5 transition-colors cursor-pointer group border-b border-slate-100/80"
                                        >
                                            <TableCell className="py-4 pl-6">
                                                <div className="flex flex-col min-w-0 pr-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                            {t.ticketId}
                                                        </span>
                                                        <span className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors truncate max-w-sm">
                                                            {t.subject}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-slate-500 truncate max-w-sm mt-0.5">
                                                        {t.description}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                                                    {t.category}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(t.status)}
                                            </TableCell>
                                            <TableCell>
                                                {getPriorityBadge(t.priority)}
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                                                {formatDate(t.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                                                {formatDate(t.updatedAt || t.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleOpenTicketDetails(t)}
                                                    className="rounded-xl h-8 px-3 text-xs font-bold border-slate-200 text-primary hover:bg-primary hover:text-white transition-all gap-1.5 shadow-xs"
                                                >
                                                    <MessageSquare className="h-3.5 w-3.5" />
                                                    <span>View Thread</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                {/* Create Support Ticket Modal */}
                <SupportTicketModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={(newTicket) => {
                        setTickets(prev => [newTicket, ...prev]);
                        handleOpenTicketDetails(newTicket);
                    }}
                />

                {/* Ticket Details & Thread Modal */}
                <TicketDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    ticketId={selectedTicketId}
                    onTicketUpdated={handleTicketUpdatedInModal}
                />
            </div>
        </DashboardLayout>
    );
}
