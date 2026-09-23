import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Video, Clock, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

interface AdminConsultationsProps {
  consultations: any[];
}

export function AdminConsultations({ consultations = [] }: AdminConsultationsProps) {
  const [selectedConsult, setSelectedConsult] = useState<any | null>(null);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const getStatusBadge = (consult: any) => {
    if (consult.status === 'completed') {
      return <Badge className="bg-slate-100 text-slate-700 border border-slate-200">COMPLETED</Badge>;
    }
    if (consult.meetingJoinedByClient && consult.meetingJoinedByLawyer) {
      return <Badge className="bg-emerald-600 text-white animate-pulse">BOTH IN ROOM (LIVE)</Badge>;
    }
    if (consult.meetingJoinedByLawyer) {
      return <Badge className="bg-amber-500/10 text-amber-700 border border-amber-500/20">LAWYER IN ROOM</Badge>;
    }
    if (consult.meetingJoinedByClient) {
      return <Badge className="bg-blue-500/10 text-blue-700 border border-blue-500/20">CLIENT IN ROOM</Badge>;
    }
    if (consult.status === 'scheduled') {
      return <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200">SCHEDULED</Badge>;
    }
    return <Badge variant="outline" className="text-muted-foreground">{consult.status?.toUpperCase() || 'PENDING'}</Badge>;
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Live Consultations</h3>
        <p className="text-sm text-muted-foreground">Monitor ongoing, live, and concluded video consultations.</p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-sans tracking-tight">{today}</h2>
        <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">TODAY</Badge>
      </div>

      <div className="space-y-3">
        {consultations.length === 0 ? (
          <div className="p-12 text-center bg-surface border border-border rounded-md shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">No consultations recorded.</p>
          </div>
        ) : (
          consultations.map((consult) => (
            <Card key={consult._id} className="border-l-4 border-l-primary shadow-sm hover:shadow transition-shadow">
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="font-mono text-sm font-medium text-foreground w-28 shrink-0">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {consult.scheduledTime || (consult.scheduledAt ? new Date(consult.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Scheduled')}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span>Adv. {consult.lawyer?.fullName || 'Lawyer'}</span>
                      <span className="text-muted-foreground">&harr;</span>
                      <span>{consult.client?.fullName || 'Client'}</span>
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Topic: <span className="font-medium text-foreground">{consult.title || 'Legal Counseling'}</span> • Fee: ₹{consult.totalFee || 0}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 justify-end">
                  {getStatusBadge(consult)}
                  <button 
                    onClick={() => setSelectedConsult(consult)}
                    className="text-xs font-semibold text-primary hover:underline px-2 py-1"
                  >
                    View Details
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal: Admin Consultation Details */}
      {selectedConsult && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden border border-slate-200 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Consultation Audit Log</h3>
                <p className="text-xs text-slate-500">ID: {selectedConsult._id}</p>
              </div>
              <Button 
                onClick={() => setSelectedConsult(null)}
                variant="ghost" 
                size="icon" 
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 font-sans text-xs">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Session Status</span>
                  {getStatusBadge(selectedConsult)}
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px] block">Topic</span>
                  <p className="text-slate-900 font-semibold text-sm">{selectedConsult.title}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Advocate</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedConsult.lawyer?.fullName || "Unassigned"}</p>
                  <p className="text-[10px] text-slate-500">{selectedConsult.lawyer?.email}</p>
                  <span className="inline-block mt-2 text-[10px] font-semibold">
                    {selectedConsult.meetingJoinedByLawyer ? "🟢 Joined Room" : "⚪ Has Not Joined"}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Client</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedConsult.client?.fullName || "Guest"}</p>
                  <p className="text-[10px] text-slate-500">{selectedConsult.client?.email}</p>
                  <span className="inline-block mt-2 text-[10px] font-semibold">
                    {selectedConsult.meetingJoinedByClient ? "🟢 Joined Room" : "⚪ Has Not Joined"}
                  </span>
                </div>
              </div>

              {selectedConsult.status === 'completed' && (
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Total Duration</span>
                    <span className="font-bold text-slate-900">{selectedConsult.meetingDuration ? `${selectedConsult.meetingDuration} mins` : "Completed"}</span>
                  </div>
                  {selectedConsult.completedAt && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold uppercase text-[10px]">Ended At</span>
                      <span className="text-slate-700">{new Date(selectedConsult.completedAt).toLocaleString()}</span>
                    </div>
                  )}
                  {selectedConsult.meetingNotes && (
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Advocate Meeting Notes</span>
                      <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100 leading-relaxed whitespace-pre-wrap">
                        {selectedConsult.meetingNotes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <Button 
                onClick={() => setSelectedConsult(null)}
                className="w-full rounded-xl text-xs font-bold"
              >
                Close Audit Log
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
