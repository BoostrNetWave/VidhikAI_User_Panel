import React, { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    PenTool, 
    Type, 
    UploadCloud, 
    Eraser, 
    RotateCcw, 
    ShieldCheck, 
    Check, 
    Sparkles,
    AlignLeft,
    AlignCenter,
    AlignRight
} from "lucide-react";
import { toast } from "sonner";

interface DigitalSignatureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInsertSignature: (signatureHtml: string) => void;
    defaultName?: string;
}

type SignatureMode = 'draw' | 'type' | 'upload';

const SIGNATURE_FONTS = [
    { id: 'dancing', name: 'Dancing Script', font: "'Dancing Script', cursive" },
    { id: 'greatvibes', name: 'Great Vibes', font: "'Great Vibes', cursive" },
    { id: 'alexbrush', name: 'Alex Brush', font: "'Alex Brush', cursive" },
    { id: 'sacramento', name: 'Sacramento', font: "'Sacramento', cursive" },
    { id: 'playfair', name: 'Playfair Italic', font: "'Playfair Display', serif", italic: true }
];

const PEN_COLORS = [
    { label: 'Deep Blue', value: '#1e3a8a' },
    { label: 'Classic Black', value: '#0f172a' },
    { label: 'Navy Slate', value: '#1e293b' },
    { label: 'Royal Blue', value: '#2563eb' }
];

export const DigitalSignatureModal: React.FC<DigitalSignatureModalProps> = ({
    isOpen,
    onClose,
    onInsertSignature,
    defaultName = ''
}) => {
    const [mode, setMode] = useState<SignatureMode>('draw');
    const [signatoryName, setSignatoryName] = useState(defaultName || '');
    const [designation, setDesignation] = useState('Authorized Signatory');
    const [organization, setOrganization] = useState('');
    const [signingDate, setSigningDate] = useState(() => {
        const today = new Date();
        return today.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    });
    const [includeVerification, setIncludeVerification] = useState(true);
    const [alignment, setAlignment] = useState<'right' | 'center' | 'left'>('right');

    // Drawing Canvas States
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const [penColor, setPenColor] = useState('#1e3a8a');
    const [strokeHistory, setStrokeHistory] = useState<ImageData[]>([]);

    // Typed Signature States
    const [selectedFont, setSelectedFont] = useState(SIGNATURE_FONTS[0].font);

    // Upload Signature States
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Initialize Canvas
    useEffect(() => {
        if (isOpen && mode === 'draw') {
            const timer = setTimeout(() => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                // Set actual canvas size matching display size with devicePixelRatio for sharpness
                const rect = canvas.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                ctx.scale(dpr, dpr);

                ctx.strokeStyle = penColor;
                ctx.lineWidth = 2.5;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                // Save blank state
                setStrokeHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen, mode]);

    // Canvas drawing handlers
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        setHasDrawn(true);

        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.strokeStyle = penColor;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Save current canvas state to history for Undo
        const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setStrokeHistory(prev => [...prev.slice(-10), currentState]);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
        setStrokeHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    };

    const undoStroke = () => {
        if (strokeHistory.length <= 1) {
            clearCanvas();
            return;
        }
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const newHistory = strokeHistory.slice(0, -1);
        const previousState = newHistory[newHistory.length - 1];
        ctx.putImageData(previousState, 0, 0);
        setStrokeHistory(newHistory);
        if (newHistory.length === 1) {
            setHasDrawn(false);
        }
    };

    // Upload handler
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file (PNG, JPG, or SVG)");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image file size should be less than 5MB");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setUploadedImageUrl(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Generate unique verification ID
    const generateVerificationId = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let id = '';
        for (let i = 0; i < 6; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `VIDHIK-SIG-${id}`;
    };

    // Insert Signature into Document
    const handleInsert = () => {
        if (!signatoryName.trim()) {
            toast.error("Please enter the Signatory's Full Name");
            return;
        }

        let signatureGraphicHtml = '';

        if (mode === 'draw') {
            if (!hasDrawn || !canvasRef.current) {
                toast.error("Please draw your signature on the canvas first");
                return;
            }
            const dataUrl = canvasRef.current.toDataURL('image/png');
            signatureGraphicHtml = `<img src="${dataUrl}" class="sig-img" alt="Digital Signature" style="max-height: 65px; max-width: 220px; object-fit: contain; margin-bottom: 4px; display: block;" />`;
        } else if (mode === 'type') {
            signatureGraphicHtml = `<span class="sig-typed" style="font-family: ${selectedFont}; font-size: 30px; line-height: 1.3; color: ${penColor}; display: block; margin-bottom: 4px;">${signatoryName.trim()}</span>`;
        } else if (mode === 'upload') {
            if (!uploadedImageUrl) {
                toast.error("Please upload a signature image first");
                return;
            }
            signatureGraphicHtml = `<img src="${uploadedImageUrl}" class="sig-img" alt="Digital Signature" style="max-height: 65px; max-width: 220px; object-fit: contain; margin-bottom: 4px; display: block;" />`;
        }

        const verificationId = generateVerificationId();
        const verificationBadgeHtml = includeVerification ? `
            <div class="sig-badge" style="display: inline-flex; align-items: center; gap: 4px; font-size: 10px; color: #059669; background-color: #ecfdf5; border: 1px solid #a7f3d0; padding: 2px 6px; border-radius: 4px; margin-top: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <span style="font-weight: 600;">&#10003; Digitally Signed &amp; Verified</span>
                <span style="color: #6ee7b7;">&bull;</span>
                <span>ID: #${verificationId}</span>
            </div>
        ` : '';

        const alignmentClass = alignment === 'right' ? 'align-right' : alignment === 'center' ? 'align-center' : 'align-left';
        const wrapperAlignStyle = alignment === 'right' 
            ? 'margin-left: auto; margin-right: 0; text-align: left;' 
            : alignment === 'center' 
                ? 'margin-left: auto; margin-right: auto; text-align: center;' 
                : 'margin-left: 0; margin-right: auto; text-align: left;';

        const signatureBlockHtml = `
            <div class="vidhik-signature-block ${alignmentClass}" style="display: block; min-width: 250px; max-width: 360px; border-top: 1.5px solid #1e293b; padding-top: 10px; margin-top: 32px; margin-bottom: 16px; ${wrapperAlignStyle} page-break-inside: avoid;">
                ${signatureGraphicHtml}
                <p class="sig-name" style="font-weight: 700; font-size: 14px; color: #0f172a; line-height: 1.3; margin: 0;">${signatoryName.trim()}</p>
                <p class="sig-title" style="font-size: 12px; color: #475569; line-height: 1.3; margin: 0;">${designation.trim()}${organization.trim() ? ` &bull; ${organization.trim()}` : ''}</p>
                <p class="sig-date" style="font-size: 11px; color: #64748b; margin-top: 2px; line-height: 1.3;">Date: ${signingDate}</p>
                ${verificationBadgeHtml}
            </div>
        `;

        onInsertSignature(signatureBlockHtml);
        toast.success("Digital signature added to document");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="max-w-2xl w-[95vw] max-h-[92vh] flex flex-col p-0 overflow-hidden bg-white rounded-2xl shadow-2xl border border-gray-200">
                {/* Header */}
                <DialogHeader className="p-5 border-b bg-gradient-to-r from-slate-50 to-indigo-50/40 shrink-0">
                    <DialogTitle className="flex items-center gap-2.5 text-lg font-bold text-gray-900">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <PenTool className="h-5 w-5" />
                        </div>
                        <div>
                            <span>Add Digital Signature</span>
                            <p className="text-xs font-normal text-muted-foreground mt-0.5">
                                Create an authentic, legally compliant digital signature for your document
                            </p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Method Selector Tabs */}
                    <div className="flex items-center justify-between gap-2 border-b pb-3">
                        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                            <button
                                type="button"
                                onClick={() => setMode('draw')}
                                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                                    mode === 'draw'
                                        ? 'bg-white text-primary shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <PenTool className="h-3.5 w-3.5" />
                                Draw Signature
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode('type')}
                                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                                    mode === 'type'
                                        ? 'bg-white text-primary shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <Type className="h-3.5 w-3.5" />
                                Type Script
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode('upload')}
                                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                                    mode === 'upload'
                                        ? 'bg-white text-primary shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <UploadCloud className="h-3.5 w-3.5" />
                                Upload Image
                            </button>
                        </div>

                        {/* Color Selector */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground mr-1 hidden sm:inline">Ink:</span>
                            {PEN_COLORS.map(c => (
                                <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => setPenColor(c.value)}
                                    title={c.label}
                                    style={{ backgroundColor: c.value }}
                                    className={`h-6 w-6 rounded-full border-2 transition-transform ${
                                        penColor === c.value ? 'scale-110 border-primary shadow-sm' : 'border-white opacity-80'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Mode Content */}
                    {mode === 'draw' && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                                <span>Draw using your mouse, trackpad, or touch screen</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={undoStroke}
                                        className="hover:text-primary transition-colors flex items-center gap-1"
                                    >
                                        <RotateCcw className="h-3 w-3" /> Undo
                                    </button>
                                    <span>&bull;</span>
                                    <button
                                        type="button"
                                        onClick={clearCanvas}
                                        className="hover:text-destructive transition-colors flex items-center gap-1"
                                    >
                                        <Eraser className="h-3 w-3" /> Clear
                                    </button>
                                </div>
                            </div>
                            <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-slate-50/50 hover:bg-white transition-colors overflow-hidden h-44 cursor-crosshair">
                                <canvas
                                    ref={canvasRef}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                    className="w-full h-full block touch-none"
                                />
                                {!hasDrawn && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 text-sm">
                                        Sign here with your mouse or finger
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {mode === 'type' && (
                        <div className="space-y-3">
                            <Label className="text-xs font-semibold text-gray-700">
                                Choose Calligraphic Legal Style
                            </Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {SIGNATURE_FONTS.map(f => (
                                    <button
                                        key={f.id}
                                        type="button"
                                        onClick={() => setSelectedFont(f.font)}
                                        className={`p-3 rounded-xl border text-left transition-all ${
                                            selectedFont === f.font
                                                ? 'border-primary bg-primary/5 shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                            <span>{f.name}</span>
                                            {selectedFont === f.font && <Check className="h-3.5 w-3.5 text-primary" />}
                                        </div>
                                        <div
                                            style={{
                                                fontFamily: f.font,
                                                color: penColor,
                                                fontStyle: f.italic ? 'italic' : 'normal'
                                            }}
                                            className="text-2xl truncate py-0.5"
                                        >
                                            {signatoryName || 'Your Signature'}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {mode === 'upload' && (
                        <div className="space-y-2">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer bg-white"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/svg+xml"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                {uploadedImageUrl ? (
                                    <div className="space-y-2">
                                        <img
                                            src={uploadedImageUrl}
                                            alt="Uploaded signature"
                                            className="max-h-28 mx-auto object-contain"
                                        />
                                        <p className="text-xs text-primary font-medium">Click to replace image</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5 py-4">
                                        <UploadCloud className="h-8 w-8 text-gray-400 mx-auto" />
                                        <p className="text-sm font-semibold text-gray-800">
                                            Click or drag to upload signature image
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            PNG, JPG or SVG with transparent or white background
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Signatory Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t">
                        <div className="space-y-1">
                            <Label className="text-xs font-semibold text-gray-700">
                                Full Signatory Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={signatoryName}
                                onChange={(e) => setSignatoryName(e.target.value)}
                                placeholder="e.g. Adv. Rajesh Sharma"
                                className="h-9 text-sm"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs font-semibold text-gray-700">
                                Designation / Role
                            </Label>
                            <Input
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                                placeholder="e.g. Authorized Signatory / Director"
                                className="h-9 text-sm"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs font-semibold text-gray-700">
                                Company / Firm (Optional)
                            </Label>
                            <Input
                                value={organization}
                                onChange={(e) => setOrganization(e.target.value)}
                                placeholder="e.g. Vidhik AI Legal Technologies"
                                className="h-9 text-sm"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs font-semibold text-gray-700">
                                Signing Date
                            </Label>
                            <Input
                                value={signingDate}
                                onChange={(e) => setSigningDate(e.target.value)}
                                className="h-9 text-sm"
                            />
                        </div>
                    </div>

                    {/* Options: Verification & Alignment */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 bg-slate-50 p-3 rounded-xl border">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-800">
                            <input
                                type="checkbox"
                                checked={includeVerification}
                                onChange={(e) => setIncludeVerification(e.target.checked)}
                                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                            />
                            <ShieldCheck className="h-4 w-4 text-emerald-600" />
                            <span>Add Vidhik AI Digital Verification Stamp & Audit ID</span>
                        </label>

                        {/* Alignment */}
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground mr-1">Position:</span>
                            <button
                                type="button"
                                onClick={() => setAlignment('left')}
                                className={`p-1.5 rounded border text-xs ${alignment === 'left' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                title="Align Left"
                            >
                                <AlignLeft className="h-3.5 w-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setAlignment('center')}
                                className={`p-1.5 rounded border text-xs ${alignment === 'center' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                title="Align Center"
                            >
                                <AlignCenter className="h-3.5 w-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setAlignment('right')}
                                className={`p-1.5 rounded border text-xs ${alignment === 'right' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                title="Align Right (Standard)"
                            >
                                <AlignRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="p-4 border-t bg-slate-50 flex items-center justify-end gap-2 shrink-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="text-xs h-9"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleInsert}
                        className="text-xs h-9 gap-1.5 bg-primary hover:bg-primary/90 text-white font-semibold shadow-sm"
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        Insert Digital Signature
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default DigitalSignatureModal;
