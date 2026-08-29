import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "@/layout/DashboardLayout"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { AIDocumentGenerator } from "@/components/dashboard/AIDocumentGenerator"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { UserNav } from "@/components/dashboard/UserNav"
import { Calendar } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"

export default function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user_profile_data') || '{}');
    const navigate = useNavigate();

    useEffect(() => {
        if (user.role === 'admin') {
            navigate('/admin');
        }
    }, [user, navigate]);

    const fullName = user.fullName || 'User';
    // const designation = user.designation || 'Legal Member';

    // Format current date: "Sunday, 29 March 2026"
    const currentDate = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <DashboardLayout userNav={<UserNav />}>
            <PageHeader 
                title={`Welcome back, ${fullName}`} 
                description={`Manage your legal work, documents, research and consultations from one workspace.`}
            />

            {/* Stats Cards */}
            <StatsCards />

            {/* Quick Actions */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    Quick Actions
                </h2>
                <QuickActions />
            </div>

            {/* AI Document Generator */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    AI Document Generator
                </h2>
                <AIDocumentGenerator />
            </div>

            {/* Recent Activity */}
            <RecentActivity />
        </DashboardLayout>
    )
}
