import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const email = process.argv[2];
if (!email) {
  console.error("Usage: npx tsx scripts/delete-user.ts <email>");
  process.exit(1);
}

async function run() {
  // Delete from users (cascades to newsletters_sent, newsletter_events)
  const { data: user, error: userErr } = await admin.from("users").delete().eq("email", email).select();
  console.log("users:", user?.length ? `deleted ${user.length}` : "none found", userErr ?? "");

  // Delete from waitlist
  const { data: wl, error: wlErr } = await admin.from("waitlist").delete().eq("email", email).select();
  console.log("waitlist:", wl?.length ? `deleted ${wl.length}` : "none found", wlErr ?? "");

  // Delete from Supabase auth
  const { data: { users } } = await admin.auth.admin.listUsers();
  const authUser = users.find((u) => u.email === email);
  if (authUser) {
    const { error: authErr } = await admin.auth.admin.deleteUser(authUser.id);
    console.log("auth:", authErr ?? "deleted");
  } else {
    console.log("auth: none found");
  }
}

run();
