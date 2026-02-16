import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export const DEFAULT_MODEL = "claude-sonnet-4-5-20250929";

export async function callClaude(
  systemPrompt: string,
  userMessage: string,
  options?: { model?: string; maxTokens?: number }
): Promise<string> {
  const response = await anthropic.messages.create({
    model: options?.model ?? DEFAULT_MODEL,
    max_tokens: options?.maxTokens ?? 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  return stripCodeFences(textBlock.text);
}

/**
 * Strip markdown code fences (```json ... ```) that Claude sometimes wraps around JSON responses.
 */
function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/);
  return match ? match[1].trim() : trimmed;
}

export { anthropic };
