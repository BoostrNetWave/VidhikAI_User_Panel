import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, FileText, ArrowRight } from "lucide-react"

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

export function RecentActivity() {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user_profile_data') || '{}');
                const userId = user._id || user.id;

                if (userId) {
                    const response = await api.get(`/documents/user/${userId}`);
                    if (response.data.success) {
                        setDocuments(response.data.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching documents:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'final': return "bg-primary/10 text-primary";
            case 'draft': return "bg-secondary text-muted-foreground";
            case 'archived': return "bg-muted text-muted-foreground";
            default: return "bg-secondary text-primary";
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6 animate-fade-in-up [animation-delay:1.5s]">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
                    <span className="text-primary">✦</span> Recent Activity
                </h3>
                <Button variant="ghost" className="text-primary hover:text-primary hover:bg-secondary font-bold transition-all" onClick={() => navigate('/documents/workspace')}>
                    View All Documents <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>

            <div className="glass rounded-2xl border border-slate-200/60 overflow-hidden shadow-lg">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-slate-200/60 hover:bg-transparent">
                            <TableHead className="w-[40%] text-[11px] font-bold text-slate-500 tracking-[0.05em] uppercase px-8">DOCUMENT NAME</TableHead>
                            <TableHead className="text-[11px] font-bold text-slate-500 tracking-[0.05em] uppercase">STATUS</TableHead>
                            <TableHead className="text-[11px] font-bold text-slate-500 tracking-[0.05em] uppercase">LAST MODIFIED</TableHead>
                            <TableHead className="text-right text-[11px] font-bold text-slate-500 tracking-[0.05em] uppercase px-8">ACTION</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="h-8 w-8 border-4 border-primary/30 border-t-violet-600 rounded-full animate-spin" />
                                        <p className="text-slate-400 font-medium animiate-pulse">Loading documents...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : documents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                                            <FileText className="h-8 w-8" />
                                        </div>
                                        <p className="text-slate-400 font-medium">No documents found. Start generating to see them here!</p>
                                        <Button variant="outline" size="sm" onClick={() => navigate('/documents/hub')}>Create New Document</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            documents.map((doc) => (
                                <TableRow key={doc._id} className="border-slate-100/60 hover:bg-secondary/30 transition-colors group">
                                    <TableCell className="font-semibold text-slate-900 px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-secondary text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-border/50 premium-gradient-subtle shadow-sm">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <span className="group-hover:text-primary transition-colors">{doc.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`border-none capitalize font-bold text-[11px] px-2.5 py-0.5 rounded-full ${getStatusColor(doc.status)}`}>
                                            {doc.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-500 font-medium text-sm">{formatDate(doc.updatedAt)}</TableCell>
                                    <TableCell className="text-right px-8">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-all">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
