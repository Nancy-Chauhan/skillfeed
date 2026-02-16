import { z } from "zod/v4";
import { callClaude } from "@/lib/claude/client";
import { ROLES, LEVELS } from "@/lib/utils/constants";
import type { ParsedProfile } from "@/lib/utils/types";

const ProfileSchema = z.object({
  current_roles: z.array(z.enum(ROLES)).min(1),
  target_roles: z.array(z.enum(ROLES)).min(1),
  current_level: z.enum(LEVELS),
  target_level: z.enum(LEVELS),
  keywords: z.array(z.string()).min(1),
  skills: z.array(z.string()).min(1),
  learning_goals: z.array(z.string()).min(1),
});

const SYSTEM_PROMPT = `You are a career profile analyzer for SkillFeed, a personalized developer learning platform.

Given a user's resume and/or career goals description, extract structured profile data.

Provide:
- current_roles: Array of their current role areas from: "backend", "devops", "security", "solutions_engineer", "ai_engineer", "general"
- target_roles: Array of roles they want to grow into (same enum)
- current_level: One of "beginner", "intermediate", "senior" — their current expertise level
- target_level: One of "beginner", "intermediate", "senior" — where they want to be
- keywords: Array of 5-15 technical keywords that describe their interests and focus areas (technologies, tools, concepts)
- skills: Array of 3-10 concrete skills they currently have (e.g., "REST API design", "Docker", "CI/CD pipelines")
- learning_goals: Array of 2-5 specific things they want to learn or achieve (e.g., "Build production ML systems")

Rules:
- If resume is empty, infer as much as possible from the goals description
- If information is vague, make reasonable inferences and lean toward broader coverage
- Keywords should be specific technical terms, not generic descriptions
- Skills should reflect what they currently know, not aspirations
- Learning goals should be actionable and specific
- Always respond with valid JSON matching the schema

Respond with JSON only, no markdown fences, no explanation.`;

export async function parseProfile(
  resumeText: string | null,
  promptText: string | null
): Promise<ParsedProfile> {
  const parts: string[] = [];
  if (resumeText?.trim()) {
    parts.push(`Resume:\n${resumeText}`);
  }
  if (promptText?.trim()) {
    parts.push(`Career Goals & Aspirations:\n${promptText}`);
  }

  if (parts.length === 0) {
    return {
      current_roles: ["general"],
      target_roles: ["general"],
      current_level: "beginner",
      target_level: "intermediate",
      keywords: ["software development"],
      skills: ["programming"],
      learning_goals: ["Grow as a developer"],
    };
  }

  const userMessage = parts.join("\n\n");
  const response = await callClaude(SYSTEM_PROMPT, userMessage);

  let parsed: unknown;
  try {
    parsed = JSON.parse(response);
  } catch {
    console.error("Failed to parse Claude response as JSON:", response.slice(0, 200));
    return {
      current_roles: ["general"],
      target_roles: ["general"],
      current_level: "beginner",
      target_level: "intermediate",
      keywords: ["software development"],
      skills: ["programming"],
      learning_goals: ["Grow as a developer"],
    };
  }

  const result = ProfileSchema.safeParse(parsed);
  if (!result.success) {
    console.error("Profile parsing failed schema validation:", result.error);
    return {
      current_roles: ["general"],
      target_roles: ["general"],
      current_level: "beginner",
      target_level: "intermediate",
      keywords: ["software development"],
      skills: ["programming"],
      learning_goals: ["Grow as a developer"],
    };
  }

  return result.data;
}
