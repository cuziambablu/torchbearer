import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, ArrowRight, X, Compass, ExternalLink, Lightbulb } from 'lucide-react';
import { useOpportunities } from '../../context/OpportunityContext';
import { useAuth } from '../../context/AuthContext';
import { createChatCompletion } from '../../services/llmClient';
import { Link } from 'react-router-dom';

export default function AIGuideModal({ isOpen, onClose }) {
  const { opportunities } = useOpportunities();
  const { user } = useAuth();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I am **Torchbearer AI**, your personal student opportunity and career guide.\n\nTell me what you're looking for (e.g. *"I know Python and I want remote AI internships"*, *"Suggest hackathons for 2nd year CSE"*, or *"Find paid research fellowships"*).`
    }
  ]);

  if (!isOpen) return null;

  const safeOpportunities = Array.isArray(opportunities) ? opportunities.filter(o => o.status === 'published') : [];

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userQuery = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userQuery }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Build catalog context for grounding
      const catalogSummary = safeOpportunities.slice(0, 15).map(o => ({
        id: o.id,
        title: o.title,
        org: o.organization,
        type: o.type,
        mode: o.mode,
        stipend: o.stipend || o.prize || 'N/A',
        skills: o.skills || [],
        deadline: o.deadline ? o.deadline.split('T')[0] : 'Rolling'
      }));

      const systemPrompt = `You are Torchbearer AI — a world-class, inspiring college career mentor and opportunity navigator.
Your mission: "Light the way to your future."

Ground your recommendations strictly in these real verified opportunities currently in the catalog:
${JSON.stringify(catalogSummary, null, 2)}

Instructions:
1. Recommend 2 to 3 specific opportunities from the catalog that match the student's prompt.
2. For each recommendation, state WHY it is a great match and provide 1 practical preparation tip.
3. Include clickable markdown links like [Opportunity Title](/opportunities/ID) using the exact ID.
4. Keep your tone encouraging, sharp, concise, and inspiring.`;

      const response = await createChatCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          ...newMessages.map(m => ({ role: m.role, content: m.content }))
        ],
        temperature: 0.6,
        max_tokens: 600
      });

      const replyContent = response?.choices?.[0]?.message?.content || "I couldn't process that request right now. Try searching our verified catalog directly!";
      setMessages([...newMessages, { role: 'assistant', content: replyContent }]);
    } catch (err) {
      console.error('AI Guide error:', err);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: `Sorry, I encountered a temporary connection issue. You can explore all verified listings directly on the [Explore Opportunities](/opportunities) page.` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Find remote open-source fellowships',
    'AI / ML research programs with stipend',
    'Best hackathons for team building',
    'Internships for 2nd & 3rd year engineering'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col h-[600px] z-10">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight text-white">Torchbearer AI Guide</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Light the way to your future • Grounded in verified opportunities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white rounded-br-none font-medium'
                    : 'bg-white text-slate-800 rounded-bl-none border border-slate-200/90'
                }`}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-500 italic p-2">
              <div className="w-7 h-7 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 animate-spin">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>Torchbearer AI is analyzing the opportunity catalog...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        {messages.length <= 2 && (
          <div className="px-6 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
              Try asking:
            </span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInput(prompt);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200 text-slate-600 text-[11px] font-medium border border-slate-200/70 whitespace-nowrap transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Torchbearer AI about opportunities, skills, or career directions..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition cursor-pointer"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
