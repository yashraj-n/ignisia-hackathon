import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FileUp, X, FileText, CheckCircle2, Loader2, Image, FileType2 } from 'lucide-react';
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
  "Generating insights...",
];

type AcceptedFileType = 'pdf' | 'docx' | 'image';

function getFileType(file: File): AcceptedFileType {
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type.startsWith('image/')) return 'image';
  return 'docx';
}

function FileTypeIcon({ type, className }: { type: AcceptedFileType; className?: string }) {
  if (type === 'pdf') return <FileType2 className={className} />;
  if (type === 'image') return <Image className={className} />;
  return <FileText className={className} />;
}

function FileTypeBadge({ type }: { type: AcceptedFileType }) {
  const config = {
    pdf: { label: 'PDF', color: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20' },
    docx: { label: 'DOCX', color: 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20' },
    image: { label: 'IMAGE', color: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20' },
  };
  const { label, color } = config[type];
  return (
    <span className={clsx('text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border', color)}>
      {label}
    </span>
  );
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<AcceptedFileType | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);

  const queryClient = useQueryClient();

  // Generate image preview when an image file is selected
  useEffect(() => {
    if (file && getFileType(file) === 'image') {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview(null);
    }
  }, [file]);

  // Start processing when file is set
  useEffect(() => {
    if (file && currentStep === -1) {
      setCurrentStep(0);
    }
  }, [file]);

  // Step progression
  useEffect(() => {
    if (currentStep >= 0 && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (currentStep === steps.length) {
      setIsComplete(true);
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['rfps'] });
        queryClient.invalidateQueries({ queryKey: ['rfp-stats'] });
        onClose();
        setFile(null);
        setFileType(null);
        setCurrentStep(-1);
        setIsComplete(false);
      }, 2000);
    }
  }, [currentStep, onClose, queryClient]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const f = acceptedFiles[0];
        setFile(f);
        setFileType(getFileType(f));
      }
    },
  });

  const handleClose = () => {
    if (currentStep >= 0 && !isComplete) return;
    onClose();
    setFile(null);
    setFileType(null);
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
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
            className="relative w-full max-w-lg glass-panel rounded-2xl overflow-hidden shadow-[0_0_50px_-12px_rgba(234,179,8,0.12)] border border-white/10"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#111111]/95 backdrop-blur-md">
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
                /* ── Drop Zone ── */
                <div
                  {...getRootProps()}
                  className={clsx(
                    "border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500 relative overflow-hidden group",
                    isDragActive
                      ? "border-primary bg-primary/5 shadow-[inset_0_0_30px_rgba(234,179,8,0.1)]"
                      : "border-white/10 hover:border-primary/40 hover:bg-white/5"
                  )}
                >
                  <input {...getInputProps()} />

                  {isDragActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"
                    />
                  )}

                  <motion.div
                    animate={isDragActive ? { y: [0, -8, 0], scale: 1.1 } : {}}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-white/5 flex items-center justify-center mb-6 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] group-hover:border-primary/40 transition-all duration-300 relative z-10"
                  >
                    <FileUp className={clsx("w-8 h-8 transition-colors duration-300", isDragActive ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
                  </motion.div>

                  <h3 className={clsx("text-lg font-semibold mb-2 transition-colors duration-300", isDragActive ? "text-primary" : "text-white")}>
                    {isDragActive ? "Release to process" : "Drop your file here"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-[220px] mx-auto">
                    Supports PDF, DOCX, PNG, JPG and WebP files
                  </p>

                  {/* Supported types */}
                  <div className="flex flex-wrap gap-2 justify-center relative z-10">
                    {[
                      { label: 'PDF', color: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20' },
                      { label: 'DOCX', color: 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20' },
                      { label: 'PNG', color: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20' },
                      { label: 'JPG', color: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20' },
                      { label: 'WEBP', color: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20' },
                    ].map(({ label, color }) => (
                      <span
                        key={label}
                        className={clsx(
                          'text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border transition-all duration-300',
                          color,
                          'group-hover:opacity-100'
                        )}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                /* ── Processing View ── */
                <div className="py-4">
                  {/* File info card */}
                  <div className="flex items-center gap-4 bg-[#1A1A1A] p-4 rounded-xl border border-white/5 mb-6">
                    {/* Image preview or icon */}
                    {fileType === 'image' && imagePreview ? (
                      <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 shrink-0">
                        <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={clsx(
                        'p-3 rounded-lg shrink-0',
                        fileType === 'pdf' ? 'bg-[#EF4444]/15 text-[#EF4444]' :
                        fileType === 'docx' ? 'bg-[#3B82F6]/15 text-[#3B82F6]' :
                        'bg-primary/15 text-primary'
                      )}>
                        <FileTypeIcon type={fileType!} className="w-6 h-6" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate text-sm">{file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        {fileType && <FileTypeBadge type={fileType} />}
                      </div>
                    </div>

                    {isComplete && <CheckCircle2 className="w-6 h-6 text-[#22C55E] shrink-0" />}
                  </div>

                  {/* Steps */}
                  <div className="space-y-3">
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
                            scale: isCurrent ? 1.02 : 1,
                          }}
                          className={clsx(
                            "flex items-center gap-3 p-3 rounded-lg transition-colors border",
                            isCurrent ? "bg-primary/10 border-primary/30" : "border-transparent"
                          )}
                        >
                          {isPast ? (
                            <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
                          ) : isCurrent ? (
                            <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                          )}
                          <span className={clsx(
                            "text-sm font-medium",
                            isCurrent ? "text-primary" : isPast ? "text-white" : "text-muted-foreground"
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

            {/* Bottom gradient accent */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
