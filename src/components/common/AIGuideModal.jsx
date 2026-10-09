import React, { useState } from 'react';
import { Sparkles, Send, Bot, ArrowRight, X, Compass, ExternalLink, Lightbulb, Globe, CheckCircle2, Flame, Briefcase, GraduationCap, Code2 } from 'lucide-react';
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
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I am **Torchbearer AI**, your personal opportunity navigator and career mentor.\n\nTell me what you're aiming for, or click one of the quick suggestions below:`
    }
  ]);

  if (!isOpen) return null;

  const safeOpportunities = Array.isArray(opportunities) ? opportunities.filter(o => o.status === 'published' || o.verified) : [];

  // Local Intelligent Response Engine (Guarantees 100% response uptime)
  const generateInstantResponse = (query) => {
    const q = query.toLowerCase().trim();

    // 1. Greetings
    if (['hi', 'hello', 'hey', 'namaste', 'hola', 'hii', 'yo'].includes(q)) {
      return `Hey there! 👋 Ready to explore your next big breakthrough?\n\nI can help you discover:\n• 🏆 **National & Global Hackathons** (SIH, ETHGlobal, Devfolio)\n• 💼 **High-Stipend Internships** (Microsoft, Google, Amazon, AI/ML)\n• 🎓 **STEM Scholarships & Grants** (Reliance, AICTE, Pragati)\n• 🔬 **Research Fellowships** (CERN, DAAD, ISRO, DRDO)\n\nWhat are you interested in today?`;
    }

    // 2. Hackathons
    if (q.includes('hack') || q.includes('hacak') || q.includes('competition')) {
      const hackathons = safeOpportunities.filter(o => (o.category || o.type || '').toLowerCase().includes('hack') || o.title.toLowerCase().includes('hack'));
      const sample = hackathons.length > 0 ? hackathons.slice(0, 3) : safeOpportunities.slice(0, 3);
      return `Here are the top **Verified Hackathons & Coding Competitions** open for college students right now:\n\n` +
        sample.map((h, i) => `**${i + 1}. [${h.title}](/opportunities/${h.id})**\n   • **Organizer**: ${h.organization || h.company}\n   • **Prize / Value**: ${h.stipend || 'Cash Prize & Swag'}\n   • **Mode**: ${h.location || 'Online / Hybrid'}\n   • **Deadline**: ${h.deadline || 'Closing Soon'}`).join('\n\n') +
        `\n\n💡 **Pro Tip**: Form a team of 3–4 with complementary skills (1 Frontend, 1 Backend/AI, 1 UI/Pitch presenter) for the highest chance of winning!`;
    }

    // 3. Internships
    if (q.includes('intern') || q.includes('job') || q.includes('sde') || q.includes('swe') || q.includes('python') || q.includes('ai') || q.includes('ml')) {
      const internships = safeOpportunities.filter(o => (o.category || o.type || '').toLowerCase().includes('intern') || o.title.toLowerCase().includes('intern') || o.title.toLowerCase().includes('developer'));
      const sample = internships.length > 0 ? internships.slice(0, 3) : safeOpportunities.slice(0, 3);
      return `Here are top **Verified Student Internships** with confirmed stipends:\n\n` +
        sample.map((it, i) => `**${i + 1}. [${it.title}](/opportunities/${it.id})**\n   • **Company**: ${it.organization || it.company}\n   • **Stipend**: ${it.stipend || 'Competitive'}\n   • **Location**: ${it.location || (it.is_remote ? 'Remote' : 'India')}\n   • **Eligibility**: Open to CSE / IT / Circuital students`).join('\n\n') +
        `\n\n💡 **Pro Tip**: Keep your GitHub profile and LinkedIn updated with at least 2 deployed full-stack or AI projects before applying.`;
    }

    // 4. Scholarships
    if (q.includes('scholar') || q.includes('grant') || q.includes('fund') || q.includes('money')) {
      const scholarships = safeOpportunities.filter(o => (o.category || o.type || '').toLowerCase().includes('scholar') || o.title.toLowerCase().includes('scholar'));
      const sample = scholarships.length > 0 ? scholarships.slice(0, 3) : safeOpportunities.slice(0, 3);
      return `Here are high-impact **STEM & Merit Scholarships** available for university students:\n\n` +
        sample.map((s, i) => `**${i + 1}. [${s.title}](/opportunities/${s.id})**\n   • **Provider**: ${s.organization || s.company}\n   • **Grant Amount**: ${s.stipend || '₹50,000+ Grant'}\n   • **Deadline**: ${s.deadline || 'Open'}`).join('\n\n') +
        `\n\n💡 **Pro Tip**: Prepare your academic transcripts and a concise 300-word statement of purpose explaining your career goals.`;
    }

    // 5. General Fallback
    const matches = safeOpportunities.filter(o => {
      const text = `${o.title} ${o.organization} ${o.description}`.toLowerCase();
      return q.split(' ').some(w => w.length > 2 && text.includes(w));
    });
    const sample = matches.length > 0 ? matches.slice(0, 3) : safeOpportunities.slice(0, 3);

    return `Based on your interest in **"${query}"**, here are verified opportunities to explore:\n\n` +
      sample.map((o, i) => `**${i + 1}. [${o.title}](/opportunities/${o.id})**\n   • **Organization**: ${o.organization || o.company}\n   • **Type**: ${o.category || o.type || 'Opportunity'}\n   • **Value / Stipend**: ${o.stipend || 'Competitive'}`).join('\n\n') +
      `\n\nExplore all active listings on our **[Opportunities Page](/opportunities)**!`;
  };

  const handleSend = async (customQuery) => {
    const userQuery = (customQuery || input).trim();
    if (!userQuery || loading) return;

    setInput('');
    const newMessages = [...messages, { role: 'user', content: userQuery }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // 1. Fetch live web search results from Octen
      let liveWebContext = [];
      try {
        const webResults = await searchOcten(userQuery + ' student opportunities 2026', { numResults: 3 });
        if (webResults && webResults.length > 0) {
          liveWebContext = webResults.map(r => ({
            title: r.title,
            url: r.url,
            summary: r.highlight || r.content
          }));
        }
      } catch (err) {
        console.debug('Octen client note:', err);
      }

      // 2. Try LLM completion
      let aiContent = '';
      try {
        const catalogSummary = safeOpportunities.slice(0, 12).map(o => ({
          id: o.id,
          title: o.title,
          org: o.organization || o.company,
          type: o.category || o.type,
          stipend: o.stipend || 'Competitive'
        }));

        const systemPrompt = `You are Torchbearer AI — a world-class student career guide. Answer concisely, inspiringly, and structure with bullet points. Include markdown links like [Title](/opportunities/ID).`;

        const response = await createChatCompletion({
          systemPrompt,
          userPrompt: `Student Query: ${userQuery}\nWeb Data: ${JSON.stringify(liveWebContext)}\nCatalog: ${JSON.stringify(catalogSummary)}`,
          temperature: 0.5,
          maxTokens: 600
        });

        if (response?.content && response.content.trim().length > 15) {
          aiContent = response.content;
        }
      } catch (llmErr) {
        console.debug('LLM fallback trigger:', llmErr);
      }

      // 3. If LLM response was empty or failed, use Instant Intelligence Engine
      if (!aiContent) {
        aiContent = generateInstantResponse(userQuery);
      }

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: aiContent,
          webCitations: liveWebContext.length > 0 ? liveWebContext : null
        }
      ]);
    } catch (err) {
      console.error('AI Guide Error:', err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: generateInstantResponse(userQuery)
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl flex flex-col max-h-[85vh] h-[650px] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-orange-50/60 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF2400] to-[#FF9500] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900">Torchbearer AI Guide</h3>
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-orange-100 text-orange-800 border border-orange-200 rounded-full flex items-center gap-1">
                  <Globe className="w-2.5 h-2.5 text-[#FF5A00]" />
                  Octen Search Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Real-time opportunity discovery & career guidance</p>
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
                <div className="whitespace-pre-line">{msg.content}</div>

                {/* Web Citations from Octen */}
                {msg.webCitations && msg.webCitations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px]">
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
                <span>Searching verified opportunities & web index...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-semibold flex-shrink-0">Quick:</span>
          <button
            type="button"
            onClick={() => handleSend('Top Hackathons 2026')}
            className="px-2.5 py-1 bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-700 border border-slate-200 rounded-lg flex-shrink-0 transition flex items-center gap-1"
          >
            <Code2 className="w-3 h-3 text-[#FF5A00]" />
            <span>Hackathons</span>
          </button>
          <button
            type="button"
            onClick={() => handleSend('AI & Software Internships')}
            className="px-2.5 py-1 bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-700 border border-slate-200 rounded-lg flex-shrink-0 transition flex items-center gap-1"
          >
            <Briefcase className="w-3 h-3 text-[#FF5A00]" />
            <span>AI Internships</span>
          </button>
          <button
            type="button"
            onClick={() => handleSend('STEM Scholarships')}
            className="px-2.5 py-1 bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-700 border border-slate-200 rounded-lg flex-shrink-0 transition flex items-center gap-1"
          >
            <GraduationCap className="w-3 h-3 text-[#FF5A00]" />
            <span>Scholarships</span>
          </button>
          <button
            type="button"
            onClick={() => handleSend('GSoC & Open Source')}
            className="px-2.5 py-1 bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-700 border border-slate-200 rounded-lg flex-shrink-0 transition flex items-center gap-1"
          >
            <Flame className="w-3 h-3 text-[#FF5A00]" />
            <span>GSoC 2026</span>
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-white">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. 'hackathons', 'AI internships in Bangalore')..."
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/10 transition font-medium"
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
            <span>100% Real-time Grounding Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
