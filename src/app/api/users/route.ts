import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseProfile } from "@/lib/agents/profile-parser";
import { ROLES, LEVELS } from "@/lib/utils/constants";
import { checkRateLimit, getClientIp } from "@/lib/utils/rate-limiter";

const CreateUserSchema = z.object({
  name: z.string().optional(),
  resume_text: z.string().optional(),
  prompt_text: z.string().optional(),
  current_roles: z.array(z.enum(ROLES)).optional(),
  target_roles: z.array(z.enum(ROLES)).optional(),
});

export async function POST(request: Request) {
  // Rate limit: 10 requests per minute per IP
  const ip = getClientIp(request);
  const rl = checkRateLimit(`users:${ip}`, 100, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse and validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = CreateUserSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.format() },
      { status: 400 }
    );
  }

  const data = result.data;

  // Parse profile with Claude
  const profile = await parseProfile(
    data.resume_text ?? null,
    data.prompt_text ?? null
  );

  // Use admin client to insert (bypasses RLS for the insert, then RLS protects reads)
  const admin = createAdminClient();

  // Check for duplicate
  const { data: existing } = await admin
    .from("users")
    .select("id")
    .eq("email", user.email!)
    .single();

  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const { data: newUser, error } = await admin
    .from("users")
    .insert({
      id: user.id,
      email: user.email!,
      name: data.name?.trim() || null,
      resume_text: data.resume_text ?? null,
      prompt_text: data.prompt_text ?? null,
      current_roles: data.current_roles ?? profile.current_roles,
      target_roles: data.target_roles ?? profile.target_roles,
      current_level: profile.current_level,
      target_level: profile.target_level,
      extracted_keywords: profile.keywords,
      extracted_skills: profile.skills,
      learning_goals: profile.learning_goals,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }

  // Add user to waitlist as pending (don't let failure break user creation)
  try {
    await admin.from("waitlist").insert({ email: user.email! });
  } catch (e) {
    console.error("Failed to insert into waitlist:", e);
  }

  return NextResponse.json(newUser, { status: 201 });
}
