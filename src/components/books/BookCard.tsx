import React, { useState, useCallback } from 'react';
import { BookInfo } from '../../services/bookService';
import { BookDetailsModal } from './BookDetailsModal';
import { bookService } from '../../services/bookService';

interface BookCardProps {
  book: BookInfo;
  onSaveToggle?: (book: BookInfo) => void;
  isSaved?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onSaveToggle, isSaved = false }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const [bookmarked, setBookmarked] = useState(book.bookmarked ?? false);
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleReadBook = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!book.previewLink) return;
    setIsReading(true);
    setTimeout(() => {
      window.open(book.previewLink, '_blank', 'noopener,noreferrer');
      setIsReading(false);
    }, 600);
  }, [book.previewLink]);

  const handleSave = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (saved && book.id) {
        await bookService.unsaveBook(book.id);
        setSaved(false);
      } else {
        await bookService.saveBook(book);
        setSaved(true);
      }
      onSaveToggle?.(book);
    } catch {
      setSaved(prev => prev);
    }
  }, [saved, book, onSaveToggle]);

  const handleBookmark = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!book.id) return;
    try {
      await bookService.toggleBookmark(book.id);
      setBookmarked(prev => !prev);
    } catch {
      setBookmarked(prev => prev);
    }
  }, [book.id]);

  const handleShare = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `Check out "${book.title}" by ${book.author} on LumenAi!`;
    const shareUrl = book.previewLink || window.location.href;
    if (navigator.share) {
      navigator.share({ title: book.title, text: shareText, url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      });
    }
  }, [book]);

  const stars = Math.round((book.rating ?? 4) * 2) / 2;
  const fullStars = Math.floor(stars);
  const halfStar = stars % 1 !== 0;

  const coverUrl = imgError
    ? `https://via.placeholder.com/300x420/1e293b/6366f1?text=${encodeURIComponent(book.title.slice(0, 20))}`
    : book.imageUrl;

  return (
    <>
      <div
        className="book-card-wrapper"
        style={{ position: 'relative', cursor: 'pointer' }}
        onClick={() => setModalOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${isHovered ? 'rgba(99, 102, 241, 0.5)' : 'rgba(99, 102, 241, 0.15)'}`,
            borderRadius: '20px',
            overflow: 'hidden',
            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
            boxShadow: isHovered
              ? '0 24px 48px rgba(99, 102, 241, 0.25), 0 0 0 1px rgba(99, 102, 241, 0.3)'
              : '0 4px 20px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          {/* Book Cover */}
          <div style={{ position: 'relative', overflow: 'hidden', height: '240px', flexShrink: 0 }}>
            <img
              src={coverUrl}
              alt={book.title}
              onError={() => setImgError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
                transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              }}
            />
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.2) 50%, transparent 100%)',
            }} />

            {/* Category badge */}
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.85), rgba(139,92,246,0.85))',
              backdropFilter: 'blur(8px)',
              borderRadius: '20px',
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: '700',
              color: 'white',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              {(book.category || 'General').slice(0, 15)}
            </div>

            {/* Bookmark button */}
            <button
              onClick={handleBookmark}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: bookmarked
                  ? 'linear-gradient(135deg, #f59e0b, #f97316)'
                  : 'rgba(15,23,42,0.7)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                fontSize: '15px',
              }}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              {bookmarked ? '🔖' : '🏷️'}
            </button>
          </div>

          {/* Card Content */}
          <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Title */}
            <h3 style={{
              fontSize: '15px',
              fontWeight: '700',
              color: '#f1f5f9',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              margin: 0,
            }}>
              {book.title}
            </h3>

            {/* Author */}
            <p style={{
              fontSize: '12px',
              color: '#94a3b8',
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              ✍️ {book.author}
            </p>

            {/* Rating + Year */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(fullStars)].map((_, i) => (
                  <span key={i} style={{ color: '#f59e0b', fontSize: '12px' }}>★</span>
                ))}
                {halfStar && <span style={{ color: '#f59e0b', fontSize: '12px' }}>½</span>}
                {[...Array(Math.max(0, 5 - fullStars - (halfStar ? 1 : 0)))].map((_, i) => (
                  <span key={i} style={{ color: '#334155', fontSize: '12px' }}>★</span>
                ))}
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                {stars.toFixed(1)}
              </span>
              {book.publishedDate && (
                <span style={{ fontSize: '11px', color: '#475569', marginLeft: 'auto' }}>
                  {book.publishedDate.slice(0, 4)}
                </span>
              )}
            </div>

            {/* Description */}
            <p style={{
              fontSize: '12px',
              color: '#64748b',
              lineHeight: '1.5',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              margin: 0,
              flex: 1,
            }}>
              {book.description || 'No description available.'}
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
              {/* Read Book */}
              <button
                onClick={handleReadBook}
                disabled={!book.previewLink}
                style={{
                  flex: 1,
                  minWidth: '80px',
                  background: book.previewLink
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    : 'rgba(51,65,85,0.5)',
                  color: book.previewLink ? 'white' : '#475569',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: book.previewLink ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  letterSpacing: '0.3px',
                }}
              >
                {isReading ? (
                  <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                ) : '📖'}
                {isReading ? 'Opening...' : 'Read'}
              </button>

              {/* Save */}
              <button
                onClick={handleSave}
                style={{
                  background: saved
                    ? 'linear-gradient(135deg, rgba(239,68,68,0.3), rgba(220,38,38,0.3))'
                    : 'rgba(30,41,59,0.8)',
                  color: saved ? '#fca5a5' : '#94a3b8',
                  border: `1px solid ${saved ? 'rgba(239,68,68,0.4)' : 'rgba(100,116,139,0.3)'}`,
                  borderRadius: '10px',
                  padding: '8px 10px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                title={saved ? 'Remove from library' : 'Save to library'}
              >
                {saved ? '❤️' : '🤍'}
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                style={{
                  background: shareSuccess
                    ? 'rgba(20,184,166,0.2)'
                    : 'rgba(30,41,59,0.8)',
                  color: shareSuccess ? '#5eead4' : '#94a3b8',
                  border: `1px solid ${shareSuccess ? 'rgba(20,184,166,0.4)' : 'rgba(100,116,139,0.3)'}`,
                  borderRadius: '10px',
                  padding: '8px 10px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                title="Share"
              >
                {shareSuccess ? '✓' : '📤'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <BookDetailsModal
          book={book}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          isSaved={saved}
        />
      )}
    </>
  );
};
