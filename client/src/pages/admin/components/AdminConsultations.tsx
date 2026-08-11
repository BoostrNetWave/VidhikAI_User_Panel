import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AdminConsultationsProps {
  consultations: any[];
}

export function AdminConsultations({ consultations = [] }: AdminConsultationsProps) {
  
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Live Consultations</h3>
        <p className="text-sm text-muted-foreground">Monitor ongoing and scheduled day-view consultations.</p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-sans tracking-tight">{today}</h2>
        <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">TODAY</Badge>
      </div>

      <div className="space-y-3">
        {consultations.length === 0 ? (
          <div className="p-12 text-center bg-surface border border-border rounded-md shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">No consultations scheduled for today.</p>
          </div>
        ) : (
          consultations.map((consult, idx) => (
            <Card key={consult._id} className="border-l-4 border-l-primary shadow-sm hover:shadow transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="font-mono text-sm font-medium text-foreground w-24">
                    {new Date(consult.scheduledAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {consult.lawyer?.fullName || 'Lawyer'} &harr; {consult.client?.fullName || 'Client'}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">ID: {consult._id.substring(0, 8)} • {consult.type || 'Video Call'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {idx === 0 ? (
                    <Badge className="bg-success text-success-foreground animate-pulse">LIVE NOW</Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">UPCOMING</Badge>
                  )}
                  <button className="text-sm font-medium text-primary hover:underline">View Log</button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
