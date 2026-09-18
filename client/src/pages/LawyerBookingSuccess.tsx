import { useLocation, useNavigate } from 'react-router-dom';
import { 
    CheckCircle2, 
    Calendar, 
    Clock, 
    Video, 
    CalendarPlus, 
    LayoutDashboard,
    Info,
    Bell,
    User,
    Gavel
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LawyerBookingSuccess() {
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve passed lawyer details from checkout navigation
    const { lawyerName, specialization, avatar, bookingDate, bookingTime } = (location.state as any) || {
        lawyerName: "Your Legal Counsel",
        specialization: "Legal Expert",
        avatar: null,
        bookingDate: "Today",
        bookingTime: "Instant Priority Consultation"
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-gray-100 py-3 px-8 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2 font-bold text-xl overflow-hidden whitespace-nowrap">
                    <div className="h-8 w-8 bg-gray-900 rounded-lg flex items-center justify-center text-white shrink-0">
                        <Gavel className="h-5 w-5" />
                    </div>
                    <span className="leading-none text-gray-900">Vidhik AI</span>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-gray-500">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <div className="h-8 w-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center overflow-hidden">
                         <User className="h-5 w-5 text-orange-400" />
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full py-12">
                <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-6 shadow-lg shadow-green-100">
                        <CheckCircle2 className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Booking Confirmed!</h1>
                    <p className="text-gray-500 text-lg font-medium">Your consultation has been successfully scheduled.</p>
                </div>

                <Card className="w-full max-w-2xl rounded-[2.5rem] border-none shadow-2xl shadow-gray-200/50 overflow-hidden mb-10 animate-in fade-in zoom-in-95 duration-700 delay-200">
                    <CardContent className="p-10 space-y-8">
                        {/* Lawyer Details */}
                        <div className="flex items-center gap-6">
                            <div className="h-20 w-20 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200 shadow-md">
                                {avatar ? (
                                    <img 
                                        src={avatar.startsWith('http') ? avatar : (avatar.startsWith('/') ? `/lawyer${avatar}` : `/lawyer/${avatar}`)} 
                                        alt={lawyerName} 
                                        className="h-full w-full object-cover animate-in fade-in duration-300"
                                    />
                                ) : (
                                    <User className="h-10 w-10 text-gray-400" />
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    Video Call with {lawyerName}
                                </h3>
                                <p className="text-[#7C3AED] font-bold text-xs uppercase tracking-wider">{specialization}</p>
                                <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold">
                                    <Video className="h-3.5 w-3.5" />
                                    Link will be shared 15 mins before call
                                </div>
                            </div>
                        </div>

                        {/* Schedule Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[#F8F9FA] rounded-2xl p-6 flex items-center gap-4 border border-gray-50 shadow-sm">
                                <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-[#7C3AED]">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date</p>
                                    <p className="text-sm font-bold text-gray-900 tracking-tight">{bookingDate || "Today"}</p>
                                </div>
                            </div>
                            <div className="bg-[#F8F9FA] rounded-2xl p-6 flex items-center gap-4 border border-gray-50 shadow-sm">
                                <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-[#7C3AED]">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Time</p>
                                    <p className="text-sm font-bold text-gray-900 tracking-tight">{bookingTime || "Instant Priority Consultation"}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
                    <Button className="flex-1 bg-gray-900 hover:bg-black text-white rounded-2xl h-14 font-bold text-base shadow-lg shadow-gray-200 gap-3">
                        <CalendarPlus className="h-5 w-5" />
                        Add to Calendar
                    </Button>
                    <Button 
                        variant="outline" 
                        className="flex-1 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-2xl h-14 font-bold text-base shadow-sm gap-3"
                        onClick={() => navigate('/consultations')}
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        Go to My Consultations
                    </Button>
                </div>

                {/* What to do next */}
                <div className="w-full max-w-2xl bg-indigo-50/50 border border-indigo-100 rounded-[2rem] p-8 animate-in fade-in duration-1000 delay-700">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                            <Info className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 tracking-tight">What to do next</h4>
                    </div>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-4">
                            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-white text-[#7C3AED] font-black text-[10px] shrink-0 shadow-sm border border-indigo-100">01.</span>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed">Prepare any relevant legal documents or contracts you wish to discuss.</p>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-white text-[#7C3AED] font-black text-[10px] shrink-0 shadow-sm border border-indigo-100">02.</span>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed">Join the meeting 2-3 minutes early to test your camera and microphone.</p>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-white text-[#7C3AED] font-black text-[10px] shrink-0 shadow-sm border border-indigo-100">03.</span>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed">Open "Live Consultations" to view your scheduled session and join the meeting.</p>
                        </li>
                    </ul>
                </div>
            </main>
        </div>
    );
}
