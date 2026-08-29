import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import { caseService, ICase } from '@/services/caseService';
import { 
    Video, Mic, MicOff, VideoOff, ScreenShare, PhoneOff, 
    FileText, ArrowLeft, Download, ShieldCheck, Clock, ExternalLink,
    Lock, RefreshCcw
} from 'lucide-react';
import { toast } from 'sonner';

export default function ConsultationMeeting() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    // WebRTC Refs
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const processedCandidatesRef = useRef<Set<string>>(new Set());
    const lastAnsweredOfferSdp = useRef<string | null>(null);

    // Case Details States
    const [caseData, setCaseData] = useState<ICase | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'details' | 'docs'>('details');


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
            return () => {
                clearInterval(interval);
            };
        } else {
            setIsRemoteVideoActive(false);
        }
    }, [remoteStream]);

    const fetchCaseDetails = async () => {
        try {
            const data = await caseService.getCaseById(id!);
            setCaseData(data);
        } catch (err) {
            console.error("Error refreshing case data:", err);
        }
    };

    // Initialize media stream
    const startLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: { ideal: "user" }
                }
            });
            localStreamRef.current = stream;
            setLocalStream(stream);
            return stream;
        } catch (err) {
            console.warn("Could not acquire both audio/video tracks, trying audio only...", err);
            try {
                const audioOnlyStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false
                });
                localStreamRef.current = audioOnlyStream;
                setLocalStream(audioOnlyStream);
                setIsVideoMuted(true);
                return audioOnlyStream;
            } catch (audioErr) {
                console.error("Could not acquire audio track either:", audioErr);
                toast.error("Could not access camera or microphone. Please check permissions.");
                throw audioErr;
            }
        }
    };

    // Set up WebRTC connection
    const setupPeerConnection = (stream: MediaStream) => {
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' }
            ]
        });

        // Add local tracks to RTCPeerConnection
        stream.getTracks().forEach(track => {
            pc.addTrack(track, stream);
        });

        // Send local ICE candidates to backend
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                caseService.sendSignal(id!, {
                    sender: 'client',
                    type: 'candidate',
                    candidate: JSON.stringify(event.candidate)
                }).catch(err => console.error("Error sending client candidate:", err));
            }
        };

        // Capture remote stream tracks
        pc.ontrack = (event) => {
            console.log("Client received remote track:", event.track.kind);
            
            // Collect all remote tracks from receivers
            const remoteTracks = pc.getReceivers()
                .map(r => r.track)
                .filter(t => t && t.readyState === 'live');
            
            console.log("Client active remote tracks count:", remoteTracks.length);
            if (remoteTracks.length > 0) {
                setRemoteStream(new MediaStream(remoteTracks));
                setIsConnected(true);
                setIsConnecting(false);
            }
        };

        pc.oniceconnectionstatechange = () => {
            const state = pc.iceConnectionState;
            console.log("Client ICE Connection State:", state);
            if (state === 'connected' || state === 'completed') {
                setIsConnected(true);
                setIsConnecting(false);
            } else if (state === 'disconnected' || state === 'failed' || state === 'closed') {
                setIsConnected(false);
                setRemoteStream(null);
            }
        };

        peerConnectionRef.current = pc;
        return pc;
    };

    // Polling Signaling Channel
    const startPolling = () => {
        const poll = async () => {
            const pc = peerConnectionRef.current;
            if (!pc) return;
            try {
                const signals = await caseService.getSignals(id!);
                const remoteSignals = signals.filter(s => s.sender === 'lawyer');

                // 1. Process Offer from Lawyer (with session reset capability)
                const offerSignal = remoteSignals.find(s => s.type === 'offer');
                if (offerSignal && offerSignal.sdp !== lastAnsweredOfferSdp.current) {
                    console.log("Client detecting new remote offer. Resetting peer connection...");
                    lastAnsweredOfferSdp.current = offerSignal.sdp;
                    processedCandidatesRef.current.clear();
                    setIsConnected(false);
                    setIsConnecting(true);

                    // Close old connection if existing
                    const activePc = peerConnectionRef.current;
                    if (activePc) {
                        activePc.close();
                    }

                    // Re-setup peer connection
                    const newPc = setupPeerConnection(localStreamRef.current!);

                    console.log("Client setting remote description...");
                    await newPc.setRemoteDescription(new RTCSessionDescription({
                        type: 'offer',
                        sdp: offerSignal.sdp
                    }));

                    console.log("Client creating answer...");
                    const answer = await newPc.createAnswer();
                    await newPc.setLocalDescription(answer);

                    await caseService.sendSignal(id!, {
                        sender: 'client',
                        type: 'answer',
                        sdp: answer.sdp
                    });
                    console.log("Client answer sent.");
                    return; // Yield this poll tick
                }

                // 2. Process Candidates from Lawyer
                const candidateSignals = remoteSignals.filter(s => s.type === 'candidate');
                for (const signal of candidateSignals) {
                    if (signal._id && !processedCandidatesRef.current.has(signal._id)) {
                        if (!pc.remoteDescription || !pc.remoteDescription.type) {
                            // Delay candidate processing until remote offer description is set
                            continue;
                        }
                        processedCandidatesRef.current.add(signal._id);
                        try {
                            const candidateObj = JSON.parse(signal.candidate);
                            if (candidateObj) {
                                await pc.addIceCandidate(new RTCIceCandidate(candidateObj));
                                console.log("Client added remote candidate successfully");
                            }
                        } catch (iceErr) {
                            console.error("Error adding client ICE candidate:", iceErr);
                        }
                    }
                }
            } catch (err) {
                console.error("Error in client signaling poll:", err);
            }
        };

        // Poll immediately and then every 1.5 seconds
        poll();
        pollingIntervalRef.current = setInterval(poll, 1500);
    };

    const startCall = () => {
        setHasJoinedCall(true);
        try {
            setupPeerConnection(localStreamRef.current!);
            startPolling();
        } catch (err) {
            console.error(err);
            toast.error("Failed to establish video call connection");
        }
    };

    useEffect(() => {
        const initMeeting = async () => {
            try {
                setLoading(true);
                const data = await caseService.getCaseById(id!);
                setCaseData(data);
                
                // Let backend know client has joined consultation
                await caseService.joinMeeting(id!);

                // Initialize WebRTC Preview
                await startLocalStream();

            } catch (err) {
                console.error(err);
                toast.error("Failed to initialize video consultation");
            } finally {
                setLoading(false);
            }
        };

        initMeeting();

        return () => {
            // Cleanup WebRTC connection
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
        };
    }, [id]);

    const handleToggleAudio = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioMuted(!audioTrack.enabled);
                toast.success(audioTrack.enabled ? "Microphone active" : "Microphone muted");
            }
        }
    };

    const handleToggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoMuted(!videoTrack.enabled);
                toast.success(videoTrack.enabled ? "Camera active" : "Camera turned off");
            }
        }
    };

    const handleShareScreen = async () => {
        if (!isConnected) {
            toast.error("Please wait for the Advocate to connect before sharing screen");
            return;
        }

        try {
            if (isScreenSharing) {
                // Restore camera track
                const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
                const cameraTrack = cameraStream.getVideoTracks()[0];
                const sender = peerConnectionRef.current
                    ?.getSenders()
                    .find(s => s.track?.kind === 'video');

                if (sender && cameraTrack) {
                    await sender.replaceTrack(cameraTrack);
                    
                    // Stop current screen track
                    const oldVideoTrack = localStreamRef.current?.getVideoTracks()[0];
                    if (oldVideoTrack) oldVideoTrack.stop();

                    localStreamRef.current?.removeTrack(oldVideoTrack!);
                    localStreamRef.current?.addTrack(cameraTrack);
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = localStreamRef.current;
                    }
                    setIsScreenSharing(false);
                    toast.success("Stopped sharing screen");
                }
            } else {
                // Prompt screen share
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                const screenTrack = screenStream.getVideoTracks()[0];
                const sender = peerConnectionRef.current
                    ?.getSenders()
                    .find(s => s.track?.kind === 'video');

                if (sender && screenTrack) {
                    await sender.replaceTrack(screenTrack);

                    screenTrack.onended = () => {
                        handleStopScreenShareExplicitly();
                    };

                    const oldVideoTrack = localStreamRef.current?.getVideoTracks()[0];
                    if (oldVideoTrack) oldVideoTrack.stop();

                    localStreamRef.current?.removeTrack(oldVideoTrack!);
                    localStreamRef.current?.addTrack(screenTrack);
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = localStreamRef.current;
                    }
                    setIsScreenSharing(true);
                    toast.success("Sharing screen");
                }
            }
        } catch (err) {
            console.error("Screen share error:", err);
            toast.error("Failed to share screen");
        }
    };

    const handleStopScreenShareExplicitly = async () => {
        try {
            const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
            const cameraTrack = cameraStream.getVideoTracks()[0];
            const sender = peerConnectionRef.current
                ?.getSenders()
                .find(s => s.track?.kind === 'video');

            if (sender && cameraTrack) {
                await sender.replaceTrack(cameraTrack);
                
                const oldVideoTrack = localStreamRef.current?.getVideoTracks()[0];
                if (oldVideoTrack) oldVideoTrack.stop();

                localStreamRef.current?.removeTrack(oldVideoTrack!);
                localStreamRef.current?.addTrack(cameraTrack);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = localStreamRef.current;
                }
                setIsScreenSharing(false);
            }
        } catch (err) {
            console.error("Error restoring camera track:", err);
        }
    };

    const handleDisconnect = () => {
        // Clear signals from database for cleanup
        caseService.clearSignals(id!).catch(err => console.error(err));
        navigate('/cases');
    };

    if (loading) {
        return (
            <DashboardLayout userNav={<UserNav />}>
                <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 font-sans">
                    <div className="h-12 w-12 border-4 border-violet-750 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground font-bold">Connecting to secure consultation channel...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!caseData) {
        return (
            <DashboardLayout userNav={<UserNav />}>
                <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 font-sans">
                    <h3 className="text-xl font-bold text-foreground">Consultation Case Not Found</h3>
                    <Button onClick={() => navigate('/cases')} className="bg-primary text-white rounded-xl">
                        Back to Cases
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const sharedDocs = caseData.milestones.flatMap((m) => m.proofDocs || []);

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <button
                        onClick={handleDisconnect}
                        className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-all group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Exit Consultation View
                    </button>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-inner">
                        <Lock className="w-4 h-4 text-primary" />
                        Secure Encrypted Consultation Room
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[75vh]">
                    {/* Left Column: Video call frame (8 Cols) */}
                    <div className="lg:col-span-8 flex flex-col bg-[#0F172A] rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative">
                        {/* Consultation Status Bar */}
                        <div className="bg-[#1E293B]/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-b border-slate-800 z-10">
                            <div className="flex items-center gap-3">
                                <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-amber-500 animate-ping'}`}></div>
                                <span className="text-white font-extrabold text-sm tracking-tight">{caseData.title}</span>
                                <span className="text-[10px] text-slate-400 bg-[#0F172A] border border-slate-850 px-2 py-0.5 rounded-md font-semibold">
                                    {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Waiting'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 bg-[#0F172A] px-3 py-1 rounded-lg border border-slate-800 text-[11px] font-bold text-slate-400">
                                <Clock className="w-3.5 h-3.5 text-primary" />
                                Active Session
                            </div>
                        </div>

                        {/* WebRTC Video Grid Container */}
                        <div className="flex-1 w-full relative bg-slate-950 flex items-center justify-center overflow-hidden">
                            {!hasJoinedCall ? (
                                <div className="flex flex-col items-center justify-center p-8 space-y-6 w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl mx-4 z-20">
                                    <div className="space-y-1.5 text-center">
                                        <h3 className="text-white font-extrabold text-lg tracking-tight">Ready to join?</h3>
                                        <p className="text-xs text-slate-400 font-semibold">Check your audio and video before entering the room.</p>
                                    </div>

                                    {/* Local Camera Preview in Lobby */}
                                    <div className="w-full h-48 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden relative flex items-center justify-center shadow-inner">
                                        {isVideoMuted ? (
                                            <div className="flex flex-col items-center text-slate-500 space-y-1">
                                                <VideoOff className="w-8 h-8" />
                                                <span className="text-[10px] font-bold">Camera off</span>
                                            </div>
                                        ) : (
                                            <video
                                                ref={localVideoCallback}
                                                autoPlay
                                                playsInline
                                                muted
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        
                                        {/* Mic/Video quick toggles in preview */}
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3 bg-black/60 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10">
                                            <button
                                                onClick={handleToggleAudio}
                                                className={`p-1.5 rounded-full transition-colors ${isAudioMuted ? 'text-red-500 hover:bg-red-500/20' : 'text-white hover:bg-white/20'}`}
                                            >
                                                {isAudioMuted ? <MicOff size={16} /> : <Mic size={16} />}
                                            </button>
                                            <button
                                                onClick={handleToggleVideo}
                                                className={`p-1.5 rounded-full transition-colors ${isVideoMuted ? 'text-red-500 hover:bg-red-500/20' : 'text-white hover:bg-white/20'}`}
                                            >
                                                {isVideoMuted ? <VideoOff size={16} /> : <Video size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={startCall}
                                        className="w-full py-3 bg-primary hover:bg-primary/95 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all active:scale-[0.98]"
                                    >
                                        Join Consultation Room
                                    </button>
                                </div>
                            ) : (
                                /* Remote Video (Full Screen / Large) */
                                remoteStream ? (
                                    <>
                                        <video
                                            ref={remoteVideoCallback}
                                            autoPlay
                                            playsInline
                                            className={`w-full h-full object-cover transition-opacity duration-500 ${
                                                isRemoteVideoActive ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'
                                            }`}
                                        />
                                        
                                        {/* Remote Camera Off Placeholder */}
                                        {!isRemoteVideoActive && (
                                            <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 animate-in fade-in duration-300">
                                                <div className="h-24 w-24 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 text-3xl font-bold shadow-xl">
                                                    {caseData.lawyer?.fullName?.split(' ').map((n: string) => n[0]).join('') || 'ADV'}
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-white font-extrabold text-base tracking-tight">
                                                        {caseData.lawyer?.fullName || 'Advocate'}
                                                    </h4>
                                                    <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 justify-center">
                                                        <VideoOff className="w-3.5 h-3.5 text-red-500" /> Camera is turned off / busy
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    /* Waiting Overlay */
                                    <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 animate-pulse">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-primary/90/20 rounded-full blur-xl animate-ping"></div>
                                            <div className="relative h-20 w-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-primary/80">
                                                <Video className="w-10 h-10 animate-bounce" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <h4 className="text-white font-extrabold text-base tracking-tight">
                                                Waiting for Advocate to join...
                                            </h4>
                                            <p className="text-xs text-slate-400 max-w-xs font-semibold">
                                                Once the Advocate enters this encrypted channel, the call session will start automatically.
                                            </p>
                                        </div>
                                    </div>
                                )
                            )}

                            {/* Local Video Picture-in-Picture (PiP) */}
                            {hasJoinedCall && (
                                <div className="absolute bottom-4 right-4 w-40 h-28 sm:w-48 sm:h-36 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl z-20 group transition-all duration-300 hover:scale-[1.03]">
                                    {isVideoMuted ? (
                                        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500">
                                            <VideoOff className="w-6 h-6" />
                                        </div>
                                    ) : (
                                        <video
                                            ref={localVideoCallback}
                                            autoPlay
                                            playsInline
                                            muted
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    {/* Local Stream Status Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent p-2.5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <div className="flex justify-end">
                                            <span className="bg-black/60 backdrop-blur-sm text-[9px] font-bold text-white px-2 py-0.5 rounded-lg border border-white/10">
                                                You
                                            </span>
                                        </div>
                                        <div className="flex gap-1.5 justify-center">
                                            {isAudioMuted && (
                                                <span className="p-1 bg-red-500/80 rounded-lg text-white">
                                                    <MicOff className="w-3.5 h-3.5" />
                                                </span>
                                            )}
                                            {isVideoMuted && (
                                                <span className="p-1 bg-red-500/80 rounded-lg text-white">
                                                    <VideoOff className="w-3.5 h-3.5" />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Meeting Control Bar */}
                        {hasJoinedCall && (
                            <div className="bg-[#1E293B] border-t border-slate-800 px-6 py-4 flex items-center justify-center gap-4 z-10">
                                <button
                                    onClick={handleToggleAudio}
                                    className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all ${
                                        isAudioMuted 
                                        ? 'bg-red-500/10 border-red-500 text-red-500' 
                                        : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                                    }`}
                                    title={isAudioMuted ? "Unmute Mic" : "Mute Mic"}
                                >
                                    {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </button>

                                <button
                                    onClick={handleToggleVideo}
                                    className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all ${
                                        isVideoMuted 
                                        ? 'bg-red-500/10 border-red-500 text-red-500' 
                                        : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                                    }`}
                                    title={isVideoMuted ? "Start Video" : "Stop Video"}
                                >
                                    {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                                </button>

                                <button
                                    onClick={handleShareScreen}
                                    className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all ${
                                        isScreenSharing
                                        ? 'bg-violet-650 bg-primary border-primary text-white'
                                        : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                                    }`}
                                    title="Share Screen"
                                >
                                    <ScreenShare className="w-5 h-5" />
                                </button>

                                <div className="w-px h-8 bg-slate-800 mx-2" />

                                <button
                                    onClick={handleDisconnect}
                                    className="h-12 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/10 active:scale-[0.98]"
                                    title="End Call"
                                >
                                    <PhoneOff className="w-5 h-5" />
                                    End Call
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Interaction panel (4 Cols) */}
                    <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-full">
                        {/* Tab header */}
                        <div className="bg-slate-50 border-b border-slate-200 flex items-center justify-start p-1.5 h-14">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`flex-1 rounded-xl text-xs font-bold transition-all h-full flex items-center justify-center ${
                                    activeTab === 'details' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                Consultation Brief
                            </button>
                            <button
                                onClick={() => setActiveTab('docs')}
                                className={`flex-1 rounded-xl text-xs font-bold transition-all h-full flex items-center justify-center ${
                                    activeTab === 'docs' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                Shared Documents ({sharedDocs.length + (caseData.meetingSummaryUrl ? 1 : 0)})
                            </button>
                        </div>

                        {/* Tab content area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {activeTab === 'details' ? (
                                <div className="space-y-6 animate-in fade-in duration-200">
                                    <div className="space-y-1.5">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Advocate Assigned</span>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400">
                                                <ShieldCheck className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-slate-900 text-sm leading-none">{caseData.lawyer?.fullName}</h4>
                                                <p className="text-[10px] text-primary font-extrabold uppercase mt-1">{caseData.lawyer?.expertise || "General Counsel"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Consultation Description</span>
                                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                                            {caseData.description}
                                        </p>
                                    </div>

                                    {caseData.bookingDate && (
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheduled consultation</span>
                                            <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold text-slate-700">
                                                <Clock className="w-4 h-4 text-primary" />
                                                <span>
                                                    {new Date(caseData.bookingDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} • {caseData.bookingTime}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Meeting Summary Section */}
                                    <div className="border-t border-slate-100 pt-6 space-y-4">
                                        <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Meeting Summary Document</h4>
                                        {caseData.meetingSummaryUrl ? (
                                            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl space-y-3 shadow-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600">
                                                        <FileText size={16} />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-bold text-emerald-950 text-xs truncate max-w-[180px]">{caseData.meetingSummaryName}</h5>
                                                        <p className="text-[9px] text-emerald-700 font-semibold">Uploaded on {caseData.meetingSummaryUploadedAt ? new Date(caseData.meetingSummaryUploadedAt).toLocaleDateString() : 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-emerald-800 leading-relaxed font-semibold">
                                                    The lawyer has submitted the official consultation briefing summary. It is now securely archived in the registry.
                                                </p>
                                                <a
                                                    href={`/lawyer${caseData.meetingSummaryUrl}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                                                >
                                                    <Download size={13} />
                                                    Download Summary Brief
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="bg-slate-50 border border-slate-150 p-6 rounded-2xl text-center space-y-2">
                                                <Clock size={24} className="text-slate-350 mx-auto animate-pulse" />
                                                <h5 className="font-bold text-slate-800 text-xs">Summary Brief Pending</h5>
                                                <p className="text-[10px] text-slate-500 leading-relaxed">
                                                    Following your discussion, Advocate {caseData.lawyer?.fullName} will compile and upload a meeting summary document. You will see it here instantly.
                                                </p>
                                                <button 
                                                    onClick={fetchCaseDetails}
                                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                                                >
                                                    <RefreshCcw size={10} /> Check for updates
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in duration-200">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Shared Consultation files</h4>
                                        <button 
                                            onClick={fetchCaseDetails}
                                            className="text-[10px] font-bold text-violet-750 text-primary flex items-center gap-1"
                                        >
                                            <RefreshCcw size={10} /> Sync
                                        </button>
                                    </div>

                                    {/* Meeting Summary File (rendered first if available) */}
                                    {caseData.meetingSummaryUrl && (
                                        <div className="p-3.5 bg-secondary/50 border border-border rounded-xl flex items-center justify-between gap-4 shadow-sm">
                                            <div className="flex items-center gap-2.5 truncate">
                                                <div className="p-2 bg-secondary/80 rounded-lg text-primary shrink-0">
                                                    <FileText size={16} />
                                                </div>
                                                <div className="truncate">
                                                    <h5 className="font-bold text-slate-900 text-xs truncate">{caseData.meetingSummaryName}</h5>
                                                    <span className="text-[9px] text-primary font-black uppercase tracking-wider">Meeting Summary</span>
                                                </div>
                                            </div>
                                            <a
                                                href={`/lawyer${caseData.meetingSummaryUrl}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="h-8 w-8 rounded-lg bg-white border border-border flex items-center justify-center hover:bg-secondary text-violet-750 hover:text-primary shrink-0 transition-colors"
                                            >
                                                <Download size={14} />
                                            </a>
                                        </div>
                                    )}

                                    {sharedDocs.length === 0 && !caseData.meetingSummaryUrl ? (
                                        <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                                            <FileText size={28} className="mx-auto mb-2 text-slate-300" />
                                            <p className="font-bold text-xs">No documents uploaded yet</p>
                                        </div>
                                    ) : (
                                        sharedDocs.map((doc, idx) => (
                                            <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-2.5 truncate">
                                                    <div className="p-2 bg-white border border-slate-200/50 rounded-lg text-slate-500 shrink-0">
                                                        <FileText size={16} />
                                                    </div>
                                                    <div className="truncate">
                                                        <h5 className="font-bold text-slate-800 text-xs truncate">{doc.name}</h5>
                                                        <span className="text-[9px] text-slate-400 font-semibold">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <a
                                                    href={`/lawyer${doc.url}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 hover:text-slate-900 shrink-0 transition-colors"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
