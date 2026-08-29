import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
    Search,
    Plus,
    Mic,
    Paperclip,
    Send,
    ArrowRight,
    Globe,
    Gavel,
    FileText,
    BookOpen,
    Sparkles,
    Loader2,
    Bookmark,
    Settings,
    X,
    File,
    Check,
    Trash2,
    AlertTriangle,
    Download,
    History as HistoryIcon
} from 'lucide-react';
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import jsPDF from 'jspdf';

export default function LegalResearchPage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [progress, setProgress] = useState(0);
    const [history, setHistory] = useState<any[]>([]);
    const [selectedModel, setSelectedModel] = useState("gpt-4o");

    // File & Audio State
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<'research' | 'history'>('research');
    const [historyFilter, setHistoryFilter] = useState<'all' | 'month' | 'week'>('all');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isClearingAll, setIsClearingAll] = useState(false);
    const [researchToDelete, setResearchToDelete] = useState<string | null>(null);
    const [researchStages, setResearchStages] = useState([
        { id: 1, label: "Indexing Multi-State Statutes & Gazette Notifications", status: 'pending' },
        { id: 2, label: "Cross-referencing Supreme Court & High Court Precedents", status: 'pending' },
        { id: 3, label: "Synthesizing Jurisprudential Analysis & Citations", status: 'pending' }
    ]);
    const [filesScanned, setFilesScanned] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(12);

    const filteredHistory = useMemo(() => {
        if (historyFilter === 'all') return history;

        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        return history.filter(item => {
            if (!item.createdAt) return true; // Fallback for items without timestamps
            const itemDate = new Date(item.createdAt);
            if (historyFilter === 'week') return itemDate >= oneWeekAgo;
            if (historyFilter === 'month') return itemDate >= oneMonthAgo;
            return true;
        });
    }, [history, historyFilter]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recognitionRef = useRef<any>(null); // For Web Speech API
    const timerRef = useRef<any>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchHistory = async () => {
        try {
            const response = await api.get('/research/history');
            setHistory(response.data);
        } catch (err) {
            console.error("Failed to fetch history:", err);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSuggestionClick = (type: 'draft' | 'precedent' | 'statute') => {
        let suggestion = "";
        switch (type) {
            case 'draft':
                suggestion = "Draft a legally binding agreement for ";
                break;
            case 'precedent':
                suggestion = "Find relevant case precedents for ";
                break;
            case 'statute':
                suggestion = "Explain the legal provisions and statutes regarding ";
                break;
        }
        setQuery(suggestion);
        // We use a small timeout to ensure state update has propagated if needed, 
        // though usually focus() works immediately.
        setTimeout(() => textareaRef.current?.focus(), 10);
    };

    const handleSearch = async (forcedQuery?: string) => {
        const searchQuery = forcedQuery || query;
        if (!searchQuery.trim() && !attachedFile && !audioBlob) return;

        // Determine if it's a follow-up query
        const isFollowUp = showResults && messages.length > 0;
        
        // Add the user message to UI immediately
        const newUserMessage = {
            role: 'user',
            content: searchQuery || (attachedFile ? `Attached: ${attachedFile.name}` : "Voice Search Result")
        };

        const historyToSend = [...messages];

        if (isFollowUp) {
            setMessages(prev => [...prev, newUserMessage]);
        } else {
            setMessages([newUserMessage]);
        }

        // Switch to chat view and set searching state
        setShowResults(true);
        setIsSearching(true);
        setQuery(""); // Clear the input field immediately
        setAttachedFile(null);
        setAudioBlob(null);

        try {
            const payload: any = { query: searchQuery, model: selectedModel };
            if (isFollowUp) {
                payload.history = historyToSend;
            }

            const response = await api.post('/research', payload);

            // Append assistant response to messages
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: response.data.answer }
            ]);
        } catch (err: any) {
            console.error("Research failed:", err);
            // Append error message to chat history
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: "Research failed. Please check your query or try again." }
            ]);

            if (err.response?.status === 403 && err.response?.data?.error === 'limit_reached') {
                toast.error('Subscription limit reached', {
                    description: err.response.data.message || 'You have reached the daily legal research query limit for your plan.',
                    action: {
                        label: 'Upgrade Plan',
                        onClick: () => window.location.href = '/user/billing'
                    }
                });
            } else {
                toast.error(err.response?.data?.message || "Research failed. Please check your query or try again.");
            }
        } finally {
            setIsSearching(false);
            setIsSaved(false); // Reset saved status for new research
        }
    };

    const handleSave = async () => {
        if (!messages.length || isSaved) return;

        try {
            const assistantMessages = messages.filter(m => m.role === 'assistant');
            const latestAssistantMessage = assistantMessages[assistantMessages.length - 1];
            if (!latestAssistantMessage) return;

            const userMessage = messages.find(m => m.role === 'user');
            const queryToSave = userMessage ? userMessage.content : query;

            await api.post('/research/save', {
                query: queryToSave,
                answer: latestAssistantMessage.content,
                title: queryToSave.length > 50 ? queryToSave.substring(0, 50) + '...' : queryToSave,
                category: "Legal Research"
            });

            setIsSaved(true);
            // Refresh history to show the save happened
            await fetchHistory();
        } catch (err) {
            console.error("Failed to save research:", err);
        }
    };

    const handleDeleteResearch = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent launching research when clicking delete
        setResearchToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!researchToDelete) return;

        try {
            await api.delete(`/research/${researchToDelete}`);
            // Refresh history after deletion
            await fetchHistory();
            setIsDeleteDialogOpen(false);
            setResearchToDelete(null);
        } catch (err) {
            console.error("Failed to delete research:", err);
            alert("Failed to delete research record.");
        }
    };

    const handleClearAllHistory = async () => {
        setIsClearingAll(true);
        try {
            await api.delete('/research/history/clear');
            setHistory([]);
            setIsSettingsOpen(false);
        } catch (err) {
            console.error("Failed to clear history:", err);
            alert("Failed to clear research history.");
        } finally {
            setIsClearingAll(false);
        }
    };

    const handleExportHistory = () => {
        if (history.length === 0) return;

        const headers = ["Title", "Date", "Category", "Query", "Answer"];
        const rows = history.map(item => [
            `"${(item.title || '').replace(/"/g, '""')}"`,
            `"${item.date || new Date(item.createdAt).toLocaleDateString()}"`,
            `"${item.category || 'General'}"`,
            `"${(item.description || '').replace(/"/g, '""')}"`,
            `"${(item.answer || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Vidhik_Research_History_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAttachedFile(file);
        }
    };

    const toggleRecording = async () => {
        if (isRecording) {
            // Stop Speech Recognition
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {
                    console.error("[Mic] Error stopping recognition:", e);
                }
            }

            // Stop Media Recorder
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                try {
                    mediaRecorderRef.current.stop();
                } catch (e) {
                    console.error("[Mic] Error stopping recorder:", e);
                }
            }

            // Stop all audio tracks to release the microphone hardware
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => {
                    track.stop();
                    console.log("[Mic] Track stopped:", track.label);
                });
                streamRef.current = null;
            }

            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
            console.log("[Mic] Recording session ended.");
        } else {
            console.log("[Mic] Requesting microphone access...");
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;

                // 1. Web Speech API (Transcription)
                const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                if (SpeechRecognition) {
                    const recognition = new SpeechRecognition();
                    recognition.continuous = true;
                    recognition.interimResults = true;
                    recognition.lang = 'en-IN';

                    recognition.onresult = (event: any) => {
                        let finalTranscript = '';
                        for (let i = event.resultIndex; i < event.results.length; ++i) {
                            if (event.results[i].isFinal) {
                                finalTranscript += event.results[i][0].transcript;
                            }
                        }
                        if (finalTranscript) {
                            setQuery(prev => prev ? prev + " " + finalTranscript : finalTranscript);
                        }
                    };

                    recognition.onerror = (event: any) => {
                        console.error("[Mic] Speech recognition error:", event.error);
                        if (event.error === 'not-allowed') {
                            alert("Microphone access denied. Please check browser permissions.");
                        }
                    };

                    recognition.start();
                    recognitionRef.current = recognition;
                }

                // 2. MediaRecorder (Audio Blob)
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;

                const chunks: BlobPart[] = [];
                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) chunks.push(e.data);
                };

                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'audio/webm' });
                    setAudioBlob(blob);
                };

                mediaRecorder.start();
                setIsRecording(true);
                setRecordingTime(0);
                timerRef.current = setInterval(() => {
                    setRecordingTime(prev => prev + 1);
                }, 1000);

                console.log("[Mic] Recording started successfully.");
            } catch (err) {
                console.error("[Mic] Failed to start recording:", err);
                alert("Microphone Error: Please ensure you have granted permission and are using a supported browser.");
                setIsRecording(false);
            }
        }
    };

    const formatAnalysisResult = (content: string) => {
        // Remove citations block from main display
        const displayContent = content.split('[CITATIONS]')[0];

        // Remove markdown headers and bolding
        const cleanContent = displayContent
            .replace(/###\s+/g, '') // Remove ###
            .replace(/\*\*/g, '')   // Remove **
            .trim();
        
        // Split by newlines and filter out empty lines to get clean paragraphs
        return cleanContent.split('\n').filter(p => p.trim() !== '');
    };

    const extractCitations = (content: string) => {
        const parts = content.split('[CITATIONS]');
        if (parts.length < 2) return [];
        
        const citationBlock = parts[1].trim();
        return citationBlock
            .split('\n')
            .map(line => line.replace(/^-\s+/, '').replace(/\*\*/g, '').trim())
            .filter(line => line.length > 0);
    };

    const generatePDFReport = async (originalQuery: string, analysisContent: string) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const maxWidth = pageWidth - (margin * 2);

        // Header
        doc.setFontSize(22);
        doc.setTextColor(37, 99, 235); // violet-600
        doc.text("Vidhik AI Legal Research Report", margin, 20);
        
        doc.setDrawColor(229, 231, 235); // gray-200
        doc.line(margin, 25, pageWidth - margin, 25);

        // Query Section
        doc.setFontSize(12);
        doc.setTextColor(156, 163, 175); // gray-400
        doc.text("RESEARCH QUERY", margin, 35);
        
        doc.setFontSize(14);
        doc.setTextColor(31, 41, 55); // gray-800
        const queryLines = doc.splitTextToSize(originalQuery, maxWidth);
        doc.text(queryLines, margin, 42);
        
        let cursorY = 42 + (queryLines.length * 7) + 10;

        // Analysis Section
        doc.setFontSize(12);
        doc.setTextColor(156, 163, 175);
        doc.text("LEGAL ANALYSIS", margin, cursorY);
        cursorY += 7;

        doc.setFontSize(11);
        doc.setTextColor(55, 65, 81); // gray-700
        const analysisParagraphs = formatAnalysisResult(analysisContent);
        
        analysisParagraphs.forEach(para => {
            const paraLines = doc.splitTextToSize(para, maxWidth);
            if (cursorY + (paraLines.length * 5) > 280) {
                doc.addPage();
                cursorY = 20;
            }
            doc.text(paraLines, margin, cursorY);
            cursorY += (paraLines.length * 5) + 5;
        });

        // Citations Section
        const citations = extractCitations(analysisContent);
        if (citations.length > 0) {
            cursorY += 5;
            doc.setFontSize(12);
            doc.setTextColor(156, 163, 175);
            doc.text("KEY LEGAL CITATIONS", margin, cursorY);
            cursorY += 7;

            doc.setFontSize(11);
            doc.setTextColor(37, 99, 235);
            citations.forEach(citation => {
                if (cursorY > 280) {
                    doc.addPage();
                    cursorY = 20;
                }
                doc.text(`• ${citation}`, margin + 5, cursorY);
                cursorY += 7;
            });
        }

        // Footer
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(156, 163, 175);
            doc.text(`Generated by Vidhik AI • Page ${i} of ${totalPages}`, margin, 285);
            doc.text(new Date().toLocaleString(), pageWidth - margin - 40, 285);
        }

        doc.save(`Vidhik_Research_Report_${new Date().getTime()}.pdf`);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };



    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="max-w-[1400px] mx-auto min-h-[calc(100vh-120px)] flex flex-col gap-10 pb-10">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* Main Content Area */}
                <div className="flex-1 space-y-8">

                    {/* Header / Breadcrumb Area with Tabs */}
                    <div className="flex flex-col gap-6 mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => { setShowResults(false); setIsSearching(false); setActiveTab('research'); setMessages([]); setQuery(""); }}>Vidhik Research</span>
                                <ArrowRight className="h-4 w-4 text-gray-300" />
                                <span className="text-gray-900 font-bold">{showResults ? "Analysis Result" : activeTab === 'history' ? "History" : "New Search"}</span>
                            </div>

                            <div className="flex bg-gray-100 p-1 rounded-2xl">
                                <Button
                                    variant={activeTab === 'research' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className={`rounded-xl px-6 font-bold ${activeTab === 'research' ? 'bg-white shadow-sm hover:bg-white' : 'text-gray-500'}`}
                                    onClick={() => setActiveTab('research')}
                                >
                                    Research
                                </Button>
                                <Button
                                    variant={activeTab === 'history' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className={`rounded-xl px-6 font-bold ${activeTab === 'history' ? 'bg-white shadow-sm hover:bg-white' : 'text-gray-500'} ${isSearching ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => !isSearching && setActiveTab('history')}
                                    disabled={isSearching}
                                >
                                    History
                                </Button>
                            </div>
                        </div>
                    </div>

                    {activeTab === 'history' ? (
                        <div className="space-y-8 animate-in fade-in duration-700">
                            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 space-y-10">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-black text-gray-900">Research History</h2>
                                        <p className="text-gray-500 font-medium">Access your past analyses and saved legal research.</p>
                                    </div>
                                    <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl">
                                        <Button
                                            variant={historyFilter === 'all' ? "secondary" : "ghost"}
                                            size="sm"
                                            className={`rounded-xl font-bold ${historyFilter === 'all' ? 'bg-white shadow-sm hover:bg-white text-gray-700' : ''}`}
                                            onClick={() => setHistoryFilter('all')}
                                        >
                                            All Time
                                        </Button>
                                        <Button
                                            variant={historyFilter === 'month' ? "secondary" : "ghost"}
                                            size="sm"
                                            className={`rounded-xl font-bold ${historyFilter === 'month' ? 'bg-white shadow-sm hover:bg-white text-gray-700' : ''}`}
                                            onClick={() => setHistoryFilter('month')}
                                        >
                                            This Month
                                        </Button>
                                        <Button
                                            variant={historyFilter === 'week' ? "secondary" : "ghost"}
                                            size="sm"
                                            className={`rounded-xl font-bold ${historyFilter === 'week' ? 'bg-white shadow-sm hover:bg-white text-gray-700' : ''}`}
                                            onClick={() => setHistoryFilter('week')}
                                        >
                                            This Week
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                                    {filteredHistory.map((record: any, i: number) => (
                                        <Card
                                            key={i}
                                            className="rounded-xl border border-border shadow-sm hover:border-border-strong hover:shadow-md transition-all duration-300 group cursor-pointer overflow-hidden bg-card"
                                            onClick={() => {
                                                setQuery(record.description);
                                                setMessages([
                                                    { role: 'user', content: record.description },
                                                    { role: 'assistant', content: record.answer }
                                                ]);
                                                setShowResults(true);
                                                setActiveTab('research');
                                            }}
                                        >
                                            <div className="p-8 flex flex-col h-full relative">
                                                <div className="flex items-center justify-between mb-6">
                                                    <Badge variant="secondary" className="border-none font-semibold text-xs px-2 py-0.5 tracking-widest uppercase">
                                                        {record.category || "General Research"}
                                                    </Badge>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{record.date || record.time}</span>
                                                        {record.id && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                                                                onClick={(e) => handleDeleteResearch(e, record.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                                                    {record.title || (record.description.length > 50 ? record.description.substring(0, 50) + '...' : record.description)}
                                                </h3>
                                                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-8">{record.description}</p>
                                                <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-6">
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        <Sparkles className="h-3 w-3" />
                                                        AI Verified
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="rounded-xl font-bold p-0 group-hover:text-primary">
                                                        Relaunch
                                                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : !showResults ? (
                        <div className="flex flex-col items-center justify-center pt-20 space-y-10 animate-in fade-in duration-700">
                            <div className="text-center space-y-4">
                                <h1 className="text-5xl font-black text-gray-900 tracking-tight">Start New Research</h1>
                                <p className="text-gray-500 text-xl font-medium">Ask a question or provide a document to begin your legal analysis.</p>
                            </div>

                            {/* Search Container */}
                            <div className="w-full max-w-5xl relative group">
                                <div className="relative bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col transition-all duration-300">
                                    {/* Attachment Preview */}
                                    {(attachedFile || audioBlob || isRecording) && (
                                        <div className="px-6 pt-4 flex flex-wrap gap-2">
                                            {attachedFile && (
                                                <Badge className="bg-secondary text-primary border-border flex items-center gap-2 px-3 py-1.5 rounded-xl animate-in zoom-in-75 duration-300">
                                                    <File className="h-3 w-3" />
                                                    {attachedFile.name}
                                                    <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => setAttachedFile(null)} />
                                                </Badge>
                                            )}
                                            {isRecording && (
                                                <Badge className="bg-red-50 text-red-600 border-red-100 flex items-center gap-2 px-3 py-1.5 rounded-xl animate-pulse">
                                                    <div className="h-2 w-2 rounded-full bg-red-600"></div>
                                                    Recording {formatTime(recordingTime)}
                                                </Badge>
                                            )}
                                            {audioBlob && !isRecording && (
                                                <Badge className="bg-green-50 text-green-700 border-green-100 flex items-center gap-2 px-3 py-1.5 rounded-xl animate-in zoom-in-75 duration-300">
                                                    <Mic className="h-3 w-3" />
                                                    Audio Recorded
                                                    <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => setAudioBlob(null)} />
                                                </Badge>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <textarea
                                            ref={textareaRef}
                                            className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-lg py-4 px-4 min-h-[80px] resize-none overflow-hidden placeholder:text-gray-400 font-medium"
                                            placeholder="Explain the Property Transfer Act or draft an employment contract..."
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSearch();
                                                }
                                            }}
                                        />
                                        <div className="flex items-center gap-3 pr-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={`rounded-full ${attachedFile ? 'text-primary bg-secondary' : 'text-gray-400'} hover:text-primary hover:bg-secondary transition-colors`}
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <Paperclip className="h-6 w-6" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={`rounded-full ${isRecording ? 'text-red-600 bg-red-50 animate-pulse' : 'text-gray-400'} hover:text-primary hover:bg-secondary transition-colors`}
                                                onClick={toggleRecording}
                                            >
                                                <Mic className="h-6 w-6" />
                                            </Button>
                                            <Button
                                                className="bg-primary hover:bg-primary rounded-2xl h-14 w-14 flex items-center justify-center p-0 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-sm"
                                                onClick={() => handleSearch()}
                                                disabled={isSearching}
                                            >
                                                {isSearching ? <Loader2 className="h-7 w-7 animate-spin" /> : <Search className="h-7 w-7" />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Suggestion Chips */}
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Button
                                    variant="outline"
                                    className="rounded-2xl h-12 px-6 gap-2 border-gray-200 hover:bg-gray-50 text-gray-600 font-bold"
                                    onClick={() => handleSuggestionClick('draft')}
                                >
                                    <FileText className="h-4 w-4 text-primary" />
                                    Draft Agreement
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-2xl h-12 px-6 gap-2 border-gray-200 hover:bg-gray-50 text-gray-600 font-bold"
                                    onClick={() => handleSuggestionClick('precedent')}
                                >
                                    <Gavel className="h-4 w-4 text-primary" />
                                    Case Precedents
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-2xl h-12 px-6 gap-2 border-gray-200 hover:bg-gray-50 text-gray-600 font-bold"
                                    onClick={() => handleSuggestionClick('statute')}
                                >
                                    <BookOpen className="h-4 w-4 text-primary" />
                                    Statute Explanation
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
                            {/* Chat View */}
                            <div className="flex items-center justify-between bg-card/80 backdrop-blur-xl p-6 rounded-xl shadow-sm border border-border sticky top-4 z-10 mx-1">
                                <div className="flex items-center gap-6">
                                    <Button 
                                        variant="ghost" 
                                        className="h-12 w-12 rounded-2xl hover:bg-gray-50 bg-white shadow-sm border border-gray-100 flex items-center justify-center transition-all hover:scale-105 active:scale-95" 
                                        onClick={() => { setShowResults(false); setMessages([]); setQuery(""); }}
                                    >
                                        <Plus className="h-6 w-6 text-primary" />
                                    </Button>
                                    <div className="h-10 w-[1px] bg-gray-100"></div>
                                    <div className="space-y-0.5">
                                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Analysis Result</h2>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verified by Vidhik AI</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl font-bold bg-white border-gray-100 hover:bg-gray-50 text-gray-600 h-10 px-4 gap-2"
                                        onClick={() => setActiveTab('history')}
                                    >
                                        <Globe className="h-4 w-4 text-primary" />
                                        Access History
                                    </Button>
                                    <Button
                                        variant={isSaved ? "secondary" : "outline"}
                                        size="sm"
                                        className={`rounded-xl font-bold transition-all duration-300 h-10 px-4 gap-2 ${isSaved ? 'bg-green-50 text-green-700 border-green-200 shadow-none' : 'bg-white border-gray-100 hover:bg-gray-50 text-gray-600'}`}
                                        onClick={handleSave}
                                        disabled={isSaved}
                                    >
                                        {isSaved ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4 text-gray-400" />}
                                        {isSaved ? "Analysis Saved" : "Save Result"}
                                    </Button>
                                    {/* Settings removed per user request */}
                                </div>
                            </div>

                            <div className="space-y-10">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex gap-6 ${m.role === 'assistant' ? 'bg-secondary/30 -mx-8 p-12 rounded-[3rem]' : 'px-4'}`}>
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${m.role === 'user' ? 'bg-gray-900 text-white' : 'bg-primary text-white animate-pulse'}`}>
                                            {m.role === 'user' ? 'US' : <Gavel className="h-6 w-6" />}
                                        </div>
                                        <div className="space-y-4 flex-1">
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{m.role === 'user' ? 'Your Query' : 'Vidhik Legal Analysis'}</p>
                                            <div className="prose prose-blue max-w-none">
                                                <div className="space-y-6">
                                                    {formatAnalysisResult(m.content).map((para, idx) => (
                                                        <p key={idx} className="text-xl font-medium leading-relaxed text-gray-800">
                                                            {para}
                                                        </p>
                                                    ))}
                                                </div>
                                                {m.role === 'assistant' && (
                                                    <div className="mt-8 space-y-6">
                                                        <div className="p-6 bg-white rounded-3xl border border-border space-y-4">
                                                            <div className="flex items-center gap-2 text-primary">
                                                                <Sparkles className="h-5 w-5" />
                                                                <h4 className="font-bold">Key Legal Citations</h4>
                                                            </div>
                                                            <ul className="space-y-3">
                                                                {extractCitations(m.content).length > 0 ? (
                                                                    extractCitations(m.content).map((citation, idx) => (
                                                                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                                                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0"></div>
                                                                            <span>{citation}</span>
                                                                        </li>
                                                                    ))
                                                                ) : (
                                                                    <>
                                                                        <li className="flex items-start gap-3 text-sm text-gray-600">
                                                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0"></div>
                                                                            <span>Section 5 of Transfer of Property Act, 1882</span>
                                                                        </li>
                                                                        <li className="flex items-start gap-3 text-sm text-gray-600">
                                                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0"></div>
                                                                            <span>Rule 4 of the Gift Deed Validation Framework</span>
                                                                        </li>
                                                                    </>
                                                                )}
                                                            </ul>
                                                        </div>
                                                        <Button 
                                                            className="rounded-2xl h-14 bg-primary hover:bg-primary px-8 font-black gap-2"
                                                            onClick={() => {
                                                                const userQuery = messages[i - 1]?.content || query;
                                                                generatePDFReport(userQuery, m.content);
                                                            }}
                                                        >
                                                            Generate Full Report
                                                            <ArrowRight className="h-5 w-5" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isSearching && (
                                    <div className="flex gap-6 bg-secondary/30 -mx-8 p-12 rounded-[3rem] animate-pulse">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary text-white animate-pulse">
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        </div>
                                        <div className="space-y-4 flex-1">
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Vidhik Legal Analysis</p>
                                            <div className="flex items-center gap-2 mt-4">
                                                <div className="h-3 w-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="h-3 w-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="h-3 w-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                <span className="ml-2 text-sm text-gray-500 font-bold">Vidhik AI is researching...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Follow up Input */}
                            <div className="sticky bottom-8 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] p-3 shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 duration-700">
                                {/* Attachment Preview for Follow-up */}
                                {(attachedFile || audioBlob || isRecording) && (
                                    <div className="px-6 pt-2 pb-2 flex flex-wrap gap-2">
                                        {attachedFile && (
                                            <Badge className="bg-secondary text-primary border-border flex items-center gap-2 px-3 py-1 rounded-xl">
                                                <File className="h-3 w-3" />
                                                {attachedFile.name}
                                                <X className="h-3 w-3 cursor-pointer" onClick={() => setAttachedFile(null)} />
                                            </Badge>
                                        )}
                                        {isRecording && (
                                            <Badge className="bg-red-50 text-red-600 border-red-100 flex items-center gap-2 px-3 py-1 rounded-xl animate-pulse">
                                                <div className="h-2 w-2 rounded-full bg-red-600"></div>
                                                Recording {formatTime(recordingTime)}
                                            </Badge>
                                        )}
                                    </div>
                                )}
                                <div className="flex items-center gap-4">
                                    <Input
                                        className="flex-1 bg-transparent border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none text-lg py-6 px-6 font-medium"
                                        placeholder="Ask a follow up question..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSearch();
                                            }
                                        }}
                                    />
                                    <div className="flex items-center gap-2 pr-2">
                                        <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-primary" onClick={() => fileInputRef.current?.click()}>
                                            <Paperclip className="h-5 w-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className={`rounded-full ${isRecording ? 'text-red-600 animate-pulse' : 'text-gray-400'}`} onClick={toggleRecording}>
                                            <Mic className="h-5 w-5" />
                                        </Button>
                                        <Button className="bg-primary hover:bg-primary rounded-2xl h-14 w-14 shadow-lg shadow-sm" onClick={() => handleSearch()}>
                                            <Send className="h-6 w-6" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}

                    {/* Pro Plan Banner - Horizontal Version */}
                    {!isSearching && (
                        <div className="mt-10">
                            <Card className="rounded-xl border border-border shadow-sm bg-primary p-10 text-primary-foreground relative overflow-hidden group">
                                <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary-foreground/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                                <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10">
                                    <div className="space-y-4 text-center lg:text-left">
                                        <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-none font-semibold text-xs px-3 tracking-widest uppercase py-1">Premium Access</Badge>
                                        <h4 className="text-3xl md:text-4xl font-bold leading-tight">Upgrade to Pro for Advanced <br className="hidden md:block"/>Case Law Analysis</h4>
                                        <p className="text-primary-foreground/80 font-medium text-lg max-w-2xl">Get unlimited access to our full suite of premium legal tools, deep case analysis, and priority research clusters.</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                                        <Button className="w-full sm:w-auto shrink-0 bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-lg h-12 px-8 font-semibold text-base shadow-sm transition-all" onClick={() => navigate('/billing')}>
                                            Upgrade Now
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-red-50 p-8 flex flex-col items-center justify-center space-y-4">
                        <div className="bg-white p-4 rounded-3xl shadow-sm">
                            <AlertTriangle className="h-10 w-10 text-red-500" />
                        </div>
                        <DialogHeader className="text-center">
                            <DialogTitle className="text-2xl font-black text-gray-900 leading-tight">Delete Research?</DialogTitle>
                            <DialogDescription className="text-gray-500 font-medium">
                                This action cannot be undone. This research analysis will be permanently removed from your history.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <DialogFooter className="p-8 bg-white flex sm:flex-row gap-4 sm:justify-center">
                        <Button
                            variant="ghost"
                            className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-200 transition-all hover:-translate-y-1"
                            onClick={confirmDelete}
                        >
                            Delete Now
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* History Settings Dialog */}
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="p-10 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center">
                                <Settings className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-0.5">
                                <DialogTitle className="text-2xl font-black text-gray-900 leading-tight">History Settings</DialogTitle>
                                <DialogDescription className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Manage your research data</DialogDescription>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-6 rounded-3xl border border-gray-100 bg-gray-50/30 space-y-4 group hover:border-border transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                            <Download className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-bold text-gray-900">Export All Research</p>
                                            <p className="text-[10px] text-gray-400 font-medium">Download history as a CSV file</p>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="rounded-xl font-bold bg-white text-primary hover:bg-secondary border-violet-50"
                                        onClick={handleExportHistory}
                                        disabled={history.length === 0}
                                    >
                                        Export
                                    </Button>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl border border-gray-100 bg-gray-50/30 space-y-4 group hover:border-red-100 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                            <HistoryIcon className="h-4 w-4 text-gray-400 group-hover:text-red-600 transition-colors" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-bold text-gray-900">Clear All History</p>
                                            <p className="text-[10px] text-gray-400 font-medium">Permanently delete all research</p>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="rounded-xl font-bold bg-white text-red-600 hover:bg-red-50 border-red-50"
                                        onClick={handleClearAllHistory}
                                        disabled={history.length === 0 || isClearingAll}
                                    >
                                        {isClearingAll ? "Clearing..." : "Clear All"}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button 
                                className="w-full rounded-2xl h-14 font-black bg-gray-900 text-white hover:bg-gray-800 shadow-xl shadow-gray-200"
                                onClick={() => setIsSettingsOpen(false)}
                            >
                                Done
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
