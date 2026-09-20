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
    Copy,
    ChevronDown,
    Layers,
    FolderPlus,
    CheckCircle2,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
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
    const [isSavingToWorkspace, setIsSavingToWorkspace] = useState(false);
    const [savingIndex, setSavingIndex] = useState<number | null>(null);
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

            // Automatically refresh research history
            fetchHistory();
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

    const renderFormattedInlineText = (text: string) => {
        // Handle bolding: **bold**
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <strong key={index} className="font-semibold text-gray-900">
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            return part;
        });
    };

    const renderLegalContent = (content: string) => {
        // Strip [CITATIONS] from main content
        const mainText = content.split('[CITATIONS]')[0].trim();
        const lines = mainText.split('\n');

        const elements: React.ReactNode[] = [];
        let currentListItems: string[] = [];

        const flushList = () => {
            if (currentListItems.length > 0) {
                const itemsToRender = [...currentListItems];
                elements.push(
                    <ul key={`list-${elements.length}`} className="my-3 space-y-2.5 pl-2">
                        {itemsToRender.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-[14.5px] leading-[1.7] text-gray-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                <div>{renderFormattedInlineText(item)}</div>
                            </li>
                        ))}
                    </ul>
                );
                currentListItems = [];
            }
        };

        lines.forEach((rawLine, idx) => {
            const line = rawLine.trim();

            if (!line) {
                flushList();
                return;
            }

            // Check if it's a bullet point
            if (/^[-*•]\s+/.test(line)) {
                currentListItems.push(line.replace(/^[-*•]\s+/, ''));
                return;
            }

            flushList();

            // Check for H1 (# Title) or H2 (## Title)
            if (/^#+\s+/.test(line)) {
                const headingText = line.replace(/^#+\s+/, '');
                elements.push(
                    <h3 key={`h-${idx}`} className="text-base md:text-lg font-bold text-gray-900 mt-6 mb-2.5 pt-3 border-t border-gray-100 first:border-none first:pt-0 first:mt-0">
                        {renderFormattedInlineText(headingText)}
                    </h3>
                );
                return;
            }

            // Check for numbered sections like "1. Explanation:" or "2. Key Legal Sections and Statutes:"
            const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
            if (numberedMatch) {
                const num = numberedMatch[1];
                const sectionTitle = numberedMatch[2];
                elements.push(
                    <div key={`section-${idx}`} className="mt-6 mb-2.5 flex items-center gap-2.5 pt-3 border-t border-gray-100 first:border-none first:pt-0 first:mt-0">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-md bg-primary/10 text-primary text-xs font-bold shrink-0">
                            {num}
                        </span>
                        <h4 className="text-[15px] font-bold text-gray-900">
                            {renderFormattedInlineText(sectionTitle)}
                        </h4>
                    </div>
                );
                return;
            }

            // Check if line looks like an introductory or stand-alone title (e.g., "Understanding GST in India")
            if (idx === 0 && line.length < 80 && !line.endsWith('.')) {
                elements.push(
                    <h2 key={`title-${idx}`} className="text-lg md:text-xl font-bold text-gray-900 tracking-tight mb-4 pb-2 border-b border-gray-100">
                        {renderFormattedInlineText(line)}
                    </h2>
                );
                return;
            }

            // Regular paragraph
            elements.push(
                <p key={`p-${idx}`} className="text-[14.5px] leading-[1.75] text-gray-700 font-normal my-2.5">
                    {renderFormattedInlineText(line)}
                </p>
            );
        });

        flushList();
        return elements;
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

    const extractCitations = (content: string): string[] => {
        if (!content) return [];
        let citationLines: string[] = [];

        // Check if explicit [CITATIONS] marker exists
        if (content.includes('[CITATIONS]')) {
            const parts = content.split('[CITATIONS]');
            if (parts.length >= 2) {
                const citationBlock = parts[1].trim();
                citationLines = citationBlock.split('\n');
            }
        } else {
            // Fallback: look for a section like "Key Legal Citations", "Key Citations", "Citations:"
            const citationHeaderRegex = /(?:###?\s*(?:Key Legal Citations|Citations|References|Key Citations and Statutes|Precedents)[\s\S]*)/i;
            const match = content.match(citationHeaderRegex);
            if (match) {
                const headerContent = match[0].split('\n').slice(1).join('\n');
                citationLines = headerContent.split('\n');
            }
        }

        const cleanedCitations = citationLines
            .map(line => {
                // Remove bullet points, numbers, asterisks, dashes, leading quotes
                return line
                    .replace(/^[\s\-*•\d\.\)\:]+/, '') // Remove leading bullets like "- ", "* ", "1. ", "• "
                    .replace(/\*\*/g, '')               // Remove markdown bold
                    .replace(/^["']|["']$/g, '')        // Remove quotes
                    .trim();
            })
            .filter(line => {
                // Filter out non-citation lines or noise
                if (!line || line.length < 5) return false;
                const lower = line.toLowerCase();
                if (lower.startsWith('disclaimer') || lower.includes('informational purposes only')) return false;
                if (lower === 'n/a' || lower === 'none' || lower === 'no citations found') return false;
                if (lower.startsWith('note:') || lower.startsWith('important:')) return false;
                return true;
            });

        // Deduplicate
        return Array.from(new Set(cleanedCitations));
    };

    const generateLegalReportPDF = (mode: 'selected' | 'full', selectedAssistantIndex?: number) => {
        try {
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 18;
            const maxWidth = pageWidth - (margin * 2);
            let cursorY = margin;

            const checkPageBreak = (neededSpace: number) => {
                if (cursorY + neededSpace > pageHeight - 22) {
                    doc.addPage();
                    cursorY = margin;
                    return true;
                }
                return false;
            };

            // Top Header Accent Bar
            doc.setFillColor(15, 23, 42); // slate-900
            doc.rect(margin, cursorY, maxWidth, 14, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10.5);
            doc.setTextColor(255, 255, 255);
            doc.text("VIDHIK AI  |  LEGAL RESEARCH DOSSIER", margin + 6, cursorY + 9);

            cursorY += 20;

            // Metadata row
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(100, 116, 139);
            const dateStr = new Date().toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            doc.text(`DATE GENERATED: ${dateStr}`, margin, cursorY);
            doc.text(`JURISDICTION: INDIAN LAW & JUDICIAL PRECEDENTS`, margin, cursorY + 4.5);
            doc.text(`SCOPE: ${mode === 'selected' ? 'SELECTED INQUIRY ANALYSIS' : 'FULL MULTI-TURN CONVERSATION'}`, margin, cursorY + 9);

            cursorY += 15;
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.4);
            doc.line(margin, cursorY, pageWidth - margin, cursorY);
            cursorY += 8;

            interface Exchange {
                userQuery: string;
                assistantAnswer: string;
                citations: string[];
                index: number;
            }

            const exchanges: Exchange[] = [];

            if (mode === 'selected') {
                const targetIdx = selectedAssistantIndex ?? (messages.length - 1);
                const assistantMsg = messages[targetIdx];
                if (!assistantMsg) {
                    toast.error("No analysis content found to download");
                    return;
                }
                let uQuery = query;
                for (let j = targetIdx - 1; j >= 0; j--) {
                    if (messages[j]?.role === 'user') {
                        uQuery = messages[j].content;
                        break;
                    }
                }
                exchanges.push({
                    userQuery: uQuery || "Legal Research Inquiry",
                    assistantAnswer: assistantMsg.content,
                    citations: extractCitations(assistantMsg.content),
                    index: 1
                });
            } else {
                let currentQuery = query || "Initial Inquiry";
                let exchangeCount = 0;

                for (let i = 0; i < messages.length; i++) {
                    const msg = messages[i];
                    if (msg.role === 'user') {
                        currentQuery = msg.content;
                    } else if (msg.role === 'assistant') {
                        exchangeCount++;
                        exchanges.push({
                            userQuery: currentQuery,
                            assistantAnswer: msg.content,
                            citations: extractCitations(msg.content),
                            index: exchangeCount
                        });
                    }
                }

                if (exchanges.length === 0 && messages.length > 0) {
                    exchanges.push({
                        userQuery: query || "Legal Research Inquiry",
                        assistantAnswer: messages[messages.length - 1].content,
                        citations: extractCitations(messages[messages.length - 1].content),
                        index: 1
                    });
                }
            }

            // Render each exchange
            exchanges.forEach((ex, idx) => {
                checkPageBreak(35);

                if (mode === 'full') {
                    doc.setFillColor(241, 245, 249);
                    doc.roundedRect(margin, cursorY, maxWidth, 7.5, 1.5, 1.5, 'F');
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(8.5);
                    doc.setTextColor(71, 85, 105);
                    doc.text(`EXCHANGE #${ex.index} ${ex.index === 1 ? '(PRIMARY INQUIRY)' : '(FOLLOW-UP QUESTION)'}`, margin + 4, cursorY + 5.2);
                    cursorY += 12;
                }

                // Query Block
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(8.5);
                doc.setTextColor(99, 102, 241);
                doc.text("RESEARCH QUERY", margin, cursorY);
                cursorY += 4.5;

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(15, 23, 42);
                const queryLines = doc.splitTextToSize(ex.userQuery, maxWidth);
                doc.text(queryLines, margin, cursorY);
                cursorY += (queryLines.length * 4.8) + 6;

                // Analysis Header
                checkPageBreak(25);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(8.5);
                doc.setTextColor(99, 102, 241);
                doc.text("LEGAL ANALYSIS & JURISPRUDENCE", margin, cursorY);
                cursorY += 5;

                const rawContent = ex.assistantAnswer.split('[CITATIONS]')[0].trim();
                const contentLines = rawContent.split('\n');

                contentLines.forEach(rawLine => {
                    const line = rawLine.trim();
                    if (!line) {
                        cursorY += 2;
                        return;
                    }

                    if (/^#+\s+/.test(line) || /^(\d+)\.\s+/.test(line)) {
                        checkPageBreak(12);
                        cursorY += 2;
                        doc.setFont('helvetica', 'bold');
                        doc.setFontSize(9.5);
                        doc.setTextColor(30, 41, 59);
                        const cleanHeader = line.replace(/^#+\s+/, '').replace(/\*\*/g, '');
                        const headerLines = doc.splitTextToSize(cleanHeader, maxWidth);
                        doc.text(headerLines, margin, cursorY);
                        cursorY += (headerLines.length * 4.4) + 2.5;
                        return;
                    }

                    if (/^[-*•]\s+/.test(line)) {
                        checkPageBreak(8);
                        const cleanBullet = line.replace(/^[-*•]\s+/, '').replace(/\*\*/g, '');
                        doc.setFont('helvetica', 'normal');
                        doc.setFontSize(8.8);
                        doc.setTextColor(51, 65, 85);
                        const bulletLines = doc.splitTextToSize(cleanBullet, maxWidth - 8);
                        doc.circle(margin + 2.5, cursorY - 1, 0.6, 'F');
                        doc.text(bulletLines, margin + 6, cursorY);
                        cursorY += (bulletLines.length * 4) + 1.8;
                        return;
                    }

                    checkPageBreak(8);
                    const cleanPara = line.replace(/\*\*/g, '');
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(8.8);
                    doc.setTextColor(51, 65, 85);
                    const paraLines = doc.splitTextToSize(cleanPara, maxWidth);
                    doc.text(paraLines, margin, cursorY);
                    cursorY += (paraLines.length * 4.1) + 2.2;
                });

                // Citations Block for this exchange
                if (ex.citations.length > 0) {
                    checkPageBreak(25);
                    cursorY += 4;
                    doc.setFillColor(248, 250, 252);
                    doc.roundedRect(margin, cursorY, maxWidth, 6.5 + (ex.citations.length * 5), 1.5, 1.5, 'F');

                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(8);
                    doc.setTextColor(79, 70, 229);
                    doc.text("KEY LEGAL CITATIONS & STATUTORY REFERENCES", margin + 4, cursorY + 4.5);
                    cursorY += 8;

                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(8);
                    doc.setTextColor(30, 41, 59);

                    ex.citations.forEach(cit => {
                        const citLines = doc.splitTextToSize(`•  ${cit}`, maxWidth - 10);
                        doc.text(citLines, margin + 5, cursorY);
                        cursorY += (citLines.length * 3.8) + 1;
                    });
                    cursorY += 3;
                }

                if (mode === 'full' && idx < exchanges.length - 1) {
                    checkPageBreak(15);
                    cursorY += 4;
                    doc.setDrawColor(203, 213, 225);
                    doc.setLineDashPattern([2, 2], 0);
                    doc.line(margin, cursorY, pageWidth - margin, cursorY);
                    doc.setLineDashPattern([], 0);
                    cursorY += 8;
                }
            });

            // Footers
            const totalPages = doc.getNumberOfPages();
            for (let p = 1; p <= totalPages; p++) {
                doc.setPage(p);
                doc.setDrawColor(226, 232, 240);
                doc.setLineWidth(0.3);
                doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(7);
                doc.setTextColor(148, 163, 184);
                doc.text("Generated by Vidhik AI Legal Assistant • Strictly for Research & Informational Purposes", margin, pageHeight - 9);
                doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin - 15, pageHeight - 9);
            }

            const fileName = mode === 'selected'
                ? `Vidhik_Legal_Research_${new Date().toISOString().slice(0, 10)}.pdf`
                : `Vidhik_Full_Chat_Report_${new Date().toISOString().slice(0, 10)}.pdf`;

            doc.save(fileName);
            toast.success(mode === 'selected' ? "Selected research report downloaded successfully!" : "Full conversation report downloaded successfully!");
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.error("Failed to generate PDF report.");
        }
    };

    const generatePDFReport = async (originalQuery: string, analysisContent: string) => {
        generateLegalReportPDF('selected');
    };

    const buildResearchHtml = (mode: 'selected' | 'full', selectedAssistantIndex?: number): { title: string; html: string } => {
        const dateStr = new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        if (mode === 'selected') {
            const targetIdx = selectedAssistantIndex ?? (messages.length - 1);
            const assistantMsg = messages[targetIdx];
            let userQ = query;
            for (let j = targetIdx - 1; j >= 0; j--) {
                if (messages[j]?.role === 'user') {
                    userQ = messages[j].content;
                    break;
                }
            }
            const cleanTitle = userQ ? (userQ.length > 55 ? `${userQ.slice(0, 55)}...` : userQ) : "Legal Research Inquiry";
            const citations = extractCitations(assistantMsg?.content || "");
            const rawContent = (assistantMsg?.content || "").split('[CITATIONS]')[0].trim();

            const contentHtml = rawContent.split(/\n{2,}/).map(block => {
                const trimmed = block.trim();
                if (!trimmed) return '';
                if (trimmed.startsWith('### ')) return `<h3>${trimmed.slice(4)}</h3>`;
                if (trimmed.startsWith('## ')) return `<h2>${trimmed.slice(3)}</h2>`;
                if (trimmed.startsWith('# ')) return `<h1>${trimmed.slice(2)}</h1>`;
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    const lis = trimmed.split('\n').map(l => `<li>${l.replace(/^[-*]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('');
                    return `<ul>${lis}</ul>`;
                }
                return `<p>${trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
            }).filter(Boolean).join('');

            const citationsHtml = citations.length > 0
                ? `<h2>KEY LEGAL CITATIONS & PRECEDENTS</h2><ul>${citations.map(c => `<li>${c}</li>`).join('')}</ul>`
                : '';

            const disclaimerHtml = `
                <div style="margin-top: 28px; padding: 14px 18px; background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; color: #92400e; font-size: 12px; line-height: 1.6;">
                    <strong>AI Legal Assistance Notice:</strong> This content may not be 100% perfect as it is AI-generated. Legal precedents and statutory provisions can change—please cross-check with official legal gazettes and consult a qualified legal professional.
                </div>
            `;

            const fullHtml = `
                <h1 class="ql-align-center">LEGAL RESEARCH DOSSIER</h1>
                <p class="ql-align-center"><strong>VIDHIK AI  |  JURISPRUDENTIAL CASE LAW ANALYSIS</strong></p>
                <hr/>
                <p><strong>Inquiry Matter:</strong> ${userQ}</p>
                <p><strong>Generated on:</strong> ${dateStr}  |  <strong>Jurisdiction:</strong> Indian Law & Judicial Precedents</p>
                <hr/>
                <h2>LEGAL SYNTHESIS & STATUTORY EVALUATION</h2>
                ${contentHtml}
                ${citationsHtml}
                ${disclaimerHtml}
            `;

            return { title: `Research: ${cleanTitle}`, html: fullHtml };
        } else {
            const firstUserMsg = messages.find(m => m.role === 'user');
            const sessionTitle = firstUserMsg ? (firstUserMsg.content.length > 55 ? `${firstUserMsg.content.slice(0, 55)}...` : firstUserMsg.content) : "Legal Research Session";

            let conversationHtml = '';
            let exchangeNum = 1;

            for (let idx = 0; idx < messages.length; idx++) {
                if (messages[idx].role === 'user') {
                    conversationHtml += `<h2 style="margin-top: 24px; color: #0f172a;">INQUIRY #${exchangeNum}: ${messages[idx].content}</h2>`;
                } else if (messages[idx].role === 'assistant') {
                    const citations = extractCitations(messages[idx].content);
                    const rawContent = messages[idx].content.split('[CITATIONS]')[0].trim();
                    const contentHtml = rawContent.split(/\n{2,}/).map(block => {
                        const trimmed = block.trim();
                        if (!trimmed) return '';
                        if (trimmed.startsWith('### ')) return `<h3>${trimmed.slice(4)}</h3>`;
                        if (trimmed.startsWith('## ')) return `<h2>${trimmed.slice(3)}</h2>`;
                        if (trimmed.startsWith('# ')) return `<h1>${trimmed.slice(2)}</h1>`;
                        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                            const lis = trimmed.split('\n').map(l => `<li>${l.replace(/^[-*]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('');
                            return `<ul>${lis}</ul>`;
                        }
                        return `<p>${trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
                    }).filter(Boolean).join('');

                    const citationsHtml = citations.length > 0
                        ? `<h3>KEY LEGAL CITATIONS</h3><ul>${citations.map(c => `<li>${c}</li>`).join('')}</ul>`
                        : '';

                    conversationHtml += `${contentHtml}${citationsHtml}<hr style="margin: 20px 0; border: none; border-top: 1px dashed #cbd5e1;"/>`;
                    exchangeNum++;
                }
            }

            const disclaimerHtml = `
                <div style="margin-top: 28px; padding: 14px 18px; background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; color: #92400e; font-size: 12px; line-height: 1.6;">
                    <strong>AI Legal Assistance Notice:</strong> This content may not be 100% perfect as it is AI-generated. Legal precedents and statutory provisions can change—please cross-check with official legal gazettes and consult a qualified legal professional.
                </div>
            `;

            const fullHtml = `
                <h1 class="ql-align-center">COMPLETE LEGAL RESEARCH SESSION</h1>
                <p class="ql-align-center"><strong>VIDHIK AI  |  MULTI-TURN RESEARCH DOSSIER</strong></p>
                <hr/>
                <p><strong>Primary Inquiry:</strong> ${sessionTitle}</p>
                <p><strong>Generated on:</strong> ${dateStr}  |  <strong>Jurisdiction:</strong> Indian Law & Judicial Precedents</p>
                <hr/>
                ${conversationHtml}
                ${disclaimerHtml}
            `;

            return { title: `Research: ${sessionTitle}`, html: fullHtml };
        }
    };

    const handleAddToWorkspace = async (mode: 'selected' | 'full', targetAssistantIndex?: number) => {
        try {
            setIsSavingToWorkspace(true);
            if (targetAssistantIndex !== undefined) {
                setSavingIndex(targetAssistantIndex);
            }

            const profile = JSON.parse(localStorage.getItem('user_profile_data') || '{}');
            const userId = profile._id || profile.id;

            const { title, html } = buildResearchHtml(mode, targetAssistantIndex);

            const response = await api.post('/documents/save', {
                userId,
                title,
                documentType: 'legal_research',
                content: html,
                formData: {
                    source: 'legal_research',
                    mode,
                    timestamp: new Date().toISOString()
                }
            });

            if (response.data.success) {
                toast.success("Saved to My Documents workspace!", {
                    description: `"${title}" has been saved to your document repository.`,
                    action: {
                        label: "Open My Documents",
                        onClick: () => navigate('/documents/my-documents')
                    }
                });
            }
        } catch (err: any) {
            console.error("Failed to save to workspace:", err);
            toast.error(err.response?.data?.message || "Failed to save document to workspace");
        } finally {
            setIsSavingToWorkspace(false);
            setSavingIndex(null);
        }
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

                                {filteredHistory.length === 0 ? (
                                    <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
                                        <div className="w-16 h-16 rounded-2xl bg-secondary/80 flex items-center justify-center text-primary">
                                            <BookOpen className="h-8 w-8" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold text-gray-900">No Research History Yet</h3>
                                            <p className="text-sm text-gray-500 max-w-md mx-auto">
                                                Ask any legal question in Vidhik Research. Your queries, legal statutes, and case analyses will automatically be saved and displayed here.
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setActiveTab('research');
                                                setShowResults(false);
                                            }}
                                            className="font-semibold rounded-lg mt-2"
                                        >
                                            Start New Research
                                        </Button>
                                    </div>
                                ) : (
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
                                )}
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
                            {/* Simplified Professional Top Action Bar */}
                            <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-4 px-6 rounded-xl shadow-xs border border-gray-200/80 sticky top-4 z-10 mx-1">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                        <Gavel className="h-4 w-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-base font-bold text-gray-900 tracking-tight">Legal Analysis Result</h2>
                                            <Badge variant="outline" className="text-[10px] font-semibold text-emerald-700 border-emerald-200 bg-emerald-50 py-0.5 px-2">
                                                Verified by Vidhik AI
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs font-semibold rounded-lg gap-1.5 text-gray-600 hover:text-gray-900"
                                        onClick={() => { setShowResults(false); setMessages([]); setQuery(""); }}
                                    >
                                        <Search className="h-3.5 w-3.5" />
                                        New Research
                                    </Button>
                                </div>
                            </div>

                            <div className="max-w-4xl mx-auto space-y-6 w-full">
                                {messages.map((m, i) => (
                                    <div key={i} className="animate-in fade-in duration-300">
                                        {m.role === 'user' ? (
                                            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 shadow-2xs">
                                                <div className="flex items-center gap-2.5 mb-2 text-slate-500">
                                                    <div className="h-5 w-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">US</div>
                                                    <span className="text-[11px] font-bold uppercase tracking-wider">Your Query</span>
                                                </div>
                                                <p className="text-base font-semibold text-slate-900 pl-7">{m.content}</p>
                                            </div>
                                        ) : (
                                            <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
                                                <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                                            <Gavel className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold uppercase tracking-wider text-primary">Vidhik Legal Analysis</p>
                                                            <span className="text-[11px] text-gray-400">Jurisprudential AI synthesis & statutory evaluation</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 text-xs text-gray-500 hover:text-gray-900 gap-1.5"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(m.content.split('[CITATIONS]')[0]);
                                                                toast.success("Analysis copied to clipboard");
                                                            }}
                                                        >
                                                            <Copy className="h-3.5 w-3.5" />
                                                            Copy
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Structured Legal Content with Professional Typography */}
                                                <div className="legal-research-content space-y-2">
                                                    {renderLegalContent(m.content)}
                                                </div>

                                                {/* Key Legal Citations Box */}
                                                {extractCitations(m.content).length > 0 && (
                                                    <div className="mt-7 p-4 sm:p-5 bg-slate-50/90 border border-slate-200/90 rounded-xl space-y-3">
                                                        <div className="flex items-center gap-2 text-primary">
                                                            <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Key Legal Citations</h4>
                                                        </div>
                                                        <ul className="space-y-2">
                                                            {extractCitations(m.content).map((citation, idx) => (
                                                                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700 font-medium leading-relaxed">
                                                                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                                                    <span className="flex-1 select-text">{citation}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* AI Content Accuracy Disclaimer */}
                                                <div className="mt-6 p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 flex items-start gap-3 text-xs leading-relaxed">
                                                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                                    <div className="space-y-0.5">
                                                        <p className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                                                            <span>AI Legal Assistance Notice</span>
                                                        </p>
                                                        <p className="text-amber-800/95 text-[11.5px] font-medium leading-relaxed">
                                                            This content may not be 100% perfect as it is AI-generated. Legal precedents and statutory provisions can change—please cross-check with official legal gazettes and consult a qualified legal professional before taking formal action.
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Action Toolbar: Download Report, Add to Workspace, Copy */}
                                                <div className="mt-7 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        {/* Download Report Button with Selected vs Full Chat Options */}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    className="h-11 px-5 rounded-xl bg-black hover:bg-black/90 text-white font-semibold text-xs sm:text-sm gap-2.5 shadow-sm hover:shadow-md transition-all inline-flex items-center"
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                    <span>Download Report</span>
                                                                    <ChevronDown className="h-3.5 w-3.5 opacity-70 ml-0.5" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="start" className="w-80 p-2 rounded-xl shadow-xl border border-gray-200 bg-white">
                                                                <div className="px-3 py-2 border-b border-gray-100 mb-1">
                                                                    <p className="text-xs font-bold text-gray-900">Download Research Report</p>
                                                                    <p className="text-[11px] text-gray-500">Choose your preferred export scope</p>
                                                                </div>
                                                                <DropdownMenuItem
                                                                    onClick={() => generateLegalReportPDF('selected', i)}
                                                                    className="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 transition-colors"
                                                                >
                                                                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                                                        <FileText className="h-4 w-4" />
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="font-semibold text-xs text-gray-900">Download Selected Chat</span>
                                                                        <span className="text-[11px] text-gray-500 leading-normal mt-0.5">
                                                                            Download only this specific research query, analysis, and citations
                                                                        </span>
                                                                    </div>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => generateLegalReportPDF('full')}
                                                                    className="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 transition-colors"
                                                                >
                                                                    <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                                                        <Layers className="h-4 w-4" />
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="font-semibold text-xs text-gray-900">Download Full Chat</span>
                                                                        <span className="text-[11px] text-gray-500 leading-normal mt-0.5">
                                                                            Download the complete multi-turn conversation and follow-ups
                                                                        </span>
                                                                    </div>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>

                                                        {/* Add to Workspace Button with Selected vs Full Chat Options */}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    disabled={isSavingToWorkspace}
                                                                    className="h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-xs sm:text-sm gap-2.5 shadow-sm hover:shadow-md transition-all inline-flex items-center"
                                                                >
                                                                    {savingIndex === i ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                    ) : (
                                                                        <FolderPlus className="h-4 w-4" />
                                                                    )}
                                                                    <span>Add to Workspace</span>
                                                                    <ChevronDown className="h-3.5 w-3.5 opacity-70 ml-0.5" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="start" className="w-80 p-2 rounded-xl shadow-xl border border-gray-200 bg-white">
                                                                <div className="px-3 py-2 border-b border-gray-100 mb-1">
                                                                    <p className="text-xs font-bold text-gray-900">Save to My Documents</p>
                                                                    <p className="text-[11px] text-gray-500">Add directly to your workspace repository</p>
                                                                </div>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleAddToWorkspace('selected', i)}
                                                                    className="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 transition-colors"
                                                                >
                                                                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                                                        <FileText className="h-4 w-4" />
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="font-semibold text-xs text-gray-900">Save Selected Analysis</span>
                                                                        <span className="text-[11px] text-gray-500 leading-normal mt-0.5">
                                                                            Save this specific legal query, analysis, and citations to My Documents
                                                                        </span>
                                                                    </div>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleAddToWorkspace('full')}
                                                                    className="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 transition-colors"
                                                                >
                                                                    <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                                                        <Layers className="h-4 w-4" />
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="font-semibold text-xs text-gray-900">Save Full Research Session</span>
                                                                        <span className="text-[11px] text-gray-500 leading-normal mt-0.5">
                                                                            Save the complete multi-turn research thread to My Documents
                                                                        </span>
                                                                    </div>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-9 text-xs text-gray-500 hover:text-gray-900 gap-1.5"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(m.content.split('[CITATIONS]')[0]);
                                                            toast.success("Analysis copied to clipboard");
                                                        }}
                                                    >
                                                        <Copy className="h-3.5 w-3.5" />
                                                        Copy Text
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isSearching && (
                                    <div className="flex items-center gap-4 bg-white border border-gray-200/80 p-6 rounded-2xl animate-pulse shadow-xs">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold uppercase tracking-wider text-primary">Vidhik AI Research in Progress</p>
                                            <p className="text-sm text-gray-500 font-medium">Analyzing statutes, case law precedents, and legal provisions...</p>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Follow up Input */}
                            <div className="sticky bottom-8 max-w-4xl mx-auto w-full bg-white/95 backdrop-blur-xl border border-gray-200/90 rounded-2xl p-2.5 shadow-xl flex flex-col mt-6">
                                {/* Attachment Preview for Follow-up */}
                                {(attachedFile || audioBlob || isRecording) && (
                                    <div className="px-4 pt-2 pb-1.5 flex flex-wrap gap-2">
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
