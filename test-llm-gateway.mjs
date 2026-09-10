import { createChatCompletion, getApiKey, EXPERIENTIAL_BASE_URL, DEFAULT_MODEL } from './src/services/llmClient.js';

async function testExperientialGateway() {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('❌ EXPLABS_API_KEY environment variable is NOT set.');
    console.error('Please create an API key under Settings -> API Keys and export it:');
    console.error('  export EXPLABS_API_KEY="your-api-key"   (Linux/macOS)');
    console.error('  $env:EXPLABS_API_KEY="your-api-key"     (PowerShell)');
    process.exit(1);
  }

  console.log(`📡 Connecting to Experiential Gateway: ${EXPERIENTIAL_BASE_URL}`);
  console.log(`🤖 Model ID: ${DEFAULT_MODEL}`);
  
  try {
    const res = await createChatCompletion({
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: 'Say hello in 5 words.' }
      ]
    });

    console.log('\n--- 🎯 Experiential Gateway Response ---');
    console.log('Reply:', res.choices?.[0]?.message?.content);
    console.log('\n--- 📊 Token Usage (Experiential Credits) ---');
    console.log(JSON.stringify(res.usage, null, 2));
  } catch (error) {
    console.error('❌ Error during Experiential test call:', error.message);
  }
}

testExperientialGateway();
