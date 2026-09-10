import { enrichOpportunityWithLLM } from './src/services/opportunityAgent/llmEnricher.js';

async function testEnricher() {
  console.log('Testing Opportunity LLM Enricher with z-ai/glm-5.3-free...');
  
  const sample = {
    title: 'Google Summer of Code (GSoC) 2026',
    organization: 'Google Open Source',
    type: 'Fellowship',
    description: 'Global online program introducing students to open-source software development with mentorship and stipend.',
    skills: ['Git', 'Python', 'Open Source', 'C++', 'Rust'],
    eligibility: 'All college students 18+ enrolled in university'
  };

  const enriched = await enrichOpportunityWithLLM(sample);
  console.log('\n--- ✨ Enriched Opportunity Result ---');
  console.log(JSON.stringify(enriched, null, 2));
}

testEnricher();
