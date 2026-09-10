import { createInterface } from 'readline';

const BASE_URL = 'https://api.tokenrouter.com/v1';
const MODEL = process.env.TOKENROUTER_MODEL || 'z-ai/glm-5.3-free';
const API_KEY = process.env.TOKENROUTER_API_KEY || process.env.EXPLABS_API_KEY || process.argv[2];

if (!API_KEY || API_KEY === '<YOUR_API_KEY>') {
  console.log(`
⚠️  API Key missing for TokenRouter!
Status: 401 Unauthorized - "Token not provided"

To run this test with streaming:
  $env:TOKENROUTER_API_KEY="your_actual_api_key"
  node test-tokenrouter-stream.mjs

Or pass it directly:
  node test-tokenrouter-stream.mjs your_actual_api_key
`);
  process.exit(1);
}

async function runStreamTest() {
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log(`🤖 Model:    ${MODEL}`);
  console.log(`🔑 Key:      ${API_KEY.slice(0, 6)}...${API_KEY.slice(-4)}\n`);

  try {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'You are an intelligent assistant, please reply concisely.' },
          { role: 'user', content: 'Hello, what kind of model are you?' }
        ],
        stream: true,
        stream_options: { include_usage: true }
      })
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`❌ HTTP Error ${res.status}: ${err}`);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullContent = '';
    let usageData = null;

    process.stdout.write('💬 Output: ');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep last incomplete line

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        const dataStr = trimmed.slice(5).trim();
        if (dataStr === '[DONE]') continue;

        try {
          const parsed = JSON.parse(dataStr);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) {
            process.stdout.write(delta);
            fullContent += delta;
          }
          if (parsed.usage) {
            usageData = parsed.usage;
          }
        } catch {}
      }
    }

    console.log('\n\n--- ✅ Complete Response ---');
    console.log(fullContent);
    if (usageData) {
      console.log('\n--- 📊 Token Usage ---');
      console.log(JSON.stringify(usageData, null, 2));
    }
  } catch (e) {
    console.error('Stream processing error:', e.message);
  }
}

runStreamTest();
