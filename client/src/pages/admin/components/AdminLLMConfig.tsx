import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
    Activity, BrainCircuit, KeyRound, Server, Zap, CheckCircle2, AlertCircle, RefreshCcw, 
    Eye, EyeOff, Play, Plus, Sliders, MessageSquare, Terminal, FileCode, Check, X, ShieldAlert 
} from 'lucide-react';
import { adminService } from '@/services/adminService';

interface AdminLLMConfigProps {
  configs: any[];
  onUpdate: (key: string, value: any) => Promise<void>;
}

const PROVIDER_OPTIONS = [
    { value: 'openai', label: 'OpenAI (GPT-4o, GPT-4o-mini)', models: ['gpt-4o', 'gpt-4o-mini', 'o3-mini', 'gpt-4-turbo'] },
    { value: 'openrouter', label: 'OpenRouter Gateway (Unified API)', models: ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet', 'google/gemini-2.0-flash-001', 'deepseek/deepseek-r1', 'meta-llama/llama-3.3-70b-instruct'] },
    { value: 'anthropic', label: 'Anthropic Claude Direct API', models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'] },
    { value: 'gemini', label: 'Google Gemini Direct API', models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'] },
    { value: 'groq', label: 'Groq Llama Acceleration API', models: ['llama-3.3-70b-versatile', 'llama3-70b-8192', 'mixtral-8x7b-32768'] },
    { value: 'deepseek', label: 'DeepSeek Direct API', models: ['deepseek-chat', 'deepseek-reasoner'] },
    { value: 'custom', label: 'Custom / Local (Ollama, LM Studio, vLLM)', models: ['llama3', 'mistral', 'qwen2.5-coder', 'custom-model'] }
];

export function AdminLLMConfig({ configs = [], onUpdate }: AdminLLMConfigProps) {
  const [llmMetrics, setLlmMetrics] = useState<any>({
      totalRequests: "0",
      totalTokens: 0,
      estimatedCost: "$0.00",
      healthStatus: "Operational",
      successRate: "100%",
      recentLogs: []
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [testingKey, setTestingKey] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  
  // Custom Feature Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newProvider, setNewProvider] = useState('openai');
  const [newModel, setNewModel] = useState('gpt-4o');
  const [newApiKey, setNewApiKey] = useState('');
  const [newBaseUrl, setNewBaseUrl] = useState('');

  const llmConfigs = configs.filter(c => c.key.startsWith('LLM_CONFIG_'));

  const fetchMetrics = async () => {
      try {
          setIsRefreshing(true);
          const metrics = await adminService.getLLMMetrics();
          setLlmMetrics(metrics);
      } catch (e) {
          console.error("Failed to fetch LLM metrics", e);
      } finally {
          setIsRefreshing(false);
      }
  };

  useEffect(() => {
      fetchMetrics();
  }, []);

  const handleSaveField = async (configKey: string, currentVal: any, field: string, newValue: any) => {
    try {
      const existingVal = typeof currentVal === 'object' && currentVal !== null ? currentVal : {};
      const updatedValue = { ...existingVal, [field]: newValue };
      await onUpdate(configKey, updatedValue);
      toast.success(`Updated ${field} for ${configKey.replace('LLM_CONFIG_', '')}`);
    } catch (e) {
      toast.error(`Failed to update ${configKey}`);
    }
  };

  const handleTestConnection = async (configKey: string, valObj: any) => {
      try {
          setTestingKey(configKey);
          setTestResults(prev => ({ ...prev, [configKey]: { loading: true } }));
          
          const result = await adminService.testLLMConfig({
              provider: valObj.provider || 'openai',
              model: valObj.model || 'gpt-4o',
              apiKey: valObj.apiKey || '',
              baseUrl: valObj.baseUrl || '',
              temperature: valObj.temperature ?? 0.3,
              maxTokens: valObj.maxTokens ?? 150,
              systemPrompt: valObj.systemPrompt || 'You are a test connection assistant.',
              prompt: "Hello! Respond with: 'Vidhik AI LLM Service Connection Active!'"
          });

          setTestResults(prev => ({ ...prev, [configKey]: result }));
          if (result.success) {
              toast.success(`Test Connection Successful! Latency: ${result.latencyMs}ms`);
          } else {
              toast.error(`Test Failed: ${result.error || 'Connection error'}`);
          }
          fetchMetrics(); // Refresh logs after test
      } catch (err: any) {
          setTestResults(prev => ({ ...prev, [configKey]: { success: false, error: err.message || 'Test failed' } }));
          toast.error("Failed to execute LLM test");
      } finally {
          setTestingKey(null);
      }
  };

  const handleCreateNewFeature = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newFeatureName.trim()) {
          toast.error("Feature name is required");
          return;
      }
      try {
          await adminService.createLLMFeatureConfig({
              featureName: newFeatureName.trim(),
              provider: newProvider,
              model: newModel,
              apiKey: newApiKey,
              baseUrl: newBaseUrl,
              description: `Custom LLM Endpoint for ${newFeatureName}`
          });
          toast.success(`Created dynamic endpoint for ${newFeatureName}`);
          setShowAddModal(false);
          setNewFeatureName('');
          setNewApiKey('');
          setNewBaseUrl('');
          // Re-fetch parent configs
          const freshConfigs = await adminService.getConfigs();
          if (freshConfigs) onUpdate('REFRESH_ALL', freshConfigs);
      } catch (err: any) {
          toast.error(err.response?.data?.message || "Failed to create endpoint");
      }
  };

  const toggleShowKey = (key: string) => {
      setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <BrainCircuit className="w-8 h-8 text-primary" /> AI Infrastructure & LLM Engine
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                  Configure dynamic LLM endpoints (OpenAI, OpenRouter, Anthropic, Gemini, Groq, DeepSeek, Local), run live connection tests, and monitor real-time API metrics.
              </p>
          </div>
          <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all shadow-sm"
              >
                  <Plus className="w-4 h-4" /> Add Feature Endpoint
              </button>
              <button 
                onClick={fetchMetrics}
                disabled={isRefreshing}
                className="bg-secondary text-primary hover:bg-secondary/80 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                  <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh Stats
              </button>
          </div>
      </div>

      {/* Global Real API Usage Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Total Executions</span>
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Activity className="w-4 h-4" />
                      </div>
                  </div>
                  <div className="space-y-1">
                      <h3 className="text-3xl font-black text-foreground">{llmMetrics.totalRequests ?? 0}</h3>
                      <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Real-time database logs
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
                      <h3 className="text-3xl font-black text-foreground">
                          {typeof llmMetrics.totalTokens === 'number' ? llmMetrics.totalTokens.toLocaleString() : llmMetrics.totalTokens || 0}
                      </h3>
                      <p className="text-xs font-medium text-muted-foreground">Cumulative Token Usage</p>
                  </div>
              </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Est. API Cost</span>
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold">
                          $
                      </div>
                  </div>
                  <div className="space-y-1">
                      <h3 className="text-3xl font-black text-foreground">{llmMetrics.estimatedCost || '$0.00'}</h3>
                      <p className="text-xs font-medium text-muted-foreground">Calculated across model tiers</p>
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
                      <h3 className={`text-2xl font-black ${llmMetrics.healthStatus === 'Operational' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {llmMetrics.healthStatus || 'Operational'}
                      </h3>
                      <p className="text-xs font-medium text-muted-foreground">Success rate: {llmMetrics.successRate || '100%'}</p>
                  </div>
              </CardContent>
          </Card>
      </div>

      {/* Feature Endpoints list */}
      <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-primary" /> Feature Endpoint Configurations
              </h2>
              <span className="text-xs font-medium text-muted-foreground">
                  {llmConfigs.length} Active LLM Endpoints
              </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {llmConfigs.map(config => {
              const val = typeof config.value === 'object' && config.value !== null 
                ? config.value 
                : { provider: 'openai', model: 'gpt-4o', apiKey: '', baseUrl: '', temperature: 0.7, maxTokens: 4000, systemPrompt: '' };
              
              const currentProviderObj = PROVIDER_OPTIONS.find(p => p.value === (val.provider || 'openai')) || PROVIDER_OPTIONS[0];
              const testRes = testResults[config.key];
              const isKeySet = Boolean(val.apiKey && val.apiKey.length > 5);

              return (
                <Card key={config.key} className="bg-card border-border shadow-md overflow-hidden flex flex-col md:flex-row transition-all hover:border-primary/40">
                    {/* Left Panel: Feature Info & Status */}
                    <div className="w-full md:w-1/3 bg-muted/20 p-6 border-b md:border-b-0 md:border-r border-border flex flex-col justify-between">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                                    {config.key.replace('LLM_CONFIG_', '')}
                                </span>
                                {isKeySet ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/20">
                                        <CheckCircle2 className="w-3 h-3" /> Key Set
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 border border-amber-500/20">
                                        <AlertCircle className="w-3 h-3" /> Env Fallback
                                    </span>
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-foreground capitalize">
                                {config.key.replace('LLM_CONFIG_', '').replace(/_/g, ' ')}
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {config.description || 'Configures model routing and prompt settings for this feature.'}
                            </p>
                        </div>
                        
                        <div className="mt-6 space-y-4 pt-4 border-t border-border/60">
                            <div className="text-xs space-y-1 bg-background p-3 rounded-lg border border-border">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground font-medium">Provider:</span>
                                    <span className="font-bold uppercase text-foreground">{val.provider || 'openai'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground font-medium">Model:</span>
                                    <span className="font-bold text-primary truncate max-w-[140px]" title={val.model}>{val.model || 'gpt-4o'}</span>
                                </div>
                            </div>

                            {/* Live Test Connection Button */}
                            <button
                                onClick={() => handleTestConnection(config.key, val)}
                                disabled={testingKey === config.key}
                                className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
                            >
                                {testingKey === config.key ? (
                                    <>
                                        <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                                        Testing Connection...
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                        Test LLM Connection Live
                                    </>
                                )}
                            </button>

                            {/* Live Test Result Output Box */}
                            {testRes && (
                                <div className={`p-3 rounded-lg text-xs space-y-1.5 border ${testRes.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400' : 'bg-destructive/10 border-destructive/30 text-destructive'}`}>
                                    {testRes.loading ? (
                                        <div className="flex items-center gap-2">
                                            <RefreshCcw className="w-3 h-3 animate-spin" /> Contacting provider...
                                        </div>
                                    ) : testRes.success ? (
                                        <>
                                            <div className="flex items-center justify-between font-bold">
                                                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Connection Passed</span>
                                                <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded text-[10px]">⚡ {testRes.latencyMs}ms</span>
                                            </div>
                                            <p className="text-[11px] opacity-90 italic border-t border-emerald-500/20 pt-1">
                                                "{testRes.responseText.length > 80 ? testRes.responseText.substring(0, 80) + '...' : testRes.responseText}"
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-1 font-bold">
                                                <ShieldAlert className="w-3.5 h-3.5" /> Test Failed ({testRes.latencyMs}ms)
                                            </div>
                                            <p className="text-[11px] opacity-90 break-words">{testRes.error}</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Full Dynamic Config Editor */}
                    <div className="w-full md:w-2/3 p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Provider Selector */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                    <Server className="w-3.5 h-3.5 text-primary" /> AI Provider Engine
                                </label>
                                <select
                                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={val.provider || 'openai'}
                                    onChange={(e) => handleSaveField(config.key, val, 'provider', e.target.value)}
                                >
                                    {PROVIDER_OPTIONS.map(prov => (
                                        <option key={prov.value} value={prov.value}>{prov.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Model Engine Selector / Custom Input */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                    <BrainCircuit className="w-3.5 h-3.5 text-primary" /> Model Name / Identifier
                                </label>
                                <div className="flex gap-2">
                                    <select
                                        className="flex h-10 w-1/2 rounded-lg border border-input bg-background px-2 py-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        value={val.model}
                                        onChange={(e) => handleSaveField(config.key, val, 'model', e.target.value)}
                                    >
                                        <option value="">Preset Models...</option>
                                        {currentProviderObj.models.map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    <Input
                                        className="h-10 rounded-lg text-xs w-1/2 font-mono"
                                        placeholder="Or custom model ID..."
                                        defaultValue={val.model}
                                        onBlur={(e) => {
                                            if (e.target.value !== val.model) {
                                                handleSaveField(config.key, val, 'model', e.target.value);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* API Key Field with Show/Hide toggle */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                    <KeyRound className="w-3.5 h-3.5 text-primary" /> API Key Authentication
                                </label>
                                <span className="text-[11px] text-muted-foreground">
                                    {isKeySet ? 'Custom Key Set in DB' : 'Using process.env fallback'}
                                </span>
                            </div>
                            <div className="relative">
                                <Input
                                    type={showKeys[config.key] ? "text" : "password"}
                                    className="h-10 rounded-lg font-mono text-xs pr-10"
                                    placeholder="Enter API Key (sk-...) or leave empty for environment fallback"
                                    defaultValue={val.apiKey}
                                    onBlur={(e) => {
                                        if (e.target.value !== val.apiKey) {
                                            handleSaveField(config.key, val, 'apiKey', e.target.value);
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShowKey(config.key)}
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    {showKeys[config.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Base URL (Visible for custom or optional proxy override) */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                <Terminal className="w-3.5 h-3.5 text-muted-foreground" /> Base URL (Optional / Custom Endpoint)
                            </label>
                            <Input
                                type="text"
                                className="h-10 rounded-lg font-mono text-xs"
                                placeholder="e.g. http://localhost:11434/v1 or https://api.groq.com/openai/v1"
                                defaultValue={val.baseUrl || ''}
                                onBlur={(e) => {
                                    if (e.target.value !== (val.baseUrl || '')) {
                                        handleSaveField(config.key, val, 'baseUrl', e.target.value);
                                    }
                                }}
                            />
                        </div>

                        {/* Inference Parameters: Temperature & Max Tokens */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-3 rounded-lg border border-border">
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-muted-foreground">Temperature</span>
                                    <span className="font-mono text-primary font-bold">{val.temperature ?? 0.7}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={val.temperature ?? 0.7}
                                    onChange={(e) => handleSaveField(config.key, val, 'temperature', parseFloat(e.target.value))}
                                    className="w-full accent-primary h-1.5 bg-border rounded-lg cursor-pointer"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-muted-foreground">Max Response Tokens</span>
                                    <span className="font-mono text-primary font-bold">{val.maxTokens ?? 4000}</span>
                                </div>
                                <Input
                                    type="number"
                                    min="256"
                                    max="32000"
                                    className="h-8 rounded text-xs font-mono"
                                    defaultValue={val.maxTokens ?? 4000}
                                    onBlur={(e) => handleSaveField(config.key, val, 'maxTokens', parseInt(e.target.value, 10))}
                                />
                            </div>
                        </div>

                        {/* System Prompt Customization */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                <MessageSquare className="w-3.5 h-3.5 text-primary" /> Feature System Prompt
                            </label>
                            <textarea
                                className="w-full min-h-[70px] rounded-lg border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-sans leading-relaxed"
                                placeholder="Enter custom system instructions for this feature..."
                                defaultValue={val.systemPrompt || ''}
                                onBlur={(e) => {
                                    if (e.target.value !== (val.systemPrompt || '')) {
                                        handleSaveField(config.key, val, 'systemPrompt', e.target.value);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </Card>
              );
            })}
          </div>
      </div>

      {/* Real-time LLM Request Logs Table */}
      <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
              <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-primary" /> Recent LLM Execution Logs
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                      Live audit stream of all LLM requests logged by the server.
                  </p>
              </div>
              <button
                  onClick={fetchMetrics}
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                  <RefreshCcw className="w-3 h-3" /> Refresh Audit Trail
              </button>
          </div>

          <Card className="bg-card border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                      <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
                          <tr>
                              <th className="p-3">Time</th>
                              <th className="p-3">Feature</th>
                              <th className="p-3">Provider / Model</th>
                              <th className="p-3">Tokens</th>
                              <th className="p-3">Latency</th>
                              <th className="p-3">Status</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                          {llmMetrics.recentLogs && llmMetrics.recentLogs.length > 0 ? (
                              llmMetrics.recentLogs.map((log: any) => (
                                  <tr key={log._id} className="hover:bg-muted/20 transition-colors">
                                      <td className="p-3 font-mono text-muted-foreground">
                                          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                      </td>
                                      <td className="p-3 font-bold text-foreground">
                                          <span className="px-2 py-0.5 rounded bg-secondary text-primary font-mono text-[10px]">
                                              {log.feature}
                                          </span>
                                      </td>
                                      <td className="p-3 font-mono">
                                          <span className="font-semibold uppercase">{log.provider}</span> / <span className="text-muted-foreground">{log.model}</span>
                                      </td>
                                      <td className="p-3 font-mono font-medium">
                                          {log.totalTokens ? log.totalTokens.toLocaleString() : '0'} tokens
                                      </td>
                                      <td className="p-3 font-mono text-muted-foreground">
                                          {log.latencyMs ? `${log.latencyMs}ms` : 'N/A'}
                                      </td>
                                      <td className="p-3">
                                          {log.status === 'success' ? (
                                              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[10px]">
                                                  <Check className="w-3 h-3" /> Success
                                              </span>
                                          ) : (
                                              <span className="inline-flex items-center gap-1 text-destructive font-bold text-[10px]" title={log.errorMessage}>
                                                  <X className="w-3 h-3" /> {log.errorMessage ? log.errorMessage.substring(0, 30) + '...' : 'Failed'}
                                              </span>
                                          )}
                                      </td>
                                  </tr>
                              ))
                          ) : (
                              <tr>
                                  <td colSpan={6} className="p-6 text-center text-muted-foreground italic">
                                      No execution logs recorded yet. Run a live test or perform an AI document action to populate logs!
                                  </td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </Card>
      </div>

      {/* Add New Dynamic Feature Modal */}
      {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-card border border-border w-full max-w-lg rounded-xl shadow-2xl p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                          <Plus className="w-5 h-5 text-primary" /> Create Dynamic LLM Endpoint
                      </h3>
                      <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                          <X className="w-5 h-5" />
                      </button>
                  </div>

                  <form onSubmit={handleCreateNewFeature} className="space-y-4">
                      <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Feature Name (Key)</label>
                          <Input
                              type="text"
                              placeholder="e.g. Legal Research or Contract Reviewer"
                              value={newFeatureName}
                              onChange={(e) => setNewFeatureName(e.target.value)}
                              required
                          />
                          <p className="text-[11px] text-muted-foreground">Will be saved as LLM_CONFIG_YOUR_KEY</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Provider</label>
                              <select
                                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium"
                                  value={newProvider}
                                  onChange={(e) => {
                                      setNewProvider(e.target.value);
                                      const provObj = PROVIDER_OPTIONS.find(p => p.value === e.target.value);
                                      if (provObj && provObj.models[0]) setNewModel(provObj.models[0]);
                                  }}
                              >
                                  {PROVIDER_OPTIONS.map(p => (
                                      <option key={p.value} value={p.value}>{p.label}</option>
                                  ))}
                              </select>
                          </div>

                          <div className="space-y-1.5">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Model Engine</label>
                              <Input
                                  type="text"
                                  placeholder="Model ID"
                                  value={newModel}
                                  onChange={(e) => setNewModel(e.target.value)}
                              />
                          </div>
                      </div>

                      <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">API Key (Optional)</label>
                          <Input
                              type="password"
                              placeholder="Leave empty to use global environment API key"
                              value={newApiKey}
                              onChange={(e) => setNewApiKey(e.target.value)}
                          />
                      </div>

                      <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Base URL (Optional)</label>
                          <Input
                              type="text"
                              placeholder="For local Ollama, LM Studio, or private proxy"
                              value={newBaseUrl}
                              onChange={(e) => setNewBaseUrl(e.target.value)}
                          />
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-border">
                          <button
                              type="button"
                              onClick={() => setShowAddModal(false)}
                              className="px-4 py-2 rounded-lg text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          >
                              Cancel
                          </button>
                          <button
                              type="submit"
                              className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                          >
                              Create Endpoint
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}
