// ==============================================================================
// TORCHBEARER AI — SECURE AI PROXY EDGE FUNCTION
// ==============================================================================
// Securely proxies AI completion requests to OpenRouter & TokenRouter
// without exposing API keys to client browsers.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY") || "";
const TOKENROUTER_API_KEY = Deno.env.get("TOKENROUTER_API_KEY") || "";

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { messages, model, temperature = 0.2, max_tokens = 1500 } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Missing or invalid 'messages' array in request body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 1. Determine target provider & endpoint
    let targetUrl = "https://openrouter.ai/api/v1/chat/completions";
    let apiKey = OPENROUTER_API_KEY;
    let selectedModel = model || "nvidia/nemotron-3-ultra-550b-a55b:free";

    if (!apiKey && TOKENROUTER_API_KEY) {
      targetUrl = "https://api.tokenrouter.com/v1/chat/completions";
      apiKey = TOKENROUTER_API_KEY;
      selectedModel = "z-ai/glm-5.3-free";
    }

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: "Server configuration error: No AI provider keys configured on backend edge function." 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 2. Call upstream AI provider
    const upstreamRes = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Bearer ,
        "HTTP-Referer": "https://torchbearer.ai",
        "X-Title": "Torchbearer AI"
      },
      body: JSON.stringify({
        model: selectedModel,
        messages,
        temperature,
        max_tokens
      })
    });

    const responseData = await upstreamRes.json();

    return new Response(JSON.stringify(responseData), {
      status: upstreamRes.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
