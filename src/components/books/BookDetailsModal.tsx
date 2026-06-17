import React, { useState, useEffect, useCallback } from 'react';
import { BookInfo } from '../../services/bookService';
import { bookService } from '../../services/bookService';

interface BookDetailsModalProps {
  book: BookInfo;
  onClose: () => void;
  onSave?: (e: React.MouseEvent) => void;
  isSaved?: boolean;
}

export const BookDetailsModal: React.FC<BookDetailsModalProps> = ({
  book, onClose, onSave, isSaved = false,
}) => {
  const [isReading, setIsReading] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const [imgError, setImgError] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const handleRead = useCallback(() => {
    if (!book.previewLink) return;
    setIsReading(true);
    setTimeout(() => {
      window.open(book.previewLink, '_blank', 'noopener,noreferrer');
      setIsReading(false);
    }, 600);
  }, [book.previewLink]);

  const handleSave = useCallback(async () => {
    try {
      if (saved && book.id) {
        await bookService.unsaveBook(book.id);
        setSaved(false);
      } else {
        await bookService.saveBook(book);
        setSaved(true);
      }
    } catch {
      // silent
    }
  }, [saved, book]);

  const stars = Math.round((book.rating ?? 4) * 2) / 2;
  const fullStars = Math.floor(stars);
  const halfStar = stars % 1 !== 0;

  const coverUrl = imgError
    ? `https://via.placeholder.com/400x560/1e293b/6366f1?text=${encodeURIComponent(book.title.slice(0, 20))}`
    : book.imageUrl;

  const infoItems = [
    { label: 'Author', value: book.author, icon: '✍️' },
    { label: 'Publisher', value: book.publisher, icon: '🏢' },
    { label: 'Published', value: book.publishedDate?.slice(0, 4), icon: '📅' },
    { label: 'Pages', value: book.pageCount ? `${book.pageCount} pages` : undefined, icon: '📄' },
    { label: 'Language', value: book.language, icon: '🌐' },
    { label: 'ISBN', value: book.isbn, icon: '🔢' },
    { label: 'Category', value: book.category, icon: '📁' },
  ].filter(item => item.value && item.value !== 'N/A' && item.value !== '0 pages');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        transition: 'all 0.25s ease',
        opacity: visible ? 1 : 0,
      }}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
      }} />

      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,27,75,0.98) 100%)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            color: '#94a3b8',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(239,68,68,0.3)'; (e.target as HTMLElement).style.color = '#fca5a5'; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; (e.target as HTMLElement).style.color = '#94a3b8'; }}
        >
          ✕
        </button>

        {/* Scrollable Content */}
        <div style={{ overflow: 'auto', flex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 0,
          }}>
            {/* Left: Cover Image */}
            <div style={{
              width: '260px',
              minHeight: '400px',
              flexShrink: 0,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <img
                src={coverUrl}
                alt={book.title}
                onError={() => setImgError(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, transparent 70%, rgba(15,23,42,0.9) 100%)',
              }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15,23,42,0.6) 0%, transparent 50%)',
              }} />
            </div>

            {/* Right: Details */}
            <div style={{ padding: '32px 32px 32px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Category */}
              <div>
                <span style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.25))',
                  border: '1px solid rgba(99,102,241,0.4)',
                  borderRadius: '20px',
                  padding: '4px 14px',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#a5b4fc',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}>
                  {book.category || 'General'}
                </span>
              </div>

              {/* Title */}
              <h2 style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#f1f5f9',
                lineHeight: '1.3',
                margin: 0,
                letterSpacing: '-0.5px',
              }}>
                {book.title}
              </h2>

              {/* Author */}
              <p style={{ fontSize: '15px', color: '#94a3b8', margin: 0, fontWeight: '500' }}>
                ✍️ <span style={{ color: '#c4b5fd' }}>{book.author}</span>
              </p>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(fullStars)].map((_, i) => (
                    <span key={i} style={{ color: '#f59e0b', fontSize: '18px' }}>★</span>
                  ))}
                  {halfStar && <span style={{ color: '#f59e0b', fontSize: '18px' }}>½</span>}
                  {[...Array(Math.max(0, 5 - fullStars - (halfStar ? 1 : 0)))].map((_, i) => (
                    <span key={i} style={{ color: '#1e293b', fontSize: '18px' }}>★</span>
                  ))}
                </div>
                <span style={{ fontSize: '16px', color: '#f59e0b', fontWeight: '700' }}>
                  {stars.toFixed(1)}
                </span>
              </div>

              {/* Info Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '8px',
              }}>
                {infoItems.map(item => (
                  <div key={item.label} style={{
                    background: 'rgba(30,41,59,0.5)',
                    border: '1px solid rgba(51,65,85,0.5)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                  }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {item.icon} {item.label}
                    </div>
                    <div style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '600' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div style={{
                background: 'rgba(30,41,59,0.4)',
                border: '1px solid rgba(51,65,85,0.4)',
                borderRadius: '12px',
                padding: '16px',
              }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  📝 Description
                </div>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.7', margin: 0 }}>
                  {book.description || 'No description available for this book.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleRead}
                  disabled={!book.previewLink}
                  style={{
                    flex: 1,
                    minWidth: '140px',
                    background: book.previewLink
                      ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                      : 'rgba(51,65,85,0.5)',
                    color: book.previewLink ? 'white' : '#475569',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 24px',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: book.previewLink ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.25s ease',
                    boxShadow: book.previewLink ? '0 4px 20px rgba(99,102,241,0.4)' : 'none',
                  }}
                >
                  {isReading ? (
                    <span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block', fontSize: '18px' }}>⟳</span>
                  ) : '📖'}
                  {isReading ? 'Opening Preview...' : 'Read Book'}
                </button>

                <button
                  onClick={handleSave}
                  style={{
                    flex: 1,
                    minWidth: '140px',
                    background: saved
                      ? 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(220,38,38,0.25))'
                      : 'rgba(30,41,59,0.8)',
                    color: saved ? '#fca5a5' : '#94a3b8',
                    border: `1px solid ${saved ? 'rgba(239,68,68,0.5)' : 'rgba(100,116,139,0.3)'}`,
                    borderRadius: '12px',
                    padding: '14px 24px',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {saved ? '❤️ Saved' : '🤍 Save Book'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
