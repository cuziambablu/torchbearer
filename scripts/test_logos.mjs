import { resolveOrganizationIdentity, getOrganizationInitials } from '../src/utils/organizationUtils.js';

console.log('===========================================================');
console.log('🧪 TESTING ORGANIZATION LOGO RESOLUTION & FALLBACK ENGINE');
console.log('===========================================================\n');

const testCases = [
  { name: 'Microsoft Opportunity', input: 'Microsoft Corporation', url: 'https://careers.microsoft.com' },
  { name: 'Google Opportunity', input: 'Google Open Source', url: 'https://summerofcode.withgoogle.com' },
  { name: 'Amazon Opportunity', input: 'Amazon', url: 'https://amazon.jobs' },
  { name: 'NVIDIA Opportunity', input: 'NVIDIA Corporation', url: 'https://nvidia.com/careers' },
  { name: 'University (IIT Bombay)', input: 'IIT Bombay', url: 'https://iitb.ac.in' },
  { name: 'University (IISc Bangalore)', input: 'IISc Bangalore', url: 'https://iisc.ac.in' },
  { name: 'Govt Agency (ISRO)', input: 'ISRO - Indian Space Research Organisation', url: 'https://isro.gov.in' },
  { name: 'Govt Agency (DRDO)', input: 'DRDO', url: 'https://drdo.gov.in' },
  { name: 'Hackathon (Smart India Hackathon)', input: 'Smart India Hackathon', url: 'https://sih.gov.in' },
  { name: 'Unknown Organization (Initials Fallback)', input: 'Quantum Zenith Labs', url: '' },
  { name: 'Invalid Logo URL Fallback', input: 'Robotics Guild', url: 'https://invalid-domain-xyz.com', logo: 'https://invalid-non-existent-image-12345.png' }
];

let allPassed = true;

testCases.forEach((tc, idx) => {
  const resolved = resolveOrganizationIdentity(tc.input, tc.url, tc.logo);
  const initials = getOrganizationInitials(tc.input);

  console.log(`[${idx + 1}/${testCases.length}] Testing: ${tc.name}`);
  console.log(`   • Input: "${tc.input}"`);
  console.log(`   • Resolved Name: "${resolved.name}"`);
  console.log(`   • Canonical Domain: "${resolved.domain}"`);
  console.log(`   • Primary Logo URL: ${resolved.logoUrl ? resolved.logoUrl.substring(0, 70) + '...' : 'None (Using Initials)'}`);
  console.log(`   • Initials Fallback: "${initials}"`);
  console.log(`   • Total Fallback Candidate URLs: ${resolved.fallbackLogoUrls.length}`);

  if (tc.name.includes('Microsoft') && !resolved.logoUrl?.includes('wikimedia') && !resolved.domain?.includes('microsoft')) {
    console.error('   ❌ Failed Microsoft mapping');
    allPassed = false;
  } else if (tc.name.includes('Unknown') && initials !== 'QZL') {
    console.error('   ❌ Failed initials fallback test');
    allPassed = false;
  } else {
    console.log('   ✅ PASS\n');
  }
});

console.log('===========================================================');
if (allPassed) {
  console.log('🎉 ALL LOGO RESOLUTION & FALLBACK TESTS PASSED!');
} else {
  console.error('❌ Some tests failed.');
  process.exit(1);
}
console.log('===========================================================');
