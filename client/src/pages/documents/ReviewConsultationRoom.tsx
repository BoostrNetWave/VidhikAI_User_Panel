import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Video, Mic, MicOff, VideoOff, ScreenShare, PhoneOff, 
    FileText, ArrowLeft, Download, ShieldCheck, Clock, 
    Lock, RefreshCcw, User, Eye, X,
    Sparkles, CheckCircle2, AlertCircle,
    Maximize2, Minimize2, PanelRightClose, PanelRightOpen, Shield,
    Wifi, Check
} from 'lucide-react';
import { toast } from 'sonner';
import { documentReviewService, IDocumentReviewRequest } from '@/services/documentReviewService';
import { getFileUrl, downloadFile, isWordFile, isPdfFile } from '@/lib/fileUtils';

export default function ReviewConsultationRoom() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const roleParam = searchParams.get('role');

    // User Profile & Role Detection
    const userProfile = (() => {
        try {
            return JSON.parse(localStorage.getItem('user_profile_data') || localStorage.getItem('vidhik_user_data') || '{}');
        } catch {
            return {};
        }
    })();
    const isLawyerOrAdmin = roleParam === 'lawyer' || (roleParam !== 'client' && (userProfile.role === 'admin' || userProfile.role === 'superadmin' || userProfile.role === 'lawyer'));
    const myRole: 'client' | 'lawyer' = roleParam === 'client' ? 'client' : (isLawyerOrAdmin ? 'lawyer' : 'client');
    const partnerRole: 'client' | 'lawyer' = isLawyerOrAdmin ? 'client' : 'lawyer';

    // Review Request Details
    const [reviewRequest, setReviewRequest] = useState<IDocumentReviewRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'doc' | 'notes'>('doc');
    const [docVersionTab, setDocVersionTab] = useState<'reviewed' | 'original'>('reviewed');
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);
    const [callDuration, setCallDuration] = useState<number>(0);

    // Call Toggles & Status
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isRemoteVideoActive, setIsRemoteVideoActive] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [hasJoinedCall, setHasJoinedCall] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // WebRTC Refs
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const processedCandidatesRef = useRef<Set<string>>(new Set());
    const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
    const lastAnsweredOfferSdp = useRef<string | null>(null);
    const pollTickCountRef = useRef<number>(0);

    const localVideoCallback = useCallback((node: HTMLVideoElement | null) => {
        (localVideoRef as any).current = node;
        if (node && localStream) {
            node.srcObject = localStream;
            node.play().catch(err => console.warn("Local video play blocked:", err));
        }
    }, [localStream]);

    const remoteVideoCallback = useCallback((node: HTMLVideoElement | null) => {
        (remoteVideoRef as any).current = node;
        if (node && remoteStream) {
            node.srcObject = remoteStream;
            node.play().catch(err => console.warn("Remote video play blocked:", err));
        }
    }, [remoteStream]);

    // Track active remote video stream tracks
    useEffect(() => {
        if (remoteStream) {
            const checkVideoTracks = () => {
                const videoTracks = remoteStream.getVideoTracks();
                setIsRemoteVideoActive(videoTracks.length > 0 && videoTracks[0].enabled);
            };
            checkVideoTracks();
            remoteStream.onaddtrack = checkVideoTracks;
            remoteStream.onremovetrack = checkVideoTracks;
            const interval = setInterval(checkVideoTracks, 1000);
            return () => clearInterval(interval);
        } else {
            setIsRemoteVideoActive(false);
        }
    }, [remoteStream]);

    // Timer for call duration
    useEffect(() => {
        let timer: any = null;
        if (isConnected) {
            timer = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isConnected]);

    // Fetch review request details
    const fetchReviewDetails = async () => {
        if (!id) return;
        try {
            const res = await documentReviewService.getRequestById(id);
            if (res.success && res.data) {
                setReviewRequest(res.data);
            }
        } catch (err) {
            console.error("Error fetching review request:", err);
            toast.error("Failed to load review request details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviewDetails();
        // Start local video preview on mount
        startLocalStream().catch(err => {
            console.warn("Could not acquire local stream on mount:", err);
        });

        return () => {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(t => t.stop());
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
        };
    }, [id]);

    // Start local media stream
    const startLocalStream = async (): Promise<MediaStream> => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: true
            });
            localStreamRef.current = stream;
            setLocalStream(stream);
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
                localVideoRef.current.play().catch(e => console.warn(e));
            }
            return stream;
        } catch (err) {
            console.warn("Could not acquire audio/video, trying audio only:", err);
            const audioStream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: true
            });
            localStreamRef.current = audioStream;
            setLocalStream(audioStream);
            setIsVideoMuted(true);
            return audioStream;
        }
    };

    // WebRTC PeerConnection creation with STUN/TURN
    const createPeerConnection = (stream: MediaStream): RTCPeerConnection => {
        const config: RTCConfiguration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478' },
                {
                    urls: [
                        'turn:openrelay.metered.ca:80',
                        'turn:openrelay.metered.ca:443',
                        'turn:openrelay.metered.ca:443?transport=tcp'
                    ],
                    username: 'openrelay',
                    credential: 'openrelay'
                }
            ],
            iceCandidatePoolSize: 10
        };

        const pc = new RTCPeerConnection(config);

        stream.getTracks().forEach(track => {
            pc.addTrack(track, stream);
        });

        pc.ontrack = (event) => {
            console.log(`[Review Call] ${myRole} received remote track:`, event.track.kind);
            const activeTracks = pc.getReceivers()
                .map(r => r.track)
                .filter(t => t && t.readyState === 'live');

            if (activeTracks.length > 0) {
                const newRemote = new MediaStream(activeTracks);
                setRemoteStream(newRemote);
                setIsConnected(true);
                setIsConnecting(false);
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = newRemote;
                    remoteVideoRef.current.play().catch(() => {});
                }
            }
        };

        pc.onicecandidate = (event) => {
            if (event.candidate && id) {
                documentReviewService.sendSignal(id, {
                    sender: myRole,
                    type: 'candidate',
                    candidate: JSON.stringify(event.candidate)
                }).catch(e => console.warn('ICE candidate dispatch error:', e));
            }
        };

        pc.oniceconnectionstatechange = () => {
            const state = pc.iceConnectionState;
            console.log(`[Review Call] ${myRole} ICE Connection State:`, state);
            if (state === 'connected' || state === 'completed') {
                setIsConnected(true);
                setIsConnecting(false);
            } else if (state === 'disconnected' || state === 'failed' || state === 'closed') {
                setIsConnected(false);
            }
        };

        peerConnectionRef.current = pc;
        return pc;
    };

    // Join & Initiate Video Call
    const handleStartCall = async () => {
        if (!id) return;
        try {
            setIsConnecting(true);
            setHasJoinedCall(true);

            // Announce join to server
            await documentReviewService.joinMeeting(id);

            let stream = localStreamRef.current;
            if (!stream) {
                stream = await startLocalStream();
            }

            const pc = createPeerConnection(stream);

            // If lawyer/admin, initiate WebRTC Offer
            if (myRole === 'lawyer') {
                console.log("[Review Call] Lawyer initiating WebRTC offer...");
                const offer = await pc.createOffer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true
                });
                await pc.setLocalDescription(offer);

                await documentReviewService.sendSignal(id, {
                    sender: 'lawyer',
                    type: 'offer',
                    sdp: offer.sdp
                });
            } else {
                // Client sends presence join signal
                await documentReviewService.sendSignal(id, {
                    sender: 'client',
                    type: 'join',
                    sdp: 'Client entered room'
                });
            }

            // Start signaling polling loop
            startSignalingPoll(pc);
            toast.success("Joined video consultation room. Connecting with advocate...");
        } catch (err: any) {
            console.error("Error starting video call:", err);
            setIsConnecting(false);
            setHasJoinedCall(false);
            toast.error("Could not access camera/microphone. Please allow browser permissions.");
        }
    };

    // Polling Signaling Loop (every 1s)
    const startSignalingPoll = (pc: RTCPeerConnection) => {
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

        const flushCandidates = async () => {
            if (!pc.remoteDescription || !pc.remoteDescription.type) return;
            while (pendingCandidatesRef.current.length > 0) {
                const cand = pendingCandidatesRef.current.shift();
                if (cand) {
                    try {
                        await pc.addIceCandidate(new RTCIceCandidate(cand));
                    } catch (_) {}
                }
            }
        };

        pollingIntervalRef.current = setInterval(async () => {
            if (!id) return;
            pollTickCountRef.current = (pollTickCountRef.current || 0) + 1;

            try {
                const res = await documentReviewService.getSignals(id);
                const signals = res.data || [];

                for (const signal of signals) {
                    // Ignore signals generated by myself
                    if (signal.sender === myRole) continue;

                    // 1. Client handles Offer from Lawyer
                    if (myRole === 'client' && signal.type === 'offer' && signal.sdp) {
                        if (lastAnsweredOfferSdp.current === signal.sdp) continue;
                        lastAnsweredOfferSdp.current = signal.sdp;
                        console.log("[Review Call] Client received Offer from Lawyer. Generating Answer...");

                        await pc.setRemoteDescription(new RTCSessionDescription({
                            type: 'offer',
                            sdp: signal.sdp
                        }));

                        await flushCandidates();

                        const answer = await pc.createAnswer();
                        await pc.setLocalDescription(answer);

                        await documentReviewService.sendSignal(id, {
                            sender: 'client',
                            type: 'answer',
                            sdp: answer.sdp
                        });
                    }

                    // 2. Lawyer handles Answer from Client
                    if (myRole === 'lawyer' && signal.type === 'answer' && signal.sdp) {
                        if (pc.signalingState === 'have-local-offer') {
                            console.log("[Review Call] Lawyer received Answer from Client. Setting remote description...");
                            await pc.setRemoteDescription(new RTCSessionDescription({
                                type: 'answer',
                                sdp: signal.sdp
                            }));
                            await flushCandidates();
                        }
                    }

                    // 3. Lawyer handles presence 'join' from Client (re-dispatch offer if not connected)
                    if (myRole === 'lawyer' && signal.type === 'join') {
                        if (pc.iceConnectionState !== 'connected' && pc.iceConnectionState !== 'completed') {
                            if (pc.localDescription && pc.localDescription.type === 'offer') {
                                console.log("[Review Call] Client announced presence. Resending offer...");
                                await documentReviewService.sendSignal(id, {
                                    sender: 'lawyer',
                                    type: 'offer',
                                    sdp: pc.localDescription.sdp
                                });
                            }
                        }
                    }

                    // 4. Both handle ICE candidates
                    if (signal.type === 'candidate' && signal.candidate) {
                        const candKey = `${signal.sender}-${signal.candidate.slice(0, 40)}`;
                        if (!processedCandidatesRef.current.has(candKey)) {
                            processedCandidatesRef.current.add(candKey);
                            try {
                                const parsed = JSON.parse(signal.candidate);
                                if (parsed && parsed.candidate) {
                                    if (pc.remoteDescription && pc.remoteDescription.type) {
                                        await pc.addIceCandidate(new RTCIceCandidate(parsed));
                                    } else {
                                        pendingCandidatesRef.current.push(parsed);
                                    }
                                }
                            } catch (e) {
                                // Candidate add error ignore
                            }
                        }
                    }
                }
            } catch (pollErr) {
                // Ignore transient polling network glitches
            }
        }, 1200);
    };

    // Mic Toggle
    const handleToggleAudio = () => {
        if (localStreamRef.current) {
            const audioTracks = localStreamRef.current.getAudioTracks();
            if (audioTracks.length > 0) {
                const nextState = !audioTracks[0].enabled;
                audioTracks[0].enabled = nextState;
                setIsAudioMuted(!nextState);
                toast.info(nextState ? "Microphone Unmuted" : "Microphone Muted");
            }
        }
    };

    // Camera Toggle
    const handleToggleVideo = () => {
        if (localStreamRef.current) {
            const videoTracks = localStreamRef.current.getVideoTracks();
            if (videoTracks.length > 0) {
                const nextState = !videoTracks[0].enabled;
                videoTracks[0].enabled = nextState;
                setIsVideoMuted(!nextState);
                toast.info(nextState ? "Camera Turned On" : "Camera Turned Off");
            }
        }
    };

    // Screen Sharing Toggle
    const handleToggleScreenShare = async () => {
        const pc = peerConnectionRef.current;
        if (!isScreenSharing) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                const screenTrack = screenStream.getVideoTracks()[0];

                if (pc) {
                    const videoSender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
                    if (videoSender) {
                        videoSender.replaceTrack(screenTrack);
                    }
                }

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = screenStream;
                }

                screenTrack.onended = () => {
                    handleStopScreenShare();
                };

                setIsScreenSharing(true);
                toast.success("Sharing your screen");
            } catch (err) {
                console.warn("Screen share cancelled/denied:", err);
            }
        } else {
            handleStopScreenShare();
        }
    };

    const handleStopScreenShare = async () => {
        const pc = peerConnectionRef.current;
        const webcamStream = localStreamRef.current;
        if (webcamStream) {
            const webcamTrack = webcamStream.getVideoTracks()[0];
            if (pc && webcamTrack) {
                const videoSender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
                if (videoSender) {
                    videoSender.replaceTrack(webcamTrack);
                }
            }
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = webcamStream;
            }
        }
        setIsScreenSharing(false);
        toast.info("Stopped sharing screen");
    };

    // End / Leave Call
    const handleLeaveCall = async () => {
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(t => t.stop());
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
        if (id) {
            documentReviewService.clearSignals(id).catch(() => {});
        }
        setIsConnected(false);
        setHasJoinedCall(false);
        setRemoteStream(null);
        toast.info("Left the consultation room");
        handleGoBack();
    };

    const handleGoBack = () => {
        if (isLawyerOrAdmin) {
            navigate('/admin/document-reviews');
        } else if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/documents/workspace');
        }
    };

    // Download revised file safely via fileUtils
    const handleDownloadRevisedDoc = async () => {
        if (!reviewRequest?.reviewedDocumentFile) {
            toast.error("No revised file attached.");
            return;
        }
        try {
            setIsDownloading(true);
            toast.info("Downloading revised document file...");
            const url = getFileUrl(reviewRequest.reviewedDocumentFile);
            await downloadFile(url, reviewRequest.reviewedDocumentFileName || 'revised_agreement.docx');
            toast.success("Downloaded successfully!");
        } catch (err) {
            console.error("Download error:", err);
            window.open(getFileUrl(reviewRequest.reviewedDocumentFile), '_blank');
        } finally {
            setIsDownloading(false);
        }
    };

    const formatSeconds = (totalSec: number) => {
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400 flex items-center justify-center animate-pulse">
                    <Video className="h-6 w-6 text-indigo-400" />
                </div>
                <p className="text-sm font-semibold tracking-wide">Initializing Legal Review Consultation Room...</p>
            </div>
        );
    }

    const partnerName = isLawyerOrAdmin
        ? (reviewRequest?.userName || 'Client')
        : (reviewRequest?.assignedLawyerName || 'Senior Advocate');

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col overflow-hidden select-none font-sans">
            {/* Top Navigation Bar */}
            <header className="h-16 px-4 sm:px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-20 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleGoBack}
                        className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl shrink-0"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-[200px] sm:max-w-md">
                                {reviewRequest?.documentTitle || 'Document Review'}
                            </h1>
                            <Badge className="text-[10px] bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-2 py-0.5">
                                #{reviewRequest?.requestId || 'REVIEW'}
                            </Badge>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                            {isLawyerOrAdmin ? `Client: ${partnerName}` : `Consultation with ${partnerName}`} &bull; Free Document Review Consultation Room
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {isConnected ? (
                        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full text-emerald-400 text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>{formatSeconds(callDuration)}</span>
                            <span className="hidden sm:inline text-slate-500">|</span>
                            <span className="hidden sm:inline text-[11px] text-emerald-300/80">Encrypted</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full text-amber-400 text-xs font-medium">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                            <span className="hidden sm:inline">Waiting for partner...</span>
                            <span className="sm:hidden">Waiting...</span>
                        </div>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
                        className="h-9 text-xs gap-1.5 border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200"
                    >
                        {isWorkspaceOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
                        <span className="hidden md:inline">{isWorkspaceOpen ? "Hide Document" : "Show Document"}</span>
                    </Button>
                </div>
            </header>

            {/* Main Stage & Collaboration Panel Split */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Left: Video Area Stage */}
                <div className="flex-1 flex flex-col items-center justify-between p-4 sm:p-6 relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
                    {/* Stage Center: Remote Video or Partner Card */}
                    <div className="w-full flex-1 max-w-5xl rounded-3xl overflow-hidden bg-slate-900/60 border border-slate-800 flex items-center justify-center relative shadow-2xl">
                        {remoteStream && isRemoteVideoActive ? (
                            <video
                                ref={remoteVideoCallback}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-center space-y-4 p-6">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 mx-auto flex items-center justify-center text-white text-3xl font-extrabold shadow-xl ring-4 ring-indigo-500/20">
                                    {partnerName.charAt(0).toUpperCase()}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-white">{partnerName}</h3>
                                    <p className="text-xs text-slate-400">
                                        {isConnected 
                                            ? "Connected (Voice Only / Camera is Off)" 
                                            : hasJoinedCall 
                                                ? `Waiting for ${partnerName} to enter this room...` 
                                                : "Click 'Start Video Consultation' below to connect"}
                                    </p>
                                </div>
                                {!hasJoinedCall && (
                                    <Button
                                        onClick={handleStartCall}
                                        disabled={isConnecting}
                                        className="h-11 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg gap-2 mt-2"
                                    >
                                        <Video className="h-4 w-4" />
                                        <span>Start Video Consultation</span>
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Floating Local PIP (Picture in Picture) */}
                        <div className="absolute top-4 right-4 w-36 sm:w-48 h-24 sm:h-32 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700 shadow-2xl z-10 flex items-center justify-center">
                            {localStream && !isVideoMuted ? (
                                <video
                                    ref={localVideoCallback}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover transform -scale-x-100"
                                />
                            ) : (
                                <div className="text-center">
                                    <User className="h-6 w-6 text-slate-400 mx-auto" />
                                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">Camera Off</span>
                                </div>
                            )}
                            <span className="absolute bottom-1.5 left-2 bg-black/60 backdrop-blur-xs text-[9px] font-bold px-2 py-0.5 rounded-full text-slate-200">
                                You ({myRole})
                            </span>
                        </div>

                        {/* Top Left Watermark */}
                        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-slate-300 text-[11px] font-semibold">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Vidhik AI Review Meet</span>
                        </div>
                    </div>

                    {/* Bottom Controls Floating Dock */}
                    <div className="h-18 w-full max-w-xl mx-auto flex items-center justify-center gap-3 sm:gap-4 px-6 py-2.5 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 shadow-2xl z-20 mt-4">
                        <Button
                            variant={isAudioMuted ? "destructive" : "secondary"}
                            size="icon"
                            onClick={handleToggleAudio}
                            className="h-12 w-12 rounded-2xl transition-all shadow-sm"
                            title={isAudioMuted ? "Unmute Microphone" : "Mute Microphone"}
                        >
                            {isAudioMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </Button>

                        <Button
                            variant={isVideoMuted ? "destructive" : "secondary"}
                            size="icon"
                            onClick={handleToggleVideo}
                            className="h-12 w-12 rounded-2xl transition-all shadow-sm"
                            title={isVideoMuted ? "Turn On Camera" : "Turn Off Camera"}
                        >
                            {isVideoMuted ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                        </Button>

                        <Button
                            variant={isScreenSharing ? "default" : "secondary"}
                            size="icon"
                            onClick={handleToggleScreenShare}
                            className={`h-12 w-12 rounded-2xl transition-all shadow-sm ${isScreenSharing ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`}
                            title={isScreenSharing ? "Stop Screen Share" : "Share Your Screen"}
                        >
                            <ScreenShare className="h-5 w-5" />
                        </Button>

                        {/* Reconnect button */}
                        {hasJoinedCall && (
                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={() => handleStartCall()}
                                className="h-12 w-12 rounded-2xl transition-all shadow-sm text-slate-300 hover:text-white"
                                title="Refresh Call Connection"
                            >
                                <RefreshCcw className="h-5 w-5" />
                            </Button>
                        )}

                        {/* End / Leave Call Button */}
                        <Button
                            variant="destructive"
                            onClick={handleLeaveCall}
                            className="h-12 px-6 rounded-2xl font-bold text-xs gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30"
                        >
                            <PhoneOff className="h-4 w-4" />
                            <span>Leave Call</span>
                        </Button>
                    </div>
                </div>

                {/* Right: Collaborative Document Review Panel */}
                {isWorkspaceOpen && (
                    <div className="w-full sm:w-[420px] lg:w-[480px] bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 z-10 transition-all">
                        {/* Panel Header Tabs */}
                        <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                            <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl">
                                <button
                                    onClick={() => setActiveTab('doc')}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'doc' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <FileText className="h-3.5 w-3.5" />
                                    <span>Document Draft</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('notes')}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'notes' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    <span>Review Summary</span>
                                </button>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsWorkspaceOpen(false)}
                                className="h-8 w-8 text-slate-400 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Panel Content Body */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {activeTab === 'doc' ? (
                                <div className="space-y-4">
                                    {/* Download Revised File Card (if lawyer attached one) */}
                                    {reviewRequest?.reviewedDocumentFile && (
                                        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/50 via-purple-900/30 to-indigo-900/50 border border-indigo-700/50 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                                                        {isPdfFile(reviewRequest.reviewedDocumentFileName) ? 'PDF' : 'DOC'}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-bold text-white truncate max-w-[200px]">
                                                            {reviewRequest.reviewedDocumentFileName || 'revised_agreement.docx'}
                                                        </h4>
                                                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                                                            <CheckCircle2 className="h-3 w-3" /> Lawyer Verified Document
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={handleDownloadRevisedDoc}
                                                disabled={isDownloading}
                                                className="w-full h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 shadow-xs"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                <span>Download Revised File</span>
                                            </Button>
                                        </div>
                                    )}

                                    {/* Document Clauses Text Preview */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                                            <span>Document Preview</span>
                                            {reviewRequest?.reviewedContent && (
                                                <div className="flex items-center gap-1 bg-slate-800/90 p-0.5 rounded-lg border border-slate-700">
                                                    <button
                                                        type="button"
                                                        onClick={() => setDocVersionTab('reviewed')}
                                                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${docVersionTab === 'reviewed' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
                                                    >
                                                        ⚖️ Lawyer Revised
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDocVersionTab('original')}
                                                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${docVersionTab === 'original' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
                                                    >
                                                        📄 Original Draft
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-serif text-slate-300 leading-relaxed max-h-[500px] overflow-y-auto space-y-2">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: (docVersionTab === 'reviewed' && reviewRequest?.reviewedContent)
                                                        ? reviewRequest.reviewedContent
                                                        : (reviewRequest?.originalContent || reviewRequest?.reviewedContent || '<p>No document content available.</p>')
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Lawyer Review Summary */}
                                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                            <Sparkles className="h-3.5 w-3.5" />
                                            <span>Lawyer Review Summary &amp; Advice</span>
                                        </div>
                                        <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                                            {reviewRequest?.reviewSummary || (reviewRequest?.status === 'in_review' ? 'Senior Advocate is actively evaluating and amending your document clauses. Live discussion is underway.' : 'Awaiting review delivery.')}
                                        </p>
                                    </div>

                                    {/* Client Original Instructions */}
                                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                                            <AlertCircle className="h-3.5 w-3.5" />
                                            <span>Client Review Instructions</span>
                                        </div>
                                        <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                                            {reviewRequest?.userNotes || 'No specific notes provided.'}
                                        </p>
                                    </div>

                                    {/* Fee & Payment Details */}
                                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                                        <div className="flex justify-between items-center text-slate-400">
                                            <span>Review Fee Paid:</span>
                                            <span className="font-bold text-emerald-400">₹{reviewRequest?.quoteAmount?.toLocaleString('en-IN') || '0'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-400">
                                            <span>Client Contact:</span>
                                            <span className="text-slate-200">{reviewRequest?.userPhone || reviewRequest?.userEmail}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-400">
                                            <span>Status:</span>
                                            <Badge className="text-[10px] px-2 py-0.5 capitalize bg-slate-800 text-slate-300 border-none">
                                                {reviewRequest?.status?.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

