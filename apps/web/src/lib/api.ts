import axios from 'axios';
import type { Message, ConfidenceResult, Pattern, IndependenceMetrics, ModelComparison, VerificationResult } from '@/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ChatRequest {
  message: string;
  sessionId: string;
}

export interface ChatResponse {
  response: string;
  confidence: ConfidenceResult;
  pattern?: Pattern;
}

export const chatApi = {
  sendMessage: async (data: ChatRequest): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/api/chat', data);
    return response.data;
  },
};

export const patternApi = {
  getCurrentPattern: async (userId: string): Promise<Pattern> => {
    const response = await api.get<{ pattern: Pattern }>(`/api/users/${userId}/pattern`);
    return response.data.pattern;
  },
};

export const independenceApi = {
  getMetrics: async (userId: string): Promise<IndependenceMetrics> => {
    const response = await api.get<IndependenceMetrics>(`/api/users/${userId}/independence-metrics`);
    return response.data;
  },
};

export const verificationApi = {
  compareModels: async (prompt: string): Promise<ModelComparison> => {
    const response = await api.post<ModelComparison>('/api/verification/multi-model', { prompt });
    return response.data;
  },

  checkFacts: async (text: string): Promise<VerificationResult[]> => {
    const response = await api.post<VerificationResult[]>('/api/verification/fact-check', { text });
    return response.data;
  },
};

export default api;
