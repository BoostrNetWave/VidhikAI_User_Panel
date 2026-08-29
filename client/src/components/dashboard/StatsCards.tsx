import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, AlertCircle, Video, Zap, Loader2 } from "lucide-react"
import api from "@/lib/api"

export function StatsCards() {
    const [stats, setStats] = useState({
        totalDocuments: 0,
        pendingReviews: 0,
        activeConsultations: 0,
        aiCredits: 0,
        plan: "Starter"
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                if (response.data && response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Documents
                    </CardTitle>
                    <FileText className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {loading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : stats.totalDocuments}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Saved in workspace
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Pending Reviews
                    </CardTitle>
                    <AlertCircle className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {loading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : stats.pendingReviews}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {stats.pendingReviews === 1 ? "1 document needs attention" : `${stats.pendingReviews} documents need attention`}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Active Consultations
                    </CardTitle>
                    <Video className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {loading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : stats.activeConsultations}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {stats.activeConsultations === 1 ? "1 active consultation" : `${stats.activeConsultations} active consultations`}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        AI Credits
                    </CardTitle>
                    <Zap className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {loading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : stats.aiCredits}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Plan: {stats.plan}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
