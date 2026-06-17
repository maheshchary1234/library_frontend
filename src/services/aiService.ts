import { api } from './api';

const BASE = '/api/ai';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface FlashcardInfo {
  id?: number;
  question: string;
  answer: string;
  documentId: number;
}

export const aiService = {
  async getSummary(documentId: number): Promise<string> {
    const response = await api.post<string>(`${BASE}/summary`, { documentId });
    return response.data;
  },

  async getQuiz(documentId: number): Promise<QuizQuestion[]> {
    const response = await api.post<QuizQuestion[]>(`${BASE}/quiz`, { documentId });
    return response.data;
  },

  async getFlashcards(documentId: number): Promise<FlashcardInfo[]> {
    const response = await api.post<FlashcardInfo[]>(`${BASE}/flashcards`, { documentId });
    return response.data;
  },

  async chat(documentId: number, message: string): Promise<string> {
    const response = await api.post<{ response: string }>(`${BASE}/chat`, { documentId, message });
    return response.data.response;
  },
};
