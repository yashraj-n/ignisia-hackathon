"use client";

import { motion, AnimatePresence } from "framer-motion";
import { XCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";

interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: "error" | "warning" | "success";
}

export function ErrorDialog({ 
  isOpen, 
  onClose, 
  title = "Authentication Error", 
  message,
  type = "error"
}: ErrorDialogProps) {
  const icons = {
    error: <XCircle className="w-8 h-8 text-destructive shadow-[0_0_15px_rgba(239,68,68,0.4)]" />,
    warning: <AlertTriangle className="w-8 h-8 text-warning shadow-[0_0_15px_rgba(242,204,21,0.4)]" />,
    success: <CheckCircle2 className="w-8 h-8 text-success shadow-[0_0_15px_rgba(34,197,94,0.4)]" />,
  };

  const borders = {
    error: "border-destructive/20",
    warning: "border-warning/20",
    success: "border-success/20",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className={`relative w-full max-w-sm glass-panel border ${borders[type]} rounded-2xl p-6 shadow-2xl overflow-hidden`}
          >
            {/* Background Glow */}
            <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[80px] opacity-20 pointer-events-none ${type === 'error' ? 'bg-destructive' : type === 'warning' ? 'bg-warning' : 'bg-success'}`} />

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-background/40 rounded-full border border-white/5">
                {icons[type]}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {message}
                </p>
              </div>

              <Button 
                onClick={onClose}
                className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all hover:scale-[1.02] active:scale-95"
              >
                Dismiss
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
