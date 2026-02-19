"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { RoleSelector } from "./role-selector";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { LEVELS, LEVEL_LABELS, ROLE_LABELS, type Role, type Level } from "@/lib/utils/constants";

interface FormData {
  name: string;
  email: string;
  resume_text: string;
  prompt_text: string;
  current_roles: Role[];
  target_roles: Role[];
  current_level: Level;
  target_level: Level;
}

interface ProfileFormProps {
  userEmail: string;
}

export function ProfileForm({ userEmail }: ProfileFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: userEmail,
    resume_text: "",
    prompt_text: "",
    current_roles: [],
    target_roles: [],
    current_level: "beginner",
    target_level: "intermediate",
  });

  const totalSteps = 4;

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return formData.name.trim().length > 0;
      case 2:
        return formData.current_roles.length > 0;
      case 3:
        return formData.target_roles.length > 0 && formData.prompt_text.trim().length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          resume_text: formData.resume_text || undefined,
          prompt_text: formData.prompt_text || undefined,
          current_roles: formData.current_roles,
          target_roles: formData.target_roles,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create profile");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  const stepTitles = [
    "Let's get to know you",
    "Where are you today?",
    "Where do you want to go?",
    "Review your profile",
  ];

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4 pt-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-violet-500/[0.04] blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="flex items-center justify-center mb-8">
          <span className="font-mono text-sm font-semibold text-white tracking-tight">
            skillfeed<span className="text-violet-400">_</span>
          </span>
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs transition-all duration-300 ${
                  i + 1 < step
                    ? "bg-violet-500 text-white"
                    : i + 1 === step
                      ? "bg-white text-[#09090B]"
                      : "bg-white/[0.03] text-white/20 border border-white/[0.06]"
                }`}
              >
                {i + 1 < step ? <Check className="w-3.5 h-3.5" /> : `0${i + 1}`}
              </div>
              {i < totalSteps - 1 && (
                <div className={`hidden sm:block w-12 md:w-20 h-px transition-colors duration-300 ${
                  i + 1 < step ? "bg-violet-500/40" : "bg-white/[0.04]"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="gradient-border rounded-xl overflow-hidden bg-white/[0.02]">
          <div className="px-8 pt-8 pb-2">
            <p className="font-mono text-[11px] text-violet-400/60 mb-2">
              step {String(step).padStart(2, "0")}/{String(totalSteps).padStart(2, "0")}
            </p>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {stepTitles[step - 1]}
            </h1>
          </div>

          <div className="px-8 py-6 space-y-6">
            {step === 1 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[13px] text-white/40">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="h-11 rounded-lg border-white/[0.06] focus:border-violet-500/40 bg-white/[0.03] text-white placeholder:text-white/15 focus:ring-1 focus:ring-violet-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[13px] text-white/40">Email</Label>
                  <Input
                    value={formData.email}
                    disabled
                    className="h-11 rounded-lg border-white/[0.04] bg-white/[0.02] text-white/25 font-mono text-sm"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="resume" className="text-[13px] text-white/40">
                    Resume or background <span className="text-white/15">(optional)</span>
                  </Label>
                  <Textarea
                    id="resume"
                    placeholder="Paste your resume or describe your experience..."
                    value={formData.resume_text}
                    onChange={(e) => update("resume_text", e.target.value)}
                    rows={4}
                    className="rounded-lg border-white/[0.06] focus:border-violet-500/40 bg-white/[0.03] text-white placeholder:text-white/15 resize-none focus:ring-1 focus:ring-violet-500/20"
                  />
                </div>
                <RoleSelector
                  selected={formData.current_roles}
                  onChange={(roles) => update("current_roles", roles)}
                  label="Current roles"
                />
                <div className="space-y-3">
                  <Label className="text-[13px] text-white/40">Current level</Label>
                  <RadioGroup
                    value={formData.current_level}
                    onValueChange={(v) => update("current_level", v as Level)}
                    className="flex gap-2"
                  >
                    {LEVELS.map((level) => (
                      <label
                        key={level}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all duration-200 text-sm ${
                          formData.current_level === level
                            ? "border-violet-500/30 bg-violet-500/[0.08] text-white/80"
                            : "border-white/[0.04] text-white/25 hover:border-white/[0.08]"
                        }`}
                      >
                        <RadioGroupItem value={level} />
                        <span>{LEVEL_LABELS[level]}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-[13px] text-white/40">
                    Who do you want to become?
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe your career goals, what you want to learn, where you see yourself in 1-2 years..."
                    value={formData.prompt_text}
                    onChange={(e) => update("prompt_text", e.target.value)}
                    rows={4}
                    className="rounded-lg border-white/[0.06] focus:border-violet-500/40 bg-white/[0.03] text-white placeholder:text-white/15 resize-none focus:ring-1 focus:ring-violet-500/20"
                  />
                </div>
                <RoleSelector
                  selected={formData.target_roles}
                  onChange={(roles) => update("target_roles", roles)}
                  label="Target roles"
                />
                <div className="space-y-3">
                  <Label className="text-[13px] text-white/40">Target level</Label>
                  <RadioGroup
                    value={formData.target_level}
                    onValueChange={(v) => update("target_level", v as Level)}
                    className="flex gap-2"
                  >
                    {LEVELS.map((level) => (
                      <label
                        key={level}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all duration-200 text-sm ${
                          formData.target_level === level
                            ? "border-violet-500/30 bg-violet-500/[0.08] text-white/80"
                            : "border-white/[0.04] text-white/25 hover:border-white/[0.08]"
                        }`}
                      >
                        <RadioGroupItem value={level} />
                        <span>{LEVEL_LABELS[level]}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="font-mono text-[11px] text-white/15 uppercase tracking-wider">name</p>
                    <p className="text-white/80 text-sm font-medium">{formData.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-[11px] text-white/15 uppercase tracking-wider">email</p>
                    <p className="font-mono text-white/35 text-sm">{formData.email}</p>
                  </div>
                </div>
                <div className="h-px bg-white/[0.04]" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-mono text-[11px] text-white/15 uppercase tracking-wider">current roles</p>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.current_roles.map((role) => (
                        <Badge key={role} variant="secondary" className="font-mono bg-white/[0.04] text-white/45 border border-white/[0.06] rounded-full text-[11px] px-2.5">
                          {ROLE_LABELS[role]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-mono text-[11px] text-white/15 uppercase tracking-wider">target roles</p>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.target_roles.map((role) => (
                        <Badge key={role} variant="secondary" className="font-mono bg-violet-500/[0.08] text-violet-400/70 border border-violet-500/[0.12] rounded-full text-[11px] px-2.5">
                          {ROLE_LABELS[role]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="h-px bg-white/[0.04]" />
                <div className="space-y-1">
                  <p className="font-mono text-[11px] text-white/15 uppercase tracking-wider">career goals</p>
                  <p className="text-white/45 text-sm leading-relaxed">{formData.prompt_text}</p>
                </div>
                {formData.resume_text && (
                  <>
                    <div className="h-px bg-white/[0.04]" />
                    <div className="space-y-1">
                      <p className="font-mono text-[11px] text-white/15 uppercase tracking-wider">resume</p>
                      <p className="text-white/45 text-sm line-clamp-3 leading-relaxed">{formData.resume_text}</p>
                    </div>
                  </>
                )}
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
                <p className="text-sm text-red-400 font-mono">{error}</p>
              </div>
            )}
          </div>

          <div className="px-8 py-4 border-t border-white/[0.04] flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 1}
              className="text-white/20 hover:text-white/50 hover:bg-white/[0.04] cursor-pointer rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back
            </Button>
            {step < totalSteps ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="rounded-lg bg-white text-[#09090B] hover:bg-white/90 cursor-pointer px-6 font-medium transition-colors"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-lg bg-violet-500 text-white hover:bg-violet-400 cursor-pointer px-6 font-medium transition-all duration-200 shadow-[0_0_20px_rgba(167,139,250,0.2)]"
              >
                {loading ? "Creating..." : "Complete Setup"}
                {!loading && <Check className="w-4 h-4 ml-1.5" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
