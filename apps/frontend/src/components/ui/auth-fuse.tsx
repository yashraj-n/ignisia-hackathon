import { useState } from "react";
import { Sparkles } from "lucide-react";
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
      <div className="lg:hidden flex items-center justify-center gap-2 text-lg font-semibold mb-12">
        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="size-4 text-primary" />
        </div>
        <span className="font-bold">BidForge</span>
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
