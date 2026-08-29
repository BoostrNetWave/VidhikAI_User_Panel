import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Bell, Lock, LogOut, ShieldCheck, User } from "lucide-react";
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authService } from "@/services/authService";

type SettingsTab = "profile" | "security" | "preferences";

type LocalUser = {
    fullName?: string;
    email?: string;
    phone?: string;
    designation?: string;
    location?: string;
};

type LocalPrefs = {
    emailNotifications: boolean;
    smsNotifications: boolean;
    productUpdates: boolean;
};

function safeParseJson<T>(raw: string | null, fallback: T): T {
    try {
        if (!raw) return fallback;
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

export default function SettingsPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const initialTab = useMemo<SettingsTab>(() => {
        const tab = new URLSearchParams(location.search).get("tab") as SettingsTab | null;
        if (tab === "profile" || tab === "security" || tab === "preferences") return tab;
        return "profile";
    }, [location.search]);

    const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const storedUser = useMemo(() => safeParseJson<LocalUser>(localStorage.getItem("user_profile_data"), {}), []);
    const storedPrefs = useMemo(
        () =>
            safeParseJson<LocalPrefs>(localStorage.getItem("settings:prefs"), {
                emailNotifications: true,
                smsNotifications: false,
                productUpdates: true,
            }),
        []
    );

    const [profile, setProfile] = useState({
        fullName: storedUser.fullName || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        designation: storedUser.designation || "",
        location: storedUser.location || "",
    });

    const [prefs, setPrefs] = useState<LocalPrefs>(storedPrefs);

    const [security, setSecurity] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const goTab = (tab: SettingsTab) => {
        setActiveTab(tab);
        navigate(`/settings?tab=${tab}`, { replace: true });
    };

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    const validateProfile = () => {
        const next: Record<string, string> = {};
        if (!profile.fullName.trim()) next.fullName = "Full name is required";
        if (!profile.email.trim()) next.email = "Email is required";
        if (profile.email.trim() && !validateEmail(profile.email)) next.email = "Enter a valid email address";
        if (profile.phone.trim() && !/^[0-9+\-\s]{8,15}$/.test(profile.phone.trim())) {
            next.phone = "Enter a valid phone number";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const saveProfile = async () => {
        if (!validateProfile()) return toast.error("Please fix the highlighted fields");

        const currentUser = safeParseJson<Record<string, any>>(localStorage.getItem("user_profile_data"), {});
        const userId = currentUser._id || currentUser.id;

        if (!userId) {
            return toast.error("You must be logged in to update your profile.");
        }

        try {
            const updatedData = await authService.updateProfile({
                userId,
                fullName: profile.fullName.trim(),
                email: profile.email.trim(),
                phone: profile.phone.trim(),
                designation: profile.designation.trim(),
                location: profile.location.trim(),
            });

            // Update localStorage with complete user object returned from server
            localStorage.setItem("user_profile_data", JSON.stringify(updatedData));
            toast.success("Profile updated in database");
        } catch (error: any) {
            console.error("Profile update failed:", error);
            toast.error(error.response?.data?.message || "Failed to update profile in database.");
        }
    };

    const validateSecurity = () => {
        const next: Record<string, string> = {};
        if (!security.newPassword) next.newPassword = "New password is required";
        if (security.newPassword && security.newPassword.length < 8) next.newPassword = "Minimum 8 characters";
        if (!security.confirmPassword) next.confirmPassword = "Confirm password is required";
        if (security.newPassword && security.confirmPassword && security.newPassword !== security.confirmPassword) {
            next.confirmPassword = "Passwords do not match";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const changePassword = () => {
        if (!validateSecurity()) return toast.error("Please fix the highlighted fields");
        setSecurity({ newPassword: "", confirmPassword: "" });
        toast.success("Password updated");
    };

    const savePreferences = () => {
        localStorage.setItem("settings:prefs", JSON.stringify(prefs));
        toast.success("Preferences saved");
    };

    const signOut = () => {
        localStorage.removeItem("user_auth_token");
        localStorage.removeItem("user_profile_data");
        localStorage.removeItem("vidhik_auth_token");
        localStorage.removeItem("vidhik_user_data");
        navigate("/login");
    };

    const userForAvatar = safeParseJson<LocalUser>(localStorage.getItem("user_profile_data"), {});
    const initials =
        (userForAvatar.fullName || "User")
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((p) => p[0]?.toUpperCase())
            .join("") || "U";

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="max-w-5xl mx-auto space-y-8 pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Settings</h1>
                        <p className="text-muted-foreground font-medium">Update your profile, security, and preferences.</p>
                    </div>

                    <Button variant="outline" className="rounded-xl border-border font-semibold h-11" onClick={signOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                    </Button>
                </div>

                <div className="bg-secondary/50 border border-border p-1 rounded-xl w-full flex items-center justify-start h-11">
                    <button
                        onClick={() => goTab("profile")}
                        className={`rounded-lg font-semibold text-sm px-5 h-full transition-all ${
                            activeTab === "profile" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => goTab("security")}
                        className={`rounded-lg font-semibold text-sm px-5 h-full transition-all ${
                            activeTab === "security" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Security
                    </button>
                    <button
                        onClick={() => goTab("preferences")}
                        className={`rounded-lg font-semibold text-sm px-5 h-full transition-all ${
                            activeTab === "preferences" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Preferences
                    </button>
                </div>

                {activeTab === "profile" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
                        <Card className="rounded-2xl border border-border bg-card shadow-sm lg:col-span-1">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Account</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-14 w-14">
                                        <AvatarImage src="/avatars/01.png" alt={userForAvatar.fullName || "User"} />
                                        <AvatarFallback>{initials}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-foreground">{userForAvatar.fullName || "User"}</p>
                                        <p className="text-xs text-muted-foreground">{userForAvatar.email || "user@example.com"}</p>
                                    </div>
                                </div>

                                <div className="bg-secondary/50 rounded-2xl p-4 border border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <ShieldCheck className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-foreground">Saved Locally</p>
                                            <p className="text-[10px] text-muted-foreground">This demo saves to localStorage.</p>
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full rounded-xl h-11 bg-primary text-white hover:bg-violet-800 active:bg-violet-900" onClick={saveProfile}>
                                    Save Profile
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border border-border bg-card shadow-sm lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Profile Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <Input value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} className={errors.fullName ? "border-destructive" : ""} />
                                        {errors.fullName && <p className="text-xs font-medium text-destructive">{errors.fullName}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={errors.email ? "border-destructive" : ""} />
                                        {errors.email && <p className="text-xs font-medium text-destructive">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={errors.phone ? "border-destructive" : ""} />
                                        {errors.phone && <p className="text-xs font-medium text-destructive">{errors.phone}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Designation</Label>
                                        <Input value={profile.designation} onChange={(e) => setProfile({ ...profile, designation: e.target.value })} placeholder="e.g. Senior Partner" />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Location</Label>
                                        <Input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} placeholder="e.g. New Delhi, India" />
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-end gap-3">
                                    <Button variant="outline" className="rounded-xl" onClick={() => setProfile({
                                        fullName: storedUser.fullName || "",
                                        email: storedUser.email || "",
                                        phone: storedUser.phone || "",
                                        designation: storedUser.designation || "",
                                        location: storedUser.location || "",
                                    })}>
                                        Reset
                                    </Button>
                                    <Button className="rounded-xl bg-primary text-white hover:bg-violet-800 active:bg-violet-900" onClick={saveProfile}>
                                        Save
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === "security" && (
                    <Card className="rounded-2xl border border-border bg-card shadow-sm animate-in fade-in duration-300">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Lock className="h-5 w-5 text-primary" />
                                Security
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>New Password</Label>
                                    <Input type="password" value={security.newPassword} onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })} className={errors.newPassword ? "border-destructive" : ""} />
                                    {errors.newPassword && <p className="text-xs font-medium text-destructive">{errors.newPassword}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Confirm Password</Label>
                                    <Input type="password" value={security.confirmPassword} onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })} className={errors.confirmPassword ? "border-destructive" : ""} />
                                    {errors.confirmPassword && <p className="text-xs font-medium text-destructive">{errors.confirmPassword}</p>}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <Button variant="outline" className="rounded-xl" onClick={() => setSecurity({ newPassword: "", confirmPassword: "" })}>
                                    Clear
                                </Button>
                                <Button className="rounded-xl bg-primary text-white hover:bg-violet-800 active:bg-violet-900" onClick={changePassword}>
                                    Update Password
                                </Button>
                            </div>

                            <Separator />

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-foreground">Sign out</p>
                                    <p className="text-xs text-muted-foreground">Log out from this device.</p>
                                </div>
                                <Button variant="destructive" className="rounded-xl h-11" onClick={signOut}>
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Sign out
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === "preferences" && (
                    <Card className="rounded-2xl border border-border bg-card shadow-sm animate-in fade-in duration-300">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Bell className="h-5 w-5 text-primary" />
                                Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-start gap-3">
                                <Checkbox id="pref-email" checked={prefs.emailNotifications} onCheckedChange={(c) => setPrefs({ ...prefs, emailNotifications: Boolean(c) })} />
                                <div className="space-y-1">
                                    <Label htmlFor="pref-email">Email notifications</Label>
                                    <p className="text-xs text-muted-foreground">Receive account alerts via email.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Checkbox id="pref-sms" checked={prefs.smsNotifications} onCheckedChange={(c) => setPrefs({ ...prefs, smsNotifications: Boolean(c) })} />
                                <div className="space-y-1">
                                    <Label htmlFor="pref-sms">SMS notifications</Label>
                                    <p className="text-xs text-muted-foreground">Receive critical alerts via SMS.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Checkbox id="pref-updates" checked={prefs.productUpdates} onCheckedChange={(c) => setPrefs({ ...prefs, productUpdates: Boolean(c) })} />
                                <div className="space-y-1">
                                    <Label htmlFor="pref-updates">Product updates</Label>
                                    <p className="text-xs text-muted-foreground">News about new features.</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-end gap-3">
                                <Button variant="outline" className="rounded-xl" onClick={() => setPrefs({ emailNotifications: true, smsNotifications: false, productUpdates: true })}>
                                    Reset
                                </Button>
                                <Button className="rounded-xl bg-primary text-white hover:bg-violet-800 active:bg-violet-900" onClick={savePreferences}>
                                    Save Preferences
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
