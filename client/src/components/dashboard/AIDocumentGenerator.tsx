import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Briefcase, Lock, ArrowRight, Mail, TrendingUp, Users } from "lucide-react"

const generators = [
    {
        id: "employment-contract",
        name: "Employment Agreement",
        description: "Professional contracts for permanent hires.",
        icon: FileText,
        path: "/documents/employment-contract-generator"
    },
    {
        id: "consultant-agreement",
        name: "Consultant Agreement",
        description: "Standard terms for independent contractors.",
        icon: Briefcase,
        path: "/documents/consultant-agreement"
    },
    {
        id: "nda",
        name: "Non-Disclosure Agreement",
        description: "High-accuracy confidentiality & protection agreements.",
        icon: Lock,
        path: "/documents/nda"
    },
    {
        id: "offer-letter",
        name: "Offer Letter",
        description: "Create professional job offer letters in seconds.",
        icon: Mail,
        path: "/documents/offer-letter"
    },
    {
        id: "share-subscription",
        name: "Share Subscription",
        description: "Equity issuance agreements for funding rounds.",
        icon: TrendingUp,
        path: "/documents/share-subscription"
    },
    {
        id: "board-resolution",
        name: "Board Resolution",
        description: "Official documentation for corporate decisions.",
        icon: Users,
        path: "/documents/board-resolution"
    }
]

export function AIDocumentGenerator() {
    const navigate = useNavigate();

    return (
        <div className="grid gap-6 md:grid-cols-3">
            {generators.map((gen) => (
                <Card
                    key={gen.id}
                    className="group hover:shadow-md hover:border-border-strong transition-all cursor-pointer rounded-xl border-border bg-card"
                    onClick={() => navigate(gen.path)}
                >
                    <CardHeader className="pb-2">
                        <div className="h-10 w-10 bg-secondary rounded-lg flex items-center justify-center mb-2">
                            <gen.icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-[15px] font-semibold text-foreground leading-tight">
                            {gen.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {gen.description}
                        </p>
                        <div className="flex items-center text-xs font-semibold text-primary group-hover:text-primary/80 transition-colors">
                            Get Started <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
