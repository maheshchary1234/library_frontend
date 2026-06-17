import React, { useState, useEffect } from 'react';
import { fileService, DocumentInfo } from '../services/fileService';
import { aiService } from '../services/aiService';
import { ChatBox } from '../components/ai/ChatBox';
import { SummaryCard } from '../components/ai/SummaryCard';
import { Sparkles, FileText, ChevronRight } from 'lucide-react';

export const AiTutor: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentInfo | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [tab, setTab] = useState<'chat' | 'summary'>('chat');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await fileService.getAllDocuments();
      setDocuments(data);
      if (data.length > 0) {
        handleSelectDocument(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectDocument = async (doc: DocumentInfo) => {
    setSelectedDoc(doc);
    setSummary(null);
    setLoadingSummary(true);
    try {
      const sum = await aiService.getSummary(doc.id);
      setSummary(sum);
    } catch (err) {
      setSummary('Failed to generate summary.');
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Document Selector Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-teal-400">AI Tutor Workspace</h2>
            <p className="text-slate-400 text-xs mt-1">Select a document to begin studying</p>
          </div>

          <div className="space-y-3">
            {documents.length === 0 ? (
              <div className="p-4 text-center text-slate-550 text-sm border border-dashed border-slate-800 rounded-xl">
                No documents in library. Please upload a file first.
              </div>
            ) : (
              documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => handleSelectDocument(doc)}
                  className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all group ${
                    selectedDoc?.id === doc.id
                      ? 'bg-teal-900/30 border-teal-500 text-teal-200 shadow-md'
                      : 'bg-slate-800 border-slate-750 text-slate-300 hover:border-slate-700 hover:bg-slate-750/30'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className={`w-5 h-5 flex-shrink-0 ${selectedDoc?.id === doc.id ? 'text-teal-400' : 'text-slate-500'}`} />
                    <span className="truncate font-medium text-sm" title={doc.title}>{doc.title}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* AI Tutor Main Interface */}
        <div className="lg:col-span-3 space-y-6">
          {selectedDoc ? (
            <div className="space-y-6">
              {/* Document Tabs */}
              <div className="flex justify-between items-center bg-slate-800 p-2 rounded-xl border border-slate-750">
                <div className="flex gap-2">
                  <button
                    onClick={() => setTab('chat')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      tab === 'chat'
                        ? 'bg-teal-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tutor Chat
                  </button>
                  <button
                    onClick={() => setTab('summary')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      tab === 'summary'
                        ? 'bg-teal-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    AI Summary
                  </button>
                </div>

                <span className="text-xs text-slate-500 font-semibold px-4">
                  Active File: <span className="text-teal-400 font-bold">{selectedDoc.title}</span>
                </span>
              </div>

              {/* Tab Content */}
              {tab === 'chat' && <ChatBox documentId={selectedDoc.id} />}
              
              {tab === 'summary' && (
                <div>
                  {loadingSummary ? (
                    <div className="p-12 text-center space-y-4">
                      <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-slate-400 text-sm">Generating comprehensive summary...</p>
                    </div>
                  ) : (
                    summary && <SummaryCard summary={summary} />
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="h-96 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 gap-4">
              <div className="p-4 bg-slate-850 rounded-full text-slate-700">
                <Sparkles className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-slate-400">Ready to Study</h3>
              <p className="text-slate-550 max-w-sm text-sm">
                Select one of your documents from the left sidebar to start the interactive AI chat tutor and generate summaries.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
