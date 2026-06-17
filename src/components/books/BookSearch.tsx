import React, { useState, useCallback } from 'react';

interface BookSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (genre: string) => void;
  activeFilter: string;
  isLoading: boolean;
}

const GENRES = [
  { label: 'All', value: 'all', icon: '📚' },
  { label: 'Fiction', value: 'fiction', icon: '✨' },
  { label: 'Non-Fiction', value: 'nonfiction', icon: '📰' },
  { label: 'Science', value: 'science', icon: '🔬' },
  { label: 'Technology', value: 'technology', icon: '💻' },
  { label: 'AI', value: 'artificial intelligence', icon: '🤖' },
  { label: 'Business', value: 'business', icon: '💼' },
  { label: 'Self Help', value: 'self help', icon: '🌱' },
  { label: 'History', value: 'history', icon: '🏛️' },
  { label: 'Biography', value: 'biography', icon: '👤' },
  { label: 'Romance', value: 'romance', icon: '💕' },
  { label: 'Comics', value: 'comics', icon: '🦸' },
  { label: 'Manga', value: 'manga', icon: '⛩️' },
];

export const BookSearch: React.FC<BookSearchProps> = ({
  onSearch, onFilterChange, activeFilter, isLoading,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  }, [query, onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) onSearch(query.trim());
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search Bar */}
      <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
        <div style={{
          position: 'relative',
          background: 'rgba(15,23,42,0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocus={() => {}}
        >
          {/* Search icon */}
          <div style={{
            padding: '0 16px',
            color: isLoading ? '#6366f1' : '#64748b',
            fontSize: '20px',
            transition: 'color 0.2s',
          }}>
            {isLoading ? (
              <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
            ) : '🔍'}
          </div>

          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search books by title, author, or topic..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f1f5f9',
              fontSize: '15px',
              padding: '16px 0',
              fontFamily: 'inherit',
            }}
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: 'none',
                color: '#64748b',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '14px',
                borderRadius: '8px',
                margin: '0 4px',
                transition: 'all 0.2s',
              }}
            >
              ✕
            </button>
          )}

          {/* Search button */}
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            style={{
              background: query.trim()
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                : 'rgba(51,65,85,0.5)',
              color: query.trim() ? 'white' : '#475569',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 20px',
              margin: '8px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: query.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.25s ease',
              whiteSpace: 'nowrap',
              letterSpacing: '0.3px',
            }}
          >
            Search
          </button>
        </div>
      </form>

      {/* Genre Filters — horizontal scroll */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '4px',
        scrollbarWidth: 'none',
      }}>
        {GENRES.map(genre => {
          const isActive = activeFilter === genre.value;
          return (
            <button
              key={genre.value}
              onClick={() => onFilterChange(genre.value)}
              style={{
                flexShrink: 0,
                background: isActive
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'rgba(15,23,42,0.6)',
                color: isActive ? 'white' : '#94a3b8',
                border: `1px solid ${isActive ? 'rgba(99,102,241,0.6)' : 'rgba(51,65,85,0.6)'}`,
                borderRadius: '24px',
                padding: '7px 14px',
                fontSize: '12px',
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: isActive ? '0 4px 12px rgba(99,102,241,0.4)' : 'none',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{genre.icon}</span>
              <span>{genre.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
