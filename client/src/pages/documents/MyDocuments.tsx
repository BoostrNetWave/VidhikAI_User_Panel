import { useState, useEffect, useMemo, useRef } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    FileText,
    Search,
    Filter,
    Download,
    Eye,
    Trash2,
    Loader2,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Upload,
    Sparkles,
    FileEdit,
    Save,
    CheckCircle2,
    PenTool,
    ShieldCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { parseHtmlToDocx } from '@/lib/docxUtils';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { DocumentPreview, formatToLegalHtml } from '@/components/documents/DocumentPreview';
import { DigitalSignatureModal } from '@/components/documents/DigitalSignatureModal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function MyDocuments() {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [docModalMode, setDocModalMode] = useState<'review' | 'edit'>('review');
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editStatus, setEditStatus] = useState("draft");
    const [isSavingDoc, setIsSavingDoc] = useState(false);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const quillRef = useRef<any>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [docToDelete, setDocToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'workspace' | 'trash'>('workspace');
    const [isRestoring, setIsRestoring] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Document Upload States
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadTitle, setUploadTitle] = useState("");
    const [uploadType, setUploadType] = useState("other");
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadFile) {
            toast.error("Please select a file to upload");
            return;
        }

        setIsUploading(true);
        const user = JSON.parse(localStorage.getItem('user_profile_data') || '{}');
        const userId = user._id || user.id;

        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("userId", userId);
        formData.append("title", uploadTitle || uploadFile.name);
        formData.append("documentType", uploadType);

        try {
            const response = await api.post("/documents/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.data.success) {
                toast.success("Document uploaded successfully");
                setIsUploadOpen(false);
                setUploadFile(null);
                setUploadTitle("");
                setUploadType("other");
                fetchDocuments(); // Refresh documents list
            }
        } catch (error: any) {
            console.error("Upload failed:", error);
            toast.error(error.response?.data?.message || "Failed to upload document");
        } finally {
            setIsUploading(false);
        }
    };

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user_profile_data') || '{}');
            const userId = user._id || user.id;

            if (userId) {
                const endpoint = activeTab === 'trash'
                    ? `/documents/trash/${userId}`
                    : `/documents/user/${userId}`;
                const response = await api.get(endpoint);
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

    useEffect(() => {
        fetchDocuments();
    }, [activeTab]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeTab]);

    const confirmDelete = async () => {
        if (!docToDelete) return;

        const id = docToDelete._id;
        setIsDeleting(id);
        try {
            const endpoint = activeTab === 'trash'
                ? `/documents/permanent/${id}`
                : `/documents/${id}`;
            const response = await api.delete(endpoint);
            if (response.data.success) {
                setDocuments(prev => prev.filter(doc => doc._id !== id));
                setIsDeleteModalOpen(false);
                setDocToDelete(null);

                if (activeTab === 'trash') {
                    toast.success("Document permanently deleted");
                } else {
                    toast.success("Document moved to Dustbin", {
                        description: "You can restore it anytime from the Dustbin tab.",
                        action: {
                            label: "Undo",
                            onClick: () => handleRestore(id)
                        }
                    });
                }
            }
        } catch (error) {
            console.error("Error deleting document:", error);
            toast.error("Failed to delete document");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleRestore = async (id: string) => {
        setIsRestoring(id);
        try {
            const response = await api.post(`/documents/restore/${id}`);
            if (response.data.success) {
                // Refresh the list based on current tab
                fetchDocuments();
                toast.success("Document restored successfully");
            }
        } catch (error) {
            console.error("Error restoring document:", error);
            toast.error("Failed to restore document");
        } finally {
            setIsRestoring(null);
        }
    };

    const handleDeleteClick = (doc: any) => {
        setDocToDelete(doc);
        setIsDeleteModalOpen(true);
    };

    const handleDownload = async (doc: any) => {
        try {
            const docxFilename = `${doc.title.replace(/\s+/g, '_')}.docx`;
            const docChildren = parseHtmlToDocx(doc.content);

            if (docChildren.length === 0) {
                docChildren.push(new Paragraph({ children: [new TextRun("Document content is empty.")] }));
            }

            const docObj = new Document({
                styles: {
                    default: {
                        document: {
                            run: {
                                font: "Calibri",
                            },
                        },
                    },
                },
                sections: [{
                    properties: {
                        page: {
                            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
                        },
                    },
                    children: docChildren,
                }],
            });

            const blob = await Packer.toBlob(docObj);
            saveAs(blob, docxFilename);
        } catch (error) {
            console.error('Error in handleDownload:', error);
            alert(`Failed to generate DOCX: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    const handleOpenDocument = (doc: any, mode: 'review' | 'edit' = 'review') => {
        setSelectedDoc(doc);
        setEditTitle(doc.title || '');
        const formatted = formatToLegalHtml(doc.content || '');
        setEditContent(doc.content && /<\s*(p|div|h[1-6]|ul|ol)\b[^>]*>/i.test(doc.content) ? doc.content : formatted);
        setEditStatus(doc.status || 'draft');
        setDocModalMode(mode);
        setIsPreviewOpen(true);
    };

    const handleView = (doc: any) => {
        handleOpenDocument(doc, 'review');
    };

    const handleInsertSignature = async (signatureHtml: string) => {
        if (quillRef.current && docModalMode === 'edit') {
            try {
                const editor = quillRef.current.getEditor();
                const range = editor.getSelection();
                const index = range ? range.index : editor.getLength();
                editor.clipboard.dangerouslyPasteHTML(index, signatureHtml);
                const updatedHtml = editor.root.innerHTML;
                setEditContent(updatedHtml);
                setSelectedDoc((prev: any) => prev ? { ...prev, content: updatedHtml } : prev);
                toast.success("Digital signature inserted into document!");
                return;
            } catch (e) {
                console.error("Failed to insert signature into Quill editor, fallback to append:", e);
            }
        }
        const currentContent = selectedDoc?.content || editContent || '';
        const updatedHtml = (currentContent ? currentContent + '\n' : '') + signatureHtml;
        setEditContent(updatedHtml);
        setSelectedDoc((prev: any) => prev ? { ...prev, content: updatedHtml } : prev);

        // Auto-save to backend so the signed document is immediately persisted
        if (selectedDoc?._id) {
            try {
                await api.put(`/documents/${selectedDoc._id}`, {
                    title: editTitle.trim() || selectedDoc.title,
                    content: updatedHtml,
                    status: selectedDoc.status || 'final'
                });
                fetchDocuments();
                toast.success("Digital signature saved to document!");
            } catch (err) {
                console.error("Auto-save signature failed:", err);
            }
        }
    };

    const handleSaveDocument = async () => {
        if (!selectedDoc?._id) return;
        setIsSavingDoc(true);

        let contentToSave = editContent;
        if (quillRef.current) {
            try {
                contentToSave = quillRef.current.getEditor().root.innerHTML;
                setEditContent(contentToSave);
            } catch (e) {
                // ignore
            }
        }

        try {
            const response = await api.put(`/documents/${selectedDoc._id}`, {
                title: editTitle.trim() || selectedDoc.title,
                content: contentToSave,
                status: editStatus
            });
            if (response.data.success) {
                const updated = response.data.data;
                setSelectedDoc(updated);
                setDocuments(prev => prev.map(d => d._id === updated._id ? { ...d, ...updated } : d));
                toast.success("Document updated successfully");
                setDocModalMode('review');
            }
        } catch (error: any) {
            console.error("Failed to save document:", error);
            toast.error(error.response?.data?.message || "Failed to save document changes");
        } finally {
            setIsSavingDoc(false);
        }
    };

    const quillModules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['clean']
        ]
    }), []);

    const quillFormats = useMemo(() => [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'indent',
        'align',
        'color', 'background',
        'link', 'image'
    ], []);

    const handleReviewDocument = (doc: any) => {
        let plainText = "";
        if (doc.content) {
            // Convert HTML to formatted text if it contains HTML tags
            if (/<[a-z][\s\S]*>/i.test(doc.content)) {
                const formatted = doc.content
                    .replace(/<\s*br\s*[\/]?>/gi, "\n")
                    .replace(/<\s*\/p\s*>/gi, "\n\n")
                    .replace(/<\s*\/h[1-6]\s*>/gi, "\n\n")
                    .replace(/<\s*\/li\s*>/gi, "\n");
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = formatted;
                plainText = tempDiv.innerText || tempDiv.textContent || "";
            } else {
                plainText = doc.content;
            }
        }
        
        if (!plainText.trim()) {
            plainText = `${doc.title}\n\nDocument Type: ${doc.documentType}\nNo content available.`;
        }

        const safeFilename = `${doc.title.replace(/[^\w\s-]/g, '').trim() || 'Document'}.txt`;
        const file = new File([plainText], safeFilename, { type: "text/plain" });

        // Save selected document in sessionStorage to preserve selection
        try {
            sessionStorage.setItem('vidhik_selected_review_doc', JSON.stringify({
                _id: doc._id,
                title: doc.title,
                documentType: doc.documentType,
                content: plainText,
                status: doc.status || 'draft',
                updatedAt: doc.updatedAt
            }));
        } catch (e) {
            console.error("Failed to save selected review doc to sessionStorage", e);
        }

        // Close modal if open
        setIsPreviewOpen(false);
        navigate('/documents/review', { 
            state: { 
                fileToReview: file,
                selectedDocument: doc
            } 
        });
    };

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
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredDocuments = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.documentType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalItems = filteredDocuments.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDocuments = filteredDocuments.slice(startIndex, startIndex + itemsPerPage);

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            {activeTab === 'trash' ? 'Dustbin (Trash)' : 'My Documents'}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {activeTab === 'trash'
                                ? 'Recover or permanently delete your trashed documents.'
                                : 'Manage and access all your generated legal documents.'}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex p-1 bg-gray-100 rounded-lg border">
                            <button
                                onClick={() => setActiveTab('workspace')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'workspace' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Workspace
                            </button>
                            <button
                                onClick={() => setActiveTab('trash')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'trash' ? 'bg-background shadow-sm text-destructive' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <Trash2 className="h-4 w-4" />
                                Dustbin
                            </button>
                        </div>
                        {activeTab === 'workspace' && (
                            <Button
                                onClick={() => setIsUploadOpen(true)}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg flex items-center gap-2 font-semibold text-sm h-9"
                            >
                                <Upload className="h-4 w-4" />
                                Upload Document
                            </Button>
                        )}
                        <div className="flex items-center gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search documents..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[38%]">Document Title</TableHead>
                                <TableHead className="w-[18%]">Type</TableHead>
                                <TableHead className="w-[18%]">Status</TableHead>
                                <TableHead className="w-[16%]">Last Modified</TableHead>
                                <TableHead className="text-right w-[10%]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                            <span>Loading your workspace...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredDocuments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                            <div className="p-4 bg-gray-50 rounded-full">
                                                <FileText className="h-10 w-10 text-gray-300" />
                                            </div>
                                            <p className="text-lg font-medium text-gray-600">No documents found</p>
                                            <p className="text-sm">Try adjusting your search or generate a new document.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedDocuments.map((doc) => (
                                    <TableRow
                                        key={doc._id}
                                        onClick={() => handleOpenDocument(doc, 'review')}
                                        className="hover:bg-primary/5 transition-colors cursor-pointer group"
                                    >
                                        <TableCell className="font-medium py-3.5">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="p-2.5 bg-secondary text-primary rounded-lg shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-foreground font-semibold truncate group-hover:text-primary transition-colors text-sm">
                                                        {doc.title}
                                                    </span>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                                            {doc.documentType}
                                                        </span>
                                                        {doc.content && (doc.content.includes('vidhik-signature-block') || doc.content.includes('sig-badge') || doc.content.includes('Digitally Signed')) && (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                                                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                                                                Signed
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="capitalize text-sm text-gray-600">
                                                {doc.documentType.split('-').join(' ')}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`border-none capitalize font-medium ${getStatusColor(doc.status)}`}>
                                                {doc.status || 'Draft'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                            {formatDate(doc.updatedAt)}
                                        </TableCell>
                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-1">
                                                {activeTab === 'workspace' ? (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Review / View Document"
                                                            onClick={() => handleOpenDocument(doc, 'review')}
                                                            className="hover:text-primary hover:bg-primary/10"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Edit Document"
                                                            onClick={() => handleOpenDocument(doc, 'edit')}
                                                            className="hover:text-primary hover:bg-primary/10"
                                                        >
                                                            <FileEdit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Add Digital Signature"
                                                            onClick={() => {
                                                                handleOpenDocument(doc, 'review');
                                                                setIsSignatureModalOpen(true);
                                                            }}
                                                            className="hover:text-indigo-600 hover:bg-indigo-50 text-indigo-500"
                                                        >
                                                            <PenTool className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Review with AI"
                                                            onClick={() => handleReviewDocument(doc)}
                                                            className="hover:text-primary hover:bg-primary/10"
                                                        >
                                                            <Sparkles className="h-4 w-4 text-primary" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Download DOCX"
                                                            onClick={() => handleDownload(doc)}
                                                            className="hover:text-primary hover:bg-primary/10"
                                                        >
                                                            <Download className="h-4 w-4 text-gray-500" />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Restore"
                                                        onClick={() => handleRestore(doc._id)}
                                                        disabled={isRestoring === doc._id}
                                                        className="text-primary hover:text-primary hover:bg-secondary"
                                                    >
                                                        {isRestoring === doc._id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <RotateCcw className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    title={activeTab === 'trash' ? 'Delete Permanently' : 'Move to Trash'}
                                                    onClick={() => handleDeleteClick(doc)}
                                                    disabled={isDeleting === doc._id}
                                                >
                                                    {isDeleting === doc._id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                {!loading && totalItems > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-medium text-gray-900">{Math.min(startIndex + 1, totalItems)}</span> to{" "}
                            <span className="font-medium text-gray-900">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of{" "}
                            <span className="font-medium text-gray-900">{totalItems}</span> documents
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            
                            <div className="flex items-center gap-1 mx-2">
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    // Logic to show limited page numbers if there are too many
                                    if (
                                        totalPages <= 5 ||
                                        pageNum === 1 ||
                                        pageNum === totalPages ||
                                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                    ) {
                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={currentPage === pageNum ? "default" : "outline"}
                                                size="sm"
                                                className={`h-9 w-9 ${currentPage === pageNum ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}`}
                                                onClick={() => setCurrentPage(pageNum)}
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    } else if (
                                        (pageNum === currentPage - 2 && pageNum > 1) ||
                                        (pageNum === currentPage + 2 && pageNum < totalPages)
                                    ) {
                                        return <span key={pageNum} className="px-1 text-gray-400">...</span>;
                                    }
                                    return null;
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Review & Edit Document Modal */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-5xl w-[95vw] max-h-[92vh] flex flex-col p-0 overflow-hidden border border-border shadow-2xl rounded-2xl bg-white">
                    {/* Modal Header */}
                    <div className="p-4 sm:p-5 border-b bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                                {docModalMode === 'edit' ? (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Input
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            placeholder="Document Title"
                                            className="h-9 text-base font-bold text-foreground max-w-sm bg-white"
                                        />
                                        <select
                                            value={editStatus}
                                            onChange={(e) => setEditStatus(e.target.value)}
                                            className="h-9 text-xs font-semibold px-2.5 rounded-md border border-gray-300 bg-white text-gray-800"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="final">Final</option>
                                        </select>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h2 className="text-base sm:text-lg font-bold text-foreground truncate max-w-md">
                                            {selectedDoc?.title}
                                        </h2>
                                        <Badge variant="outline" className={`border-none capitalize font-medium text-xs ${getStatusColor(selectedDoc?.status)}`}>
                                            {selectedDoc?.status || 'Draft'}
                                        </Badge>
                                        {(selectedDoc?.content && (selectedDoc.content.includes('vidhik-signature-block') || selectedDoc.content.includes('sig-badge') || selectedDoc.content.includes('Digitally Signed'))) && (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                                                Digitally Signed
                                            </span>
                                        )}
                                    </div>
                                )}
                                <span className="text-xs text-muted-foreground mt-0.5">
                                    {selectedDoc?.documentType?.split('-').join(' ').toUpperCase()} • Last modified: {selectedDoc?.updatedAt ? formatDate(selectedDoc.updatedAt) : 'Recent'}
                                </span>
                            </div>
                        </div>

                        {/* Controls: Mode Switcher and Actions */}
                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                            {/* Review vs Edit Toggle */}
                            <div className="inline-flex rounded-lg bg-gray-200/90 p-0.5 text-xs font-semibold">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (docModalMode === 'edit') {
                                            let currentHtml = editContent;
                                            if (quillRef.current) {
                                                try {
                                                    currentHtml = quillRef.current.getEditor().root.innerHTML;
                                                    setEditContent(currentHtml);
                                                } catch (e) {
                                                    // ignore
                                                }
                                            }
                                            setSelectedDoc((prev: any) => ({ ...prev, title: editTitle, content: currentHtml, status: editStatus }));
                                        }
                                        setDocModalMode('review');
                                    }}
                                    className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                                        docModalMode === 'review'
                                            ? 'bg-white text-primary shadow-sm font-bold'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <Eye className="h-3.5 w-3.5" />
                                    Review Mode
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (docModalMode === 'review') {
                                            const currentDocContent = selectedDoc?.content || editContent || '';
                                            const formatted = formatToLegalHtml(currentDocContent);
                                            const contentToEdit = currentDocContent && /<\s*(p|div|h[1-6]|ul|ol)\b[^>]*>/i.test(currentDocContent) ? currentDocContent : formatted;
                                            setEditContent(contentToEdit);
                                        }
                                        setDocModalMode('edit');
                                    }}
                                    className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                                        docModalMode === 'edit'
                                            ? 'bg-white text-primary shadow-sm font-bold'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <FileEdit className="h-3.5 w-3.5" />
                                    Edit Mode
                                </button>
                            </div>

                            {docModalMode === 'review' ? (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 text-xs text-indigo-700 border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 font-semibold h-8"
                                        onClick={() => setIsSignatureModalOpen(true)}
                                    >
                                        <PenTool className="h-3.5 w-3.5" />
                                        Add Digital Signature
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 text-xs text-primary border-primary/30 hover:bg-primary/10 h-8"
                                        onClick={() => handleReviewDocument(selectedDoc)}
                                    >
                                        <Sparkles className="h-3.5 w-3.5" />
                                        Review with AI
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 text-xs h-8"
                                        onClick={() => handleDownload(selectedDoc)}
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        Download DOCX
                                    </Button>
                                </>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="gap-1.5 text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
                                        onClick={() => setIsSignatureModalOpen(true)}
                                    >
                                        <PenTool className="h-3.5 w-3.5" />
                                        Add Digital Signature
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="gap-1.5 text-xs h-8 bg-primary hover:bg-primary/90 text-white font-semibold shadow-sm"
                                        onClick={handleSaveDocument}
                                        disabled={isSavingDoc}
                                    >
                                        {isSavingDoc ? (
                                            <>
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-3.5 w-3.5" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modal Body */}
                    <div className="flex-1 overflow-y-auto bg-slate-100/70 p-4 sm:p-6">
                        {docModalMode === 'review' ? (
                            <div className="max-w-4xl mx-auto">
                                <DocumentPreview content={selectedDoc?.content || editContent || ''} />
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto space-y-4">
                                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                                    <div className="px-4 py-2.5 bg-slate-50 border-b text-xs text-muted-foreground flex justify-between items-center flex-wrap gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-800">Legal Document Editor</span>
                                            <span className="text-gray-300">|</span>
                                            <span className="italic text-gray-500">Edit clauses, headings, and digital signatures</span>
                                        </div>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setIsSignatureModalOpen(true)}
                                            className="gap-1.5 text-xs h-7 text-indigo-700 border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 font-semibold"
                                        >
                                            <PenTool className="h-3.5 w-3.5" />
                                            Add Digital Signature
                                        </Button>
                                    </div>
                                    <div className="p-4 sm:p-6 min-h-[550px] bg-white">
                                        <ReactQuill
                                            ref={quillRef}
                                            theme="snow"
                                            value={editContent}
                                            onChange={setEditContent}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            className="font-serif text-slate-900 min-h-[500px]"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center gap-2 pt-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        className="gap-1.5 text-xs text-indigo-700 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 font-semibold"
                                        onClick={() => setIsSignatureModalOpen(true)}
                                    >
                                        <PenTool className="h-3.5 w-3.5" />
                                        Add Digital Signature
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                if (quillRef.current) {
                                                    try {
                                                        const currentHtml = quillRef.current.getEditor().root.innerHTML;
                                                        setEditContent(currentHtml);
                                                        setSelectedDoc((prev: any) => ({ ...prev, content: currentHtml }));
                                                    } catch (e) {
                                                        // ignore
                                                    }
                                                }
                                                setDocModalMode('review');
                                            }}
                                        >
                                            Cancel / View Preview
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="gap-1.5 bg-primary hover:bg-primary/90 text-white font-semibold"
                                            onClick={handleSaveDocument}
                                            disabled={isSavingDoc}
                                        >
                                            {isSavingDoc ? (
                                                <>
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-3.5 w-3.5" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Digital Signature Modal */}
            <DigitalSignatureModal
                isOpen={isSignatureModalOpen}
                onClose={() => setIsSignatureModalOpen(false)}
                onInsertSignature={handleInsertSignature}
                defaultName={selectedDoc?.formData?.signatory_name || selectedDoc?.formData?.employer_name || selectedDoc?.formData?.client_name || ''}
            />

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <Trash2 className="h-5 w-5" />
                            {activeTab === 'trash' ? 'Permanent Deletion' : 'Move to Dustbin'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-gray-600">
                            Are you sure you want to {activeTab === 'trash' ? 'permanently delete' : 'move to dustbin'} <span className="font-semibold text-gray-900">"{docToDelete?.title}"</span>?
                        </p>
                        <p className="text-sm text-red-500 mt-2 bg-red-50 p-3 rounded-lg border border-red-100 italic">
                            {activeTab === 'trash'
                                ? 'This action is final and the document will be lost forever.'
                                : 'You can still recover it from the Dustbin section.'}
                        </p>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={!!isDeleting}
                        >
                            No, Keep it
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={!!isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Yes, Delete Permanently'
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Upload Document Modal */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-primary">
                            <Upload className="h-5 w-5" />
                            Upload Document
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpload} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Document Title</label>
                            <Input
                                placeholder="Enter document title (optional)"
                                value={uploadTitle}
                                onChange={(e) => setUploadTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Document Type</label>
                            <select
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-800"
                                value={uploadType}
                                onChange={(e) => setUploadType(e.target.value)}
                            >
                                <option value="other">Other/Uploaded</option>
                                <option value="nda">Non-Disclosure Agreement (NDA)</option>
                                <option value="employment-contract">Employment Contract</option>
                                <option value="consultant-agreement">Consultant Agreement</option>
                                <option value="service-agreement">Service Agreement</option>
                                <option value="commercial-lease">Commercial Lease</option>
                                <option value="residential-lease">Residential Lease</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">File (.pdf, .docx, .txt)</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100/50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept=".pdf,.docx,.txt"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setUploadFile(file);
                                            if (!uploadTitle) setUploadTitle(file.name.split('.').slice(0, -1).join('.'));
                                        }
                                    }}
                                />
                                <Upload className="h-8 w-8 text-gray-400" />
                                <span className="text-sm font-medium text-gray-600">
                                    {uploadFile ? uploadFile.name : "Click to select or drag file here"}
                                </span>
                                <span className="text-xs text-gray-400">PDF, DOCX, or TXT up to 10MB</span>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsUploadOpen(false)}
                                disabled={isUploading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isUploading || !uploadFile}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    'Upload & Save'
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
