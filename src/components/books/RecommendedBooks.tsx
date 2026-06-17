import React, { useState, useEffect } from 'react';
import { bookService, BookInfo } from '../../services/bookService';
import { BookCard } from './BookCard';

type Section = 'trending' | 'new' | 'popular' | 'ai';

const SECTIONS: { key: Section; label: string; icon: string; description: string }[] = [
  { key: 'trending', label: 'Trending', icon: '🔥', description: 'Most popular right now' },
  { key: 'new', label: 'New Releases', icon: '✨', description: 'Latest additions' },
  { key: 'popular', label: 'All-Time Popular', icon: '👑', description: 'Beloved classics' },
  { key: 'ai', label: 'AI Recommended', icon: '🤖', description: 'Curated for you' },
];

interface RecommendedBooksProps {
  onSaveToggle?: (book: BookInfo) => void;
}

const BookSkeletonCard = () => (
  <div style={{
    background: 'rgba(15,23,42,0.6)',
    border: '1px solid rgba(51,65,85,0.4)',
    borderRadius: '20px',
    overflow: 'hidden',
    height: '380px',
  }}>
    <div style={{
      height: '220px',
      background: 'linear-gradient(90deg, rgba(30,41,59,0.8) 0%, rgba(51,65,85,0.5) 50%, rgba(30,41,59,0.8) 100%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    }} />
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {[80, 60, 40].map((w, i) => (
        <div key={i} style={{
          height: '12px',
          width: `${w}%`,
          background: 'linear-gradient(90deg, rgba(30,41,59,0.8) 0%, rgba(51,65,85,0.5) 50%, rgba(30,41,59,0.8) 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '6px',
          animationDelay: `${i * 0.1}s`,
        }} />
      ))}
    </div>
  </div>
);

export const RecommendedBooks: React.FC<RecommendedBooksProps> = ({ onSaveToggle }) => {
  const [activeSection, setActiveSection] = useState<Section>('trending');
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedSections, setLoadedSections] = useState<Partial<Record<Section, BookInfo[]>>>({});

  useEffect(() => {
    if (loadedSections[activeSection]) {
      setBooks(loadedSections[activeSection]!);
      return;
    }
    setIsLoading(true);
    bookService.getRecommendedBooks(activeSection)
      .then(data => {
        setBooks(data);
        setLoadedSections(prev => ({ ...prev, [activeSection]: data }));
      })
      .catch(() => setBooks([]))
      .finally(() => setIsLoading(false));
  }, [activeSection]);

  return (
    <section>
      {/* Section Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontSize: '26px',
          fontWeight: '800',
          color: '#f1f5f9',
          margin: '0 0 6px',
          letterSpacing: '-0.5px',
        }}>
          Discover Books
        </h2>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
          Handpicked collections to fuel your learning journey
        </p>
      </div>

      {/* Tab Switcher */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '28px',
        overflowX: 'auto',
        paddingBottom: '4px',
        scrollbarWidth: 'none',
      }}>
        {SECTIONS.map(section => {
          const isActive = activeSection === section.key;
          return (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              style={{
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '2px',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))'
                  : 'rgba(15,23,42,0.5)',
                border: `1px solid ${isActive ? 'rgba(99,102,241,0.5)' : 'rgba(51,65,85,0.5)'}`,
                borderRadius: '14px',
                padding: '12px 18px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                }} />
              )}
              <span style={{ fontSize: '18px' }}>{section.icon}</span>
              <span style={{
                fontSize: '13px',
                fontWeight: '700',
                color: isActive ? '#c4b5fd' : '#94a3b8',
                whiteSpace: 'nowrap',
              }}>
                {section.label}
              </span>
              <span style={{
                fontSize: '10px',
                color: isActive ? '#7c3aed' : '#475569',
                whiteSpace: 'nowrap',
              }}>
                {section.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* Books Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
      }}>
        {isLoading
          ? [...Array(8)].map((_, i) => <BookSkeletonCard key={i} />)
          : books.slice(0, 12).map((book, idx) => (
            <BookCard
              key={`${book.googleBookId}-${idx}`}
              book={book}
              onSaveToggle={onSaveToggle}
            />
          ))
        }
      </div>

      {!isLoading && books.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#475569',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
          <p style={{ fontSize: '16px' }}>No books found in this section.</p>
        </div>
      )}
    </section>
  );
};
