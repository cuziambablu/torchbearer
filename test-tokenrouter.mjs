// Test tokenrouter endpoint
const BASE_URL = 'https://api.tokenrouter.com/v1';
const MODEL = 'z-ai/glm-5.3-free';
const API_KEY = process.env.TOKENROUTER_API_KEY || process.env.EXPLABS_API_KEY || '';

async function testTokenRouter() {
  console.log(`Connecting to: ${BASE_URL}/chat/completions`);
  console.log(`Model: ${MODEL}`);
  console.log(`API Key present: ${Boolean(API_KEY)}`);

  try {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY ? { 'Authorization': `Bearer ${API_KEY}` } : {})
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'You are an intelligent assistant, please reply concisely.' },
          { role: 'user', content: 'Hello, what kind of model are you?' }
        ],
        stream: false
      })
    });

    console.log(`Status: ${res.status} ${res.statusText}`);
    const data = await res.text();
    console.log('Response body:\n', data);
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

testTokenRouter();
