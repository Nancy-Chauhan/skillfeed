import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const testArticles = [
  {
    source_email: "newsletter@tldr.tech",
    source_name: "TLDR AI",
    original_subject: "TLDR AI 2026-02-15",
    message_id: "seed:tldr-ai-001",
    title: "Building RAG Pipelines with LangChain and PostgreSQL",
    summary:
      "A step-by-step guide to building retrieval-augmented generation pipelines using LangChain, with PostgreSQL as the vector store backend.",
    url: "https://example.com/rag-langchain",
    level: "intermediate" as const,
    roles: ["ai_engineer", "backend"] as const,
    keywords: ["RAG", "LangChain", "PostgreSQL", "embeddings", "LLM"],
    processing_status: "completed" as const,
    received_at: new Date().toISOString(),
  },
  {
    source_email: "newsletter@bytebytego.com",
    source_name: "ByteByteGo",
    original_subject: "System Design Weekly",
    message_id: "seed:bytebytego-001",
    title: "Designing a Real-Time Notification System at Scale",
    summary:
      "How to architect a notification system handling millions of events per second using Kafka, Redis, and WebSockets.",
    url: "https://example.com/notification-system",
    level: "senior" as const,
    roles: ["backend", "devops"] as const,
    keywords: ["system design", "Kafka", "Redis", "WebSockets", "scalability"],
    processing_status: "completed" as const,
    received_at: new Date().toISOString(),
  },
  {
    source_email: "newsletter@tldrsec.com",
    source_name: "tl;dr sec",
    original_subject: "tl;dr sec #220",
    message_id: "seed:tldrsec-001",
    title: "Zero Trust Architecture: Practical Implementation Guide",
    summary:
      "A pragmatic guide to implementing Zero Trust principles in cloud-native environments, covering identity, network, and workload security.",
    url: "https://example.com/zero-trust",
    level: "intermediate" as const,
    roles: ["security", "devops"] as const,
    keywords: ["zero trust", "cloud security", "IAM", "network security", "Kubernetes"],
    processing_status: "completed" as const,
    received_at: new Date().toISOString(),
  },
  {
    source_email: "newsletter@deeplearning.ai",
    source_name: "The Batch",
    original_subject: "The Batch — Feb 15",
    message_id: "seed:batch-001",
    title: "Fine-Tuning LLMs on Custom Datasets with LoRA",
    summary:
      "How to efficiently fine-tune large language models using Low-Rank Adaptation, reducing compute costs by 10x while maintaining quality.",
    url: "https://example.com/lora-finetuning",
    level: "intermediate" as const,
    roles: ["ai_engineer"] as const,
    keywords: ["fine-tuning", "LoRA", "LLM", "training", "PyTorch", "transformers"],
    processing_status: "completed" as const,
    received_at: new Date().toISOString(),
  },
  {
    source_email: "newsletter@devops.com",
    source_name: "DevOps Weekly",
    original_subject: "DevOps Weekly #632",
    message_id: "seed:devops-001",
    title: "GitOps with ArgoCD: From Zero to Production",
    summary:
      "Complete walkthrough of setting up ArgoCD for GitOps-based Kubernetes deployments, including secrets management and rollback strategies.",
    url: "https://example.com/argocd-gitops",
    level: "intermediate" as const,
    roles: ["devops", "backend"] as const,
    keywords: ["GitOps", "ArgoCD", "Kubernetes", "CI/CD", "deployment"],
    processing_status: "completed" as const,
    received_at: new Date().toISOString(),
  },
  {
    source_email: "newsletter@pythonweekly.com",
    source_name: "Python Weekly",
    original_subject: "Python Weekly #640",
    message_id: "seed:python-001",
    title: "Building REST APIs with FastAPI and SQLAlchemy 2.0",
    summary:
      "Modern patterns for building type-safe REST APIs using FastAPI with async SQLAlchemy 2.0, including dependency injection and testing.",
    url: "https://example.com/fastapi-sqlalchemy",
    level: "beginner" as const,
    roles: ["backend"] as const,
    keywords: ["FastAPI", "SQLAlchemy", "REST API", "Python", "async"],
    processing_status: "completed" as const,
    received_at: new Date().toISOString(),
  },
  {
    source_email: "newsletter@tldr.tech",
    source_name: "TLDR AI",
    original_subject: "TLDR AI 2026-02-14",
    message_id: "seed:tldr-ai-002",
    title: "MLOps: Deploying ML Models with Docker and Kubernetes",
    summary:
      "Best practices for containerizing ML models, setting up model serving infrastructure, and implementing A/B testing for model versions.",
    url: "https://example.com/mlops-docker-k8s",
    level: "intermediate" as const,
    roles: ["ai_engineer", "devops"] as const,
    keywords: ["MLOps", "Docker", "Kubernetes", "model serving", "ML deployment"],
    processing_status: "completed" as const,
    received_at: new Date().toISOString(),
  },
  {
    source_email: "newsletter@consoledotdev.com",
    source_name: "Console",
    original_subject: "Console #198",
    message_id: "seed:console-001",
    title: "Prompt Engineering Patterns for Production Applications",
    summary:
      "Battle-tested prompt engineering patterns including chain-of-thought, few-shot, and structured output techniques for reliable AI applications.",
    url: "https://example.com/prompt-engineering",
    level: "intermediate" as const,
    roles: ["ai_engineer", "backend", "solutions_engineer"] as const,
    keywords: ["prompt engineering", "LLM", "AI applications", "chain-of-thought"],
    processing_status: "completed" as const,
    received_at: new Date().toISOString(),
  },
  {
    source_email: "newsletter@kubeweekly.com",
    source_name: "KubeWeekly",
    original_subject: "KubeWeekly #400",
    message_id: "seed:kube-001",
    title: "Kubernetes Security Hardening Checklist for 2026",
    summary:
      "Comprehensive checklist covering pod security standards, network policies, RBAC best practices, and runtime security for Kubernetes clusters.",
    url: "https://example.com/k8s-security",
    level: "senior" as const,
    roles: ["security", "devops"] as const,
    keywords: ["Kubernetes", "security", "RBAC", "pod security", "network policies"],
    processing_status: "completed" as const,
    received_at: new Date().toISOString(),
  },
  {
    source_email: "newsletter@thechiefio.com",
    source_name: "The Chief I/O",
    original_subject: "Solutions Engineering Digest",
    message_id: "seed:chiefio-001",
    title: "Technical Discovery: Frameworks for Solution Architecture",
    summary:
      "How to run effective technical discovery sessions, map customer requirements to architecture decisions, and create compelling technical proposals.",
    url: "https://example.com/tech-discovery",
    level: "intermediate" as const,
    roles: ["solutions_engineer"] as const,
    keywords: ["solutions architecture", "technical discovery", "presales", "architecture"],
    processing_status: "completed" as const,
    received_at: new Date().toISOString(),
  },
];

async function seed() {
  console.log("Seeding test articles...");

  const { data, error } = await supabase
    .from("articles")
    .upsert(testArticles, { onConflict: "message_id", ignoreDuplicates: true })
    .select("id, title");

  if (error) {
    console.error("Failed to seed articles:", error);
    process.exit(1);
  }

  console.log(`Seeded ${data.length} articles:`);
  data.forEach((a) => console.log(`  - ${a.title}`));

  console.log("\nSeed complete. You can now test match_articles_for_user().");
  console.log("Example: SELECT * FROM match_articles_for_user('<user-uuid>');");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
