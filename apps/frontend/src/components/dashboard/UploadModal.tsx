import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FileUp, X, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useQueryClient } from '@tanstack/react-query';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  "Analyzing RFP...",
  "Extracting scope...",
  "Detecting infrastructure...",
  "Generating insights..."
];

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  
  const queryClient = useQueryClient();

  // Simulate process
  useEffect(() => {
    if (file && currentStep === -1) {
      setCurrentStep(0);
    }
  }, [file]);

  useEffect(() => {
    if (currentStep >= 0 && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (currentStep === steps.length) {
      setIsComplete(true);
      setTimeout(() => {
        // Assume mutation success
        queryClient.invalidateQueries({ queryKey: ['rfps']});
        queryClient.invalidateQueries({ queryKey: ['rfp-stats']});
        onClose();
        setFile(null);
        setCurrentStep(-1);
        setIsComplete(false);
      }, 2000);
    }
  }, [currentStep, onClose, queryClient]);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    }
  });

  const handleClose = () => {
    if (currentStep >= 0 && !isComplete) return; // Prevent close during processing
    onClose();
    setFile(null);
    setCurrentStep(-1);
    setIsComplete(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full max-w-lg glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#121212]/95 backdrop-blur-md">
              <h2 className="text-xl font-bold text-white tracking-tight">Upload RFP Document</h2>
              <button
                onClick={handleClose}
                disabled={currentStep >= 0 && !isComplete}
                className="p-2 text-muted-foreground hover:text-white hover:bg-white/5 rounded-full transition-all duration-200 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              {!file ? (
                <div
                  {...getRootProps()}
                  className={clsx(
                    "border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500 relative overflow-hidden group",
                    isDragActive 
                      ? "border-[#D4AF37] bg-[#D4AF37]/5 shadow-[inset_0_0_20px_rgba(212,175,55,0.1)]" 
                      : "border-white/10 hover:border-[#D4AF37]/40 hover:bg-white/5"
                  )}
                >
                  <input {...getInputProps()} />
                  
                  {isDragActive && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none"
                    />
                  )}

                  <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-white/5 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:border-[#D4AF37]/30 transition-all duration-300">
                    <FileUp className={clsx("w-8 h-8 transition-colors duration-300", isDragActive ? "text-[#D4AF37]" : "text-muted-foreground group-hover:text-white")} />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {isDragActive ? "Release to process" : "Drop RFP file here"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-[200px] mx-auto">
                    Securely upload PDF or DOCX files for AI analysis
                  </p>
                  
                  <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                    <span className="bg-white/5 px-2 py-1 rounded border border-white/5 transition-colors group-hover:border-white/10">PDF</span>
                    <span className="bg-white/5 px-2 py-1 rounded border border-white/5 transition-colors group-hover:border-white/10">DOCX</span>
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  <div className="flex items-center gap-4 bg-[#1A1A1A] p-4 rounded-xl border border-white/5 mb-8">
                    <div className="bg-[#D4AF37]/20 p-3 rounded-lg text-[#D4AF37]">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    {isComplete && <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />}
                  </div>

                  <div className="space-y-4">
                    {steps.map((step, index) => {
                      const isPast = currentStep > index;
                      const isCurrent = currentStep === index;
                      const isPending = currentStep < index;

                      return (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: isPending ? 0.4 : 1,
                            x: 0,
                            scale: isCurrent ? 1.02 : 1
                          }}
                          className={clsx(
                            "flex items-center gap-3 p-3 rounded-lg transition-colors border",
                            isCurrent ? "bg-[#D4AF37]/10 border-[#D4AF37]/30" : "border-transparent"
                          )}
                        >
                          {isPast ? (
                            <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                          ) : isCurrent ? (
                            <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                          )}
                          <span className={clsx(
                            "text-sm font-medium",
                            isCurrent ? "text-[#D4AF37]" : isPast ? "text-white" : "text-muted-foreground"
                          )}>
                            {step}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            {/* Soft gold bottom gradient line */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
