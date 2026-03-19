"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/blocks/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";

const EMAIL_REGEX = /\S+@\S+\.\S+/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleEmailChange = (v: string) => {
    setEmail(v);
    if (!v) setErrors(prev => ({ ...prev, email: "Required" }));
    else if (!EMAIL_REGEX.test(v)) setErrors(prev => ({ ...prev, email: "Invalid email format" }));
    else { const { email, ...rest } = errors; setErrors(rest); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    handleEmailChange(email);

    if (email && EMAIL_REGEX.test(email)) {
      setSubmitted(true);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-8 sm:p-10 w-full shadow-2xl relative overflow-hidden">
        {/* Subtle top highlight */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00F38D]/20 to-transparent" />
        
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-white mb-2">
            Reset password
          </h1>
          <p className="text-sm text-white/45 leading-relaxed">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-white/80">
              If an account with <span className="text-[#00F38D] font-medium">{email}</span> exists, an email will be sent with further instructions.
            </p>
            <div className="mt-6 flex flex-col gap-4">
              <Link href="/authentication/login" className="w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 border-white/10 text-white hover:bg-white/5 transition-all duration-300 rounded-lg"
                >
                  Back to login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className={cn("block text-xs font-medium tracking-wide", errors.email ? "text-red-500" : "text-white/60")}
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={cn(
                  "bg-white/[0.04] border-white/10 text-white placeholder:text-white/25 focus-visible:border-[#00F38D]/60 focus-visible:ring-0 h-10",
                  errors.email && "border-red-500 focus-visible:border-red-500"
                )}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Submit */}
            <div className="mt-8 flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full h-11 bg-[#00F38D] text-black font-bold tracking-tight hover:bg-[#00F38D]/90 hover:shadow-[0_0_20px_rgba(0,243,141,0.35)] transition-all duration-300 rounded-lg"
              >
                Send Reset Link
              </Button>
            </div>
          </form>
        )}

        {/* Footer links */}
        {!submitted && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p className="text-white/40">
              Remember your password?{" "}
              <Link
                href="/authentication/login"
                className="text-white font-medium hover:text-[#00F38D] transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-[#00F38D]/50"
              >
                Log in
              </Link>
            </p>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
