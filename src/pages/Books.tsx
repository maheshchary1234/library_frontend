import React, { useState, useEffect, useCallback, useRef } from 'react';
import { bookService, BookInfo } from '../services/bookService';
import { BookCard } from '../components/books/BookCard';
import { BookSearch } from '../components/books/BookSearch';
import { RecommendedBooks } from '../components/books/RecommendedBooks';

type ViewMode = 'discover' | 'search' | 'saved';

const BooksHeroBanner: React.FC = () => (
  <div style={{
    position: 'relative',
    borderRadius: '24px',
    overflow: 'hidden',
    padding: '48px 40px',
    marginBottom: '40px',
    background: 'linear-gradient(135deg, rgba(67,20,128,0.6) 0%, rgba(99,102,241,0.4) 40%, rgba(14,116,144,0.4) 100%)',
    border: '1px solid rgba(99,102,241,0.25)',
    backdropFilter: 'blur(20px)',
  }}>
    {/* Decorative blobs */}
    <div style={{
      position: 'absolute', top: '-60px', right: '-60px',
      width: '300px', height: '300px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
      pointerEvents: 'none',
    }} />
    <div style={{
      position: 'absolute', bottom: '-40px', left: '20%',
      width: '200px', height: '200px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(20,184,166,0.2) 0%, transparent 70%)',
      pointerEvents: 'none',
    }} />

    <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(99,102,241,0.2)',
        border: '1px solid rgba(99,102,241,0.4)',
        borderRadius: '20px',
        padding: '5px 14px',
        marginBottom: '16px',
        fontSize: '12px',
        fontWeight: '700',
        color: '#a5b4fc',
        letterSpacing: '1px',
        textTransform: 'uppercase',
      }}>
        📚 Book Discovery
      </div>

      <h1 style={{
        fontSize: 'clamp(28px, 4vw, 44px)',
        fontWeight: '900',
        color: '#f1f5f9',
        lineHeight: '1.2',
        margin: '0 0 16px',
        letterSpacing: '-1px',
      }}>
        Explore Millions of
        <span style={{
          display: 'block',
          background: 'linear-gradient(135deg, #a5b4fc, #14b8a6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Books & Stories
        </span>
      </h1>

      <p style={{
        fontSize: '15px',
        color: '#94a3b8',
        lineHeight: '1.7',
        margin: '0 0 24px',
        maxWidth: '480px',
      }}>
        Discover, read, and save books from Google Books & Open Library.
        Your personal AI-powered reading companion.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[
          { icon: '🔍', label: 'Search 10M+ Books' },
          { icon: '📖', label: 'Read Previews' },
          { icon: '❤️', label: 'Build Your Library' },
        ].map(f => (
          <div key={f.label} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '12px',
            color: '#cbd5e1',
            fontWeight: '500',
          }}>
            <span>{f.icon}</span>
            <span>{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const EmptyState: React.FC<{ message: string; subtext?: string; icon?: string }> = ({ message, subtext, icon = '🔍' }) => (
  <div style={{
    textAlign: 'center',
    padding: '80px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  }}>
    <div style={{
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'rgba(99,102,241,0.1)',
      border: '1px solid rgba(99,102,241,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '36px',
    }}>
      {icon}
    </div>
    <p style={{ fontSize: '18px', color: '#94a3b8', fontWeight: '600', margin: 0 }}>{message}</p>
    {subtext && <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>{subtext}</p>}
  </div>
);

const BookSkeletonCard = () => (
  <div style={{
    background: 'rgba(15,23,42,0.6)',
    border: '1px solid rgba(51,65,85,0.4)',
    borderRadius: '20px',
    overflow: 'hidden',
    height: '400px',
  }}>
    <div style={{ height: '240px', background: 'rgba(30,41,59,0.6)', animation: 'pulse 1.5s ease-in-out infinite' }} />
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {[75, 55, 45, 30].map((w, i) => (
        <div key={i} style={{
          height: '12px',
          width: `${w}%`,
          background: 'rgba(30,41,59,0.8)',
          animation: `pulse 1.5s ease-in-out ${i * 0.1}s infinite`,
          borderRadius: '6px',
        }} />
      ))}
    </div>
  </div>
);

export const Books: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('discover');
  const [searchResults, setSearchResults] = useState<BookInfo[]>([]);
  const [savedBooks, setSavedBooks] = useState<BookInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [errorMsg, setErrorMsg] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load saved books when switching to saved view
  useEffect(() => {
    if (viewMode === 'saved') {
      setIsLoading(true);
      bookService.getSavedBooks()
        .then(setSavedBooks)
        .catch(() => setErrorMsg('Failed to load saved books.'))
        .finally(() => setIsLoading(false));
    }
  }, [viewMode]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query) {
      setSearchResults([]);
      setViewMode('discover');
      return;
    }
    setLastQuery(query);
    setViewMode('search');
    setIsLoading(true);
    setErrorMsg('');
    try {
      const results = await bookService.searchBooks(query);
      setSearchResults(results);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setErrorMsg('Search failed. Please check your connection and try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFilterChange = useCallback((genre: string) => {
    setActiveFilter(genre);
    if (genre === 'all') {
      handleSearch(lastQuery || 'bestsellers');
    } else {
      handleSearch(genre);
    }
  }, [lastQuery, handleSearch]);

  const handleSaveToggle = useCallback((book: BookInfo) => {
    setSavedBooks(prev =>
      prev.some(b => b.googleBookId === book.googleBookId)
        ? prev.filter(b => b.googleBookId !== book.googleBookId)
        : [...prev, book]
    );
  }, []);

  const filteredSearchResults = activeFilter === 'all'
    ? searchResults
    : searchResults.filter(b =>
        b.category?.toLowerCase().includes(activeFilter.toLowerCase()) ||
        b.title?.toLowerCase().includes(activeFilter.toLowerCase()) ||
        b.author?.toLowerCase().includes(activeFilter.toLowerCase())
      );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0f0a1e 50%, #0a1628 100%)',
      color: '#f1f5f9',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* Animated bg particles */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${
              ['rgba(99,102,241,0.08)', 'rgba(139,92,246,0.06)', 'rgba(20,184,166,0.05)'][i % 3]
            } 0%, transparent 70%)`,
            width: `${[400, 300, 500, 350, 250, 450][i]}px`,
            height: `${[400, 300, 500, 350, 250, 450][i]}px`,
            top: `${[10, 60, 30, 80, 5, 55][i]}%`,
            left: `${[10, 70, 40, 20, 80, 55][i]}%`,
            transform: 'translate(-50%, -50%)',
            animation: `float ${[20, 25, 18, 22, 28, 16][i]}s ease-in-out infinite alternate`,
          }} />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '32px 24px 60px' }}>

        {/* Hero */}
        <BooksHeroBanner />

        {/* Search & Filters */}
        <div style={{ marginBottom: '32px' }}>
          <BookSearch
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            activeFilter={activeFilter}
            isLoading={isLoading && viewMode === 'search'}
          />
        </div>

        {/* View Mode Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '32px',
          background: 'rgba(15,23,42,0.6)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(51,65,85,0.5)',
          borderRadius: '16px',
          padding: '4px',
          width: 'fit-content',
        }}>
          {[
            { key: 'discover' as ViewMode, label: 'Discover', icon: '🌟' },
            { key: 'search' as ViewMode, label: `Results${searchResults.length ? ` (${searchResults.length})` : ''}`, icon: '🔍' },
            { key: 'saved' as ViewMode, label: `My Library${savedBooks.length ? ` (${savedBooks.length})` : ''}`, icon: '❤️' },
          ].map(tab => {
            const isActive = viewMode === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setViewMode(tab.key)}
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    : 'transparent',
                  color: isActive ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 4px 12px rgba(99,102,241,0.4)' : 'none',
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '24px',
            color: '#fca5a5',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* ── Discover View ── */}
        {viewMode === 'discover' && (
          <RecommendedBooks onSaveToggle={handleSaveToggle} />
        )}

        {/* ── Search Results View ── */}
        {viewMode === 'search' && (
          <div ref={resultsRef}>
            {/* Results header */}
            {!isLoading && searchResults.length > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '12px',
              }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#f1f5f9', margin: '0 0 4px' }}>
                    Results for "{lastQuery}"
                  </h2>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                    {filteredSearchResults.length} books found
                    {activeFilter !== 'all' && ` · filtered by "${activeFilter}"`}
                  </p>
                </div>
                <div style={{
                  background: 'rgba(99,102,241,0.15)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: '20px',
                  padding: '5px 14px',
                  fontSize: '12px',
                  color: '#a5b4fc',
                  fontWeight: '600',
                }}>
                  🔍 {searchResults.length} total
                </div>
              </div>
            )}

            {isLoading ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px',
              }}>
                {[...Array(12)].map((_, i) => <BookSkeletonCard key={i} />)}
              </div>
            ) : filteredSearchResults.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px',
              }}>
                {filteredSearchResults.map((book, idx) => (
                  <BookCard
                    key={`${book.googleBookId}-${idx}`}
                    book={book}
                    onSaveToggle={handleSaveToggle}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="🔍"
                message={lastQuery ? `No results for "${lastQuery}"` : 'Search for books above'}
                subtext={lastQuery ? 'Try a different query or browse by genre' : 'Use the search bar or explore genres above'}
              />
            )}
          </div>
        )}

        {/* ── Saved Library View ── */}
        {viewMode === 'saved' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#f1f5f9', margin: '0 0 6px' }}>
                My Library
              </h2>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                {savedBooks.length} {savedBooks.length === 1 ? 'book' : 'books'} saved
              </p>
            </div>

            {isLoading ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px',
              }}>
                {[...Array(6)].map((_, i) => <BookSkeletonCard key={i} />)}
              </div>
            ) : savedBooks.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px',
              }}>
                {savedBooks.map((book, idx) => (
                  <BookCard
                    key={`saved-${book.id ?? book.googleBookId}-${idx}`}
                    book={book}
                    isSaved={true}
                    onSaveToggle={b => setSavedBooks(prev => prev.filter(p => p.id !== b.id))}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="📚"
                message="Your library is empty"
                subtext="Search for books and click the ❤️ button to save them here"
              />
            )}
          </div>
        )}
      </div>

      {/* Global CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        @keyframes float {
          0% { transform: translate(-50%, -50%) scale(1); }
          100% { transform: translate(-50%, -50%) scale(1.1) translate(20px, -20px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.6); }
      `}</style>
    </div>
  );
};
