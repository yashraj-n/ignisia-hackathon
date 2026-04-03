"use client";

import React, { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

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

  return (
    <div className="w-full max-w-[420px] transition-all duration-500 animate-in fade-in slide-in-from-left-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back!</h1>
        <p className="text-muted-foreground text-sm">Please enter your details</p>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            placeholder="name@company.com" 
            onFocus={() => onFocusChange(true)}
            onBlur={() => onFocusChange(false)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => onFocusChange(true)}
              onBlur={() => onFocusChange(false)}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <a href="#" className="text-sm text-primary hover:underline font-medium">
            Forgot password?
          </a>
        </div>

        <Button type="submit" className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground border-none">
          Sign In
        </Button>
      </form>

      <div className="mt-6">
        <Button variant="outline" className="w-full h-12 bg-background border-border/60 hover:bg-accent" type="button">
          <Mail className="mr-2 h-5 w-5" />
          Continue with Google
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground mt-8">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="font-medium text-primary hover:underline transition-colors"
        >
          Sign Up
        </button>
      </div>
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

  return (
    <div className="w-full max-w-[420px] transition-all duration-500 animate-in fade-in slide-in-from-right-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create an account</h1>
        <p className="text-muted-foreground text-sm">Join BidForge today</p>
      </div>

      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="userName">User Name</Label>
            <Input 
              id="userName" 
              placeholder="John Doe" 
              onFocus={() => onFocusChange(true)}
              onBlur={() => onFocusChange(false)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input 
              id="companyName" 
              placeholder="Acme Corp" 
              onFocus={() => onFocusChange(true)}
              onBlur={() => onFocusChange(false)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="signup-email">Company Email</Label>
            <Input 
              id="signup-email" 
              type="email"
              placeholder="name@company.com" 
              onFocus={() => onFocusChange(true)}
              onBlur={() => onFocusChange(false)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="size">Company Size</Label>
            <Input 
              id="size" 
              type="number"
              min="1"
              placeholder="50" 
              onFocus={() => onFocusChange(true)}
              onBlur={() => onFocusChange(false)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <div className="relative">
            <Input 
              id="signup-password" 
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => onFocusChange(true)}
              onBlur={() => onFocusChange(false)}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input 
            id="confirm-password" 
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={() => onFocusChange(true)}
            onBlur={() => onFocusChange(false)}
            required
          />
          {password && confirmPassword && password !== confirmPassword && (
            <p className="text-[10px] text-destructive">Passwords do not match</p>
          )}
        </div>

        <Button type="submit" className="w-full h-12 mt-2 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground border-none">
          Sign Up
        </Button>
      </form>

      <div className="mt-4">
        <Button variant="outline" className="w-full h-12 bg-background border-border/60 hover:bg-accent" type="button">
          <Mail className="mr-2 h-5 w-5" />
          Join with Google
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="font-medium text-primary hover:underline transition-colors"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
