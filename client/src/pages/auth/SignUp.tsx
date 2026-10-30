import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { authService } from "@/services/authService"
import { Eye, EyeOff, User, Mail, Lock, Loader2, Star, ShieldCheck } from "lucide-react"

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
import logo from "@/assets/logo.png"

const signUpSchema = z.object({
    fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    terms: z.boolean().refine((val) => val === true, {
        message: "You must agree to the terms and conditions",
    }),
})

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            terms: false,
        },
    })

    async function onSubmit(values: z.infer<typeof signUpSchema>) {
        setIsLoading(true)
        try {
            await authService.register({
                fullName: values.fullName.trim(),
                email: values.email.trim(),
                password: values.password
            })

            toast.success("Account created successfully! Please check your email for the verification code.")
            navigate(`/verify-otp?email=${encodeURIComponent(values.email.trim())}`)
        } catch (error: any) {
            console.error('Registration error:', error)
            const message = error.response?.data?.message || "Registration failed. Please check your details and try again."
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen w-full font-sans bg-zinc-50">
            {/* Left - Branding Panel */}
            <div className="hidden lg:flex lg:w-5/12 bg-zinc-950 relative overflow-hidden items-center justify-center p-12 select-none border-r border-zinc-800/80">
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
                    <Link to="/" className="inline-flex items-center mb-10 transition-transform duration-300 hover:scale-105 bg-white px-4 py-2 rounded-2xl shadow-sm border border-white/20">
                        <img src={logo} alt="Vidhik AI" className="h-8 w-auto object-contain" />
                    </Link>
                    
                    <h2 className="font-display text-4xl font-extrabold mb-6 leading-tight">
                        Your Trusted Partner in Legal Operations
                    </h2>
                    <p className="text-slate-300/85 text-sm leading-relaxed mb-10">
                        Join Vidhik AI to draft contracts, access intelligent case management, and collaborate with verified legal counsel across India.
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
                        <Link to="/" className="inline-flex items-center">
                            <img src={logo} alt="Vidhik AI" className="h-9 w-auto object-contain" />
                        </Link>
                    </div>

                    <div className="bg-white/60 backdrop-blur-3xl border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-3xl p-8 sm:p-10 w-full relative">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 font-display">
                                Create Account
                            </h2>
                            <p className="mt-2.5 text-sm text-slate-500">
                                Sign up to start using the Vidhik AI legal platform.
                            </p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Full Name</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                                                    <Input 
                                                        placeholder="Adv. John Doe / Company Name" 
                                                        autoComplete="name" 
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
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                                                    <Input 
                                                        type="email"
                                                        placeholder="name@company.com" 
                                                        autoComplete="email" 
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
                                                        autoComplete="new-password"
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

                                <FormField
                                    control={form.control}
                                    name="terms"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-2 space-y-0 pt-1">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="mt-0.5 border-slate-300 text-zinc-900 focus:ring-zinc-900"
                                                />
                                            </FormControl>
                                            <FormLabel className="text-xs font-medium text-slate-500 leading-snug cursor-pointer select-none">
                                                I agree to Vidhik AI's{" "}
                                                <Link to="/terms" className="font-semibold text-zinc-900 hover:underline">Terms of Service</Link>
                                                {" "}and{" "}
                                                <Link to="/privacy" className="font-semibold text-zinc-900 hover:underline">Privacy Policy</Link>
                                            </FormLabel>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button 
                                    type="submit" 
                                    disabled={isLoading} 
                                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold h-11 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none mt-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating Account & Dispatching OTP...
                                        </>
                                    ) : (
                                        <span>Create Account</span>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-6 text-center text-sm text-zinc-500 border-t border-zinc-100 pt-5">
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold text-zinc-900 hover:text-zinc-600 transition-colors">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
