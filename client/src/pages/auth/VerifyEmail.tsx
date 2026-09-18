import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { authService } from "@/services/authService"
import { Loader2, Mail, ShieldCheck, Scale, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

const verifySchema = z.object({
    otp: z.string().length(6, { message: "Verification code must be exactly 6 digits" }),
})

export default function VerifyEmail() {
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [searchParams] = useSearchParams()
    const emailParam = searchParams.get("email")
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            otp: "",
        },
    })

    useEffect(() => {
        if (!emailParam) {
            toast.error("Email not provided. Redirecting to login.")
            navigate("/login")
        }
    }, [emailParam, navigate])

    async function onSubmit(values: z.infer<typeof verifySchema>) {
        if (!emailParam) return;
        setIsLoading(true)
        try {
            await authService.verifyOTP({
                email: emailParam,
                otp: values.otp
            })
            
            toast.success("Email verified successfully! You can now log in.")
            navigate('/login')
        } catch (error: any) {
            console.error(error)
            const message = error.response?.data?.message || "Verification failed. Please try again."
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleResendOTP() {
        if (!emailParam) return;
        setIsResending(true)
        try {
            await authService.resendOTP({
                email: emailParam
            })
            toast.success("Verification email resent. Please check your inbox.")
        } catch (error: any) {
            console.error(error)
            const message = error.response?.data?.message || "Failed to resend verification email."
            toast.error(message)
        } finally {
            setIsResending(false)
        }
    }

    return (
        <div className="flex min-h-screen w-full font-sans bg-slate-50">
            {/* Left - Branding Panel */}
            <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-[#120F2E] via-[#1E113E] to-[#0A0718] relative overflow-hidden items-center justify-center p-12 select-none">
                <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/10 to-transparent blur-3xl pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
                <div className="absolute -top-40 -right-40 w-[400px] h-[400px] rounded-full bg-primary/90/10 blur-[100px] pointer-events-none" />
                
                <div 
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: '24px 24px'
                    }}
                />

                <div className="relative z-10 text-white max-w-md">
                    <Link to="/" className="inline-flex items-center gap-2 mb-10 transition-transform duration-300 hover:scale-105">
                        <Scale className="h-8 w-8 text-primary/80" />
                        <span className="font-display text-2xl font-bold tracking-tight">Vidhik <span className="text-primary/80">AI</span></span>
                    </Link>
                    
                    <h2 className="font-display text-4xl font-extrabold mb-6 leading-tight">
                        Secure Your Account
                    </h2>
                    <p className="text-slate-300/85 text-sm leading-relaxed mb-10">
                        We prioritize your security. Verifying your email address ensures that you are the rightful owner of this account.
                    </p>
                </div>
            </div>

            {/* Right - Form Container */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-[#FAFAFC] relative overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 w-[300px] h-[300px] rounded-full bg-violet-200/30 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -z-10 w-[300px] h-[300px] rounded-full bg-indigo-100/30 blur-3xl pointer-events-none" />
                
                <div className="w-full max-w-md">
                    <div className="text-center mb-8 lg:hidden">
                        <Link to="/" className="inline-flex items-center gap-2">
                            <Scale className="h-7 w-7 text-primary" />
                            <span className="font-display text-xl font-bold tracking-tight text-slate-900">
                                Vidhik <span className="text-primary">AI</span>
                            </span>
                        </Link>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md border border-slate-100 shadow-[0_20px_50px_-12px_rgba(124,58,237,0.08)] rounded-2xl p-8 sm:p-10 w-full relative">
                        <div className="text-center mb-8">
                            <div className="mx-auto w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-4">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
                                Verify Email
                            </h2>
                            <p className="mt-2.5 text-sm text-slate-500">
                                Enter the 6-digit verification code sent to <br />
                                <span className="font-semibold text-slate-700">{emailParam}</span>
                            </p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="otp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Verification Code</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                                                    <Input 
                                                        placeholder="123456" 
                                                        autoComplete="off" 
                                                        maxLength={6}
                                                        className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:border-primary focus:ring-primary/20 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-lg text-center tracking-widest text-lg font-semibold"
                                                        {...field} 
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button 
                                    type="submit" 
                                    disabled={isLoading || isResending} 
                                    className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary hover:to-indigo-700 text-white font-semibold h-11 rounded-lg flex items-center justify-center transition-all duration-300 shadow-[0_10px_20px_-5px_rgba(124,58,237,0.3)] hover:shadow-[0_15px_25px_-5px_rgba(124,58,237,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <span>Verify Email</span>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-6 flex flex-col gap-3">
                            <Button 
                                type="button" 
                                variant="outline"
                                onClick={handleResendOTP}
                                disabled={isLoading || isResending}
                                className="w-full font-semibold h-11 rounded-lg flex items-center justify-center border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                                {isResending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Resending...
                                    </>
                                ) : (
                                    <span>Resend Verification Email</span>
                                )}
                            </Button>

                            <Button 
                                type="button"
                                variant="ghost"
                                onClick={() => navigate('/login')}
                                className="w-full font-semibold h-11 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Sign In
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
