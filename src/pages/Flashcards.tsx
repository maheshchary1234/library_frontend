import React, { useState, useEffect } from 'react';
import { fileService, DocumentInfo } from '../services/fileService';
import { aiService, FlashcardInfo } from '../services/aiService';
import { FlashCard } from '../components/ai/FlashCard';
import { ChevronLeft, ChevronRight, FileText, Sparkles } from 'lucide-react';

export const Flashcards: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentInfo | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

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
    setFlashcards([]);
    setCurrentIdx(0);
    setLoading(true);
    try {
      const data = await aiService.getFlashcards(doc.id);
      setFlashcards(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < flashcards.length) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Document Selector Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-teal-400">AI Flashcards</h2>
            <p className="text-slate-400 text-xs mt-1">Select a document to review revision cards</p>
          </div>

          <div className="space-y-3">
            {documents.length === 0 ? (
              <div className="p-4 text-center text-slate-555 text-sm border border-dashed border-slate-800 rounded-xl">
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

        {/* Flashcards Panel */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[400px]">
          {selectedDoc ? (
            <div className="w-full space-y-8">
              <div className="text-center">
                <h3 className="text-lg text-slate-450">Reviewing flashcards generated from:</h3>
                <h4 className="text-2xl font-extrabold text-teal-400 mt-1">{selectedDoc.title}</h4>
              </div>

              {loading ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-400 text-sm">Generating flashcards...</p>
                </div>
              ) : flashcards.length === 0 ? (
                <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                  Failed to generate flashcards.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current Active Flashcard */}
                  <FlashCard
                    question={flashcards[currentIdx].question}
                    answer={flashcards[currentIdx].answer}
                  />

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-6 max-w-xs mx-auto">
                    <button
                      onClick={handlePrev}
                      disabled={currentIdx === 0}
                      className="p-3 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-semibold text-slate-450">
                      Card {currentIdx + 1} of {flashcards.length}
                    </span>
                    <button
                      onClick={handleNext}
                      disabled={currentIdx + 1 === flashcards.length}
                      className="p-3 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 gap-4 w-full py-24">
              <div className="p-4 bg-slate-855 rounded-full text-slate-700">
                <Sparkles className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-slate-400">AI Flashcard Deck</h3>
              <p className="text-slate-550 max-w-sm text-sm">
                Select one of your documents from the sidebar to review and generate conceptual flashcard decks automatically.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
