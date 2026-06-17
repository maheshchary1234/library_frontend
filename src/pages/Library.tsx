import React, { useState, useEffect, useRef } from 'react';
import { fileService, DocumentInfo } from '../services/fileService';
import { FileText, Trash2, Upload, CheckCircle, AlertCircle, Loader2, UploadCloud } from 'lucide-react';

export const Library: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await fileService.getAllDocuments();
      setDocuments(data);
    } catch (err: any) {
      setError('Failed to fetch documents.');
    }
  };

  const processFile = async (file: File) => {
    setError(null);
    setSuccess(null);
    setUploading(true);
    try {
      await fileService.uploadFile(file);
      setSuccess(`"${file.name}" uploaded and parsed successfully!`);
      fetchDocuments();
    } catch (err: any) {
      const status = err.response?.status;
      const serverMsg = typeof err.response?.data === 'string' ? err.response.data : null;

      if (status === 401 || status === 403) {
        setError('Session expired — please log out and log in again, then retry.');
      } else if (status === 413) {
        setError('File is too large. Maximum upload size is 100 MB.');
      } else if (serverMsg) {
        setError(serverMsg);
      } else if (err.message?.includes('Network Error')) {
        setError('Cannot reach the server. Make sure the backend is running on port 8080.');
      } else {
        setError('Upload failed. Ensure the file is a valid PDF or TXT and try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processFile(files[0]);
    // Reset the input so the same file can be re-uploaded
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    await processFile(files[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await fileService.deleteDocument(id);
      setSuccess('Document deleted successfully.');
      setDocuments(documents.filter((doc) => doc.id !== id));
    } catch (err: any) {
      setError('Failed to delete document.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent dark:from-white dark:to-slate-400 text-slate-900">
            Document Library
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            Upload PDFs and text files to unlock AI summaries, flashcards, quizzes, and tutoring.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white/5 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 self-start sm:self-center">
          {documents.length} document{documents.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Status Banners */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-2xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* ── LARGE UPLOAD ZONE ── */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative w-full rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
          ${isDragging
            ? 'border-purple-500 bg-purple-500/10 scale-[1.01]'
            : 'border-slate-200 dark:border-white/10 hover:border-purple-500/60 dark:hover:border-purple-500/50 bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.04]'
          }
          ${uploading ? 'pointer-events-none' : ''}
        `}
      >
        {/* Ambient glow orbs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center gap-6 py-20 px-8 text-center select-none">
          {uploading ? (
            <>
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
              </div>
              <div>
                <p className="text-lg font-bold dark:text-white text-slate-800">Uploading & Analyzing...</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Extracting text and building your study index. This may take a moment.</p>
              </div>
              <div className="w-full max-w-xs h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </>
          ) : (
            <>
              <div className={`w-24 h-24 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isDragging
                  ? 'bg-purple-500/20 border-2 border-purple-500/40 scale-110'
                  : 'bg-gradient-to-tr from-purple-500/10 to-blue-500/10 border border-purple-500/20'
              }`}>
                <UploadCloud className={`w-12 h-12 transition-all duration-300 ${isDragging ? 'text-purple-400 scale-110' : 'text-purple-400'}`} />
              </div>

              <div>
                <p className="text-2xl font-extrabold dark:text-white text-slate-800 tracking-tight">
                  {isDragging ? 'Drop your file here' : 'Drag & Drop to Upload'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  or <span className="font-bold text-purple-400 hover:text-purple-300 transition-colors">click anywhere to browse</span>
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap justify-center">
                <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
                  📄 PDF Documents
                </span>
                <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
                  📝 TXT Files
                </span>
                <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
                  Max 50 MB
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                className="mt-2 px-8 py-3.5 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#9D76FA] hover:to-[#5293FA] text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transform hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Choose File
              </button>
            </>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Documents Grid */}
      {documents.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
            Your Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="group p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-[2px] bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.04] border-slate-200 dark:border-white/[0.06] shadow-sm hover:shadow-md hover:border-purple-500/20 dark:hover:border-purple-500/20 flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-105 transition-transform shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm dark:text-white text-slate-800 truncate" title={doc.title}>
                      {doc.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      Uploaded {new Date(doc.uploadedAt).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                    {doc.content && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 bg-slate-50 dark:bg-white/[0.02] p-2.5 rounded-lg border border-slate-100 dark:border-white/5">
                        {doc.content.substring(0, 150)}…
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.05] flex justify-between items-center">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {doc.title.toLowerCase().endsWith('.pdf') ? 'PDF' : 'TXT'}
                  </span>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
