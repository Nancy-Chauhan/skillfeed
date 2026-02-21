import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseProfile } from "@/lib/agents/profile-parser";
import { ROLES, LEVELS } from "@/lib/utils/constants";

const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  resume_text: z.string().optional(),
  prompt_text: z.string().optional(),
  current_roles: z.array(z.enum(ROLES)).optional(),
  target_roles: z.array(z.enum(ROLES)).optional(),
  current_level: z.enum(LEVELS).optional(),
  target_level: z.enum(LEVELS).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RLS ensures users can only read their own data
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.id !== id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = UpdateUserSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.format() },
      { status: 400 }
    );
  }

  const updates = result.data;
  const admin = createAdminClient();

  // If resume or prompt changed, re-run profile parser
  const needsReparse = updates.resume_text !== undefined || updates.prompt_text !== undefined;
  let profileUpdates = {};

  if (needsReparse) {
    // Fetch current user to merge with updates
    const { data: currentUser } = await admin
      .from("users")
      .select("resume_text, prompt_text")
      .eq("id", id)
      .single();

    const resumeText = updates.resume_text ?? currentUser?.resume_text ?? null;
    const promptText = updates.prompt_text ?? currentUser?.prompt_text ?? null;

    const profile = await parseProfile(resumeText, promptText);
    profileUpdates = {
      // User-selected levels take priority over AI-parsed ones
      current_level: updates.current_level ?? profile.current_level,
      target_level: updates.target_level ?? profile.target_level,
      extracted_keywords: profile.keywords,
      extracted_skills: profile.skills,
      learning_goals: profile.learning_goals,
    };
  }

  const { data, error } = await admin
    .from("users")
    .update({
      ...updates,
      ...profileUpdates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json(data);
}
