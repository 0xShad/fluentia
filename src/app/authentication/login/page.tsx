"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/blocks/auth-layout";
import { OAuthButtons, AuthDivider } from "@/components/blocks/oauth-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const EMAIL_REGEX = /\S+@\S+\.\S+/;

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (v: string) => {
    setEmail(v);
    if (!v) setErrors(prev => ({ ...prev, email: "Required" }));
    else if (!EMAIL_REGEX.test(v)) setErrors(prev => ({ ...prev, email: "Invalid email format" }));
    else { const { email, ...rest } = errors; setErrors(rest); }
  };

  const handlePasswordChange = (v: string) => {
    setPassword(v);
    if (!v) setErrors(prev => ({ ...prev, password: "Required" }));
    else { const { password, ...rest } = errors; setErrors(rest); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    handleEmailChange(email);
    handlePasswordChange(password);

    if (email && EMAIL_REGEX.test(email) && password) {
      console.log("Login submitted");
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
            Sign into your account
          </h1>
          <p className="text-sm text-white/45 leading-relaxed">
            Pick up right where you left off — your coach is ready.
          </p>
        </div>

        {/* OAuth */}
        <OAuthButtons label="sign in" />

        {/* Divider */}
        <AuthDivider />

        {/* Form */}
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

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className={cn("block text-xs font-medium tracking-wide", errors.password ? "text-red-500" : "text-white/60")}
              >
                Password
              </label>
              <Link
                href="/authentication/forgot-password"
                className="text-xs text-[#00F38D]/70 hover:text-[#00F38D] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className={cn(
                  "bg-white/[0.04] border-white/10 text-white placeholder:text-white/25 focus-visible:border-[#00F38D]/60 focus-visible:ring-0 h-10 pr-10",
                  errors.password && "border-red-500 focus-visible:border-red-500"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Submit */}
          <div className="mt-6 flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full h-11 bg-[#00F38D] text-black font-bold tracking-tight hover:bg-[#00F38D]/90 hover:shadow-[0_0_20px_rgba(0,243,141,0.35)] transition-all duration-300 rounded-lg"
            >
              Sign in
            </Button>
          </div>
        </form>

        {/* Footer links */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-white/40">
            Don&apos;t have an account?{" "}
            <Link
              href="/authentication/register"
              className="text-white font-medium hover:text-[#00F38D] transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-[#00F38D]/50"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}