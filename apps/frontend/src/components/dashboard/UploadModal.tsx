import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FileUp, X, FileText, AlertCircle, Image, FileType2, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { API_BASE_URL } from '../../lib/utils';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CompanyInfo {
  id: string;
  name: string;
  login_email: string;
}

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

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<AcceptedFileType | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Get company info
  const { data: companyData } = useQuery({
    queryKey: ['company-me'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch company info');
      const data = await res.json();
      return data.company as CompanyInfo;
    },
    enabled: isOpen,
  });

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

  // Upload file immediately and navigate to processing page
  const uploadAndProcess = async (selectedFile: File) => {
    if (isUploading || !companyData) return;

    try {
      setIsUploading(true);
      setUploadError(null);

      // Read file content
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(selectedFile);
      });

      // Upload to backend
      const token = localStorage.getItem('token');
      const uploadRes = await fetch(`${API_BASE_URL}/api/rfp/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_id: companyData.id,
          status: 'Processing',
          information: fileContent,
        }),
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload RFP');
      }

      const uploadedRfp = await uploadRes.json();

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['rfps'] });
      queryClient.invalidateQueries({ queryKey: ['rfp-stats'] });

      // Navigate to the authentic processing pipeline
      if (uploadedRfp.rfp?.id) {
        navigate({
          to: '/rfp-processing',
          search: {
            rfpId: uploadedRfp.rfp.id,
            companyId: companyData.id,
            companyName: companyData.name
          },
        });
      } else {
        throw new Error('Upload succeeded but no RFP ID was returned.');
      }

      // Clean up modal state
      onClose();
      resetState();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload RFP';
      setUploadError(message);
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setFileType(null);
    setIsUploading(false);
    setUploadError(null);
    setImagePreview(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    disabled: isUploading,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const f = acceptedFiles[0];
        setFile(f);
        setFileType(getFileType(f));
      }
    },
  });

  const handleClose = () => {
    if (isUploading) return;
    onClose();
    resetState();
  };

  const handleUpload = () => {
    if (file && companyData) {
      uploadAndProcess(file);
    }
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
                disabled={isUploading}
                className="p-2 text-muted-foreground hover:text-white hover:bg-white/5 rounded-full transition-all duration-200 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              {uploadError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-400">Upload Error</p>
                    <p className="text-xs text-red-300/80 mt-1">{uploadError}</p>
                  </div>
                </motion.div>
              )}

              {/* Drop Zone */}
              <div
                {...getRootProps()}
                className={clsx(
                  "border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500 relative overflow-hidden group",
                  isUploading && "pointer-events-none opacity-50",
                  isDragActive
                    ? "border-primary bg-primary/5 shadow-[inset_0_0_30px_rgba(234,179,8,0.1)]"
                    : file
                    ? "border-[#D4AF37]/40 bg-[#D4AF37]/5"
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

                {file ? (
                  /* File selected preview */
                  <div className="flex flex-col items-center relative z-10">
                    {fileType === 'image' && imagePreview ? (
                      <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 mb-4 shadow-lg">
                        <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={clsx(
                        'w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg',
                        fileType === 'pdf' ? 'bg-[#EF4444]/15 text-[#EF4444]' :
                        fileType === 'docx' ? 'bg-[#3B82F6]/15 text-[#3B82F6]' :
                        'bg-primary/15 text-primary'
                      )}>
                        <FileTypeIcon type={fileType!} className="w-8 h-8" />
                      </div>
                    )}
                    <p className="text-white font-semibold text-sm mb-1">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p className="text-xs text-[#D4AF37] mt-3">Click or drop another file to replace</p>
                  </div>
                ) : (
                  /* Empty drop zone */
                  <>
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
                  </>
                )}
              </div>

              {/* Upload Button — shown when file is selected */}
              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <button
                    onClick={handleUpload}
                    disabled={isUploading || !companyData}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#E5B80B] text-black font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FileUp className="w-4 h-4" />
                        Upload Document
                      </>
                    )}
                  </button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    You will be redirected to the actual RFP processing pipeline
                  </p>
                </motion.div>
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
