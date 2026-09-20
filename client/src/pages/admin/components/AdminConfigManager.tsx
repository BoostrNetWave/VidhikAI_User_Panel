import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Save, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface AdminConfigManagerProps {
  configs: any[];
  editingJsonConfig: any;
  setEditingJsonConfig: (config: any) => void;
  onUpdate: (key: string, value: any) => Promise<void>;
}

export function AdminConfigManager({ configs = [], editingJsonConfig = {}, setEditingJsonConfig, onUpdate }: AdminConfigManagerProps) {
  const [activeTab, setActiveTab] = useState('user');

  const handleSave = async (key: string, newValue: any, type: 'toggle' | 'slider' | 'input' | 'json') => {
    const originalConfig = configs.find(c => c.key === key);
    if (!originalConfig) return;
    const oldValue = originalConfig.value;

    try {
      await onUpdate(key, newValue);
      // Premium touch: Diff-style toast
      if (type === 'toggle') {
        toast.success(`${key} updated: ${oldValue ? 'Enabled' : 'Disabled'} → ${newValue ? 'Enabled' : 'Disabled'}`);
      } else if (type === 'slider' || type === 'input') {
        toast.success(`${key} limit updated: ${oldValue} → ${newValue}`);
      } else {
        toast.success(`${key} configuration saved.`);
      }
    } catch (e) {
      toast.error('Failed to save configuration');
    }
  };

  const renderLimitSlider = (title: string, desc: string, key: string, max: number, unit: string) => {
    const config = configs.find(c => c.key === key);
    if (!config) return null;
    const value = typeof config.value === 'number' ? config.value : 0;
    return (
      <div className="flex flex-col gap-4 p-4 border border-border rounded-md bg-surface">
        <div>
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
        <div className="flex items-center gap-4">
          <Slider
            value={[value]}
            max={max}
            step={1}
            onValueChange={(val) => {
               // Update local state optimistic, but we don't have local override here. 
               // For simplicity, we just trigger the save on mouseUp or use local state.
               handleSave(key, val[0], 'slider');
            }}
          />
          <span className="text-sm font-mono text-muted-foreground w-16 text-right">{value} {unit}</span>
        </div>
      </div>
    );
  };

  const renderToggle = (title: string, desc: string, key: string) => {
    const config = configs.find(c => c.key === key);
    if (!config) return null;
    return (
      <div className="flex items-center justify-between p-4 border border-border rounded-md bg-surface">
        <div>
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
        <Switch
          checked={config.value === true || config.value === 'true'}
          onCheckedChange={(checked) => handleSave(key, checked, 'toggle')}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-sans tracking-tight">Platform Configuration</CardTitle>
          <CardDescription>Manage module limits, toggle features, and edit platform content.</CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64 shrink-0">
          <Tabs orientation="vertical" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex-col h-auto w-full bg-transparent p-0 items-start space-y-1">
              <TabsTrigger value="user" className="w-full justify-start font-medium text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none rounded-md px-4 py-2">
                User Module Limits
              </TabsTrigger>
              <TabsTrigger value="lawyer" className="w-full justify-start font-medium text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none rounded-md px-4 py-2">
                Lawyer Settings
              </TabsTrigger>
              <TabsTrigger value="landing" className="w-full justify-start font-medium text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none rounded-md px-4 py-2">
                Landing Page
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1">
          {activeTab === 'user' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">AI Document Generator</h3>
                {renderToggle('Enable Generator', 'Allow users to generate new documents using AI', 'USER_DOC_GENERATOR_ACTIVE')}
                {renderLimitSlider('Free Tier Limit', 'Max documents a free user can generate', 'USER_DOC_GENERATOR_LIMIT_FREE', 10, 'docs')}
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">AI Document Review</h3>
                {renderToggle('Enable Document Review', 'Allow users to upload and review documents', 'USER_DOC_REVIEW_ACTIVE')}
                {renderLimitSlider('Max File Size', 'Maximum allowed file size for document review', 'USER_DOC_REVIEW_MAX_FILE_SIZE_MB', 50, 'MB')}
              </div>
            </div>
          )}

          {activeTab === 'lawyer' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  Lawyer Subscription & Chamber Quotas
                </h3>
                <div className="p-4 border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-md space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-foreground">Unlimited Lawyer Access Active</span>
                    </div>
                    <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
                      NO LIMITS ENFORCED
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Subscription limits for lawyers are fully bypassed. All registered lawyers have unrestricted active case capacity, unlimited weekly blog publishing, and full chamber functionality across all plans.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Lawyer Appointments</h3>
                {renderToggle('Enable Lawyer Booking', 'Allow clients to book lawyers', 'USER_LAWYER_BOOKING_ACTIVE')}
                {renderLimitSlider('Minimum Notice Hours', 'Minimum hours before a booking can start', 'LAWYER_APPOINTMENT_MIN_NOTICE_HOURS', 48, 'hrs')}
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Payouts & Commission</h3>
                {renderLimitSlider('Base Commission', 'Platform commission percentage', 'USER_LAWYER_BOOKING_BASE_COMMISSION_PERCENT', 30, '%')}
                {renderLimitSlider('TDS Deduction', 'Tax deducted at source', 'LAWYER_PAYMENT_TDS_PERCENT', 20, '%')}
              </div>
            </div>
          )}

          {activeTab === 'landing' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Landing Page Layout</CardTitle>
                  <CardDescription>Edit landing page content via the advanced JSON editor below.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}

          <div className="mt-12 border border-border rounded-md overflow-hidden">
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between bg-muted/50 px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted">
                View Raw Configuration (JSON)
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="p-4 bg-surface border-t border-border">
                <p className="text-xs text-muted-foreground mb-4">Editing this raw JSON allows you to modify deeply nested structures like FAQ items or Pricing tiers. Be cautious.</p>
                <div className="bg-foreground text-background p-4 rounded-md overflow-x-auto font-mono text-[11px] leading-relaxed">
                   {/* Simplified JSON display for visual completeness */}
                   <pre>{JSON.stringify(editingJsonConfig, null, 2).slice(0, 500)}...</pre>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
