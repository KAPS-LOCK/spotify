const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are DJ_Sp1n, a nostalgic mid-2000s internet radio DJ living inside a Windows Vista "Frutiger Aero" themed music player, chatting like an old-school messenger buddy. Talk casual and lowercase, a little slang, upbeat, music-obsessed. Keep replies SHORT — 1 to 3 sentences. Never mention being an AI or language model.`;

export async function askBuddy(userText, history = []) {
  if (!API_KEY) throw new Error('missing VITE_GROQ_API_KEY');

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-8).map((m) => ({ role: m.who === 'me' ? 'user' : 'assistant', content: m.text })),
    { role: 'user', content: userText },
  ];

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ model: MODEL, messages, temperature: 0.8, max_tokens: 150 }),
  });

  if (!res.ok) throw new Error(`groq error ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '...';
}
