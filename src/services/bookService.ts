import { api } from './api';

const BASE = '/api/books';

export interface BookInfo {
  id?: number;
  googleBookId: string;
  title: string;
  author: string;
  category: string;
  imageUrl: string;
  previewLink: string;
  description: string;
  rating?: number;
  bookmarked?: boolean;
  publisher?: string;
  publishedDate?: string;
  isbn?: string;
  pageCount?: number;
  language?: string;
}

export const bookService = {
  async searchBooks(query: string): Promise<BookInfo[]> {
    const response = await api.get<BookInfo[]>(`${BASE}/search`, {
      params: { q: query },
    });
    return response.data;
  },

  async getRecommendedBooks(section: 'trending' | 'new' | 'popular' | 'ai'): Promise<BookInfo[]> {
    const response = await api.get<BookInfo[]>(`${BASE}/recommended`, {
      params: { section },
    });
    return response.data;
  },

  async getSavedBooks(): Promise<BookInfo[]> {
    const response = await api.get<BookInfo[]>(`${BASE}/saved`);
    return response.data;
  },

  async saveBook(book: BookInfo): Promise<BookInfo> {
    const response = await api.post<BookInfo>(`${BASE}/save`, book);
    return response.data;
  },

  async unsaveBook(id: number): Promise<void> {
    await api.delete(`${BASE}/unsave/${id}`);
  },

  async toggleBookmark(id: number): Promise<BookInfo> {
    const response = await api.post<BookInfo>(`${BASE}/bookmark/${id}`, {});
    return response.data;
  },
};
