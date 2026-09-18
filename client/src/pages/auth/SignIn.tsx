import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { authService } from "@/services/authService"
import { Eye, EyeOff, Loader2, Mail, Lock, Scale, Star, ShieldCheck, Sparkles } from "lucide-react"
import { Logo } from "@/components/brand/Logo"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

const signInSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
    rememberMe: z.boolean().default(false).optional(),
})

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    })

    async function onSubmit(values: z.infer<typeof signInSchema>) {
        setIsLoading(true)
        try {
            const data = await authService.login({
                email: values.email,
                password: values.password
            })

            // Store token and user data
            localStorage.setItem('user_auth_token', data.token)
            localStorage.setItem('user_profile_data', JSON.stringify(data))
            localStorage.setItem('vidhik_auth_token', data.token)
            localStorage.setItem('vidhik_user_data', JSON.stringify(data))

            // Role-based redirection
            if (data.role === 'admin') {
                toast.success("Logging in as Super Admin...")
                navigate('/admin')
            } else {
                toast.success("Logging in as User...")
                navigate('/dashboard')
            }
        } catch (error: any) {
            console.error('Login error:', error)
            
            if (error.response?.status === 403 && error.response?.data?.isVerified === false) {
                const unverifiedEmail = error.response.data.email || values.email;
                toast.error("Email not verified! Redirecting to verification page...");
                // Redirect to main site's verification page using react router
                setTimeout(() => {
                    navigate(`/verify-otp?email=${encodeURIComponent(unverifiedEmail)}`);
                }, 1500);
                return;
            }
            
            const message = error.response?.data?.message || "Something went wrong. Please check your connection and try again."
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen w-full font-sans bg-zinc-50">
            {/* Left - Branding Panel */}
            <div className="hidden lg:flex lg:w-5/12 bg-zinc-950 relative overflow-hidden items-center justify-center p-12 select-none">
                {/* Decorative glows */}
                <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-zinc-800/20 to-transparent blur-3xl pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-zinc-800/30 blur-[100px] pointer-events-none" />
                <div className="absolute -top-40 -right-40 w-[400px] h-[400px] rounded-full bg-zinc-800/30 blur-[100px] pointer-events-none" />
                
                {/* Dots grid pattern */}
                <div 
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: '24px 24px'
                    }}
                />

                <div className="relative z-10 text-white max-w-md">
                    <Link to="/" className="inline-flex items-center gap-2 mb-10 transition-transform duration-300 hover:scale-105">
                        <Scale className="h-8 w-8 text-zinc-300" />
                        <span className="font-display text-2xl font-bold tracking-tight">Vidhik <span className="text-zinc-400">AI</span></span>
                    </Link>
                    
                    <h2 className="font-display text-4xl font-extrabold mb-6 leading-tight">
                        Your Trusted Partner in Legal Operations
                    </h2>
                    <p className="text-slate-300/85 text-sm leading-relaxed mb-10">
                        Access AI-driven case research, document generation, and professional lawyer matching. Everything you need to navigate legal complexities with confidence.
                    </p>
                    
                    {/* Premium Card Testimonial */}
                    <div className="bg-zinc-900/40 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                        <p className="text-sm text-slate-200 leading-relaxed mb-4 italic">
                            "Vidhik AI has completely transformed our approach to legal research. The document automation is incredibly accurate and fast."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold shadow-md">
                                RK
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">Rajesh Kumar</p>
                                <p className="text-xs text-slate-400">Corporate Legal Advisor</p>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            {/* Right - Form Container */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-zinc-50 relative overflow-hidden">
                {/* Dots grid pattern for Right Panel */}
                <div 
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #18181b 1px, transparent 0)`,
                        backgroundSize: '20px 20px'
                    }}
                />

                <div className="w-full max-w-md relative z-10">
                    {/* Small Logo for mobile view */}
                    <div className="text-center mb-8 lg:hidden">
                        <Link to="/" className="inline-flex items-center gap-2">
                            <Scale className="h-7 w-7 text-primary" />
                            <span className="font-display text-xl font-bold tracking-tight text-slate-900">
                                Vidhik <span className="text-primary">AI</span>
                            </span>
                        </Link>
                    </div>

                    <div className="bg-white/60 backdrop-blur-3xl border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-3xl p-8 sm:p-10 w-full relative">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 font-display">
                                Welcome Back
                            </h2>
                            <p className="mt-2.5 text-sm text-slate-500">
                                Sign in to access your client portal dashboard.
                            </p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                                                    <Input 
                                                        placeholder="name@company.com" 
                                                        autoComplete="off" 
                                                        className="pl-10 h-11 bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10 focus-visible:ring-zinc-900/10 focus-visible:border-zinc-900 transition-all rounded-lg"
                                                        {...field} 
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Password</FormLabel>
                                            <div className="relative">
                                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                                                <FormControl>
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        autoComplete="off"
                                                        className="pl-10 pr-10 h-11 bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10 focus-visible:ring-zinc-900/10 focus-visible:border-zinc-900 transition-all rounded-lg"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent text-slate-400 hover:text-slate-600 transition-colors"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                    <span className="sr-only">
                                                        {showPassword ? "Hide password" : "Show password"}
                                                    </span>
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex items-center justify-between">
                                    <FormField
                                        control={form.control}
                                        name="rememberMe"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        className="border-slate-300 text-primary focus:ring-primary"
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-xs font-semibold text-slate-500 cursor-pointer select-none">
                                                    Remember me
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                        <Link
                                        to="/forgot-password"
                                        className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={isLoading} 
                                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold h-11 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        <span>Sign in</span>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-8 text-center text-sm text-zinc-500 border-t border-zinc-100 pt-6">
                            Don't have an account?{" "}
                            <Link to="/signup" className="font-semibold text-zinc-900 hover:text-zinc-600 transition-colors">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
