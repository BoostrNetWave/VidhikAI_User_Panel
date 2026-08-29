import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Activity, BrainCircuit, KeyRound, Server, Zap, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';

interface AdminLLMConfigProps {
  configs: any[];
  onUpdate: (key: string, value: any) => Promise<void>;
}

// Mock data for the dashboard
const GLOBAL_METRICS = {
    totalRequests: "1.2M",
    totalTokens: "845M",
    estimatedCost: "$1,240.50",
    healthStatus: "Operational"
};

const MODEL_CAPABILITIES: Record<string, { context: string, bestFor: string, speed: string }> = {
    'gpt-4o': { context: '128k', bestFor: 'Complex reasoning, drafting', speed: 'Fast' },
    'gpt-4o-mini': { context: '128k', bestFor: 'Simple tasks, quick processing', speed: 'Very Fast' },
    'claude-3-5-sonnet': { context: '200k', bestFor: 'Nuanced legal analysis', speed: 'Fast' },
    'llama-3-70b-instruct': { context: '8k', bestFor: 'Open-source inference', speed: 'Medium' },
    'default': { context: 'Unknown', bestFor: 'General tasks', speed: 'Varies' }
};

export function AdminLLMConfig({ configs = [], onUpdate }: AdminLLMConfigProps) {
  const llmConfigs = configs.filter(c => c.key.startsWith('LLM_CONFIG_'));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSave = async (key: string, currentVal: any, field: string, newValue: string) => {
    try {
      const updatedValue = { ...currentVal, [field]: newValue };
      await onUpdate(key, updatedValue);
      toast.success(`${key} ${field} updated successfully`);
    } catch (e) {
      toast.error(`Failed to update ${key}`);
    }
  };

  const handleRefreshMetrics = () => {
      setIsRefreshing(true);
      setTimeout(() => {
          setIsRefreshing(false);
          toast.success("Metrics refreshed");
      }, 1000);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Infrastructure</h1>
              <p className="text-muted-foreground text-sm mt-1">
                  Monitor global usage, configure LLM endpoints, and manage API keys.
              </p>
          </div>
          <button 
            onClick={handleRefreshMetrics}
            disabled={isRefreshing}
            className="bg-secondary text-primary hover:bg-secondary/80 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
          >
              <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Metrics
          </button>
      </div>

      {/* Global API Usage Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Total Requests</span>
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Activity className="w-4 h-4" />
                      </div>
                  </div>
                  <div className="space-y-1">
                      <h3 className="text-3xl font-black text-foreground">{GLOBAL_METRICS.totalRequests}</h3>
                      <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                          <Activity className="w-3 h-3" /> +12% from last month
                      </p>
                  </div>
              </CardContent>
          </Card>
          
          <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Tokens Processed</span>
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Zap className="w-4 h-4" />
                      </div>
                  </div>
                  <div className="space-y-1">
                      <h3 className="text-3xl font-black text-foreground">{GLOBAL_METRICS.totalTokens}</h3>
                      <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                          <Activity className="w-3 h-3" /> +8% from last month
                      </p>
                  </div>
              </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Est. API Cost</span>
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <span className="font-bold text-sm">$</span>
                      </div>
                  </div>
                  <div className="space-y-1">
                      <h3 className="text-3xl font-black text-foreground">{GLOBAL_METRICS.estimatedCost}</h3>
                      <p className="text-xs font-medium text-rose-600 flex items-center gap-1">
                          <Activity className="w-3 h-3" /> +15% from last month
                      </p>
                  </div>
              </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
              <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">System Health</span>
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <Server className="w-4 h-4" />
                      </div>
                  </div>
                  <div className="space-y-1">
                      <h3 className="text-2xl font-black text-emerald-600">{GLOBAL_METRICS.healthStatus}</h3>
                      <p className="text-xs font-medium text-muted-foreground">All APIs responding optimally</p>
                  </div>
              </CardContent>
          </Card>
      </div>

      <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground border-b border-border pb-2">Feature Endpoints</h2>
          <div className="grid grid-cols-1 gap-6 pt-2">
            {llmConfigs.map(config => {
              const val = typeof config.value === 'object' ? config.value : { provider: 'openai', model: 'gpt-4o', apiKey: '' };
              
              // Standardize model key for capabilities lookup
              let capabilitiesKey = 'default';
              if (val.model.toLowerCase().includes('gpt-4o-mini')) capabilitiesKey = 'gpt-4o-mini';
              else if (val.model.toLowerCase().includes('gpt-4o')) capabilitiesKey = 'gpt-4o';
              else if (val.model.toLowerCase().includes('claude-3-5')) capabilitiesKey = 'claude-3-5-sonnet';
              else if (val.model.toLowerCase().includes('llama')) capabilitiesKey = 'llama-3-70b-instruct';
              
              const caps = MODEL_CAPABILITIES[capabilitiesKey];
              const isHealthy = val.apiKey && val.apiKey.length > 10;
              const mockUsage = Math.floor(Math.random() * 50) + 10; // 10-60k
              
              return (
                <Card key={config.key} className="bg-card border-border shadow-sm overflow-hidden flex flex-col md:flex-row">
                    {/* Left Panel: Info & Metrics */}
                    <div className="w-full md:w-1/3 bg-muted/30 p-6 border-b md:border-b-0 md:border-r border-border flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <BrainCircuit className="w-5 h-5 text-primary" />
                                <CardTitle className="text-lg">{config.key.replace('LLM_CONFIG_', '').replace(/_/g, ' ')}</CardTitle>
                            </div>
                            <CardDescription className="text-xs leading-relaxed">{config.description}</CardDescription>
                        </div>
                        
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</span>
                                {isHealthy ? (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                        <CheckCircle2 className="w-3 h-3" /> Healthy
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                                        <AlertCircle className="w-3 h-3" /> Missing Key
                                    </span>
                                )}
                            </div>
                            
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-medium text-muted-foreground">Monthly Usage</span>
                                    <span className="font-bold text-foreground">{mockUsage}k Tokens</span>
                                </div>
                                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full" style={{ width: `${(mockUsage / 100) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Configuration */}
                    <div className="w-full md:w-2/3 p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Provider</label>
                                <select
                                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={val.provider}
                                onChange={(e) => handleSave(config.key, val, 'provider', e.target.value)}
                                >
                                <option value="openai">OpenAI API</option>
                                <option value="openrouter">OpenRouter Gateway</option>
                                <option value="anthropic">Anthropic Claude</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Model Engine</label>
                                <Input
                                className="h-11 rounded-lg"
                                placeholder="e.g. gpt-4o"
                                defaultValue={val.model}
                                onBlur={(e) => {
                                    if (e.target.value !== val.model) {
                                    handleSave(config.key, val, 'model', e.target.value);
                                    }
                                }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                <KeyRound className="w-3 h-3" /> API Key Authentication
                            </label>
                            <Input
                                type="password"
                                className="h-11 rounded-lg font-mono text-sm"
                                placeholder="Enter API Key or leave blank to use fallback"
                                defaultValue={val.apiKey}
                                onBlur={(e) => {
                                    if (e.target.value !== val.apiKey) {
                                    handleSave(config.key, val, 'apiKey', e.target.value);
                                    }
                                }}
                            />
                        </div>

                        {/* Contextual Model Info */}
                        <div className="bg-secondary/50 rounded-xl p-4 mt-2">
                            <div className="flex flex-wrap gap-4 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-muted-foreground">Context:</span>
                                    <span className="font-bold text-foreground">{caps.context}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-muted-foreground">Speed:</span>
                                    <span className="font-bold text-foreground">{caps.speed}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-muted-foreground">Ideal for:</span>
                                    <span className="font-bold text-foreground">{caps.bestFor}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
              );
            })}
          </div>
      </div>
    </div>
  );
}
