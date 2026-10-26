import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  FileText,
  Lock,
  ShieldCheck,
  HelpCircle,
  BookOpen,
  Activity,
  Plus,
  Trash2,
  Save,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Globe,
  Clock,
  Layers,
  Search,
  Eye,
  Edit3
} from 'lucide-react';
import { toast } from 'sonner';

export interface CmsSectionItem {
  id?: string;
  title: string;
  content: string;
}

export interface CmsPageConfig {
  title: string;
  slug: string;
  category: 'Legal' | 'Support' | 'Company';
  subtitle: string;
  lastUpdated: string;
  isPublished: boolean;
  contentHtml?: string;
  sections: CmsSectionItem[];
}

export const INITIAL_DEFAULT_PAGES: Record<string, CmsPageConfig> = {
  'privacy-policy': {
    title: "Privacy Policy",
    slug: "privacy-policy",
    category: "Legal",
    subtitle: "How Vidhik AI collects, encrypts, and protects your personal and confidential legal documents.",
    lastUpdated: "October 2026",
    isPublished: true,
    sections: [
      {
        id: "collection",
        title: "1. Information We Collect",
        content: `At Vidhik AI, we collect minimal information necessary to deliver high-performance legal drafting and consultation services. This includes:
• Account Credentials: Your full name, verified email address, phone number, and authentication tokens.
• Legal Document Inputs: Contracts, draft clauses, party details, and uploaded files submitted for automated review or generation.
• Payment Identifiers: Billing contact information and transactional tokens managed strictly by our PCI-DSS compliant partner, Razorpay. We do not store raw credit/debit card numbers.
• Telemetry & System Logs: Browser details, IP addresses for session security, and access timestamps.`
      },
      {
        id: "ai-retention",
        title: "2. Zero AI Model Training on Private Data",
        content: `Your legal documents belong entirely to you. Vidhik AI enforces a strict non-training policy:
• We NEVER use your confidential legal contracts, personal prompts, or audit feedback to train or fine-tune public foundation AI models.
• Documents processed through our neural clause engines are isolated in encrypted sandboxes during runtime and immediately purged from memory once generation completes.
• Only you and the parties you explicitly authorize have access to the contents of your workspace.`
      },
      {
        id: "usage",
        title: "3. How We Use Your Information",
        content: `We process your data exclusively to:
• Generate and format custom legal agreements, petitions, and corporate resolutions.
• Run automated compliance audits, risk flagging, and statutory references.
• Facilitate secure video consultations with verified legal advocates on our marketplace.
• Comply with legal obligations under applicable Indian statutes, including the Information Technology Act, 2000 and Digital Personal Data Protection Act, 2023.`
      },
      {
        id: "security",
        title: "4. Security & AES-256 Encryption",
        content: `We protect your documents with enterprise-grade safeguards:
• In-Transit: All network communications are secured via TLS 1.3 with SHA-256 cryptographic signatures.
• At-Rest: All documents and backups stored in our database clusters are encrypted using AES-256.
• Digital Signatures: Generated signatures are timestamped and tied with cryptographic hashes to prevent tampering.`
      },
      {
        id: "user-rights",
        title: "5. Your Data Control & Deletion Rights",
        content: `You maintain complete sovereignty over your information:
• Instant Export: Export your document repository anytime in PDF, DOCX, or JSON formats.
• Permanent Purge: Request full deletion of your user account, consultation logs, and documents with immediate database removal.
• Contact: For privacy questions, reach our Data Protection Officer at privacy@vidhikai.com.`
      }
    ]
  },

  'terms-of-service': {
    title: "Terms of Service",
    slug: "terms-of-service",
    category: "Legal",
    subtitle: "Terms and conditions governing your use of Vidhik AI tools, AI generation, and marketplace services.",
    lastUpdated: "October 2026",
    isPublished: true,
    sections: [
      {
        id: "acceptance",
        title: "1. Acceptance of Terms",
        content: `By creating an account, accessing our portal, or generating documents on Vidhik AI, you agree to comply with and be bound by these Terms of Service. If you are entering into this agreement on behalf of a business entity, you warrant that you possess the authority to bind that entity.`
      },
      {
        id: "service-scope",
        title: "2. Nature of Platform & Legal Information Notice",
        content: `Vidhik AI is an advanced legal technology software platform offering automated document drafting, clause review, and a directory of verified independent advocates.
• Informational & Assistance Tool: Vidhik AI does not operate as a law firm and does not directly provide legal advice.
• Independent Advocates: Advocates listed on our marketplace are independent practitioners governed by the Bar Council of India rules. Engagements made during video consultations establish a direct advocate-client relationship.
• Discretion: While our AI models are trained on Indian statutory standards, users are encouraged to obtain independent legal counsel for high-stakes litigation.`
      },
      {
        id: "ownership",
        title: "3. Document Ownership & Intellectual Property",
        content: `• User Ownership: You retain 100% exclusive copyright and ownership over all customized documents, contracts, and briefs created using Vidhik AI.
• Platform Rights: Vidhik AI retains all proprietary rights, trademarks, algorithms, UI components, and software code powering the platform.`
      },
      {
        id: "subscriptions",
        title: "4. Subscriptions, Credits & Billing",
        content: `• Quotas: Monthly plans provide monthly credit allocations that reset each billing cycle. Extra purchased credit top-ups never expire and roll over.
• Payments: Subscriptions are billed through Razorpay. You may cancel automated renewals at any time from your Billing Dashboard.
• Refund Policy: We offer a 7-day satisfaction guarantee on initial subscription signups upon contacting support.`
      },
      {
        id: "governing-law",
        title: "5. Dispute Resolution & Jurisdiction",
        content: `These terms are governed by the laws of India. Any disputes arising out of or related to Vidhik AI shall be subject to the exclusive jurisdiction of the competent courts located in New Delhi, India.`
      }
    ]
  },

  'security': {
    title: "Security & Trust",
    slug: "security",
    category: "Legal",
    subtitle: "Enterprise-grade protection, encrypted sandboxing, and compliance architecture guarding your legal assets.",
    lastUpdated: "October 2026",
    isPublished: true,
    sections: [
      {
        id: "encryption-standards",
        title: "1. Bank-Grade Cryptography",
        content: `Every byte of legal data stored or transmitted through Vidhik AI is shielded:
• AES-256 Storage: All active document stores, revision histories, and database backups are encrypted with AES-256 keys managed in secure Hardware Security Modules (HSMs).
• TLS 1.3 in Transit: Strict HTTPS with forward secrecy guarantees that eavesdropping or man-in-the-middle attacks are impossible.`
      },
      {
        id: "tenant-isolation",
        title: "2. Logical Tenant Sandboxing",
        content: `• Data Partitioning: Multi-tenant database schemas enforce strict tenant isolation keys. A customer can never access another organization's drafts or clause analysis.
• Ephemeral AI Processing: Text sent to our AI microservices is held in transient memory solely for the processing duration, never cached to persistent shared disks.`
      },
      {
        id: "compliance",
        title: "3. Compliance & Statutory Alignment",
        content: `• Digital Personal Data Protection (DPDP) Act, 2023 compliant architecture.
• ISO/IEC 27001 aligned security frameworks with continuous vulnerability monitoring.
• PCI-DSS Level 1 certified payment processing handled exclusively via Razorpay.`
      },
      {
        id: "audits",
        title: "4. Vulnerability Management & Uptime",
        content: `• Automated daily vulnerability scans and third-party penetration testing.
• 99.98% historic uptime SLA with multi-zone automated failovers across Tier-4 data centers.
• Comprehensive audit logs recording every login, signature stamping, and document modification.`
      }
    ]
  },

  'help-center': {
    title: "Help Center",
    slug: "help-center",
    category: "Support",
    subtitle: "Guides, troubleshooting, and answers to help you get the most out of Vidhik AI.",
    lastUpdated: "October 2026",
    isPublished: true,
    sections: [
      {
        id: "getting-started",
        title: "Getting Started with Vidhik AI",
        content: `New to Vidhik AI? Here are the core workflows:
1. Select a Document Template: Navigate to Services or AI Document Generator and pick from 100+ standard Indian legal agreements.
2. Answer the Guided Questionnaire: Provide party names, jurisdiction, consideration amount, and custom terms.
3. Review & Edit in Real-Time: Use our rich text editor to tweak clauses, customize headers, and format typography.
4. Add Digital Signatures: Choose from Draw, Type, or Upload signature options, complete with organization and designation alignment.`
      },
      {
        id: "clause-audit",
        title: "Document Review & Clause Audit",
        content: `How our AI Clause Audit works:
• Upload any existing contract (.pdf, .docx, or .txt).
• Our neural audit models scan for ambiguous wording, non-compete liabilities, missing indemnity protections, and statutory conflicts.
• Click or hover on highlighted clauses to inspect the issue and apply the one-click recommended revision.`
      },
      {
        id: "advocate-consultations",
        title: "Advocate Consultations & Video Booking",
        content: `How to consult verified lawyers:
• Browse verified advocates by practice area (Corporate, Criminal, Property, Family, Intellectual Property).
• Choose an available slot and book directly.
• Join the end-to-end encrypted video consultation room directly from your browser with built-in document sharing.`
      },
      {
        id: "billing-support",
        title: "Billing, Invoices & Upgrades",
        content: `Manage your plan directly from the Dashboard:
• View real-time credit balances and monthly renewal dates.
• Download GST-compliant tax invoices for corporate reimbursements.
• Top up extra credits anytime without changing your monthly tier.`
      }
    ]
  },

  'documentation': {
    title: "Documentation",
    slug: "documentation",
    category: "Support",
    subtitle: "Complete platform reference, feature guides, and API integration documentation.",
    lastUpdated: "October 2026",
    isPublished: true,
    sections: [
      {
        id: "platform-overview",
        title: "Platform Architecture Overview",
        content: `Vidhik AI combines state-of-the-art Large Language Models with specialized Indian legal ontologies. The system is split into three decoupled engines:
• Drafting Engine: Generates legally structured contracts with valid recital, clause, representation, and execution blocks.
• Audit Engine: Computes a statutory compliance score (0-100%) and extracts high, medium, and low risk clauses.
• Identity & Signature Engine: Attaches cryptographically stamped digital signatures with signer designation and date.`
      },
      {
        id: "prompting-best-practices",
        title: "Best Practices for Custom Clauses",
        content: `To achieve maximum accuracy when generating custom clauses:
• Specify the governing jurisdiction clearly (e.g., 'Governed by the laws of Karnataka, India').
• Define dispute resolution mechanisms (e.g., 'Sole arbitrator appointed under the Arbitration and Conciliation Act, 1996, seated in Bangalore').
• Explicitly state monetary liability caps and tenure periods.`
      },
      {
        id: "export-formats",
        title: "Export & PDF Generation Specifications",
        content: `• Standard A4 pagination with 1-inch printable margins.
• Automatic header, footer, and signature block containment to prevent page overflows.
• Vector typography rendering matching Indian court formatting standards.`
      }
    ]
  },

  'status': {
    title: "System Status",
    slug: "status",
    category: "Support",
    subtitle: "Real-time service uptime, performance metrics, and infrastructure health.",
    lastUpdated: "October 2026",
    isPublished: true,
    sections: [
      {
        id: "uptime-summary",
        title: "Service Reliability & Operational Health",
        content: `All Vidhik AI core production systems are fully operational with normal response latencies. Below is the live breakdown of our microservices and external gateways.`
      }
    ]
  }
};

const PAGE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  'privacy-policy': Lock,
  'terms-of-service': FileText,
  'security': ShieldCheck,
  'help-center': HelpCircle,
  'documentation': BookOpen,
  'status': Activity,
};

interface AdminPagesManagerProps {
  configs: any[];
  onUpdate: (key: string, value: any) => Promise<void>;
}

export const AdminPagesManager: React.FC<AdminPagesManagerProps> = ({ configs, onUpdate }) => {
  const [selectedSlug, setSelectedSlug] = useState<string>('privacy-policy');
  const [pageData, setPageData] = useState<CmsPageConfig>(INITIAL_DEFAULT_PAGES['privacy-policy']);
  const [isSaving, setIsSaving] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<'editor' | 'preview'>('editor');
  const [searchFilter, setSearchFilter] = useState('');

  // Extract config key helper
  const getConfigKeyForSlug = (slug: string) => `PAGE_CONTENT_${slug.toUpperCase().replace(/-/g, '_')}`;

  // Load config from configs array whenever selectedSlug or configs change
  useEffect(() => {
    const key = getConfigKeyForSlug(selectedSlug);
    const existing = configs.find((c: any) => c.key === key);

    if (existing && existing.value) {
      try {
        const parsed = typeof existing.value === 'string' ? JSON.parse(existing.value) : existing.value;
        setPageData({
          ...INITIAL_DEFAULT_PAGES[selectedSlug],
          ...parsed,
          slug: selectedSlug
        });
      } catch (e) {
        setPageData({
          ...INITIAL_DEFAULT_PAGES[selectedSlug],
          slug: selectedSlug
        });
      }
    } else if (INITIAL_DEFAULT_PAGES[selectedSlug]) {
      setPageData(INITIAL_DEFAULT_PAGES[selectedSlug]);
    } else {
      setPageData({
        title: selectedSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        slug: selectedSlug,
        category: 'Legal',
        subtitle: '',
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        isPublished: true,
        sections: [
          { title: 'Overview', content: 'Enter the page content details here.' }
        ]
      });
    }
  }, [selectedSlug, configs]);

  // Section manipulation helpers
  const handleUpdateSection = (index: number, field: keyof CmsSectionItem, val: string) => {
    const nextSections = [...pageData.sections];
    nextSections[index] = { ...nextSections[index], [field]: val };
    setPageData({ ...pageData, sections: nextSections });
  };

  const handleAddSection = () => {
    const newSec: CmsSectionItem = {
      id: `sec-${Date.now()}`,
      title: `New Section ${pageData.sections.length + 1}`,
      content: ''
    };
    setPageData({ ...pageData, sections: [...pageData.sections, newSec] });
  };

  const handleRemoveSection = (index: number) => {
    if (pageData.sections.length <= 1) {
      toast.error("A page must have at least one section.");
      return;
    }
    const nextSections = pageData.sections.filter((_, idx) => idx !== index);
    setPageData({ ...pageData, sections: nextSections });
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= pageData.sections.length) return;
    const nextSections = [...pageData.sections];
    const temp = nextSections[index];
    nextSections[index] = nextSections[targetIdx];
    nextSections[targetIdx] = temp;
    setPageData({ ...pageData, sections: nextSections });
  };

  // Save changes to SystemConfig
  const handleSavePage = async () => {
    try {
      setIsSaving(true);
      const configKey = getConfigKeyForSlug(pageData.slug);
      await onUpdate(configKey, pageData);
      toast.success(`Published "${pageData.title}" successfully!`, {
        description: `Changes are now live at /${pageData.slug} on the website.`
      });
    } catch (err: any) {
      console.error("Save page failed:", err);
      toast.error(`Failed to save ${pageData.title}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default pre-seeded content
  const handleResetDefault = () => {
    if (INITIAL_DEFAULT_PAGES[selectedSlug]) {
      setPageData(INITIAL_DEFAULT_PAGES[selectedSlug]);
      toast.info(`Reset to default template for "${INITIAL_DEFAULT_PAGES[selectedSlug].title}". Click Save to publish.`);
    }
  };

  const pageSlugs = Object.keys(INITIAL_DEFAULT_PAGES);
  const filteredSlugs = pageSlugs.filter(slug => 
    slug.toLowerCase().includes(searchFilter.toLowerCase()) || 
    INITIAL_DEFAULT_PAGES[slug].title.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                  Website CMS
                </span>
                <Badge variant="outline" className="text-xs font-semibold gap-1">
                  <Globe className="h-3 w-3 text-emerald-600" />
                  Live Content Engine
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Footer & Legal Pages Manager
              </CardTitle>
              <CardDescription className="text-xs md:text-sm text-muted-foreground mt-1">
                Create, customize, and publish content for all 6 website footer pages without requiring development releases.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={activeViewMode === 'editor' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveViewMode('editor')}
                className="gap-1.5 font-bold text-xs"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Editor
              </Button>
              <Button
                variant={activeViewMode === 'preview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveViewMode('preview')}
                className="gap-1.5 font-bold text-xs"
              >
                <Eye className="h-3.5 w-3.5" />
                Live Preview
              </Button>
              <Button
                size="sm"
                onClick={handleSavePage}
                disabled={isSaving}
                className="gap-1.5 font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    Save & Publish
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main 2-Column Interface: Left Page Switcher + Right Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Pages List */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="p-4 pb-2 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  Website Pages ({pageSlugs.length})
                </CardTitle>
              </div>
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter pages..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="h-8 pl-8 text-xs rounded-lg"
                />
              </div>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              {filteredSlugs.map((slug) => {
                const item = INITIAL_DEFAULT_PAGES[slug];
                const Icon = PAGE_ICONS[slug] || FileText;
                const isSelected = selectedSlug === slug;
                const key = getConfigKeyForSlug(slug);
                const isCustomized = configs.some((c: any) => c.key === key && c.value);

                return (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => setSelectedSlug(slug)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold truncate">
                          {item.title}
                        </p>
                        {isCustomized && (
                          <Badge className={`text-[9px] px-1.5 py-0 h-4 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            Custom
                          </Badge>
                        )}
                      </div>
                      <p className={`text-[11px] truncate mt-0.5 ${
                        isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
                      }`}>
                        /{slug}
                      </p>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Info Box */}
          <Card className="border-border bg-muted/40 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Instant Zero-Downtime Updates</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              When you click <strong>Save & Publish</strong>, changes are stored in MongoDB under SystemConfig and instantly stream to users visiting the website footer.
            </p>
          </Card>
        </div>

        {/* Right Column: Page Editor or Live Preview */}
        <div className="lg:col-span-8 space-y-6">
          
          {activeViewMode === 'preview' ? (
            /* Live Preview Screen */
            <Card className="border-border bg-card shadow-sm">
              <CardHeader className="border-b border-border p-5 flex flex-row items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-primary tracking-wider">Live Preview Mode</span>
                  <CardTitle className="text-xl font-bold">{pageData.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-xs">
                    Published
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs font-bold"
                    onClick={() => window.open(`http://localhost:5173/${pageData.slug}`, '_blank')}
                  >
                    Open Live <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-50/50 to-blue-50/50 border border-violet-100 space-y-2">
                  <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                    {pageData.category}
                  </Badge>
                  <h1 className="text-2xl font-bold text-foreground">{pageData.title}</h1>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pageData.subtitle}</p>
                  <p className="text-xs text-muted-foreground font-mono flex items-center gap-1.5 pt-2">
                    <Clock className="h-3 w-3" /> Last Updated: {pageData.lastUpdated}
                  </p>
                </div>

                <div className="space-y-4">
                  {pageData.sections.map((sec, idx) => (
                    <div key={idx} className="p-5 rounded-xl border border-border bg-background space-y-2">
                      <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {sec.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Main Form Editor */
            <div className="space-y-6">
              
              {/* Page Metadata Settings Card */}
              <Card className="border-border bg-card shadow-sm">
                <CardHeader className="p-5 pb-3 border-b border-border flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">General Page Settings</CardTitle>
                    <CardDescription className="text-xs">Page metadata, URL slug, and publication status.</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetDefault}
                    className="h-8 text-xs font-bold text-muted-foreground hover:text-foreground gap-1"
                    title="Restore default pre-seeded template text"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset to Default
                  </Button>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Page Title</label>
                      <Input
                        value={pageData.title}
                        onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                        placeholder="e.g. Privacy Policy"
                        className="h-10 text-xs font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">URL Path Slug</label>
                      <Input
                        value={pageData.slug}
                        disabled
                        className="h-10 text-xs font-mono bg-muted text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Subtitle / Summary</label>
                    <Input
                      value={pageData.subtitle}
                      onChange={(e) => setPageData({ ...pageData, subtitle: e.target.value })}
                      placeholder="Brief overview displayed at top of the page..."
                      className="h-10 text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Category Group</label>
                      <select
                        value={pageData.category}
                        onChange={(e) => setPageData({ ...pageData, category: e.target.value as any })}
                        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="Legal">Legal</option>
                        <option value="Support">Support</option>
                        <option value="Company">Company</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Last Updated String</label>
                      <Input
                        value={pageData.lastUpdated}
                        onChange={(e) => setPageData({ ...pageData, lastUpdated: e.target.value })}
                        placeholder="e.g. October 2026"
                        className="h-10 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border mt-2">
                    <div>
                      <p className="text-xs font-bold text-foreground">Live Published Status</p>
                      <p className="text-[11px] text-muted-foreground">Controls visibility on the public website footer.</p>
                    </div>
                    <Switch
                      checked={pageData.isPublished}
                      onCheckedChange={(checked) => setPageData({ ...pageData, isPublished: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sections Editor Card */}
              <Card className="border-border bg-card shadow-sm">
                <CardHeader className="p-5 pb-3 border-b border-border flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">Document Sections & Content</CardTitle>
                    <CardDescription className="text-xs">Manage individual structured clauses, guidelines, and articles.</CardDescription>
                  </div>
                  <Button
                    onClick={handleAddSection}
                    size="sm"
                    className="h-8 gap-1.5 text-xs font-bold"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Section
                  </Button>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  {pageData.sections.map((sec, idx) => (
                    <div
                      key={sec.id || idx}
                      className="p-4 rounded-xl border border-border bg-background space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-foreground">Section Header</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={idx === 0}
                            onClick={() => handleMoveSection(idx, 'up')}
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            title="Move section up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={idx === pageData.sections.length - 1}
                            onClick={() => handleMoveSection(idx, 'down')}
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            title="Move section down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSection(idx)}
                            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Delete this section"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Input
                          value={sec.title}
                          onChange={(e) => handleUpdateSection(idx, 'title', e.target.value)}
                          placeholder="Section Title (e.g. 1. Information We Collect)"
                          className="h-9 text-xs font-bold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Textarea
                          value={sec.content}
                          onChange={(e) => handleUpdateSection(idx, 'content', e.target.value)}
                          rows={6}
                          placeholder="Enter clause body or detailed guidance..."
                          className="text-xs leading-relaxed font-normal resize-y"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 flex justify-end">
                    <Button
                      onClick={handleSavePage}
                      disabled={isSaving}
                      className="gap-2 font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm h-10 px-5"
                    >
                      {isSaving ? (
                        <>Saving & Publishing...</>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Publish Changes to /{pageData.slug}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default AdminPagesManager;
