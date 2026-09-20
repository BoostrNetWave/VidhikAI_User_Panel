import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { authService } from "@/services/authService"
import { Eye, EyeOff, User, Mail, Lock, Loader2, Scale, Star, ShieldCheck, Sparkles } from "lucide-react"

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
import logo from "@/assets/logo.png";

const signUpSchema = z.object({
    fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    terms: z.boolean().refine((val) => val === true, {
        message: "You must agree to the terms and conditions",
    }),
})

export default function SignUp() {
    // ... rest of the component
    const [showPassword, setShowPassword] = useState(false)

    // Password strength calculation (simple version)
    const calculateStrength = (password: string) => {
        if (!password) return 0
        let score = 0
        if (password.length >= 8) score += 25
        if (/[A-Z]/.test(password)) score += 25
        if (/[0-9]/.test(password)) score += 25
        if (/[^A-Za-z0-9]/.test(password)) score += 25
        return score
    }

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            terms: false,
        },
    })

    const [isLoading, setIsLoading] = useState(false)
    const passwordValue = form.watch("password")
    const passwordStrength = calculateStrength(passwordValue)
    const navigate = useNavigate()

    async function onSubmit(values: z.infer<typeof signUpSchema>) {
        setIsLoading(true)
        try {
            const data = await authService.register({
                fullName: values.fullName,
                email: values.email,
                password: values.password
            })

            toast.success("Account created! Please verify your email.")
            navigate(`/verify-otp?email=${encodeURIComponent(values.email)}`)
        } catch (error: any) {
            console.error(error)
            const message = error.response?.data?.message || "Something went wrong. Please try again."
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen w-full font-sans bg-slate-50">
            {/* Left - Branding Panel */}
            <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-[#120F2E] via-[#1E113E] to-[#0A0718] relative overflow-hidden items-center justify-center p-12 select-none">
                {/* Decorative glows */}
                <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/10 to-transparent blur-3xl pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
                <div className="absolute -top-40 -right-40 w-[400px] h-[400px] rounded-full bg-primary/90/10 blur-[100px] pointer-events-none" />
                
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
                        Start Redefining Your Legal Practice
                    </h2>
                    <p className="text-slate-300/85 text-sm leading-relaxed mb-10">
                        Join thousands of legal professionals and clients using Vidhik AI to streamline research, analyze documents, and collaborate securely.
                    </p>
                    
                    {/* Premium Card Testimonial */}
                    <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl p-6 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                        <p className="text-sm text-slate-200 leading-relaxed mb-4 italic">
                            "Setting up our team account was seamless. Vidhik AI is hands down the most premium and reliable legal intelligence platform we have used."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-xs font-bold shadow-md">
                                AM
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">Ananya Mehta</p>
                                <p className="text-xs text-slate-400">Managing Partner, AMLaw</p>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            {/* Right - Form Container */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-[#FAFAFC] relative overflow-hidden">
                {/* Decorative glows on the right panel */}
                <div className="absolute top-0 right-0 -z-10 w-[300px] h-[300px] rounded-full bg-violet-200/30 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -z-10 w-[300px] h-[300px] rounded-full bg-indigo-100/30 blur-3xl pointer-events-none" />
                
                {/* Dots grid pattern for Right Panel */}
                <div 
                    className="absolute inset-0 opacity-[0.015] pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #7C3AED 1px, transparent 0)`,
                        backgroundSize: '20px 20px'
                    }}
                />

                <div className="w-full max-w-md">
                    {/* Small Logo for mobile view */}
                    <div className="text-center mb-8 lg:hidden">
                        <Link to="/" className="inline-flex items-center">
                            <img src={logo} alt="Vidhik AI" className="h-9 w-auto object-contain" />
                        </Link>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md border border-slate-100 shadow-[0_20px_50px_-12px_rgba(124,58,237,0.08)] rounded-2xl p-8 sm:p-10 w-full relative">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
                                Create Account
                            </h2>
                            <p className="mt-2.5 text-sm text-slate-500">
                                Start your 14-day free trial. No credit card required.
                            </p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                                                        placeholder="John Doe" 
                                                        autoComplete="off" 
                                                        className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:border-primary focus:ring-primary/20 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-lg"
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
                                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Work Email</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                                                    <Input 
                                                        placeholder="name@company.com" 
                                                        autoComplete="off" 
                                                        className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:border-primary focus:ring-primary/20 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-lg"
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
                                                        className="pl-10 pr-10 h-11 bg-slate-50/50 border-slate-200 focus:border-primary focus:ring-primary/20 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-lg"
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
                                                </Button>
                                            </div>

                                            {/* Password Strength Indicator */}
                                            <div className="mt-3.5 space-y-2">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-semibold text-slate-500">Password Strength</span>
                                                    <span className={`font-bold uppercase tracking-wider ${
                                                        passwordStrength > 75 ? 'text-emerald-500' : passwordStrength > 50 ? 'text-indigo-500' : 'text-rose-500'
                                                    }`}>
                                                        {passwordStrength > 75 ? "Strong" : passwordStrength > 50 ? "Medium" : "Weak"}
                                                    </span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full transition-all duration-500 rounded-full ${
                                                            passwordStrength > 75 
                                                                ? 'bg-gradient-to-r from-emerald-400 to-teal-500' 
                                                                : passwordStrength > 50 
                                                                ? 'bg-gradient-to-r from-indigo-400 to-primary' 
                                                                : 'bg-gradient-to-r from-rose-400 to-orange-500'
                                                        }`}
                                                        style={{ width: `${passwordStrength}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="terms"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 text-left">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-slate-300 text-primary focus:ring-primary mt-1"
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-xs text-slate-500 leading-normal font-medium">
                                                    I agree to the <Link to="/terms" className="text-primary font-semibold hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary font-semibold hover:underline">Privacy Policy</Link>.
                                                </FormLabel>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <Button 
                                    type="submit" 
                                    disabled={isLoading} 
                                    className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary hover:to-indigo-700 text-white font-semibold h-11 rounded-lg flex items-center justify-center transition-all duration-300 shadow-[0_10px_20px_-5px_rgba(124,58,237,0.3)] hover:shadow-[0_15px_25px_-5px_rgba(124,58,237,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating Account...
                                        </>
                                    ) : (
                                        <span className="flex items-center justify-center gap-1.5">
                                            <Sparkles className="h-4 w-4" />
                                            Create Account
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold text-primary hover:text-primary transition-colors">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
