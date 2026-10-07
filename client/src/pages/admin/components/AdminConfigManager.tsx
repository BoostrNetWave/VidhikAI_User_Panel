import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Globe,
  User,
  ShieldCheck,
  Save,
  Plus,
  Trash2,
  Sliders,
  Sparkles,
  DollarSign,
  Search,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Crown,
  Zap,
  AlertCircle,
  Eye,
  RefreshCw,
  FileText,
  LayoutGrid,
  Layers,
  ArrowUpRight,
  Megaphone,
  CreditCard,
  Building2,
  Lock,
  Tag
} from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '@/services/adminService';

interface AdminConfigManagerProps {
  configs: any[];
  editingJsonConfig: any;
  setEditingJsonConfig: (config: any) => void;
  onUpdate: (key: string, value: any) => Promise<void>;
}

export function AdminConfigManager({
  configs = [],
  editingJsonConfig = {},
  setEditingJsonConfig,
  onUpdate
}: AdminConfigManagerProps) {
  const [mainTab, setMainTab] = useState<'landing' | 'user' | 'lawyer'>('landing');
  const [subTabLanding, setSubTabLanding] = useState('hero');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [publicLawyers, setPublicLawyers] = useState<any[]>([]);
  const [loadingLawyers, setLoadingLawyers] = useState(false);

  // Helper to retrieve config by key
  const getConfig = (key: string, defaultValue: any = '') => {
    const item = configs.find(c => c.key === key);
    return item !== undefined && item !== null ? item.value : defaultValue;
  };

  // Local state for complex object editing
  const [heroData, setHeroData] = useState<any>({
    title: 'Legal work, drafted with intelligence.',
    subtitle: 'Generate professional legal documents, review contracts, and move from legal questions to usable work — faster.',
    badge: 'Get started with Vidhik AI',
    primaryCtaText: 'Start Free Trial',
    primaryCtaLink: '/user/auth?mode=register',
    secondaryCtaText: 'Watch Demo',
    secondaryCtaLink: '#demo',
    trustText: 'Trusted by legal professionals',
    statNumber: '24',
    imageUrl: '',
  });

  const [workflowData, setWorkflowData] = useState<any>({
    tag: 'Workflow',
    title: 'From blank page to executed agreement in minutes.',
    subtitle: 'Our intelligent workflow removes the friction from legal documentation, letting you focus on your actual business.',
    steps: [
      { num: "01", title: "Choose a document", desc: "Select the legal document you need from our verified template library." },
      { num: "02", title: "Provide your details", desc: "Answer a few simple questions in plain English to customize your document." },
      { num: "03", title: "Generate and review", desc: "Our AI engine instantly drafts the contract. Review and edit as needed." },
      { num: "04", title: "Download or use", desc: "Export securely to PDF or Word, ready for signatures or filing." }
    ]
  });

  const [audienceData, setAudienceData] = useState<any>({
    tag: 'Who it is for',
    title: 'Built for modern teams and professionals.',
    cards: [
      { label: "Startups", desc: "Draft incorporation documents, founder agreements, NDAs, and equity structures instantly." },
      { label: "Freelancers", desc: "Protect your work with bulletproof service contracts, invoices, and IP assignments." },
      { label: "Small Businesses", desc: "Manage employment agreements, compliance checklists, and corporate policies." },
      { label: "Individuals", desc: "Handle personal legal matters like rental agreements, wills, and basic legal guidance." }
    ]
  });

  const [testimonialsData, setTestimonialsData] = useState<any>({
    title: 'Trusted by professionals navigating complex work.',
    subtitle: 'Built for founders, businesses, legal teams, and professionals who need to move through complex legal work with clarity and confidence.',
    items: [
      { id: "t1", name: "Priya Sharma", role: "Startup Founder", text: "Vidhik AI helped us draft all our incorporation documents in under an hour. The speed and precision is unmatched, letting us focus entirely on building our product.", avatar: "PS" },
      { id: "t2", name: "Anita Desai", role: "Director", company: "Desai Ventures", text: "The contract review feature is a game changer. It consistently catches clauses I would have missed and allows us to negotiate with absolute clarity and zero anxiety.", avatar: "AD", featured: true },
      { id: "t3", name: "Rahul Mehra", role: "Freelance Designer", text: "I finally have proper contracts for my clients. The AI assistant answered all my legal questions instantly. It's the best tool for protecting my independent business.", avatar: "RM" }
    ]
  });

  const [faqData, setFaqData] = useState<any>({
    title: 'Frequently asked questions.',
    items: [
      { question: "Are the legal documents legally binding?", answer: "Yes. Documents generated by Vidhik AI are based on verified templates used by practicing lawyers. However, they should be reviewed to ensure they meet your specific jurisdiction's requirements." },
      { question: "How secure is my data and confidential information?", answer: "We use enterprise-grade encryption for all data at rest and in transit. We do not use your proprietary documents to train public AI models. Your data remains strictly within your secure workspace." },
      { question: "Can I consult a human lawyer if I need help?", answer: "Absolutely. Our platform connects you with verified legal professionals. You can book a consultation or request a formal review of any document generated on the platform." },
      { question: "What types of documents can I generate?", answer: "You can generate a wide range of documents including Non-Disclosure Agreements, Employment Contracts, Board Resolutions, Consultant Agreements, and many more standard corporate and commercial documents." },
      { question: "Is the AI Legal Assistant giving legal advice?", answer: "The AI provides legal information, analysis of case laws, and standard interpretations, but it does not constitute formal legal advice. For definitive legal advice, we recommend consulting one of our verified lawyers." }
    ]
  });

  const [navFooterData, setNavFooterData] = useState<any>({
    brandName: 'Vidhik AI',
    logoUrl: '',
    footerTagline: 'Intelligent legal drafting, contract review, and powerful tools for modern teams.',
    copyright: '© 2026 Vidhik AI. All rights reserved.',
    statusText: 'All systems operational'
  });

  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  const [extraCreditPackages, setExtraCreditPackages] = useState<any[]>([]);
  const [creditCosts, setCreditCosts] = useState<any>({
    docGen: 5,
    docReview: 3,
    research: 2,
    chat: 1,
    precisionChat: 3
  });
  const [landingBanner, setLandingBanner] = useState<any>({
    active: false,
    message: '🎉 Launch Offer: Get 50 Extra AI Credits on Starter & Growth plans!',
    link: '#pricing'
  });
  const [userBanner, setUserBanner] = useState<any>({
    active: false,
    message: 'Welcome to Vidhik AI 3.0! New legal templates and AI review engine are now active.',
    variant: 'info'
  });
  const [lawyerBanner, setLawyerBanner] = useState<any>({
    active: false,
    message: 'Notice: Platform commission is fixed at 15%. Payouts occur every Friday.',
    variant: 'info'
  });

  // Sync state when configs array changes
  useEffect(() => {
    setHeroData({
      title: getConfig('LANDING_HERO_TITLE', 'Legal work, drafted with intelligence.'),
      subtitle: getConfig('LANDING_HERO_SUBTITLE', 'Generate professional legal documents, review contracts, and move from legal questions to usable work — faster.'),
      badge: getConfig('LANDING_HERO_BADGE', 'Get started with Vidhik AI'),
      primaryCtaText: getConfig('LANDING_HERO_PRIMARY_CTA_TEXT', 'Start Free Trial'),
      primaryCtaLink: getConfig('LANDING_HERO_PRIMARY_CTA_LINK', '/user/auth?mode=register'),
      secondaryCtaText: getConfig('LANDING_HERO_SECONDARY_CTA_TEXT', 'Watch Demo'),
      secondaryCtaLink: getConfig('LANDING_HERO_SECONDARY_CTA_LINK', '#demo'),
      trustText: getConfig('LANDING_HERO_TRUST_TEXT', 'Trusted by legal professionals'),
      statNumber: getConfig('LANDING_HERO_STAT_NUMBER', '24'),
      imageUrl: getConfig('LANDING_HERO_IMAGE', '')
    });

    const wfSteps = getConfig('LANDING_WORKFLOW_STEPS');
    setWorkflowData({
      tag: getConfig('LANDING_WORKFLOW_TAG', 'Workflow'),
      title: getConfig('LANDING_WORKFLOW_TITLE', 'From blank page to executed agreement in minutes.'),
      subtitle: getConfig('LANDING_WORKFLOW_SUBTITLE', 'Our intelligent workflow removes the friction from legal documentation, letting you focus on your actual business.'),
      steps: Array.isArray(wfSteps) ? wfSteps : workflowData.steps
    });

    const audCards = getConfig('LANDING_AUDIENCE_CARDS');
    setAudienceData({
      tag: getConfig('LANDING_AUDIENCE_TAG', 'Who it is for'),
      title: getConfig('LANDING_AUDIENCE_TITLE', 'Built for modern teams and professionals.'),
      cards: Array.isArray(audCards) ? audCards : audienceData.cards
    });

    const tItems = getConfig('LANDING_TESTIMONIALS_ITEMS');
    setTestimonialsData({
      title: getConfig('LANDING_TESTIMONIALS_TITLE', 'Trusted by professionals navigating complex work.'),
      subtitle: getConfig('LANDING_TESTIMONIALS_SUBTITLE', 'Built for founders, businesses, legal teams, and professionals who need to move through complex legal work with clarity and confidence.'),
      items: Array.isArray(tItems) ? tItems : testimonialsData.items
    });

    const fItems = getConfig('LANDING_FAQS');
    setFaqData({
      title: getConfig('LANDING_FAQ_TITLE', 'Frequently asked questions.'),
      items: Array.isArray(fItems) ? fItems : faqData.items
    });

    setNavFooterData({
      brandName: getConfig('LANDING_NAVBAR_BRAND', 'Vidhik AI'),
      logoUrl: getConfig('LANDING_LOGO_URL', ''),
      footerTagline: getConfig('LANDING_FOOTER_TAGLINE', 'Intelligent legal drafting, contract review, and powerful tools for modern teams.'),
      copyright: getConfig('LANDING_FOOTER_COPYRIGHT', '© 2026 Vidhik AI. All rights reserved.'),
      statusText: getConfig('LANDING_FOOTER_STATUS_TEXT', 'All systems operational')
    });

    const userPlans = getConfig('USER_PRICING_PLANS');
    if (Array.isArray(userPlans)) {
      setPricingPlans(JSON.parse(JSON.stringify(userPlans)));
    }

    const packages = getConfig('EXTRA_CREDIT_PACKAGES');
    if (Array.isArray(packages)) {
      setExtraCreditPackages(JSON.parse(JSON.stringify(packages)));
    }

    const costs = getConfig('USER_CREDIT_COSTS');
    if (costs && typeof costs === 'object') {
      setCreditCosts({ ...costs });
    }

    const lBanner = getConfig('LANDING_ANNOUNCEMENT_BANNER');
    if (lBanner && typeof lBanner === 'object') setLandingBanner({ ...lBanner });

    const uBanner = getConfig('USER_ANNOUNCEMENT_BANNER');
    if (uBanner && typeof uBanner === 'object') setUserBanner({ ...uBanner });

    const lawBanner = getConfig('LAWYER_ANNOUNCEMENT_BANNER');
    if (lawBanner && typeof lawBanner === 'object') setLawyerBanner({ ...lawBanner });
  }, [configs]);

  // Fetch approved lawyers for section 1.3
  const fetchLawyers = async () => {
    setLoadingLawyers(true);
    try {
      const users = await adminService.getAllUsers();
      const approved = users.filter((u: any) => u.role === 'lawyer' && u.isApproved);
      setPublicLawyers(approved);
    } catch (e) {
      console.error('Failed to load lawyers:', e);
    } finally {
      setLoadingLawyers(false);
    }
  };

  useEffect(() => {
    if (mainTab === 'landing') {
      fetchLawyers();
    }
  }, [mainTab]);

  // Single Setting Save
  const handleSingleSave = async (key: string, value: any, category: string, description?: string) => {
    try {
      setIsSaving(true);
      await onUpdate(key, value);
      toast.success(`Saved setting: ${key}`);
    } catch (e) {
      toast.error(`Failed to save ${key}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Bulk Save Handler for Panels
  const handleBulkSave = async (items: Array<{ key: string; value: any; category: string; description?: string }>) => {
    try {
      setIsSaving(true);
      await adminService.bulkUpdateConfigs(items);
      toast.success('All changes saved & live on website!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle lawyer visibility for public landing page
  const handleToggleLawyerVisibility = async (id: string, current: boolean) => {
    try {
      await adminService.toggleConsultantVisibility(id, !current);
      setPublicLawyers(prev => prev.map(l => l._id === id ? { ...l, showInConsultants: !current } : l));
      toast.success(`Lawyer ${!current ? 'added to' : 'removed from'} landing page consultation listing`);
    } catch (e) {
      toast.error('Failed to update lawyer visibility');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30 font-bold px-2.5 py-0.5">
              Production CMS Console v3.0
            </Badge>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Synced
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Website & Content Management</h2>
          <p className="text-xs text-slate-300">
            Dynamically update landing page text, pricing plans, feature credit rules, and lawyer consultation listings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search setting keys..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-slate-800/80 border-slate-700 text-white pl-9 text-xs h-9 w-60 rounded-xl focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Main 3 Panels Navigation */}
      <div className="border-b border-border bg-surface rounded-xl p-1.5 flex flex-wrap gap-1 shadow-sm">
        <button
          onClick={() => setMainTab('landing')}
          className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold transition-all ${
            mainTab === 'landing'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>1. Landing Page & Website CMS</span>
          <Badge variant="secondary" className="ml-1 text-[10px] bg-background/20">vidhikai.com</Badge>
        </button>

        <button
          onClick={() => setMainTab('user')}
          className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold transition-all ${
            mainTab === 'user'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          }`}
        >
          <User className="h-4 w-4" />
          <span>2. User Panel & AI Credit System</span>
          <Badge variant="secondary" className="ml-1 text-[10px] bg-background/20">Credits & Limits</Badge>
        </button>

        <button
          onClick={() => setMainTab('lawyer')}
          className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold transition-all ${
            mainTab === 'lawyer'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>3. Lawyer Panel & Chamber Console</span>
          <Badge variant="secondary" className="ml-1 text-[10px] bg-background/20">Consultations</Badge>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* PANEL 1: LANDING PAGE CMS                                                 */}
      {/* ========================================================================= */}
      {mainTab === 'landing' && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-lg font-bold text-foreground">Main Landing Page Controls</h3>
              <p className="text-xs text-muted-foreground">Manage text, pricing cards, FAQs, and lawyer consultation cards on vidhikai.com</p>
            </div>
            <Button
              onClick={() => {
                handleBulkSave([
                  { key: 'LANDING_HERO_TITLE', value: heroData.title, category: 'landing', description: 'Main hero title' },
                  { key: 'LANDING_HERO_SUBTITLE', value: heroData.subtitle, category: 'landing', description: 'Hero subtitle' },
                  { key: 'LANDING_HERO_BADGE', value: heroData.badge, category: 'landing', description: 'Hero badge tag' },
                  { key: 'LANDING_HERO_PRIMARY_CTA_TEXT', value: heroData.primaryCtaText, category: 'landing', description: 'Primary CTA label' },
                  { key: 'LANDING_HERO_PRIMARY_CTA_LINK', value: heroData.primaryCtaLink, category: 'landing', description: 'Primary CTA link' },
                  { key: 'LANDING_HERO_SECONDARY_CTA_TEXT', value: heroData.secondaryCtaText, category: 'landing', description: 'Secondary CTA label' },
                  { key: 'LANDING_HERO_SECONDARY_CTA_LINK', value: heroData.secondaryCtaLink, category: 'landing', description: 'Secondary CTA link' },
                  { key: 'LANDING_HERO_TRUST_TEXT', value: heroData.trustText, category: 'landing', description: 'Trust text copy' },
                  { key: 'LANDING_HERO_STAT_NUMBER', value: heroData.statNumber, category: 'landing', description: 'Floating date stat badge' },
                  { key: 'LANDING_HERO_IMAGE', value: heroData.imageUrl, category: 'landing', description: 'Hero image URL' },

                  { key: 'LANDING_WORKFLOW_TAG', value: workflowData.tag, category: 'landing', description: 'Workflow section tag' },
                  { key: 'LANDING_WORKFLOW_TITLE', value: workflowData.title, category: 'landing', description: 'Workflow section title' },
                  { key: 'LANDING_WORKFLOW_SUBTITLE', value: workflowData.subtitle, category: 'landing', description: 'Workflow section subtitle' },
                  { key: 'LANDING_WORKFLOW_STEPS', value: workflowData.steps, category: 'landing', description: 'Workflow step cards array' },

                  { key: 'LANDING_AUDIENCE_TAG', value: audienceData.tag, category: 'landing', description: 'Audience section tag' },
                  { key: 'LANDING_AUDIENCE_TITLE', value: audienceData.title, category: 'landing', description: 'Audience section title' },
                  { key: 'LANDING_AUDIENCE_CARDS', value: audienceData.cards, category: 'landing', description: 'Audience target cards array' },

                  { key: 'LANDING_TESTIMONIALS_TITLE', value: testimonialsData.title, category: 'landing', description: 'Testimonials section title' },
                  { key: 'LANDING_TESTIMONIALS_SUBTITLE', value: testimonialsData.subtitle, category: 'landing', description: 'Testimonials section subtitle' },
                  { key: 'LANDING_TESTIMONIALS_ITEMS', value: testimonialsData.items, category: 'landing', description: 'Customer reviews array' },

                  { key: 'LANDING_PRICING_PLANS', value: pricingPlans, category: 'landing', description: 'Landing page pricing plans' },
                  { key: 'USER_PRICING_PLANS', value: pricingPlans, category: 'user_panel', description: 'User panel billing plans' },

                  { key: 'LANDING_FAQ_TITLE', value: faqData.title, category: 'landing', description: 'FAQ section title' },
                  { key: 'LANDING_FAQS', value: faqData.items, category: 'landing', description: 'FAQ questions array' },

                  { key: 'LANDING_NAVBAR_BRAND', value: navFooterData.brandName, category: 'landing', description: 'Brand name' },
                  { key: 'LANDING_LOGO_URL', value: navFooterData.logoUrl, category: 'landing', description: 'Custom logo image URL' },
                  { key: 'LANDING_FOOTER_TAGLINE', value: navFooterData.footerTagline, category: 'landing', description: 'Footer tagline' },
                  { key: 'LANDING_FOOTER_COPYRIGHT', value: navFooterData.copyright, category: 'landing', description: 'Footer copyright' },
                  { key: 'LANDING_FOOTER_STATUS_TEXT', value: navFooterData.statusText, category: 'landing', description: 'System status indicator copy' },

                  { key: 'LANDING_ANNOUNCEMENT_BANNER', value: landingBanner, category: 'landing', description: 'Top alert banner' }
                ]);
              }}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-md"
            >
              <Save className="h-4 w-4" />
              <span>Save All Landing Page Changes</span>
            </Button>
          </div>

          {/* Sub Navigation */}
          <div className="flex gap-1.5 overflow-x-auto pb-2">
            <button
              onClick={() => setSubTabLanding('hero')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${
                subTabLanding === 'hero' ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface border-border text-muted-foreground'
              }`}
            >
              Hero & Badges
            </button>
            <button
              onClick={() => setSubTabLanding('workflow')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${
                subTabLanding === 'workflow' ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface border-border text-muted-foreground'
              }`}
            >
              Workflow ({workflowData.steps?.length || 0})
            </button>
            <button
              onClick={() => setSubTabLanding('audience')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${
                subTabLanding === 'audience' ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface border-border text-muted-foreground'
              }`}
            >
              Who It Is For ({audienceData.cards?.length || 0})
            </button>
            <button
              onClick={() => setSubTabLanding('testimonials')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${
                subTabLanding === 'testimonials' ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface border-border text-muted-foreground'
              }`}
            >
              Testimonials ({testimonialsData.items?.length || 0})
            </button>
            <button
              onClick={() => setSubTabLanding('pricing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${
                subTabLanding === 'pricing' ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface border-border text-muted-foreground'
              }`}
            >
              Pricing Plans ({pricingPlans.length})
            </button>
            <button
              onClick={() => setSubTabLanding('faq')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${
                subTabLanding === 'faq' ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface border-border text-muted-foreground'
              }`}
            >
              FAQ ({faqData.items?.length || 0})
            </button>
            <button
              onClick={() => setSubTabLanding('navfooter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${
                subTabLanding === 'navfooter' ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface border-border text-muted-foreground'
              }`}
            >
              Navbar & Footer
            </button>
            <button
              onClick={() => setSubTabLanding('lawyers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${
                subTabLanding === 'lawyers' ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface border-border text-muted-foreground'
              }`}
            >
              Public Lawyers ({publicLawyers.length})
            </button>
            <button
              onClick={() => setSubTabLanding('banner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${
                subTabLanding === 'banner' ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface border-border text-muted-foreground'
              }`}
            >
              Header Alert
            </button>
          </div>

          {/* 1.1 Hero Section Editor */}
          {subTabLanding === 'hero' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border shadow-xs">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Hero Section Text & CTAs
                  </CardTitle>
                  <CardDescription>Edit headlines, sub-descriptions, and CTA buttons for the landing page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Top Badge Text</label>
                    <Input
                      value={heroData.badge}
                      onChange={e => setHeroData({ ...heroData, badge: e.target.value })}
                      placeholder="e.g. AI-POWERED LEGAL PLATFORM"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Main Hero Headline</label>
                    <Textarea
                      rows={2}
                      value={heroData.title}
                      onChange={e => setHeroData({ ...heroData, title: e.target.value })}
                      placeholder="e.g. Affordable Legal Services Powered by AI"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Subtitle Description</label>
                    <Textarea
                      rows={3}
                      value={heroData.subtitle}
                      onChange={e => setHeroData({ ...heroData, subtitle: e.target.value })}
                      placeholder="Explain value proposition in 2-3 sentences..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Primary Button Text</label>
                      <Input
                        value={heroData.primaryCtaText}
                        onChange={e => setHeroData({ ...heroData, primaryCtaText: e.target.value })}
                        placeholder="e.g. Start Free Trial"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Primary Button Link</label>
                      <Input
                        value={heroData.primaryCtaLink}
                        onChange={e => setHeroData({ ...heroData, primaryCtaLink: e.target.value })}
                        placeholder="e.g. /user/auth?mode=register"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Secondary Button Text</label>
                      <Input
                        value={heroData.secondaryCtaText}
                        onChange={e => setHeroData({ ...heroData, secondaryCtaText: e.target.value })}
                        placeholder="e.g. Watch Demo"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Secondary Button Link</label>
                      <Input
                        value={heroData.secondaryCtaLink}
                        onChange={e => setHeroData({ ...heroData, secondaryCtaLink: e.target.value })}
                        placeholder="e.g. #demo"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Custom Hero Image URL (Optional)</label>
                    <Input
                      value={heroData.imageUrl}
                      onChange={e => setHeroData({ ...heroData, imageUrl: e.target.value })}
                      placeholder="https://.../hero-image.png (leave empty for default)"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Live Preview Card (Mirrors vidhikai.com visual look) */}
              <Card className="border border-purple-200/60 bg-gradient-to-b from-purple-50/70 via-white to-slate-50 text-slate-900 shadow-md flex flex-col justify-between overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs border-purple-200 bg-purple-100/60 text-purple-800 font-bold">
                      Live Preview (vidhikai.com)
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-mono">vidhikai.com</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 my-auto py-6 flex flex-col items-center text-center px-6">
                  {/* Top Pill Badge */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-xs">
                    <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-blue-600 font-bold text-[10px]">⚡</span>
                    <span>{heroData.badge || 'Get started with Vidhik AI'}</span>
                    <span className="text-slate-400">→</span>
                  </div>

                  {/* Main Display Title */}
                  <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight max-w-md">
                    {heroData.title || 'Legal work, drafted with intelligence.'}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
                    {heroData.subtitle || 'Generate professional legal documents, review contracts, and move from legal questions to usable work — faster.'}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs shadow-md">
                      {heroData.primaryCtaText || 'Start Free Trial'}
                    </button>
                    <button className="px-5 py-2.5 rounded-full bg-white text-slate-900 font-bold text-xs border border-slate-200 shadow-xs flex items-center gap-1.5">
                      <span className="text-[10px]">▷</span>
                      <span>{heroData.secondaryCtaText || 'Watch Demo'}</span>
                    </button>
                  </div>
                </CardContent>

                <div className="p-3.5 bg-white/80 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Changes sync dynamically to production landing page upon saving.</span>
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
              </Card>
            </div>
          )}

          {/* 1.2 Workflow Section Editor */}
          {subTabLanding === 'workflow' && (
            <Card className="border-border shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  Workflow Section (How It Works)
                </CardTitle>
                <CardDescription>Edit section title, subheadline, and step cards for vidhikai.com.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">Section Tag</label>
                    <Input value={workflowData.tag} onChange={e => setWorkflowData({ ...workflowData, tag: e.target.value })} />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-foreground">Section Title</label>
                    <Input value={workflowData.title} onChange={e => setWorkflowData({ ...workflowData, title: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Section Subtitle</label>
                  <Textarea rows={2} value={workflowData.subtitle} onChange={e => setWorkflowData({ ...workflowData, subtitle: e.target.value })} />
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Workflow Steps ({workflowData.steps?.length || 0})</h4>
                    <Button size="sm" variant="outline" className="h-7 text-xs font-bold gap-1 text-primary" onClick={() => {
                      const nextNum = String((workflowData.steps?.length || 0) + 1).padStart(2, '0');
                      setWorkflowData({ ...workflowData, steps: [...(workflowData.steps || []), { num: nextNum, title: 'New Step', desc: 'Description of the step...' }] });
                    }}><Plus className="h-3.5 w-3.5" /> Add Step</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workflowData.steps?.map((step: any, sIdx: number) => (
                      <div key={sIdx} className="p-3.5 border border-border rounded-xl bg-surface/50 space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="font-bold text-xs">{step.num}</Badge>
                          <button className="text-muted-foreground hover:text-red-500 text-xs p-1 font-bold" onClick={() => {
                            setWorkflowData({ ...workflowData, steps: workflowData.steps.filter((_: any, i: number) => i !== sIdx) });
                          }}>×</button>
                        </div>
                        <Input value={step.title} onChange={e => {
                          const updated = [...workflowData.steps];
                          updated[sIdx].title = e.target.value;
                          setWorkflowData({ ...workflowData, steps: updated });
                        }} className="font-bold text-xs h-8" placeholder="Step title" />
                        <Textarea rows={2} value={step.desc} onChange={e => {
                          const updated = [...workflowData.steps];
                          updated[sIdx].desc = e.target.value;
                          setWorkflowData({ ...workflowData, steps: updated });
                        }} className="text-xs" placeholder="Step description" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 1.3 Audience Section Editor */}
          {subTabLanding === 'audience' && (
            <Card className="border-border shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Audience Section (Who It Is For)
                </CardTitle>
                <CardDescription>Edit target user group cards and section title.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">Section Tag</label>
                    <Input value={audienceData.tag} onChange={e => setAudienceData({ ...audienceData, tag: e.target.value })} />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-foreground">Section Title</label>
                    <Input value={audienceData.title} onChange={e => setAudienceData({ ...audienceData, title: e.target.value })} />
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Audience Cards ({audienceData.cards?.length || 0})</h4>
                    <Button size="sm" variant="outline" className="h-7 text-xs font-bold gap-1 text-primary" onClick={() => {
                      setAudienceData({ ...audienceData, cards: [...(audienceData.cards || []), { label: 'New Target Audience', desc: 'Description of target audience...' }] });
                    }}><Plus className="h-3.5 w-3.5" /> Add Audience Card</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {audienceData.cards?.map((card: any, cIdx: number) => (
                      <div key={cIdx} className="p-3.5 border border-border rounded-xl bg-surface/50 space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary">Card #{cIdx + 1}</span>
                          <button className="text-muted-foreground hover:text-red-500 text-xs p-1 font-bold" onClick={() => {
                            setAudienceData({ ...audienceData, cards: audienceData.cards.filter((_: any, i: number) => i !== cIdx) });
                          }}>×</button>
                        </div>
                        <Input value={card.label} onChange={e => {
                          const updated = [...audienceData.cards];
                          updated[cIdx].label = e.target.value;
                          setAudienceData({ ...audienceData, cards: updated });
                        }} className="font-bold text-xs h-8" placeholder="Audience label (e.g. Startups)" />
                        <Textarea rows={2} value={card.desc} onChange={e => {
                          const updated = [...audienceData.cards];
                          updated[cIdx].desc = e.target.value;
                          setAudienceData({ ...audienceData, cards: updated });
                        }} className="text-xs" placeholder="Audience card description" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 1.4 Testimonials Section Editor */}
          {subTabLanding === 'testimonials' && (
            <Card className="border-border shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Customer Reviews & Testimonials
                </CardTitle>
                <CardDescription>Edit customer reviews, quotes, company names, and featured highlight toggles.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Section Title</label>
                  <Input value={testimonialsData.title} onChange={e => setTestimonialsData({ ...testimonialsData, title: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Section Subtitle</label>
                  <Textarea rows={2} value={testimonialsData.subtitle} onChange={e => setTestimonialsData({ ...testimonialsData, subtitle: e.target.value })} />
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Review Cards ({testimonialsData.items?.length || 0})</h4>
                    <Button size="sm" variant="outline" className="h-7 text-xs font-bold gap-1 text-primary" onClick={() => {
                      const newT = { id: `t${Date.now()}`, name: 'New Customer', role: 'Founder', company: 'Tech Inc', text: 'Vidhik AI is an amazing platform...', avatar: 'NC', featured: false };
                      setTestimonialsData({ ...testimonialsData, items: [...(testimonialsData.items || []), newT] });
                    }}><Plus className="h-3.5 w-3.5" /> Add Review</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {testimonialsData.items?.map((item: any, tIdx: number) => (
                      <div key={tIdx} className={`p-4 border rounded-xl bg-surface/50 space-y-2.5 relative ${item.featured ? 'border-primary ring-1 ring-primary/20' : 'border-border'}`}>
                        <div className="flex items-center justify-between">
                          <Badge variant={item.featured ? 'default' : 'outline'} className="text-[10px]">
                            {item.featured ? 'Featured Center Card' : `Card #${tIdx + 1}`}
                          </Badge>
                          <button className="text-muted-foreground hover:text-red-500 text-xs p-1 font-bold" onClick={() => {
                            setTestimonialsData({ ...testimonialsData, items: testimonialsData.items.filter((_: any, i: number) => i !== tIdx) });
                          }}>×</button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Input value={item.name} onChange={e => {
                            const updated = [...testimonialsData.items];
                            updated[tIdx].name = e.target.value;
                            setTestimonialsData({ ...testimonialsData, items: updated });
                          }} className="font-bold text-xs h-7" placeholder="Name" />
                          <Input value={item.avatar} onChange={e => {
                            const updated = [...testimonialsData.items];
                            updated[tIdx].avatar = e.target.value;
                            setTestimonialsData({ ...testimonialsData, items: updated });
                          }} className="text-xs h-7 font-mono" placeholder="Initials (e.g. PS)" />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Input value={item.role} onChange={e => {
                            const updated = [...testimonialsData.items];
                            updated[tIdx].role = e.target.value;
                            setTestimonialsData({ ...testimonialsData, items: updated });
                          }} className="text-xs h-7" placeholder="Role (e.g. Founder)" />
                          <Input value={item.company || ''} onChange={e => {
                            const updated = [...testimonialsData.items];
                            updated[tIdx].company = e.target.value;
                            setTestimonialsData({ ...testimonialsData, items: updated });
                          }} className="text-xs h-7" placeholder="Company (Optional)" />
                        </div>

                        <Textarea rows={3} value={item.text} onChange={e => {
                          const updated = [...testimonialsData.items];
                          updated[tIdx].text = e.target.value;
                          setTestimonialsData({ ...testimonialsData, items: updated });
                        }} className="text-xs" placeholder="Review quote text" />

                        <div className="flex items-center justify-between pt-1 border-t border-border">
                          <span className="text-[11px] font-semibold">Center Highlight</span>
                          <Switch checked={item.featured === true} onCheckedChange={checked => {
                            const updated = testimonialsData.items.map((it: any, i: number) => ({ ...it, featured: i === tIdx ? checked : false }));
                            setTestimonialsData({ ...testimonialsData, items: updated });
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 1.5 FAQ Section Editor */}
          {subTabLanding === 'faq' && (
            <Card className="border-border shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  Frequently Asked Questions (FAQ)
                </CardTitle>
                <CardDescription>Edit section title and question/answer accordion cards.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Section Title</label>
                  <Input value={faqData.title} onChange={e => setFaqData({ ...faqData, title: e.target.value })} />
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">FAQ Q&A Items ({faqData.items?.length || 0})</h4>
                    <Button size="sm" variant="outline" className="h-7 text-xs font-bold gap-1 text-primary" onClick={() => {
                      setFaqData({ ...faqData, items: [...(faqData.items || []), { question: 'New Question?', answer: 'Answer details...' }] });
                    }}><Plus className="h-3.5 w-3.5" /> Add FAQ Item</Button>
                  </div>

                  <div className="space-y-3">
                    {faqData.items?.map((faqItem: any, fIdx: number) => (
                      <div key={fIdx} className="p-3.5 border border-border rounded-xl bg-surface/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary">Question #{fIdx + 1}</span>
                          <button className="text-muted-foreground hover:text-red-500 text-xs p-1 font-bold" onClick={() => {
                            setFaqData({ ...faqData, items: faqData.items.filter((_: any, i: number) => i !== fIdx) });
                          }}>×</button>
                        </div>
                        <Input value={faqItem.question} onChange={e => {
                          const updated = [...faqData.items];
                          updated[fIdx].question = e.target.value;
                          setFaqData({ ...faqData, items: updated });
                        }} className="font-bold text-xs h-8" placeholder="Question" />
                        <Textarea rows={2} value={faqItem.answer} onChange={e => {
                          const updated = [...faqData.items];
                          updated[fIdx].answer = e.target.value;
                          setFaqData({ ...faqData, items: updated });
                        }} className="text-xs" placeholder="Answer" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 1.6 Navbar & Footer Section Editor */}
          {subTabLanding === 'navfooter' && (
            <Card className="border-border shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Layout className="h-4 w-4 text-primary" />
                  Navbar & Footer Branding Controls
                </CardTitle>
                <CardDescription>Edit brand name, custom logo URL, footer tagline, copyright statement, and status bar text.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Brand Name</label>
                    <Input value={navFooterData.brandName} onChange={e => setNavFooterData({ ...navFooterData, brandName: e.target.value })} placeholder="e.g. Vidhik AI" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Custom Logo Image URL</label>
                    <Input value={navFooterData.logoUrl} onChange={e => setNavFooterData({ ...navFooterData, logoUrl: e.target.value })} placeholder="https://.../logo.png (leave empty for default local logo)" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Footer Subtitle Tagline</label>
                  <Textarea rows={2} value={navFooterData.footerTagline} onChange={e => setNavFooterData({ ...navFooterData, footerTagline: e.target.value })} placeholder="Footer tagline copy..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Copyright Statement</label>
                    <Input value={navFooterData.copyright} onChange={e => setNavFooterData({ ...navFooterData, copyright: e.target.value })} placeholder="© 2026 Vidhik AI. All rights reserved." />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">System Status Indicator Text</label>
                    <Input value={navFooterData.statusText} onChange={e => setNavFooterData({ ...navFooterData, statusText: e.target.value })} placeholder="e.g. All systems operational" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 1.7 Pricing Plans Manager */}
          {subTabLanding === 'pricing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Dynamically add, edit, or customize pricing packages shown on vidhikai.com and user checkout pages.
                </p>
                <Button
                  onClick={() => {
                    const newPlan = {
                      id: `plan-${Date.now()}`,
                      name: 'Custom Plan',
                      priceMonthly: 999,
                      priceYearly: 9990,
                      monthlyCredits: 300,
                      desc: 'New customized pricing plan',
                      features: ['300 Monthly AI Credits', 'Full Document Review', 'Priority Support'],
                      gradient: 'from-blue-500 to-indigo-600',
                      popular: false,
                      iconName: 'Sparkles',
                      cta: 'Choose Custom Plan',
                      disabled: false,
                      limits: { monthlyCredits: 300, maxChatWords: 10000, maxDocGenWords: 10000, maxDocReviewWords: 20000 }
                    };
                    setPricingPlans([...pricingPlans, newPlan]);
                  }}
                  variant="outline"
                  size="sm"
                  className="gap-2 font-bold text-primary"
                >
                  <Plus className="h-4 w-4" />
                  Add Pricing Plan
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricingPlans.map((plan: any, idx: number) => (
                  <Card key={idx} className={`border ${plan.popular ? 'border-primary shadow-lg ring-1 ring-primary/30' : 'border-border'} relative`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-sm">
                        Most Popular
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Input
                          value={plan.name}
                          onChange={e => {
                            const updated = [...pricingPlans];
                            updated[idx].name = e.target.value;
                            setPricingPlans(updated);
                          }}
                          className="font-bold text-base h-8 w-36"
                        />
                        <button
                          onClick={() => {
                            const updated = pricingPlans.filter((_, i) => i !== idx);
                            setPricingPlans(updated);
                          }}
                          className="text-muted-foreground hover:text-red-500 p-1"
                          title="Delete Plan"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <Input
                        value={plan.desc}
                        onChange={e => {
                          const updated = [...pricingPlans];
                          updated[idx].desc = e.target.value;
                          setPricingPlans(updated);
                        }}
                        className="text-xs text-muted-foreground h-7 mt-1"
                        placeholder="Plan description..."
                      />
                    </CardHeader>

                    <CardContent className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-2 p-2.5 bg-muted/40 rounded-xl">
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Monthly (₹)</label>
                          <Input
                            type="number"
                            value={plan.priceMonthly}
                            onChange={e => {
                              const updated = [...pricingPlans];
                              updated[idx].priceMonthly = Number(e.target.value);
                              setPricingPlans(updated);
                            }}
                            className="h-7 font-bold text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Monthly Credits</label>
                          <Input
                            type="number"
                            value={plan.monthlyCredits}
                            onChange={e => {
                              const updated = [...pricingPlans];
                              updated[idx].monthlyCredits = Number(e.target.value);
                              setPricingPlans(updated);
                            }}
                            className="h-7 font-bold text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Plan Features</label>
                          <button
                            onClick={() => {
                              const updated = [...pricingPlans];
                              updated[idx].features = [...(updated[idx].features || []), 'New Feature Item'];
                              setPricingPlans(updated);
                            }}
                            className="text-[10px] font-bold text-primary hover:underline"
                          >
                            + Add Feature
                          </button>
                        </div>
                        {plan.features?.map((feat: string, fIdx: number) => (
                          <div key={fIdx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <Input
                              value={feat}
                              onChange={e => {
                                const updated = [...pricingPlans];
                                updated[idx].features[fIdx] = e.target.value;
                                setPricingPlans(updated);
                              }}
                              className="h-7 text-xs flex-1"
                            />
                            <button
                              onClick={() => {
                                const updated = [...pricingPlans];
                                updated[idx].features = updated[idx].features.filter((_: any, i: number) => i !== fIdx);
                                setPricingPlans(updated);
                              }}
                              className="text-muted-foreground hover:text-red-500 p-0.5"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-[11px] font-semibold text-foreground">Mark as Most Popular</span>
                        <Switch
                          checked={plan.popular === true}
                          onCheckedChange={checked => {
                            const updated = pricingPlans.map((p, i) => ({
                              ...p,
                              popular: i === idx ? checked : false
                            }));
                            setPricingPlans(updated);
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 1.3 Public Lawyer Consultation Listings */}
          {subTabLanding === 'lawyers' && (
            <Card className="border-border shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Public Lawyer Consultation Cards (vidhikai.com)
                    </CardTitle>
                    <CardDescription>
                      Toggle which verified lawyers are displayed in the "Consult Top Lawyers" section on the landing page.
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={fetchLawyers} disabled={loadingLawyers} className="gap-1.5 text-xs">
                    <RefreshCw className={`h-3.5 w-3.5 ${loadingLawyers ? 'animate-spin' : ''}`} />
                    Refresh Lawyers
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingLawyers ? (
                  <div className="p-8 text-center text-xs text-muted-foreground">Loading approved lawyers...</div>
                ) : publicLawyers.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted-foreground">No approved lawyers found in database.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {publicLawyers.map(lawyer => (
                      <div key={lawyer._id} className="p-4 border border-border rounded-xl bg-surface flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                            {lawyer.fullName?.charAt(0) || 'L'}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-sm text-foreground truncate">{lawyer.fullName}</h4>
                            <p className="text-xs text-primary font-medium">{lawyer.expertise || 'Legal Practitioner'}</p>
                            <p className="text-[11px] text-muted-foreground">{lawyer.experience || 'Experienced'} • {lawyer.location || 'India'}</p>
                            <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-block">
                              Fee: ₹{lawyer.hourlyRate || 500} / consult
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Landing Page</span>
                          <Switch
                            checked={lawyer.showInConsultants !== false}
                            onCheckedChange={() => handleToggleLawyerVisibility(lawyer._id, lawyer.showInConsultants !== false)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 1.4 Top Banner Announcement */}
          {subTabLanding === 'banner' && (
            <Card className="border-border shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-primary" />
                  Header Announcement Alert Bar (vidhikai.com)
                </CardTitle>
                <CardDescription>Display a prominent notification bar at the very top of the website.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-surface">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Enable Website Header Alert</h4>
                    <p className="text-xs text-muted-foreground">Show announcement bar at top of landing page</p>
                  </div>
                  <Switch
                    checked={landingBanner.active === true}
                    onCheckedChange={checked => setLandingBanner({ ...landingBanner, active: checked })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Announcement Message</label>
                  <Input
                    value={landingBanner.message}
                    onChange={e => setLandingBanner({ ...landingBanner, message: e.target.value })}
                    placeholder="e.g. 🎉 Special Launch Offer: Get 50 Extra AI Credits..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Target Link / Section Anchor</label>
                  <Input
                    value={landingBanner.link}
                    onChange={e => setLandingBanner({ ...landingBanner, link: e.target.value })}
                    placeholder="e.g. #pricing or /user/auth"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PANEL 2: USER PANEL & CREDIT SYSTEM                                       */}
      {/* ========================================================================= */}
      {mainTab === 'user' && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-lg font-bold text-foreground">User Panel & AI Credit Allocation Console</h3>
              <p className="text-xs text-muted-foreground">Configure AI credit consumption per action, extra credit packages, and feature toggles</p>
            </div>
            <Button
              onClick={() => {
                handleBulkSave([
                  { key: 'USER_CREDIT_COSTS', value: creditCosts, category: 'user_panel', description: 'Per-feature credit consumption rules' },
                  { key: 'EXTRA_CREDIT_PACKAGES', value: extraCreditPackages, category: 'user_panel', description: 'Extra credit top-up packages' },
                  { key: 'USER_ANNOUNCEMENT_BANNER', value: userBanner, category: 'user_panel', description: 'User panel notice banner' }
                ]);
              }}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-md"
            >
              <Save className="h-4 w-4" />
              <span>Save User Panel Settings</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 2.1 Per-Feature Credit Consumption Rules */}
            <Card className="border-border shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  AI Feature Credit Consumption Matrix
                </CardTitle>
                <CardDescription>Set how many AI credits are deducted for each user action.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-border rounded-xl bg-surface">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Document Generation</h4>
                    <p className="text-[11px] text-muted-foreground">Credits charged per document drafted</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={creditCosts.docGen}
                      onChange={e => setCreditCosts({ ...creditCosts, docGen: Number(e.target.value) })}
                      className="w-20 h-8 text-xs font-bold font-mono text-right"
                    />
                    <span className="text-xs text-muted-foreground font-semibold">credits</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-xl bg-surface">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Contract & Document Review</h4>
                    <p className="text-[11px] text-muted-foreground">Credits charged per document audit</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={creditCosts.docReview}
                      onChange={e => setCreditCosts({ ...creditCosts, docReview: Number(e.target.value) })}
                      className="w-20 h-8 text-xs font-bold font-mono text-right"
                    />
                    <span className="text-xs text-muted-foreground font-semibold">credits</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-xl bg-surface">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Legal Case Research</h4>
                    <p className="text-[11px] text-muted-foreground">Credits charged per citation search query</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={creditCosts.research}
                      onChange={e => setCreditCosts({ ...creditCosts, research: Number(e.target.value) })}
                      className="w-20 h-8 text-xs font-bold font-mono text-right"
                    />
                    <span className="text-xs text-muted-foreground font-semibold">credits</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-xl bg-surface">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Standard AI Legal Chat</h4>
                    <p className="text-[11px] text-muted-foreground">Credits charged per standard chat query</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={creditCosts.chat}
                      onChange={e => setCreditCosts({ ...creditCosts, chat: Number(e.target.value) })}
                      className="w-20 h-8 text-xs font-bold font-mono text-right"
                    />
                    <span className="text-xs text-muted-foreground font-semibold">credits</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-xl bg-surface">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">High-Precision Extended Analysis</h4>
                    <p className="text-[11px] text-muted-foreground">Credits charged for deep legal reasoning</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={creditCosts.precisionChat}
                      onChange={e => setCreditCosts({ ...creditCosts, precisionChat: Number(e.target.value) })}
                      className="w-20 h-8 text-xs font-bold font-mono text-right"
                    />
                    <span className="text-xs text-muted-foreground font-semibold">credits</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2.2 Extra Credit Top-Up Packages */}
            <Card className="border-border shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      Extra Credit Top-Up Packages
                    </CardTitle>
                    <CardDescription>Packages users can purchase to add non-expiring extra credits.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {extraCreditPackages.map((pkg: any, idx: number) => (
                  <div key={idx} className="p-3 border border-border rounded-xl bg-surface flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs font-bold bg-primary/10 text-primary border-primary/20">
                        +{pkg.credits} Credits
                      </Badge>
                      <span className="font-semibold text-foreground">{pkg.desc || `${pkg.credits} Credits Top-up`}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-muted-foreground">Price: ₹</span>
                      <Input
                        type="number"
                        value={pkg.price}
                        onChange={e => {
                          const updated = [...extraCreditPackages];
                          updated[idx].price = Number(e.target.value);
                          setExtraCreditPackages(updated);
                        }}
                        className="w-20 h-7 text-xs font-bold text-right"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* 2.3 User Dashboard Broadcast Banner */}
          <Card className="border-border shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-primary" />
                User Dashboard Broadcast Notice
              </CardTitle>
              <CardDescription>Broadcast an alert message visible to all users upon logging into their dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-surface">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Enable Dashboard Announcement Bar</h4>
                  <p className="text-xs text-muted-foreground">Display banner across User Panel header</p>
                </div>
                <Switch
                  checked={userBanner.active === true}
                  onCheckedChange={checked => setUserBanner({ ...userBanner, active: checked })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Broadcast Message Text</label>
                <Input
                  value={userBanner.message}
                  onChange={e => setUserBanner({ ...userBanner, message: e.target.value })}
                  placeholder="e.g. System Notice: New AI document templates added..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PANEL 3: LAWYER PANEL CMS & CHAMBER RULES                                 */}
      {/* ========================================================================= */}
      {mainTab === 'lawyer' && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-lg font-bold text-foreground">Lawyer Panel & Consultation Rules Console</h3>
              <p className="text-xs text-muted-foreground">Manage platform commissions, payout thresholds, and lawyer portal announcements</p>
            </div>
            <Button
              onClick={() => {
                handleBulkSave([
                  { key: 'LAWYER_DASHBOARD_ANNOUNCEMENT', value: lawyerBanner.message, category: 'lawyer_panel', description: 'Lawyer portal announcement message' },
                  { key: 'LAWYER_ANNOUNCEMENT_BANNER', value: lawyerBanner, category: 'lawyer_panel', description: 'Lawyer banner config' }
                ]);
              }}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-md"
            >
              <Save className="h-4 w-4" />
              <span>Save Lawyer Panel Rules</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Financial Commission Rules */}
            <Card className="border-border shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  Financial Commission & Tax Deduction Rules
                </CardTitle>
                <CardDescription>Configure platform fees deducted from lawyer consultations & milestone payouts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-border rounded-xl bg-surface space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Base Platform Commission (%)</h4>
                      <p className="text-[11px] text-muted-foreground">Percentage retained by platform on consultations</p>
                    </div>
                    <span className="text-sm font-mono font-bold text-primary">
                      {getConfig('USER_LAWYER_BOOKING_BASE_COMMISSION_PERCENT', 15)}%
                    </span>
                  </div>
                  <Slider
                    value={[getConfig('USER_LAWYER_BOOKING_BASE_COMMISSION_PERCENT', 15)]}
                    max={50}
                    step={1}
                    onValueChange={val => handleSingleSave('USER_LAWYER_BOOKING_BASE_COMMISSION_PERCENT', val[0], 'lawyer_panel')}
                  />
                </div>

                <div className="p-4 border border-border rounded-xl bg-surface space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Tax Deducted at Source (TDS %)</h4>
                      <p className="text-[11px] text-muted-foreground">Statutory TDS rate applied on lawyer payouts</p>
                    </div>
                    <span className="text-sm font-mono font-bold text-primary">
                      {getConfig('LAWYER_PAYMENT_TDS_PERCENT', 10)}%
                    </span>
                  </div>
                  <Slider
                    value={[getConfig('LAWYER_PAYMENT_TDS_PERCENT', 10)]}
                    max={30}
                    step={1}
                    onValueChange={val => handleSingleSave('LAWYER_PAYMENT_TDS_PERCENT', val[0], 'lawyer_panel')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lawyer Dashboard Notice */}
            <Card className="border-border shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-primary" />
                  Lawyer Chamber Announcement Notice
                </CardTitle>
                <CardDescription>Banner notice displayed to lawyers on their chamber dashboard.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-surface">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Enable Lawyer Portal Banner</h4>
                    <p className="text-xs text-muted-foreground">Show announcement bar in lawyer chamber console</p>
                  </div>
                  <Switch
                    checked={lawyerBanner.active === true}
                    onCheckedChange={checked => setLawyerBanner({ ...lawyerBanner, active: checked })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Notice Text Message</label>
                  <Textarea
                    rows={3}
                    value={lawyerBanner.message}
                    onChange={e => setLawyerBanner({ ...lawyerBanner, message: e.target.value })}
                    placeholder="e.g. Weekly payout cycles occur every Friday for all completed milestones..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Raw JSON Debug Accordion for Power Users */}
      <div className="mt-8 border border-border rounded-xl overflow-hidden bg-surface">
        <details className="group">
          <summary className="flex cursor-pointer items-center justify-between px-5 py-3.5 text-xs font-bold text-muted-foreground hover:bg-muted/40 transition-colors">
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Advanced Raw Configuration Inspector (JSON)
            </span>
            <span className="transition group-open:rotate-180">▼</span>
          </summary>
          <div className="p-5 border-t border-border space-y-3">
            <p className="text-xs text-muted-foreground">
              Inspect all raw system configuration key-value documents in MongoDB.
            </p>
            <div className="bg-slate-950 text-slate-100 p-4 rounded-xl overflow-x-auto font-mono text-[11px] max-h-96 leading-relaxed">
              <pre>{JSON.stringify(configs, null, 2)}</pre>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
