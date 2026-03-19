"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/blocks/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OAuthButtons, AuthDivider } from "@/components/blocks/oauth-buttons";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const NAME_REGEX = /^[A-Za-z\s]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
const EMAIL_REGEX = /\S+@\S+\.\S+/;

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Real-time validation handlers
  const handleFirstNameChange = (v: string) => {
    setFirstName(v);
    if (!v) setErrors(prev => ({ ...prev, firstName: "Required" }));
    else if (!NAME_REGEX.test(v)) setErrors(prev => ({ ...prev, firstName: "No numbers or special characters allowed" }));
    else { const { firstName, ...rest } = errors; setErrors(rest); }
  };

  const handleLastNameChange = (v: string) => {
    setLastName(v);
    if (!v) setErrors(prev => ({ ...prev, lastName: "Required" }));
    else if (!NAME_REGEX.test(v)) setErrors(prev => ({ ...prev, lastName: "No numbers or special characters allowed" }));
    else { const { lastName, ...rest } = errors; setErrors(rest); }
  };

  const handleEmailChange = (v: string) => {
    setEmail(v);
    if (!v) setErrors(prev => ({ ...prev, email: "Required" }));
    else if (!EMAIL_REGEX.test(v)) setErrors(prev => ({ ...prev, email: "Invalid email format" }));
    else { const { email, ...rest } = errors; setErrors(rest); }
  };

  const handlePasswordChange = (v: string) => {
    setPassword(v);
    if (!v) setErrors(prev => ({ ...prev, password: "Required" }));
    else if (!PASSWORD_REGEX.test(v)) setErrors(prev => ({ ...prev, password: "Min 8 chars, 1 uppercase, 1 special character" }));
    else { const { password, ...rest } = Object.assign({}, errors, { password: undefined }); setErrors(JSON.parse(JSON.stringify(rest))); }
    
    // Check confirm password if it's already typed
    if (confirmPassword) {
      if (v !== confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      else setErrors(prev => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleConfirmPasswordChange = (v: string) => {
    setConfirmPassword(v);
    if (!v) setErrors(prev => ({ ...prev, confirmPassword: "Required" }));
    else if (v !== password) setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
    else { const { confirmPassword, ...rest } = errors; setErrors(rest); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Force validation of all fields on submit
    handleFirstNameChange(firstName);
    handleLastNameChange(lastName);
    handleEmailChange(email);
    handlePasswordChange(password);
    handleConfirmPasswordChange(confirmPassword);

    const hasErrors = !firstName || !NAME_REGEX.test(firstName) ||
                      !lastName || !NAME_REGEX.test(lastName) ||
                      !email || !EMAIL_REGEX.test(email) ||
                      !password || !PASSWORD_REGEX.test(password) ||
                      !confirmPassword || password !== confirmPassword;

    if (!hasErrors) {
      console.log("Registration submitted");
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
            Create your account
          </h1>
          <p className="text-sm text-white/45 leading-relaxed">
            Start your journey to confident, fluent communication — free.
          </p>
        </div>

        {/* OAuth */}
        <OAuthButtons label="sign up" />

        {/* Divider */}
        <AuthDivider text="or register with email" />

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Name row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="firstName" className={cn("block text-xs font-medium tracking-wide", errors.firstName ? "text-red-500" : "text-white/60")}>
                First name
              </label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="Alex"
                value={firstName}
                onChange={(e) => handleFirstNameChange(e.target.value)}
                className={cn(
                  "bg-white/[0.04] border-white/10 text-white placeholder:text-white/25 focus-visible:border-[#00F38D]/60 focus-visible:ring-0 h-10",
                  errors.firstName && "border-red-500 focus-visible:border-red-500"
                )}
              />
              {errors.firstName && <p className="text-red-500 text-[10px] mt-1 pr-1">{errors.firstName}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="lastName" className={cn("block text-xs font-medium tracking-wide", errors.lastName ? "text-red-500" : "text-white/60")}>
                Last name
              </label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Taylor"
                value={lastName}
                onChange={(e) => handleLastNameChange(e.target.value)}
                className={cn(
                  "bg-white/[0.04] border-white/10 text-white placeholder:text-white/25 focus-visible:border-[#00F38D]/60 focus-visible:ring-0 h-10",
                  errors.lastName && "border-red-500 focus-visible:border-red-500"
                )}
              />
              {errors.lastName && <p className="text-red-500 text-[10px] mt-1 pr-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className={cn("block text-xs font-medium tracking-wide", errors.email ? "text-red-500" : "text-white/60")}>
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
            <label htmlFor="password" className={cn("block text-xs font-medium tracking-wide", errors.password ? "text-red-500" : "text-white/60")}>
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className={cn("block text-xs font-medium tracking-wide", errors.confirmPassword ? "text-red-500" : "text-white/60")}>
              Re-type your password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                className={cn(
                  "bg-white/[0.04] border-white/10 text-white placeholder:text-white/25 focus-visible:border-[#00F38D]/60 focus-visible:ring-0 h-10 pr-10",
                  errors.confirmPassword && "border-red-500 focus-visible:border-red-500"
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (errors.confirmPassword !== "") && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit */}
          <div className="mt-6 flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full h-11 bg-[#00F38D] text-black font-bold tracking-tight hover:bg-[#00F38D]/90 hover:shadow-[0_0_20px_rgba(0,243,141,0.35)] transition-all duration-300 rounded-lg mt-2"
            >
              Create Account
            </Button>
          </div>
        </form>

        {/* Footer links */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-white/40">
            Already have an account?{" "}
            <Link
              href="/authentication/login"
              className="text-white font-medium hover:text-[#00F38D] transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-[#00F38D]/50"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}