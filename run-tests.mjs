import { runAgentTestSuite } from './src/services/opportunityAgent/__tests__/agent.test.js';

console.log('--- Running Torchbearer AI Intelligence Test Suite ---');
const results = runAgentTestSuite();
console.log(`Summary: ${results.passedCount}/${results.totalTests} tests passed.`);
results.results.forEach(r => {
  console.log(`[${r.passed ? 'PASS' : 'FAIL'}] ${r.name}: ${r.details}`);
});

if (!results.success) {
  process.exit(1);
} else {
  console.log('\n✅ All tests passed successfully!');
}
