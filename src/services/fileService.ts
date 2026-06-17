import { api } from './api';

const BASE = '/api/documents';

export interface DocumentInfo {
  id: number;
  title: string;
  fileUrl: string;
  content: string;
  uploadedAt: string;
}

export const fileService = {
  async uploadFile(file: File): Promise<DocumentInfo> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<DocumentInfo>(`${BASE}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getAllDocuments(): Promise<DocumentInfo[]> {
    const response = await api.get<DocumentInfo[]>(`${BASE}/all`);
    return response.data;
  },

  async deleteDocument(id: number): Promise<string> {
    const response = await api.delete<string>(`${BASE}/${id}`);
    return response.data;
  },
};
