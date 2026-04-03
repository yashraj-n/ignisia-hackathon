"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRouter } from "@tanstack/react-router";
import { ErrorDialog } from "./ErrorDialog";

interface AuthFormProps {
  onFocusChange: (isFocused: boolean) => void;
  onPasswordLengthChange: (length: number) => void;
  onShowPasswordChange: (show: boolean) => void;
  onToggle: () => void;
}

export function SignInForm({ 
  onFocusChange, 
  onPasswordLengthChange, 
  onShowPasswordChange,
  onToggle 
}: AuthFormProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorConfig, setErrorConfig] = useState({ isOpen: false, message: "" });
  const router = useRouter();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    onPasswordLengthChange(val.length);
  };

  const togglePasswordVisibility = () => {
    const nextValue = !showPassword;
    setShowPassword(nextValue);
    onShowPasswordChange(nextValue);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const emailInput = (document.getElementById("email") as HTMLInputElement).value;
      const res = await fetch("http://localhost:9000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_email: emailInput,
          login_password: password
        })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        router.navigate({ to: "/dashboard" });
      } else {
        const err = await res.json();
        setErrorConfig({ isOpen: true, message: err.message || "Invalid credentials. Please check your email and password." });
      }
    } catch (error) {
       setErrorConfig({ isOpen: true, message: "A connection error occurred. Please ensure the backend server is running." });
    }
  };

  return (
    <div className="w-full max-w-[420px] transition-all duration-500 animate-in fade-in slide-in-from-left-4">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-6">
           <div className="w-16 h-16 flex items-center justify-center p-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm shadow-xl">
             <img src="/bidforge-icon.png" alt="BidForge Logo" className="w-full h-full object-contain" />
           </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Welcome back!</h1>
        <p className="text-muted-foreground text-sm">Please enter your details to access the command center</p>
      </div>

      <form className="space-y-5" onSubmit={handleLogin}>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/70">Email</Label>
          <Input 
            id="email" 
            placeholder="name@company.com" 
            className="bg-white/5 border-white/10 focus:border-primary/50 text-white h-12"
            onFocus={() => onFocusChange(true)}
            onBlur={() => onFocusChange(false)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password text-white/70">Password</Label>
            <a href="#" className="text-xs text-primary hover:underline font-medium">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              className="bg-white/5 border-white/10 focus:border-primary/50 text-white h-12 pr-16"
              onChange={handlePasswordChange}
              onFocus={() => onFocusChange(true)}
              onBlur={() => onFocusChange(false)}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors text-xs font-bold"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full h-12 mt-4 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground border-none rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all">
          Sign In
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground mt-10">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="font-bold text-primary hover:underline transition-colors ml-1"
        >
          Sign Up
        </button>
      </div>

      <ErrorDialog 
        isOpen={errorConfig.isOpen} 
        onClose={() => setErrorConfig({ ...errorConfig, isOpen: false })} 
        message={errorConfig.message}
      />
    </div>
  );
}

export function SignUpForm({ 
  onFocusChange, 
  onPasswordLengthChange, 
  onShowPasswordChange,
  onToggle 
}: AuthFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [companySizeCategory, setCompanySizeCategory] = useState<"small" | "medium" | "large" | "very-large">("medium");
  const [errorConfig, setErrorConfig] = useState<{ isOpen: boolean, message: string, type: "error" | "warning" | "success", title: string }>({ 
    isOpen: false, 
    message: "", 
    type: "error", 
    title: "Registration Error" 
  });

  const getRandomSize = (category: string) => {
    const ranges = {
      small: [1, 50],
      medium: [51, 250],
      large: [251, 1000],
      "very-large": [1001, 5000]
    };
    const [min, max] = ranges[category as keyof typeof ranges] || [1, 50];
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    onPasswordLengthChange(val.length);
  };

  const togglePasswordVisibility = () => {
    const nextValue = !showPassword;
    setShowPassword(nextValue);
    onShowPasswordChange(nextValue);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorConfig({ 
        isOpen: true, 
        message: "The passwords you entered do not match. Please try again.", 
        type: "error",
        title: "Password Mismatch"
      });
      return;
    }
    try {
      const companyName = (document.getElementById("companyName") as HTMLInputElement).value;
      const email = (document.getElementById("signup-email") as HTMLInputElement).value;
      
      const res = await fetch("http://localhost:9000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: companyName,
          login_email: email,
          login_password: password,
          size: getRandomSize(companySizeCategory)
        })
      });
      if (res.ok) {
        setErrorConfig({ 
          isOpen: true, 
          message: "Verification email sent. Please check your inbox securely before logging in.", 
          type: "success",
          title: "Verify Your Account"
        });
        setTimeout(onToggle, 3000); 
      } else {
        const err = await res.json();
        setErrorConfig({ 
          isOpen: true, 
          message: err.message || "We couldn't create your account. This email might already be in use.", 
          type: "error",
          title: "Registration Failed"
        });
      }
    } catch (error) {
       setErrorConfig({ 
         isOpen: true, 
         message: "A network error occurred during registration. Please try again later.", 
         type: "error",
         title: "Sync Error"
       });
    }
  };

  return (
    <div className="w-full max-w-[420px] transition-all duration-500 animate-in fade-in slide-in-from-right-4 pt-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
           <div className="w-16 h-16 flex items-center justify-center p-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm shadow-xl">
             <img src="/bidforge-icon.png" alt="BidForge Logo" className="w-full h-full object-contain" />
           </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Forge your legacy</h1>
        <p className="text-muted-foreground text-sm">Join the elite network of BidForge innovators</p>
      </div>

      <form className="space-y-4" onSubmit={handleSignup}>
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-white/70">Company Name</Label>
          <Input 
            id="companyName" 
            placeholder="Acme Corp" 
            className="bg-white/5 border-white/10 focus:border-primary/50 text-white h-11"
            onFocus={() => onFocusChange(true)}
            onBlur={() => onFocusChange(false)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-white/70">Company Email</Label>
            <Input 
              id="signup-email" 
              type="email"
              placeholder="name@company.com" 
              className="bg-white/5 border-white/10 focus:border-primary/50 text-white h-11"
              onFocus={() => onFocusChange(true)}
              onBlur={() => onFocusChange(false)}
              required
            />
          </div>
          <div className="space-y-3">
            <Label className="text-white/70">Company Size</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "small", label: "Small", sub: "1-50" },
                { id: "medium", label: "Medium", sub: "51-250" },
                { id: "large", label: "Large", sub: "251-1k" },
                { id: "very-large", label: "Very Large", sub: "1k-10k+" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCompanySizeCategory(cat.id as any)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${
                    companySizeCategory === cat.id 
                    ? "bg-primary/20 border-primary shadow-[0_0_15px_rgba(212,175,55,0.15)]" 
                    : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <span className={`text-sm font-bold ${companySizeCategory === cat.id ? "text-primary" : "text-white"}`}>{cat.label}</span>
                  <span className="text-[10px] text-muted-foreground font-medium opacity-60">{cat.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="space-y-2">
            <Label htmlFor="signup-password text-white/70">Password</Label>
            <div className="relative">
              <Input 
                id="signup-password" 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                className="bg-white/5 border-white/10 focus:border-primary/50 text-white h-11 pr-12"
                onChange={handlePasswordChange}
                onFocus={() => onFocusChange(true)}
                onBlur={() => onFocusChange(false)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors text-[10px] font-bold"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password text-white/70">Confirm</Label>
            <Input 
              id="confirm-password" 
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              className={`bg-white/5 border-white/10 focus:border-primary/50 text-white h-11 ${
                password && confirmPassword && password !== confirmPassword ? "border-destructive/50" : ""
              }`}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => onFocusChange(true)}
              onBlur={() => onFocusChange(false)}
              required
            />
          </div>
        </div>
        
        {password && confirmPassword && password !== confirmPassword && (
          <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 -mt-2">
             <span className="w-1 h-1 bg-destructive rounded-full"></span> Passwords do not match
          </p>
        )}

        <Button type="submit" className="w-full h-12 mt-4 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground border-none rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all">
          Sign Up
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground mt-8">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="font-bold text-primary hover:underline transition-colors ml-1"
        >
          Sign In
        </button>
      </div>

      <ErrorDialog 
        isOpen={errorConfig.isOpen} 
        onClose={() => setErrorConfig({ ...errorConfig, isOpen: false })} 
        message={errorConfig.message}
        title={errorConfig.title}
        type={errorConfig.type}
      />
    </div>
  );
}

