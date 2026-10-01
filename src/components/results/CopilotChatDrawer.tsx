'use client';

import React, { useState } from 'react';
import { useCopilotChat } from '@/hooks/use-copilot-chat';
import { GeminiClinicalAnalysis } from '@/types/gemini';
import { CompositeFatigueResult } from '@/types/assessment';
import { ArrowUp, Sparkles, Loader2 } from 'lucide-react';

interface CopilotChatDrawerProps {
  analysis: GeminiClinicalAnalysis | null;
  cfi: CompositeFatigueResult | null;
}

const SUGGESTED_QUERIES = [
  'Apakah aman bagi saya mengemudi sekarang?',
  'Berapa lama jeda tidur ideal untuk memulihkan refleks?',
  'Kapan batas aman terakhir konsumsi kafein hari ini?',
];

export const CopilotChatDrawer: React.FC<CopilotChatDrawerProps> = ({
  analysis,
  cfi,
}) => {
  const [input, setInput] = useState('');
  const { messages, isLoading, sendMessage } = useCopilotChat(analysis, cfi);

  const handleSend = (text: string) => {
    if (!text.trim() || isLoading) return;
    sendMessage(text);
    setInput('');
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-apple overflow-hidden space-y-0 text-xs">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-zinc-50/80 dark:bg-zinc-800/40 border-b border-black/[0.04] dark:border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-apple-purple/10 text-apple-purple flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-zinc-900 dark:text-white">
            Konsultasi Gemini Clinical AI
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-apple-purple/10 text-apple-purple">
            Terverifikasi
          </span>
        </div>
        <span className="text-[11px] text-zinc-400 font-medium">
          Privasi Terjamin
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-3">
        {/* Messages List */}
        <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3.5 max-w-[85%] font-medium leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-apple-blue text-white rounded-2xl rounded-br-sm shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl rounded-bl-sm'
                }`}
              >
                <p>{m.content}</p>
                <span className={`text-[9px] block text-right mt-1 font-semibold ${
                  m.role === 'user' ? 'text-white/70' : 'text-zinc-400'
                }`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-zinc-500 text-xs py-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-apple-purple" />
              <span>Gemini sedang menyusun penalaran klinis...</span>
            </div>
          )}
        </div>

        {/* Suggested Queries Chips */}
        <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.08]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
            Pertanyaan Rekomendasi
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_QUERIES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-apple-blue/10 hover:text-apple-blue text-[11px] font-medium text-zinc-700 dark:text-zinc-300 transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2 pt-1"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan analisis tidur, kopi, atau waktu istirahat..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-apple-blue/50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-8 h-8 rounded-full bg-apple-blue text-white flex items-center justify-center hover:opacity-90 active:scale-95 disabled:opacity-40 transition-all shadow-sm shrink-0"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
};
