import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const arg = process.argv[2];
if (!arg) {
  console.error(
    "Usage:\n" +
      "  npx tsx scripts/approve-user.ts <email>   # approve one user\n" +
      "  npx tsx scripts/approve-user.ts --all      # approve all pending\n" +
      "  npx tsx scripts/approve-user.ts --list     # list all pending"
  );
  process.exit(1);
}

async function list() {
  const { data, error } = await admin
    .from("waitlist")
    .select("email, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }

  if (!data?.length) {
    console.log("No pending waitlist users.");
    return;
  }

  console.log(`${data.length} pending user(s):\n`);
  console.table(data);
}

async function approveOne(email: string) {
  const { data, error } = await admin
    .from("waitlist")
    .update({ status: "approved" })
    .eq("email", email)
    .eq("status", "pending")
    .select();

  if (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }

  if (!data?.length) {
    console.log(`No pending waitlist entry found for ${email}.`);
  } else {
    console.log(`Approved: ${email}`);
  }
}

async function approveAll() {
  const { data, error } = await admin
    .from("waitlist")
    .update({ status: "approved" })
    .eq("status", "pending")
    .select();

  if (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }

  console.log(`Approved ${data?.length ?? 0} pending user(s).`);
}

if (arg === "--list") {
  list();
} else if (arg === "--all") {
  approveAll();
} else {
  approveOne(arg);
}
