const BASE_URL = 'https://api.tokenrouter.com/v1';
const MODEL = 'z-ai/glm-5.3-free';
const API_KEY = 'sk-CVqw7jlQPzG8DlW8k26HXl89cNixf9XLbM9shyBkobGuzD3R';

async function testWithRetries(retries = 3) {
  for (let i = 1; i <= retries; i++) {
    console.log(`[Attempt ${i}/${retries}] Sending request to ${BASE_URL}...`);
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
            { role: 'user', content: 'Hello! Please introduce yourself in one sentence.' }
          ]
        })
      });

      console.log(`Response Status: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.log('Body:', text);

      if (res.ok) {
        console.log('✅ Success!');
        return;
      }
    } catch (err) {
      console.error('Fetch error:', err.message);
    }
    if (i < retries) {
      console.log('Waiting 3s before retry...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

testWithRetries();
