import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
    Activity, BrainCircuit, KeyRound, Server, Zap, CheckCircle2, AlertCircle, RefreshCcw, 
    Eye, EyeOff, Play, Plus, Sliders, MessageSquare, Terminal, FileCode, Check, X, ShieldAlert,
    RotateCcw, Save, Sparkles, HelpCircle
} from 'lucide-react';
import { adminService } from '@/services/adminService';

interface AdminLLMConfigProps {
  configs: any[];
  onUpdate: (key: string, value: any) => Promise<void>;
}

const PROVIDER_OPTIONS = [
    { 
        value: 'openai', 
        label: 'OpenAI (GPT-4o, GPT-4o-mini)', 
        models: ['gpt-4o', 'gpt-4o-mini', 'o3-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        defaultBaseUrl: ''
    },
    { 
        value: 'openrouter', 
        label: 'OpenRouter Gateway (Unified API)', 
        models: ['openai/gpt-4o', 'openai/gpt-4o-mini', 'anthropic/claude-3.5-sonnet', 'google/gemini-2.0-flash-001', 'deepseek/deepseek-r1', 'meta-llama/llama-3.3-70b-instruct'],
        defaultBaseUrl: 'https://openrouter.ai/api/v1'
    },
    { 
        value: 'anthropic', 
        label: 'Anthropic Claude Direct API', 
        models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
        defaultBaseUrl: ''
    },
    { 
        value: 'gemini', 
        label: 'Google Gemini Direct API', 
        models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'],
        defaultBaseUrl: ''
    },
    { 
        value: 'groq', 
        label: 'Groq Llama Acceleration API', 
        models: ['llama-3.3-70b-versatile', 'llama3-70b-8192', 'mixtral-8x7b-32768'],
        defaultBaseUrl: 'https://api.groq.com/openai/v1'
    },
    { 
        value: 'deepseek', 
        label: 'DeepSeek Direct API', 
        models: ['deepseek-chat', 'deepseek-reasoner'],
        defaultBaseUrl: 'https://api.deepseek.com/v1'
    },
    { 
        value: 'custom', 
        label: 'Custom / Local (Ollama, LM Studio, vLLM)', 
        models: ['llama3', 'mistral', 'qwen2.5-coder', 'custom-model'],
        defaultBaseUrl: 'http://localhost:11434/v1'
    }
];

const DEFAULT_RECOMMENDED_SETTINGS: Record<string, any> = {
    LLM_CONFIG_DEFAULT: {
        provider: 'openai',
        model: 'gpt-4o',
        temperature: 0.7,
        maxTokens: 4000,
        systemPrompt: 'You are Vidhik AI, an expert AI legal system assisting Indian legal professionals and citizens.'
    },
    LLM_CONFIG_CHATBOT: {
        provider: 'openai',
        model: 'gpt-4o-mini',
        temperature: 0.7,
        maxTokens: 4000,
        systemPrompt: 'You are Vidhik AI Assistant, specialized in Indian legal queries, case research, IPC/BNS sections, and legal advice.'
    },
    LLM_CONFIG_DOC_GEN: {
        provider: 'openai',
        model: 'gpt-4o',
        temperature: 0.5,
        maxTokens: 4000,
        systemPrompt: 'You are an elite legal drafting expert in Indian law. Generate exhaustive, legally binding documents formatted with clean semantic HTML.'
    },
    LLM_CONFIG_DOC_REVIEW: {
        provider: 'openai',
        model: 'gpt-4o',
        temperature: 0.2,
        maxTokens: 4000,
        systemPrompt: 'You are a meticulous contract auditor. Review legal documents for risks, missing clauses, and compliance under Indian laws.'
    }
};

interface EndpointCardProps {
    config: any;
    onSave: (configKey: string, updatedVal: any) => Promise<void>;
    onTestSuccess: () => void;
}

function LLMEndpointCard({ config, onSave, onTestSuccess }: EndpointCardProps) {
    const rawVal = typeof config.value === 'object' && config.value !== null ? config.value : {};
    
    // Sanitize any corrupted/legacy model names
    const initialModel = rawVal.model === 'GPT-5.6 Luna' ? 'gpt-4o' : (rawVal.model || 'gpt-4o');

    const [provider, setProvider] = useState<string>(rawVal.provider || 'openai');
    const [model, setModel] = useState<string>(initialModel);
    const [apiKey, setApiKey] = useState<string>(rawVal.apiKey || '');
    const [baseUrl, setBaseUrl] = useState<string>(rawVal.baseUrl || '');
    const [temperature, setTemperature] = useState<number>(rawVal.temperature ?? 0.7);
    const [maxTokens, setMaxTokens] = useState<number>(rawVal.maxTokens ?? 4000);
    const [systemPrompt, setSystemPrompt] = useState<string>(rawVal.systemPrompt || '');
    
    const [showKey, setShowKey] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isTesting, setIsTesting] = useState<boolean>(false);
    const [testResult, setTestResult] = useState<any>(null);
    const [isDirty, setIsDirty] = useState<boolean>(false);

    // Keep state in sync if external config updates
    useEffect(() => {
        const v = typeof config.value === 'object' && config.value !== null ? config.value : {};
        setProvider(v.provider || 'openai');
        setModel(v.model === 'GPT-5.6 Luna' ? 'gpt-4o' : (v.model || 'gpt-4o'));
        setApiKey(v.apiKey || '');
        setBaseUrl(v.baseUrl || '');
        setTemperature(v.temperature ?? 0.7);
        setMaxTokens(v.maxTokens ?? 4000);
        setSystemPrompt(v.systemPrompt || '');
        setIsDirty(false);
    }, [config.value]);

    const currentProviderObj = PROVIDER_OPTIONS.find(p => p.value === provider) || PROVIDER_OPTIONS[0];
    const isKeySetInDB = Boolean(apiKey && apiKey.trim().length > 5);

    // When provider changes, automatically switch model to first preset of new provider
    const handleProviderChange = (newProvider: string) => {
        setProvider(newProvider);
        setIsDirty(true);
        const provObj = PROVIDER_OPTIONS.find(p => p.value === newProvider);
        if (provObj && provObj.models.length > 0) {
            // If current model is not in new provider's list, pick first preset
            if (!provObj.models.includes(model)) {
                setModel(provObj.models[0]);
            }
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const updated = {
                provider,
                model: model.trim() || 'gpt-4o',
                apiKey: apiKey.trim(),
                baseUrl: baseUrl.trim(),
                temperature,
                maxTokens,
                systemPrompt: systemPrompt.trim()
            };
            await onSave(config.key, updated);
            setIsDirty(false);
            toast.success(`Saved configuration for ${config.key.replace('LLM_CONFIG_', '')}`);
        } catch (err: any) {
            toast.error(`Failed to save ${config.key}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleResetDefaults = async () => {
        const rec = DEFAULT_RECOMMENDED_SETTINGS[config.key] || {
            provider: 'openai',
            model: 'gpt-4o',
            temperature: 0.7,
            maxTokens: 4000,
            systemPrompt: 'You are Vidhik AI, an expert AI legal system assisting Indian legal professionals and citizens.'
        };
        setProvider(rec.provider);
        setModel(rec.model);
        setApiKey('');
        setBaseUrl('');
        setTemperature(rec.temperature);
        setMaxTokens(rec.maxTokens);
        setSystemPrompt(rec.systemPrompt);
        setIsDirty(true);

        try {
            await onSave(config.key, {
                ...rec,
                apiKey: '',
                baseUrl: ''
            });
            setIsDirty(false);
            toast.success(`Reset ${config.key.replace('LLM_CONFIG_', '')} to verified defaults`);
        } catch (e) {
            toast.error("Failed to reset defaults");
        }
    };

    const handleRunTest = async () => {
        try {
            setIsTesting(true);
            setTestResult({ loading: true });

            const payload = {
                provider,
                model: model.trim() || 'gpt-4o',
                apiKey: apiKey.trim(),
                baseUrl: baseUrl.trim(),
                temperature: 0.3,
                maxTokens: 150,
                systemPrompt: systemPrompt || 'You are a test connection assistant.',
                prompt: "Hello! Respond concisely with: 'Vidhik AI LLM Service Connection Verified Successfully.'"
            };

            const res = await adminService.testLLMConfig(payload);
            setTestResult(res);

            if (res.success) {
                toast.success(`Test Passed! Latency: ${res.latencyMs}ms (${res.model})`);
            } else {
                toast.error(`Test Failed: ${res.error || 'Connection error'}`);
            }
            onTestSuccess();
        } catch (err: any) {
            const msg = err.response?.data?.error || err.response?.data?.message || err.message || 'Connection test failed';
            setTestResult({ success: false, error: msg, latencyMs: 0 });
            toast.error(`Test failed: ${msg}`);
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <Card className="bg-card border-border shadow-md overflow-hidden flex flex-col md:flex-row transition-all hover:border-primary/40">
            {/* Left Panel: Feature Info & Status */}
            <div className="w-full md:w-1/3 bg-muted/20 p-6 border-b md:border-b-0 md:border-r border-border flex flex-col justify-between">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                            {config.key.replace('LLM_CONFIG_', '').replace(/_/g, ' ')}
                        </span>
                        {isKeySetInDB ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/20" title="API key explicitly configured in database">
                                <CheckCircle2 className="w-3 h-3" /> Key Set
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 border border-amber-500/20" title="Using server .env key fallback (e.g. OPENAI_API_KEY)">
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
                            <span className="font-bold uppercase text-foreground">{provider}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground font-medium">Active Model:</span>
                            <span className="font-bold text-primary truncate max-w-[150px]" title={model}>{model}</span>
                        </div>
                    </div>

                    {/* Live Test Connection Button */}
                    <button
                        onClick={handleRunTest}
                        disabled={isTesting}
                        className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                        {isTesting ? (
                            <>
                                <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                                Testing Connection...
                            </>
                        ) : (
                            <>
                                <Play className="w-3.5 h-3.5 fill-current" />
                                Test Connection Live
                            </>
                        )}
                    </button>

                    {/* Live Test Result Output Box */}
                    {testResult && (
                        <div className={`p-3 rounded-lg text-xs space-y-1.5 border transition-all ${
                            testResult.loading 
                                ? 'bg-secondary/40 border-border text-foreground'
                                : testResult.success 
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400' 
                                    : 'bg-destructive/10 border-destructive/30 text-destructive'
                        }`}>
                            {testResult.loading ? (
                                <div className="flex items-center gap-2">
                                    <RefreshCcw className="w-3 h-3 animate-spin text-primary" /> Contacting provider endpoint...
                                </div>
                            ) : testResult.success ? (
                                <>
                                    <div className="flex items-center justify-between font-bold">
                                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Connection Passed</span>
                                        <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded text-[10px]">⚡ {testResult.latencyMs}ms</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] opacity-75">
                                        <span>Model: {testResult.model}</span>
                                        <span>Tokens: {testResult.tokensUsed}</span>
                                    </div>
                                    <p className="text-[11px] opacity-90 italic border-t border-emerald-500/20 pt-1">
                                        "{testResult.responseText.length > 90 ? testResult.responseText.substring(0, 90) + '...' : testResult.responseText}"
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-1 font-bold">
                                        <ShieldAlert className="w-3.5 h-3.5" /> Test Failed {testResult.latencyMs ? `(${testResult.latencyMs}ms)` : ''}
                                    </div>
                                    <p className="text-[11px] opacity-90 break-words">{testResult.error}</p>
                                    {testResult.error?.includes('model ID') && (
                                        <p className="text-[10px] text-muted-foreground pt-1 border-t border-destructive/20 italic">
                                            Tip: Select a verified preset model like <strong>gpt-4o</strong> or <strong>gpt-4o-mini</strong>.
                                        </p>
                                    )}
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
                            value={provider}
                            onChange={(e) => handleProviderChange(e.target.value)}
                        >
                            {PROVIDER_OPTIONS.map(prov => (
                                <option key={prov.value} value={prov.value}>{prov.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Model Engine Selector / Custom Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                            <span className="flex items-center gap-1"><BrainCircuit className="w-3.5 h-3.5 text-primary" /> Model Identifier</span>
                            <span className="text-[10px] text-muted-foreground">Preset or Custom</span>
                        </label>
                        <div className="flex gap-2">
                            <select
                                className="flex h-10 w-1/2 rounded-lg border border-input bg-background px-2 py-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                value={currentProviderObj.models.includes(model) ? model : ''}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setModel(e.target.value);
                                        setIsDirty(true);
                                    }
                                }}
                            >
                                <option value="">Custom Model...</option>
                                {currentProviderObj.models.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            <Input
                                className="h-10 rounded-lg text-xs w-1/2 font-mono"
                                placeholder="Model ID (e.g. gpt-4o)"
                                value={model}
                                onChange={(e) => {
                                    setModel(e.target.value);
                                    setIsDirty(true);
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
                            {isKeySetInDB ? 'Custom Key Set in DB' : 'Using server process.env fallback'}
                        </span>
                    </div>
                    <div className="relative">
                        <Input
                            type={showKey ? "text" : "password"}
                            className="h-10 rounded-lg font-mono text-xs pr-10"
                            placeholder="Enter API Key (sk-...) or leave empty for environment variable fallback"
                            value={apiKey}
                            onChange={(e) => {
                                setApiKey(e.target.value);
                                setIsDirty(true);
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowKey(!showKey)}
                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Base URL (Optional / Custom Endpoint) */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Terminal className="w-3.5 h-3.5 text-muted-foreground" /> Base URL (Optional Endpoint Proxy)
                    </label>
                    <Input
                        type="text"
                        className="h-10 rounded-lg font-mono text-xs"
                        placeholder={currentProviderObj.defaultBaseUrl || 'Default provider URL or http://localhost:11434/v1'}
                        value={baseUrl}
                        onChange={(e) => {
                            setBaseUrl(e.target.value);
                            setIsDirty(true);
                        }}
                    />
                </div>

                {/* Inference Parameters: Temperature & Max Tokens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-3 rounded-lg border border-border">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-muted-foreground">Temperature (Creativity)</span>
                            <span className="font-mono text-primary font-bold">{temperature}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={temperature}
                            onChange={(e) => {
                                setTemperature(parseFloat(e.target.value));
                                setIsDirty(true);
                            }}
                            className="w-full accent-primary h-1.5 bg-border rounded-lg cursor-pointer"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-muted-foreground">Max Response Tokens</span>
                            <span className="font-mono text-primary font-bold">{maxTokens}</span>
                        </div>
                        <Input
                            type="number"
                            min="100"
                            max="32000"
                            className="h-8 rounded text-xs font-mono"
                            value={maxTokens}
                            onChange={(e) => {
                                setMaxTokens(parseInt(e.target.value, 10) || 4000);
                                setIsDirty(true);
                            }}
                        />
                    </div>
                </div>

                {/* System Prompt Customization */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-primary" /> Feature System Prompt
                    </label>
                    <textarea
                        className="w-full min-h-[75px] rounded-lg border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-sans leading-relaxed"
                        placeholder="Enter custom system instructions for this feature..."
                        value={systemPrompt}
                        onChange={(e) => {
                            setSystemPrompt(e.target.value);
                            setIsDirty(true);
                        }}
                    />
                </div>

                {/* Footer Controls: Save & Reset to Defaults */}
                <div className="flex items-center justify-between pt-2 border-t border-border/70">
                    <button
                        type="button"
                        onClick={handleResetDefaults}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
                        title="Restore recommended verified model and prompt for this feature"
                    >
                        <RotateCcw className="w-3.5 h-3.5" /> Reset to Recommended Defaults
                    </button>

                    <div className="flex items-center gap-3">
                        {isDirty && (
                            <span className="text-[11px] text-amber-500 font-medium flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Unsaved changes
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                                isDirty 
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                            }`}
                        >
                            {isSaving ? (
                                <>
                                    <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-3.5 h-3.5" /> Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    );
}

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
  
  // Custom Feature Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newProvider, setNewProvider] = useState('openai');
  const [newModel, setNewModel] = useState('gpt-4o');
  const [newApiKey, setNewApiKey] = useState('');
  const [newBaseUrl, setNewBaseUrl] = useState('');

  // Extract all LLM configurations from configs
  const llmConfigs = configs.filter(c => c.key && c.key.startsWith('LLM_CONFIG_'));

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

  const handleSaveEndpoint = async (configKey: string, updatedValue: any) => {
      await onUpdate(configKey, updatedValue);
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
              model: newModel || 'gpt-4o',
              apiKey: newApiKey.trim(),
              baseUrl: newBaseUrl.trim(),
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

  return (
    <div className="space-y-8 pb-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <BrainCircuit className="w-8 h-8 text-primary" /> AI Infrastructure & LLM Engine
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                  Configure dynamic AI endpoints (OpenAI, OpenRouter, Anthropic, Gemini, Groq, DeepSeek, Local), run live connection tests, and monitor real-time API execution metrics.
              </p>
          </div>
          <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                  <Plus className="w-4 h-4" /> Add Feature Endpoint
              </button>
              <button 
                onClick={fetchMetrics}
                disabled={isRefreshing}
                className="bg-secondary text-primary hover:bg-secondary/80 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
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
            {llmConfigs.map(config => (
                <LLMEndpointCard
                    key={config.key}
                    config={config}
                    onSave={handleSaveEndpoint}
                    onTestSuccess={fetchMetrics}
                />
            ))}
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
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
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
                                          <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                                              log.feature === 'test_connection' 
                                                  ? 'bg-purple-500/15 text-purple-600 border border-purple-500/20' 
                                                  : 'bg-secondary text-primary'
                                          }`}>
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
                                          {log.latencyMs ? (
                                              <span className={log.latencyMs > 3000 ? 'text-amber-600' : 'text-emerald-600'}>
                                                  {log.latencyMs}ms
                                              </span>
                                          ) : 'N/A'}
                                      </td>
                                      <td className="p-3">
                                          {log.status === 'success' ? (
                                              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[10px]">
                                                  <Check className="w-3 h-3" /> Success
                                              </span>
                                          ) : (
                                              <span className="inline-flex items-center gap-1 text-destructive font-bold text-[10px]" title={log.errorMessage}>
                                                  <X className="w-3 h-3" /> {log.errorMessage ? log.errorMessage.substring(0, 35) + '...' : 'Failed'}
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
                      <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
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
                              className="px-4 py-2 rounded-lg text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer"
                          >
                              Cancel
                          </button>
                          <button
                              type="submit"
                              className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm cursor-pointer"
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
