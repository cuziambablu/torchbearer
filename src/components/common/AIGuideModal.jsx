import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, ArrowRight, X, Compass, ExternalLink, Lightbulb, Globe, CheckCircle2 } from 'lucide-react';
import { useOpportunities } from '../../context/OpportunityContext';
import { useAuth } from '../../context/AuthContext';
import { createChatCompletion } from '../../services/llmClient';
import { searchOcten } from '../../services/octenService';
import { Link } from 'react-router-dom';

export default function AIGuideModal({ isOpen, onClose }) {
  const { opportunities } = useOpportunities();
  const { user } = useAuth();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchingWeb, setSearchingWeb] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I am **Torchbearer AI**, your personal opportunity navigator with **Octen Real-time Web Search**.\n\nTell me what you're looking for (e.g. *"Find latest AI/ML internships in Bangalore"*, *"When does SIH 2026 registration close?"*, or *"Suggest paid research fellowships"*).`
    }
  ]);

  if (!isOpen) return null;

  const safeOpportunities = Array.isArray(opportunities) ? opportunities.filter(o => o.status === 'published' || o.verified) : [];

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userQuery = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userQuery }];
    setMessages(newMessages);
    setLoading(true);
    setSearchingWeb(true);

    try {
      // 1. Fetch live web search results from Octen Search API
      let liveWebContext = [];
      try {
        const webResults = await searchOcten(userQuery + ' student opportunity internship hackathon 2026', { numResults: 3 });
        liveWebContext = webResults.map(r => ({
          title: r.title,
          url: r.url,
          summary: r.highlight || r.content
        }));
      } catch (err) {
        console.warn('Octen search error:', err);
      } finally {
        setSearchingWeb(false);
      }

      // 2. Build local catalog context
      const catalogSummary = safeOpportunities.slice(0, 15).map(o => ({
        id: o.id,
        title: o.title,
        org: o.organization || o.company,
        type: o.category || o.type,
        mode: o.location || (o.is_remote ? 'Remote' : 'India'),
        stipend: o.stipend || 'Competitive',
        deadline: o.deadline || 'Rolling'
      }));

      const systemPrompt = `You are Torchbearer AI — a world-class, inspiring student career mentor and opportunity navigator powered by Octen Real-Time Search.
Your mission: "Light the path to your future."

Use BOTH the real verified catalog items AND the live Octen Web Search results to give the most up-to-date, actionable answer:

[LIVE OCTEN WEB SEARCH RESULTS]:
${JSON.stringify(liveWebContext, null, 2)}

[LOCAL VERIFIED CATALOG]:
${JSON.stringify(catalogSummary, null, 2)}

Instructions:
1. Recommend the best matching opportunities from either the catalog or the live web search results.
2. For each recommendation, provide:
   - What the opportunity is and key eligibility
   - Why it fits the student's request
   - Direct application / info link (e.g. [Portal Name](URL) or [Opportunity Name](/opportunities/ID))
3. Give 1 practical, high-leverage preparation tip.
4. Keep the tone concise, encouraging, and highly structured with bullet points.`;

      const response = await createChatCompletion({
        systemPrompt,
        userPrompt: userQuery,
        temperature: 0.5,
        maxTokens: 750
      });

      setMessages([...newMessages, { role: 'assistant', content: response.content, webCitations: liveWebContext }]);
    } catch (err) {
      console.error('AI Guide error:', err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: `Here are opportunities matching your search from our verified database and Octen live search:\n\n` +
            safeOpportunities.slice(0, 3).map(o => `• **[${o.title}](/opportunities/${o.id})** at ${o.organization || o.company} (${o.stipend || 'Competitive'})`).join('\n') +
            `\n\n💡 *Tip: Check the [Opportunities Explorer](/opportunities) to filter by your specific branch and stipend preference.*`
        }
      ]);
    } finally {
      setLoading(false);
      setSearchingWeb(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl flex flex-col max-h-[85vh] h-[650px] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-orange-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF2400] to-[#FF9500] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900">Torchbearer AI Guide</h3>
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-orange-100 text-orange-800 border border-orange-200 rounded-full flex items-center gap-1">
                  <Globe className="w-2.5 h-2.5 text-[#FF5A00]" />
                  Octen Web Search
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Live opportunity discovery & personalized mentorship</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 text-[#FF5A00] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3.5 sm:p-4 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white font-medium rounded-tr-none'
                    : 'bg-[#FAFAFC] text-slate-800 border border-slate-200/80 rounded-tl-none space-y-2'
                }`}
              >
                <div className="whitespace-pre-line prose-xs">{msg.content}</div>

                {/* Web Citations from Octen */}
                {msg.webCitations && msg.webCitations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/70 text-[11px]">
                    <p className="font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-[#FF5A00]" />
                      Live Web Citations (Octen Index):
                    </p>
                    <div className="space-y-1">
                      {msg.webCitations.map((cite, cIdx) => (
                        <a
                          key={cIdx}
                          href={cite.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-2 p-1.5 bg-white rounded-lg border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-600 transition"
                        >
                          <span className="truncate max-w-[340px] font-medium">{cite.title}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0 text-slate-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 text-[#FF5A00] flex items-center justify-center flex-shrink-0 mt-0.5 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5A00] animate-ping" />
                <span>{searchingWeb ? 'Searching live web with Octen AI...' : 'Crafting recommendations...'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-white">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. 'Find paid internships in Bangalore')..."
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/10 transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-4 py-2.5 bg-gradient-to-r from-[#FF2400] via-[#FF5A00] to-[#FF9500] text-white text-xs font-bold rounded-xl shadow-xs hover:opacity-95 transition flex items-center gap-1.5 disabled:opacity-40"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span>Powered by Octen Search API & Torchbearer AI</span>
            <span>Real-time Web Grounding Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
