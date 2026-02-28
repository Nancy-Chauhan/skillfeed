import { config } from "dotenv";
config({ path: ".env.local" });

import { Resend } from "resend";
import { renderFeedbackRequestEmail } from "../src/emails/feedback-request";

const resend = new Resend(process.env.RESEND_API_KEY);

interface User {
  email: string;
  name: string | null;
  userId: string;
}

async function sendToUser(user: User) {
  const html = renderFeedbackRequestEmail(user.name, user.userId);

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "SkillFeed <hello@skillfeed.dev>",
    to: user.email,
    subject: "Quick question -- how are your daily briefs?",
    html,
  });

  if (error) {
    console.error(`Failed to send to ${user.email}:`, error);
  } else {
    console.log(`Sent to ${user.email} (id: ${data?.id})`);
  }
}

// Users to send to (pass emails as CLI args, or hardcode)
const users: User[] = [
  {
    email: "nancychn1@gmail.com",
    name: "Nancy",
    userId: "7c69f61b-5255-45df-9761-744b4b1e201a",
  },
];

async function main() {
  for (const user of users) {
    await sendToUser(user);
  }
}

main();
