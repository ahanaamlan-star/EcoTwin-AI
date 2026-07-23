import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Cpu, 
  Copy, 
  Check, 
  Trash2, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { ChatMessage, TwinRegion } from '../types';

interface AICopilotProps {
  region: TwinRegion;
  initialPrompt?: string;
  onNavigateToReports: (markdown: string) => void;
}

export const AICopilot: React.FC<AICopilotProps> = ({
  region,
  initialPrompt,
  onNavigateToReports
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      content: `Hello! I am **EcoTwin AI Copilot**, your enterprise digital twin intelligence advisor.

I have synchronized real-time sensor telemetries, climate scenario models, and ESG compliance frameworks for **${region.name}**.

How can I assist your team today?`,
      timestamp: 'Just now'
    }
  ]);

  const [inputMsg, setInputMsg] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Send message to Express endpoint `/api/gemini/copilot-chat`
  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputMsg;
    if (!prompt.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMsg('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/copilot-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          activeDistrict: region.name,
          twinContext: {
            baselineCO2Mtons: region.baselineCO2Mtons,
            currentAQI: region.currentAQI,
            floodRiskScore: region.floodRiskScore
          }
        })
      });

      const resData = await response.json();
      if (resData.success && resData.reply) {
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          content: resData.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error('Copilot Chat Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const presetPrompts = [
    `Analyze coastal flood vulnerability for ${region.name} under +0.8m surge.`,
    `Draft a 5-step heat island abatement plan for Central Plaza.`,
    `How can we optimize micro-grid battery storage to achieve 95% renewable uptime?`,
    `Prepare executive bullet points for municipal council on $85/ton carbon tax impact.`
  ];

  return (
    <div className="space-y-6">
      {/* Copilot Header */}
      <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold uppercase tracking-widest font-mono">
              ECOTWIN COPILOT ADVISOR
            </span>
            <span className="text-xs text-white/40">• Gemini 3.6 Flash Neural Model</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            AI Climate & Digital Twin Assistant
          </h1>
          <p className="text-xs text-white/50 mt-0.5">
            Query sensor telemetries, climate stress test projections, and ESG policy strategy in natural language.
          </p>
        </div>

        <button
          onClick={() => setMessages([])}
          className="p-2.5 px-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all text-xs flex items-center"
        >
          <Trash2 className="w-4 h-4 mr-1.5" /> Clear Chat
        </button>
      </div>

      {/* Preset Prompt Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {presetPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(p)}
            className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/5 border border-white/10 text-left text-xs text-white/80 transition-all hover:border-emerald-500/40 group backdrop-blur-xl"
          >
            <div className="text-[10px] text-emerald-400 font-mono font-bold mb-1">PROMPT TEMPLATE</div>
            <div className="line-clamp-2 text-white/70">{p}</div>
          </button>
        ))}
      </div>

      {/* Main Chat Stream Container */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl flex flex-col h-[520px] shadow-2xl">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-emerald-500 text-black'
                      : 'bg-white/10 border border-white/10 text-emerald-400'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed space-y-2 relative group ${
                    isUser
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-white rounded-tr-none'
                      : 'bg-white/[0.03] border border-white/10 text-white/90 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                  <div className="flex items-center justify-between text-[10px] text-white/40 border-t border-white/10 pt-1.5 mt-2">
                    <span className="font-mono">{msg.timestamp}</span>

                    {!isUser && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCopyText(msg.id, msg.content)}
                          className="hover:text-white flex items-center"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => onNavigateToReports(msg.content)}
                          className="hover:text-emerald-400 text-emerald-300 font-semibold"
                        >
                          Send to Report Builder →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-emerald-400">
                <Cpu className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-white/50 flex items-center space-x-2">
                <span className="animate-pulse">Gemini 3.6 Flash analyzing digital twin context...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form Bar */}
        <div className="p-3 border-t border-white/10 bg-white/[0.02] rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder={`Ask EcoTwin Copilot about ${region.name}...`}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim() || loading}
              className="p-2.5 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold disabled:opacity-40 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <Send className="w-4 h-4 text-black" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
