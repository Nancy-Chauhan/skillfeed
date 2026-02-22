import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI, type Schema } from "@google/generative-ai";

// ── Provider config ─────────────────────────────────────────────
// Set LLM_PROVIDER=gemini or LLM_PROVIDER=anthropic in .env.local
// Defaults to gemini if GEMINI_API_KEY is set, otherwise anthropic.

type LLMProvider = "anthropic" | "gemini";

function getProvider(): LLMProvider {
  const explicit = process.env.LLM_PROVIDER as LLMProvider | undefined;
  if (explicit === "anthropic" || explicit === "gemini") return explicit;
  if (process.env.GEMINI_API_KEY) return "gemini";
  return "anthropic";
}

// ── Anthropic ───────────────────────────────────────────────────

const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-4-5-20250929";

function callAnthropic(
  systemPrompt: string,
  userMessage: string,
  options?: { model?: string; maxTokens?: number }
): Promise<string> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  return anthropic.messages
    .create({
      model: options?.model ?? DEFAULT_ANTHROPIC_MODEL,
      max_tokens: options?.maxTokens ?? 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    })
    .then((response) => {
      const textBlock = response.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("No text response from Anthropic");
      }
      return stripCodeFences(textBlock.text);
    });
}

// ── Gemini ──────────────────────────────────────────────────────

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

function callGemini(
  systemPrompt: string,
  userMessage: string,
  options?: { maxTokens?: number; responseSchema?: Record<string, unknown> }
): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: DEFAULT_GEMINI_MODEL });

  return model
    .generateContent({
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      systemInstruction: { role: "model", parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: "application/json",
        ...(options?.responseSchema ? { responseSchema: options.responseSchema as unknown as Schema } : {}),
        maxOutputTokens: options?.maxTokens ?? 4096,
      },
    })
    .then((result) => stripCodeFences(result.response.text()));
}

// ── Public API ──────────────────────────────────────────────────

export async function callClaude(
  systemPrompt: string,
  userMessage: string,
  options?: { model?: string; maxTokens?: number; responseSchema?: Record<string, unknown> }
): Promise<string> {
  const provider = getProvider();

  if (provider === "gemini") {
    return callGemini(systemPrompt, userMessage, options);
  }

  return callAnthropic(systemPrompt, userMessage, options);
}

// kept for backward compat (profile-parser uses it for type inference)
export const DEFAULT_MODEL = DEFAULT_ANTHROPIC_MODEL;

// ── Helpers ─────────────────────────────────────────────────────

function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/);
  return match ? match[1].trim() : trimmed;
}

