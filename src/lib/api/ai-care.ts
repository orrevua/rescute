import api from './client';
import type { FAQItem } from '../types';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function askCare(question: string): Promise<string> {
  const { data } = await api.post<{ answer: string }>('/ai-care/ask', { question });
  return data.answer;
}

export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
  const { data } = await api.post<{ reply: string }>('/ai-care/chat', { messages });
  return data.reply;
}

export async function getAIState(): Promise<boolean> {
  const { data } = await api.get<{ ai_enabled: boolean }>('/ai-care/state');
  return data.ai_enabled;
}

export async function getFaq(): Promise<FAQItem[]> {
  const { data } = await api.get<FAQItem[]>('/ai-care/faq');
  return data;
}
