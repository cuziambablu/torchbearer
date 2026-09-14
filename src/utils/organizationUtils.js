/**
 * Torchbearer AI — Organization Normalization & Logo Resolution Engine
 * 
 * Provides:
 * 1. Normalized organization names (e.g. "Microsoft Corporation" -> "Microsoft")
 * 2. Official domain mapping (e.g. "Google" -> "google.com")
 * 3. Multi-tier logo URLs (Curated High-Res SVGs/PNGs -> Clearbit -> Google HD Favicon -> Initials Avatar)
 * 4. Deterministic initial avatar colors & initials extraction
 */

// Normalized organization registry with verified domains, official websites, and high-res brand logos
export const KNOWN_ORGANIZATIONS = {
  // --- TECH GIANTS & TOP PRODUCT COMPANIES ---
  'google': {
    name: 'Google',
    domain: 'google.com',
    website: 'https://careers.google.com',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    category: 'Technology'
  },
  'google open source': {
    name: 'Google Open Source',
    domain: 'opensource.google',
    website: 'https://opensource.google',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    category: 'Open Source'
  },
  'microsoft': {
    name: 'Microsoft',
    domain: 'microsoft.com',
    website: 'https://careers.microsoft.com',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
    category: 'Technology'
  },
  'microsoft corporation': {
    name: 'Microsoft',
    domain: 'microsoft.com',
    website: 'https://careers.microsoft.com',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
    category: 'Technology'
  },
  'amazon': {
    name: 'Amazon',
    domain: 'amazon.com',
    website: 'https://amazon.jobs',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    category: 'Technology'
  },
  'nvidia': {
    name: 'NVIDIA',
    domain: 'nvidia.com',
    website: 'https://www.nvidia.com/careers',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg',
    category: 'Hardware & AI'
  },
  'nvidia corporation': {
    name: 'NVIDIA',
    domain: 'nvidia.com',
    website: 'https://www.nvidia.com/careers',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg',
    category: 'Hardware & AI'
  },
  'apple': {
    name: 'Apple',
    domain: 'apple.com',
    website: 'https://jobs.apple.com',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    category: 'Technology'
  },
  'meta': {
    name: 'Meta',
    domain: 'meta.com',
    website: 'https://metacareers.com',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    category: 'Social & AI'
  },
  'adobe': {
    name: 'Adobe',
    domain: 'adobe.com',
    website: 'https://careers.adobe.com',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png',
    category: 'Design & Software'
  },
  'intel': {
    name: 'Intel',
    domain: 'intel.com',
    website: 'https://jobs.intel.com',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282020%29.svg',
    category: 'Semiconductors'
  },
  'intel corporation': {
    name: 'Intel',
    domain: 'intel.com',
    website: 'https://jobs.intel.com',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282020%29.svg',
    category: 'Semiconductors'
  },
  'ibm': {
    name: 'IBM',
    domain: 'ibm.com',
    website: 'https://www.ibm.com/careers',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
    category: 'Technology & Cloud'
  },
  'cisco': {
    name: 'Cisco',
    domain: 'cisco.com',
    website: 'https://jobs.cisco.com',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg',
    category: 'Networking & Security'
  },
  'oracle': {
    name: 'Oracle',
    domain: 'oracle.com',
    website: 'https://oracle.com/careers',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg',
    category: 'Database & Cloud'
  },
  'salesforce': {
    name: 'Salesforce',
    domain: 'salesforce.com',
    website: 'https://salesforce.com/careers',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',
    category: 'CRM & Cloud'
  },
  'uber': {
    name: 'Uber',
    domain: 'uber.com',
    website: 'https://uber.com/careers',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png',
    category: 'Mobility & Tech'
  },
  'stripe': {
    name: 'Stripe',
    domain: 'stripe.com',
    website: 'https://stripe.com/jobs',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
    category: 'Fintech'
  },
  'github': {
    name: 'GitHub',
    domain: 'github.com',
    website: 'https://github.com/about/careers',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
    category: 'Developer Tools'
  },

  // --- GOVERNMENT, RESEARCH & SPACE AGENCIES ---
  'isro': {
    name: 'ISRO',
    domain: 'isro.gov.in',
    website: 'https://www.isro.gov.in',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Indian_Space_Research_Organisation_Logo.svg',
    category: 'Space & Research'
  },
  'isro - indian space research organisation': {
    name: 'ISRO',
    domain: 'isro.gov.in',
    website: 'https://www.isro.gov.in',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Indian_Space_Research_Organisation_Logo.svg',
    category: 'Space & Research'
  },
  'drdo': {
    name: 'DRDO',
    domain: 'drdo.gov.in',
    website: 'https://www.drdo.gov.in',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/DRDO_Logo.svg/300px-DRDO_Logo.svg.png',
    category: 'Defense & Research'
  },
  'cern': {
    name: 'CERN',
    domain: 'cern.ch',
    website: 'https://careers.cern',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/CERN_logo.svg/320px-CERN_logo.svg.png',
    category: 'Nuclear Physics & Computing'
  },
  'aicte': {
    name: 'AICTE',
    domain: 'aicte-india.org',
    website: 'https://internship.aicte-india.org',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/All_India_Council_for_Technical_Education_logo.png/220px-All_India_Council_for_Technical_Education_logo.png',
    category: 'Government Education'
  },
  'ministry of education & aicte': {
    name: 'Ministry of Education & AICTE',
    domain: 'aicte-india.org',
    website: 'https://sih.gov.in',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_of_India_logo.svg/200px-Government_of_India_logo.svg.png',
    category: 'Government & SIH'
  },
  'nasa': {
    name: 'NASA',
    domain: 'nasa.gov',
    website: 'https://intern.nasa.gov',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg',
    category: 'Aerospace & Science'
  },

  // --- TOP UNIVERSITIES & RESEARCH INSTITUTES ---
  'iit bombay': {
    name: 'IIT Bombay',
    domain: 'iitb.ac.in',
    website: 'https://www.iitb.ac.in',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/IIT_Bombay_Logo.svg/220px-IIT_Bombay_Logo.svg.png',
    category: 'Premier Institute'
  },
  'iisc bangalore': {
    name: 'IISc Bangalore',
    domain: 'iisc.ac.in',
    website: 'https://iisc.ac.in',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/IISc_logo.svg/220px-IISc_logo.svg.png',
    category: 'Premier Research'
  },
  'mitacs': {
    name: 'Mitacs Globalink',
    domain: 'mitacs.ca',
    website: 'https://www.mitacs.ca/en/programs/globalink',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Mitacs_Logo.png/320px-Mitacs_Logo.png',
    category: 'International Research'
  },
  'tifr': {
    name: 'TIFR Mumbai',
    domain: 'tifr.res.in',
    website: 'https://www.tifr.res.in',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Tifr_logo.png/220px-Tifr_logo.png',
    category: 'Fundamental Research'
  },
  'tata institute of fundamental research': {
    name: 'TIFR Mumbai',
    domain: 'tifr.res.in',
    website: 'https://www.tifr.res.in',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Tifr_logo.png/220px-Tifr_logo.png',
    category: 'Fundamental Research'
  },

  // --- FOUNDATIONS, FELLOWSHIPS & HACKATHONS ---
  'linux foundation': {
    name: 'Linux Foundation',
    domain: 'linuxfoundation.org',
    website: 'https://mentorship.lfx.linuxfoundation.org',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/The_Linux_Foundation_logo.svg/320px-The_Linux_Foundation_logo.svg.png',
    category: 'Open Source'
  },
  'mlh': {
    name: 'Major League Hacking (MLH)',
    domain: 'mlh.io',
    website: 'https://fellowship.mlh.io',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Major_League_Hacking_logo.svg/320px-Major_League_Hacking_logo.svg.png',
    category: 'Hackathons & Fellowship'
  },
  'mlh (major league hacking)': {
    name: 'Major League Hacking (MLH)',
    domain: 'mlh.io',
    website: 'https://fellowship.mlh.io',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Major_League_Hacking_logo.svg/320px-Major_League_Hacking_logo.svg.png',
    category: 'Hackathons & Fellowship'
  },
  'outreachy': {
    name: 'Outreachy',
    domain: 'outreachy.org',
    website: 'https://www.outreachy.org',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Outreachy_logo.svg/320px-Outreachy_logo.svg.png',
    category: 'Diversity in Tech'
  },
  'smart india hackathon': {
    name: 'Smart India Hackathon (SIH)',
    domain: 'sih.gov.in',
    website: 'https://sih.gov.in',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_of_India_logo.svg/200px-Government_of_India_logo.svg.png',
    category: 'National Hackathon'
  },
  'ethindia': {
    name: 'ETHIndia',
    domain: 'ethindia.co',
    website: 'https://ethindia.co',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/200px-Ethereum_logo_2014.svg.png',
    category: 'Web3 & Hackathons'
  },
  'reliance foundation': {
    name: 'Reliance Foundation',
    domain: 'reliancefoundation.org',
    website: 'https://www.scholarships.reliancefoundation.org',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/99/Reliance_Industries_Logo.svg/220px-Reliance_Industries_Logo.svg.png',
    category: 'Scholarships'
  },
  'goldman sachs': {
    name: 'Goldman Sachs',
    domain: 'goldmansachs.com',
    website: 'https://www.goldmansachs.com/careers',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Goldman_Sachs.svg/320px-Goldman_Sachs.svg.png',
    category: 'Investment Banking & Tech'
  },
  'j.p. morgan': {
    name: 'J.P. Morgan',
    domain: 'jpmorgan.com',
    website: 'https://careers.jpmorgan.com',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/J_P_Morgan_Chase_Logo_2008_1.svg/320px-J_P_Morgan_Chase_Logo_2008_1.svg.png',
    category: 'Fintech & Banking'
  },
  'morgan stanley': {
    name: 'Morgan Stanley',
    domain: 'morganstanley.com',
    website: 'https://www.morganstanley.com/careers',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Morgan_Stanley_Logo_1.svg/320px-Morgan_Stanley_Logo_1.svg.png',
    category: 'Financial Services'
  }
};

/**
 * Extracts a normalized domain from any URL
 */
export function extractDomainFromUrl(url = '') {
  if (!url || typeof url !== 'string') return null;
  try {
    const urlObj = new URL(url.trim());
    return urlObj.hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return null;
  }
}

/**
 * Normalizes an organization name and resolves its identity, domain, website and logo URLs
 */
export function resolveOrganizationIdentity(orgName = '', explicitUrl = '', explicitLogo = '') {
  const cleanOrg = (orgName || '').trim();
  const lowerOrg = cleanOrg.toLowerCase();

  // 1. Direct registry lookup
  if (KNOWN_ORGANIZATIONS[lowerOrg]) {
    const match = KNOWN_ORGANIZATIONS[lowerOrg];
    return {
      name: match.name,
      canonicalName: match.name,
      domain: match.domain,
      website: match.website,
      logoUrl: explicitLogo || match.logoUrl,
      fallbackLogoUrls: [
        match.logoUrl,
        `https://logo.clearbit.com/${match.domain}`,
        `https://www.google.com/s2/favicons?domain=${match.domain}&sz=128`,
        `https://unavatar.io/${match.domain}`
      ],
      initials: getOrganizationInitials(match.name),
      isVerified: true
    };
  }

  // 2. Fuzzy / partial match on known registry
  for (const [key, match] of Object.entries(KNOWN_ORGANIZATIONS)) {
    if (lowerOrg.includes(key) || key.includes(lowerOrg)) {
      return {
        name: cleanOrg || match.name,
        canonicalName: match.name,
        domain: match.domain,
        website: match.website,
        logoUrl: explicitLogo || match.logoUrl,
        fallbackLogoUrls: [
          match.logoUrl,
          `https://logo.clearbit.com/${match.domain}`,
          `https://www.google.com/s2/favicons?domain=${match.domain}&sz=128`
        ],
        initials: getOrganizationInitials(cleanOrg || match.name),
        isVerified: true
      };
    }
  }

  // 3. Dynamic domain resolution from opportunity URL
  const domainFromUrl = extractDomainFromUrl(explicitUrl);
  const derivedDomain = domainFromUrl || `${cleanOrg.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

  const fallbackLogoUrls = [];
  if (explicitLogo && explicitLogo.startsWith('http')) {
    fallbackLogoUrls.push(explicitLogo);
  }
  if (domainFromUrl) {
    fallbackLogoUrls.push(`https://logo.clearbit.com/${domainFromUrl}`);
    fallbackLogoUrls.push(`https://www.google.com/s2/favicons?domain=${domainFromUrl}&sz=128`);
    fallbackLogoUrls.push(`https://unavatar.io/${domainFromUrl}`);
  }

  return {
    name: cleanOrg || 'Organization',
    canonicalName: cleanOrg || 'Organization',
    domain: domainFromUrl || derivedDomain,
    website: explicitUrl && explicitUrl.startsWith('http') ? explicitUrl : `https://${derivedDomain}`,
    logoUrl: explicitLogo || (fallbackLogoUrls[0] || null),
    fallbackLogoUrls,
    initials: getOrganizationInitials(cleanOrg || 'Organization'),
    isVerified: Boolean(domainFromUrl || explicitLogo)
  };
}

/**
 * Extracts 1-3 letter initials from organization name
 */
export function getOrganizationInitials(name = '') {
  if (!name || typeof name !== 'string') return 'TB';

  const clean = name.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);

  if (words.length === 0) return 'TB';
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  if (words.length === 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  // 3 or more words (e.g. Smart India Hackathon -> SIH, Indian Space Research -> ISRO)
  return (words[0][0] + words[1][0] + words[2][0]).toUpperCase();
}

/**
 * Deterministically generates an attractive avatar gradient style based on organization name
 */
export function getOrganizationAvatarStyle(name = '') {
  const palettes = [
    { bg: 'from-amber-500 to-orange-600', text: 'text-white', ring: 'ring-amber-500/30' },
    { bg: 'from-indigo-600 to-purple-600', text: 'text-white', ring: 'ring-indigo-500/30' },
    { bg: 'from-blue-600 to-cyan-600', text: 'text-white', ring: 'ring-blue-500/30' },
    { bg: 'from-emerald-600 to-teal-600', text: 'text-white', ring: 'ring-emerald-500/30' },
    { bg: 'from-rose-600 to-pink-600', text: 'text-white', ring: 'ring-rose-500/30' },
    { bg: 'from-slate-800 to-slate-950', text: 'text-amber-400', ring: 'ring-slate-700/50' },
    { bg: 'from-violet-600 to-indigo-800', text: 'text-white', ring: 'ring-violet-500/30' },
    { bg: 'from-teal-600 to-emerald-700', text: 'text-white', ring: 'ring-teal-500/30' }
  ];

  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % palettes.length;
  return palettes[index];
}
