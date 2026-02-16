import { AgentMailClient } from "agentmail";

const agentmail = new AgentMailClient({
  apiKey: process.env.AGENTMAIL_API_KEY!,
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

async function setup() {
  if (!APP_URL) {
    console.error("NEXT_PUBLIC_APP_URL is not set in .env.local");
    process.exit(1);
  }

  console.log("Creating AgentMail inbox...");

  const inbox = await agentmail.inboxes.create({
    displayName: "SkillFeed Newsletter Ingestion",
  });

  console.log(`Inbox created: ${inbox.inboxId}`);
  console.log(`Pod ID: ${inbox.podId}`);

  const webhookUrl = `${APP_URL}/api/webhooks/agentmail`;
  console.log(`\nRegistering webhook: ${webhookUrl}`);

  const webhook = await agentmail.webhooks.create({
    url: webhookUrl,
    eventTypes: ["message.received"],
  });

  console.log(`Webhook registered: ${webhook.webhookId}`);
  console.log(`Webhook secret: ${webhook.secret}`);

  console.log("\n--- Add these to your .env.local ---");
  console.log(`AGENTMAIL_INBOX_ID=${inbox.inboxId}`);
  console.log(`AGENTMAIL_WEBHOOK_SECRET=${webhook.secret}`);
}

setup().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
