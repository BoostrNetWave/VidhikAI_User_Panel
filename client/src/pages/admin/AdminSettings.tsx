import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import AdminLayout from "@/layout/AdminLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";

// Import the new modular components
import { AdminOverview } from "./components/AdminOverview";
import { AdminConfigManager } from "./components/AdminConfigManager";
import { AdminUsers } from "./components/AdminUsers";
import { AdminLawyers } from "./components/AdminLawyers";
import { AdminCases } from "./components/AdminCases";
import { AdminConsultations } from "./components/AdminConsultations";
import { AdminTickets } from "./components/AdminTickets";
import { AdminDocuments } from "./components/AdminDocuments";
import { AdminLoginHistory } from "./components/AdminLoginHistory";

export default function AdminSettings() {
    const { tab } = useParams();
    const activeTab = tab || 'overview';

    // Global State
    const [configs, setConfigs] = useState<any[]>([]);
    const [editingJsonConfig, setEditingJsonConfig] = useState<any>({});
    const [users, setUsers] = useState<any[]>([]);
    const [pendingLawyers, setPendingLawyers] = useState<any[]>([]);
    const [cases, setCases] = useState<any[]>([]);
    const [tickets, setTickets] = useState<any[]>([]);
    const [documents, setDocuments] = useState<any[]>([]);
    const [consultations, setConsultations] = useState<any[]>([]);
    const [loginHistory, setLoginHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch everything concurrently for a snappy load, or split by tab if performance is an issue.
            // Since it's an admin dashboard, we fetch all to feed the overview KPIs.
            const [
                configData, 
                userData, 
                pendingData, 
                casesData, 
                ticketData, 
                docData, 
                consultData,
                historyData
            ] = await Promise.all([
                adminService.getConfigs().catch(() => []),
                adminService.getAllUsers().catch(() => []),
                adminService.getPendingLawyers().catch(() => []),
                adminService.getAllCases().catch(() => []),
                adminService.getAllTickets().catch(() => []),
                adminService.getAllDocuments().catch(() => []),
                adminService.getAllConsultations().catch(() => []),
                adminService.getLoginHistory().catch(() => [])
            ]);

            setConfigs(configData);
            setUsers(userData);
            setPendingLawyers(pendingData);
            setCases(casesData);
            setTickets(ticketData);
            setDocuments(docData);
            setConsultations(consultData);
            setLoginHistory(historyData);

            // Setup JSON configs
            const jsonConfigs: {[key: string]: any} = {};
            configData.forEach((c: any) => {
                if (typeof c.value === 'object' && c.value !== null) {
                    jsonConfigs[c.key] = JSON.parse(JSON.stringify(c.value));
                }
            });
            setEditingJsonConfig(jsonConfigs);

        } catch (error) {
            toast.error("Failed to load admin data");
        } finally {
            setLoading(false);
        }
    };

    // Actions
    const handleUpdateConfig = async (key: string, value: any) => {
        const originalConfig = configs.find(c => c.key === key);
        let parsedValue = value;
        if (originalConfig && typeof originalConfig.value === 'number') {
            parsedValue = Number(value);
        }
        await adminService.updateConfig(key, parsedValue);
        // Refresh configs to reflect changes
        const newConfigs = await adminService.getConfigs();
        setConfigs(newConfigs);
    };

    const handleVerifyUser = async (id: string) => {
        try {
            await adminService.verifyUser(id);
            toast.success("User verified successfully");
            const newUsers = await adminService.getAllUsers();
            setUsers(newUsers);
        } catch (e) {
            toast.error("Failed to verify user");
        }
    };

    const handleUpdateSubscription = async (id: string, sub: string) => {
        await adminService.updateUserSubscription(id, sub);
        const newUsers = await adminService.getAllUsers();
        setUsers(newUsers);
    };

    const handleApproveLawyer = async (id: string) => {
        try {
            await adminService.approveLawyer(id);
            toast.success("Lawyer approved");
            const newPending = await adminService.getPendingLawyers();
            setPendingLawyers(newPending);
        } catch (e) {
            toast.error("Failed to approve lawyer");
        }
    };

    const handleReplyTicket = async (id: string, text: string) => {
        try {
            await adminService.replyToTicket(id, text, 'In_Progress');
            toast.success("Reply sent");
            const newTickets = await adminService.getAllTickets();
            setTickets(newTickets);
        } catch (e) {
            toast.error("Failed to send reply");
        }
    };

    const handleUpdateTicketStatus = async (id: string, status: string) => {
        try {
            await adminService.updateTicketStatus(id, status);
            toast.success("Ticket status updated");
            const newTickets = await adminService.getAllTickets();
            setTickets(newTickets);
        } catch (e) {
            toast.error("Failed to update status");
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex h-64 items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            );
        }

        switch (activeTab) {
            case 'overview':
                return <AdminOverview users={users} pendingLawyers={pendingLawyers} consultations={consultations} tickets={tickets} cases={cases} documents={documents} />;
            case 'content':
                return <AdminConfigManager configs={configs} editingJsonConfig={editingJsonConfig} setEditingJsonConfig={setEditingJsonConfig} onUpdate={handleUpdateConfig} />;
            case 'users':
                return <AdminUsers users={users} onVerifyUser={handleVerifyUser} onUpdateSubscription={handleUpdateSubscription} />;
            case 'lawyers':
                return <AdminLawyers pendingLawyers={pendingLawyers} onApprove={handleApproveLawyer} />;
            case 'cases':
            case 'payments': // Alias cases and payments to the financial view
                return <AdminCases cases={cases} />;
            case 'consultations':
                return <AdminConsultations consultations={consultations} />;
            case 'tickets':
                return <AdminTickets tickets={tickets} onReply={handleReplyTicket} onUpdateStatus={handleUpdateTicketStatus} />;
            case 'documents':
                return <AdminDocuments documents={documents} />;
            case 'login-history':
                return <AdminLoginHistory history={loginHistory} />;
            default:
                return <Navigate to="/admin/overview" replace />;
        }
    };

    return (
        <AdminLayout userNav={<UserNav />}>
            {renderContent()}
        </AdminLayout>
    );
}
