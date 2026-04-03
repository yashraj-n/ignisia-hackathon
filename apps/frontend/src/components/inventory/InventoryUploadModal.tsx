import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FileUp, X, CheckCircle2, Loader2, FileType2, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadInventory, uploadCompetitor } from '../../store/queries';

interface InventoryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: 'inventory' | 'competitor';
}

type AcceptedFileType = 'pdf' | 'csv';

function getFileType(file: File): AcceptedFileType {
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) return 'pdf';
  return 'csv';
}

export default function InventoryUploadModal({ isOpen, onClose, target }: InventoryUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<AcceptedFileType | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (f: File) =>
      target === 'inventory' ? uploadInventory({ file: f }) : uploadCompetitor({ file: f }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [target === 'inventory' ? 'inventory' : 'competitors'] });
      setTimeout(() => {
        onClose();
        resetState();
      }, 1200);
    },
  });

  const resetState = useCallback(() => {
    setFile(null);
    setFileType(null);
    mutation.reset();
  }, [mutation]);

  useEffect(() => {
    if (file && !mutation.isPending && !mutation.isSuccess && !mutation.isError) {
      mutation.mutate(file);
    }
  }, [file]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    maxFiles: 1,
    disabled: mutation.isPending,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const f = acceptedFiles[0];
        setFile(f);
        setFileType(getFileType(f));
      }
    },
  });

  const handleClose = () => {
    if (mutation.isPending) return;
    onClose();
    resetState();
  };

  const titleLabel = target === 'inventory' ? 'Upload Inventory Document' : 'Upload Competitor Document';

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
            className="relative w-full max-w-lg glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#111111]/95 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className={clsx(
                  'p-2 rounded-lg',
                  target === 'inventory' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                )}>
                  <FileUp className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">{titleLabel}</h2>
              </div>
              <button
                onClick={handleClose}
                disabled={mutation.isPending}
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
                    "border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500 relative overflow-hidden group",
                    isDragActive
                      ? target === 'inventory'
                        ? "border-primary bg-primary/5 shadow-[inset_0_0_30px_rgba(234,179,8,0.1)]"
                        : "border-accent bg-accent/5 shadow-[inset_0_0_30px_rgba(232,133,74,0.1)]"
                      : "border-white/10 hover:border-white/20 hover:bg-white/5"
                  )}
                >
                  <input {...getInputProps()} />

                  {isDragActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={clsx(
                        "absolute inset-0 pointer-events-none",
                        target === 'inventory'
                          ? "bg-gradient-to-b from-primary/5 to-transparent"
                          : "bg-gradient-to-b from-accent/5 to-transparent"
                      )}
                    />
                  )}

                  <motion.div
                    animate={isDragActive ? { y: [0, -8, 0], scale: 1.1 } : {}}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    className={clsx(
                      "w-16 h-16 rounded-full bg-[#1A1A1A] border border-white/5 flex items-center justify-center mb-6 transition-all duration-300 relative z-10",
                      isDragActive
                        ? target === 'inventory' ? 'border-primary/40' : 'border-accent/40'
                        : 'group-hover:border-white/20'
                    )}
                  >
                    <FileUp className={clsx(
                      "w-8 h-8 transition-colors duration-300",
                      isDragActive
                        ? target === 'inventory' ? "text-primary" : "text-accent"
                        : "text-muted-foreground group-hover:text-white"
                    )} />
                  </motion.div>

                  <h3 className={clsx(
                    "text-lg font-semibold mb-2 transition-colors duration-300",
                    isDragActive
                      ? target === 'inventory' ? "text-primary" : "text-accent"
                      : "text-white"
                  )}>
                    {isDragActive ? "Release to upload" : "Drop your file here"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-[220px] mx-auto">
                    Upload PDF or CSV files for {target === 'inventory' ? 'your inventory' : 'competitor analysis'}
                  </p>

                  <div className="flex gap-2 relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20">
                      PDF
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20">
                      CSV
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  <div className="flex items-center gap-4 bg-[#1A1A1A] p-4 rounded-xl border border-white/5 mb-6">
                    <div className={clsx(
                      'p-3 rounded-lg shrink-0',
                      fileType === 'pdf' ? 'bg-[#EF4444]/15 text-[#EF4444]' : 'bg-[#22C55E]/15 text-[#22C55E]'
                    )}>
                      {fileType === 'pdf' ? <FileType2 className="w-6 h-6" /> : <FileSpreadsheet className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate text-sm">{file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <span className={clsx(
                          'text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border',
                          fileType === 'pdf'
                            ? 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20'
                            : 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20'
                        )}>
                          {fileType?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    {mutation.isSuccess && <CheckCircle2 className="w-6 h-6 text-[#22C55E] shrink-0" />}
                    {mutation.isError && <AlertCircle className="w-6 h-6 text-[#EF4444] shrink-0" />}
                  </div>

                  <div className="space-y-3">
                    {mutation.isPending && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={clsx(
                          "flex items-center gap-3 p-3 rounded-lg border",
                          target === 'inventory'
                            ? "bg-primary/10 border-primary/30"
                            : "bg-accent/10 border-accent/30"
                        )}
                      >
                        <Loader2 className={clsx(
                          "w-5 h-5 animate-spin shrink-0",
                          target === 'inventory' ? "text-primary" : "text-accent"
                        )} />
                        <span className={clsx(
                          "text-sm font-medium",
                          target === 'inventory' ? "text-primary" : "text-accent"
                        )}>
                          {target === 'inventory' ? 'Uploading & processing inventory...' : 'Uploading & analyzing competitor data...'}
                        </span>
                      </motion.div>
                    )}

                    {mutation.isSuccess && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-3 rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/10"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
                        <span className="text-sm font-medium text-[#22C55E]">Upload complete</span>
                      </motion.div>
                    )}

                    {mutation.isError && (
                      <div className="space-y-3">
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 p-3 rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10"
                        >
                          <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0" />
                          <span className="text-sm font-medium text-[#EF4444]">
                            {mutation.error instanceof Error ? mutation.error.message : 'Upload failed'}
                          </span>
                        </motion.div>
                        <button
                          onClick={() => {
                            resetState();
                          }}
                          className="w-full py-2.5 rounded-lg text-sm font-semibold border border-white/10 text-white hover:bg-white/5 transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className={clsx(
              "h-px w-full bg-gradient-to-r from-transparent to-transparent",
              target === 'inventory' ? 'via-primary/40' : 'via-accent/40'
            )} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
