import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
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
    Upload
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { parseHtmlToDocx } from '@/lib/docxUtils';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { DocumentPreview } from '@/components/documents/DocumentPreview';

export default function MyDocuments() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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

    const handleView = (doc: any) => {
        setSelectedDoc(doc);
        setIsPreviewOpen(true);
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
                                <TableHead className="w-[40%]">Document Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Modified</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
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
                                    <TableRow key={doc._id} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-secondary text-primary rounded-lg">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-foreground">{doc.title}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{doc.documentType}</span>
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
                                                {doc.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                            {formatDate(doc.updatedAt)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {activeTab === 'workspace' ? (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="View"
                                                            onClick={() => handleView(doc)}
                                                        >
                                                            <Eye className="h-4 w-4 text-gray-500" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Download"
                                                            onClick={() => handleDownload(doc)}
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

            {/* Preview Modal */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
                    <DialogHeader className="p-6 border-b">
                        <DialogTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <span>{selectedDoc?.title}</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => handleDownload(selectedDoc)}
                            >
                                <Download className="h-4 w-4" />
                                Download DOCX
                            </Button>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                        <div className="max-w-3xl mx-auto">
                            <DocumentPreview content={selectedDoc?.content || ''} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

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
