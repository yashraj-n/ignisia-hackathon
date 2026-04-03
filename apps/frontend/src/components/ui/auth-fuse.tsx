import { useState } from "react";
import { AnimatedCharacters } from "../auth/AnimatedCharacters";
import { SignInForm, SignUpForm } from "../auth/AuthForms";

const AuthFormContainer = ({
  isSignIn,
  onToggle,
  onFocusChange,
  onPasswordLengthChange,
  onShowPasswordChange
}: {
  isSignIn: boolean;
  onToggle: () => void;
  onFocusChange: (isFocused: boolean) => void;
  onPasswordLengthChange: (length: number) => void;
  onShowPasswordChange: (show: boolean) => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto px-6">
      <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
        <div className="w-10 h-10 flex items-center justify-center p-1 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
          <img src="/bidforge-icon.png" alt="BidForge Logo" className="w-full h-full object-contain" />
        </div>
        <span className="font-bold text-xl tracking-tight leading-none text-white">
          Bid<span className="text-[#D4AF37]">Forge</span>
        </span>
      </div>

      <div className="w-full relative transition-all duration-300">
        {isSignIn ? (
          <SignInForm
            onFocusChange={onFocusChange}
            onPasswordLengthChange={onPasswordLengthChange}
            onShowPasswordChange={onShowPasswordChange}
            onToggle={onToggle}
          />
        ) : (
          <SignUpForm
            onFocusChange={onFocusChange}
            onPasswordLengthChange={onPasswordLengthChange}
            onShowPasswordChange={onShowPasswordChange}
            onToggle={onToggle}
          />
        )}
      </div>
    </div>
  );
};

export const AuthUI = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [passwordLength, setPasswordLength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const toggleForm = () => setIsSignIn(!isSignIn);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left side: Animated Characters */}
      <AnimatedCharacters
        isTyping={isTyping}
        passwordLength={passwordLength}
        showPassword={showPassword}
      />

      {/* Right side: Auth Forms */}
      <div className="flex items-center justify-center p-8">
        <AuthFormContainer
          isSignIn={isSignIn}
          onToggle={toggleForm}
          onFocusChange={setIsTyping}
          onPasswordLengthChange={setPasswordLength}
          onShowPasswordChange={setShowPassword}
        />
      </div>
    </div>
  );
};
