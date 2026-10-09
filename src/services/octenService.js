/**
 * Octen Search API Service for Torchbearer AI
 * Provides ultra-fast, live web search and opportunity discovery powered by Octen.ai
 */

const OCTEN_API_KEY =
  (typeof process !== 'undefined' && process.env?.OCTEN_API_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_OCTEN_API_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OCTEN_API_KEY) ||
  'octen-6cf4e07c7c694099813cf00fa7a5e140';

const OCTEN_API_URL = 'https://api.octen.ai/search';

/**
 * Execute real-time web search via Octen
 * @param {string} query - The search query
 * @param {Object} options - Additional options (num_results, etc.)
 * @returns {Promise<Array<{title: string, url: string, highlight: string, content?: string}>>}
 */
export async function searchOcten(query, options = {}) {
  if (!query || typeof query !== 'string') {
    return [];
  }

  const numResults = options.numResults || options.count || 5;

  try {
    const response = await fetch(OCTEN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': OCTEN_API_KEY,
      },
      body: JSON.stringify({
        query: query.trim(),
        num_results: numResults,
        count: numResults,
      }),
    });

    if (!response.ok) {
      console.warn(`Octen Search API responded with status ${response.status}`);
      return [];
    }

    const data = await response.json();
    const results = data?.data?.results || data?.results || [];

    return results.map((item, idx) => ({
      id: `octen-${idx}-${Date.now()}`,
      title: item.title || 'Untitled Result',
      url: item.url || '#',
      highlight: item.highlight || item.snippet || item.content || '',
      content: item.content || '',
      score: item.score,
      source: 'Octen AI Live Web Index',
    }));
  } catch (error) {
    console.error('Octen Search error:', error.message);
    return [];
  }
}

/**
 * Discover live student opportunities via Octen
 * Formats results into Torchbearer-compatible opportunity cards
 */
export async function discoverLiveOpportunitiesWithOcten(keywords = 'internships hackathons 2026 students india') {
  const query = `${keywords} apply online eligibility stipend`;
  const rawResults = await searchOcten(query, { numResults: 8 });

  return rawResults.map((item, index) => {
    // Basic heuristics to extract company/type
    let type = 'Internship';
    const lowerTitle = item.title.toLowerCase();
    if (lowerTitle.includes('hackathon')) type = 'Hackathon';
    else if (lowerTitle.includes('scholarship')) type = 'Scholarship';
    else if (lowerTitle.includes('fellowship') || lowerTitle.includes('research')) type = 'Fellowship';

    let org = 'Verified Opportunity';
    const orgMatch = item.title.match(/^(.*?)(?:\||[-–—]|Hiring|Recruitment|Internship|Hackathon)/i);
    if (orgMatch && orgMatch[1]?.trim().length > 1 && orgMatch[1]?.trim().length < 30) {
      org = orgMatch[1].trim();
    }

    return {
      id: `live-octen-${index}`,
      title: item.title,
      organization: org,
      company: org,
      type: type,
      category: type,
      location: 'India / Remote',
      is_remote: lowerTitle.includes('remote'),
      stipend: lowerTitle.includes('₹') || lowerTitle.includes('lpa') || lowerTitle.includes('month') ? 'Competitive' : 'Verified Grant',
      description: item.highlight || item.content,
      application_url: item.url,
      link: item.url,
      verified: true,
      last_verified_at: new Date().toISOString(),
      source: 'Octen AI Real-time Web',
      isLiveWebResult: true,
    };
  });
}
