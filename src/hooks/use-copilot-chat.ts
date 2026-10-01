/**
 * Hook: useCopilotChat
 * Asisten interaktif bertenaga Gemini 3.8 Flash untuk tanya-jawab klinis seputar hasil asesmen.
 */

import { useState } from 'react';
import { CopilotChatMessage, GeminiClinicalAnalysis } from '@/types/gemini';
import { CompositeFatigueResult } from '@/types/assessment';

export function useCopilotChat(
  analysis: GeminiClinicalAnalysis | null,
  cfi: CompositeFatigueResult | null
) {
  const [messages, setMessages] = useState<CopilotChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Halo, saya CogniPulse Copilot (Gemini 3.8 Flash). Apakah Anda memiliki pertanyaan mengenai diagnosis kelelahan, ritme sirkadian, atau rekomendasi pemulihan Anda?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: CopilotChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          analysis,
          cfi,
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();

      const botMsg: CopilotChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      // Fallback response klinis lokal jika network error
      const fallbackReply = generateLocalChatFallback(userText, cfi?.cfiScore ?? 50);
      const botMsg: CopilotChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage };
}

function generateLocalChatFallback(query: string, cfiScore: number): string {
  const lower = query.toLowerCase();
  if (lower.includes('tidur') || lower.includes('nap')) {
    return 'Riset kedokteran tidur menyarankan power-nap selama 15–20 menit untuk menyegarkan reseptor adenosin tanpa memasuki fase gelombang lambat (slow-wave sleep) yang memicu inersia tidur.';
  }
  if (lower.includes('kopi') || lower.includes('kafein')) {
    return 'Waktu paruh kafein adalah 5–7 jam. Hindari konsumsi kafein jika waktu tidur kurang dari 6 jam lagi agar arsitektur tidur REM Anda tidak terganggu.';
  }
  return `Berdasarkan skor kelelahan kognitif Anda saat ini (CFI: ${cfiScore}/100), prioritas utama adalah mengambil jeda layar 10-15 menit dan hidrasi cairan elektrolit sebelum kembali bertugas.`;
}
