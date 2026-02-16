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
import { Zap, ArrowLeft, ArrowRight, Check } from "lucide-react";
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

  const stepSubtitles = [
    "We'll personalize your newsletter based on this",
    "Tell us about your current experience",
    "Help us match articles to your career goals",
    "Make sure everything looks good",
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#00FF88]/10 border border-[#00FF88]/20 flex items-center justify-center neon-box-glow">
            <Zap className="w-4 h-4 text-[#00FF88]" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-semibold text-white tracking-tight">
            SkillFeed
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    i + 1 < step
                      ? "bg-[#00FF88] text-[#0A0A0A]"
                      : i + 1 === step
                        ? "bg-white text-[#0A0A0A]"
                        : "bg-[#1A1A1A] text-[#525252] border border-[#262626]"
                  }`}
                >
                  {i + 1 < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`hidden sm:block w-16 md:w-28 h-0.5 rounded-full transition-colors ${
                    i + 1 < step ? "bg-[#00FF88]" : "bg-[#262626]"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#141414] rounded-2xl border border-[#262626] overflow-hidden" style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.03)' }}>
          {/* Step header */}
          <div className="px-8 pt-8 pb-2">
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              {stepTitles[step - 1]}
            </h1>
            <p className="text-sm text-[#525252] mt-1">
              {stepSubtitles[step - 1]}
            </p>
          </div>

          <div className="px-8 py-6 space-y-6">
            {/* Step 1: Basics */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm text-[#A3A3A3] font-medium">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="h-12 rounded-xl border-[#262626] focus:border-[#00FF88]/50 bg-[#1A1A1A] text-white placeholder:text-[#525252]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-[#A3A3A3] font-medium">Email</Label>
                  <Input
                    value={formData.email}
                    disabled
                    className="h-12 rounded-xl border-[#262626] bg-[#0A0A0A] text-[#525252]"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Current State */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="resume" className="text-sm text-[#A3A3A3] font-medium">
                    Resume or background <span className="text-[#525252] font-normal">(optional)</span>
                  </Label>
                  <Textarea
                    id="resume"
                    placeholder="Paste your resume or describe your experience..."
                    value={formData.resume_text}
                    onChange={(e) => update("resume_text", e.target.value)}
                    rows={4}
                    className="rounded-xl border-[#262626] focus:border-[#00FF88]/50 bg-[#1A1A1A] text-white placeholder:text-[#525252] resize-none"
                  />
                </div>
                <RoleSelector
                  selected={formData.current_roles}
                  onChange={(roles) => update("current_roles", roles)}
                  label="Current roles"
                />
                <div className="space-y-3">
                  <Label className="text-sm text-[#A3A3A3] font-medium">Current level</Label>
                  <RadioGroup
                    value={formData.current_level}
                    onValueChange={(v) => update("current_level", v as Level)}
                    className="flex gap-3"
                  >
                    {LEVELS.map((level) => (
                      <label
                        key={level}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all text-sm ${
                          formData.current_level === level
                            ? "border-[#00FF88]/30 bg-[#00FF88]/5 text-white"
                            : "border-[#262626] bg-[#1A1A1A] text-[#737373] hover:border-[#333]"
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

            {/* Step 3: Future State */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-sm text-[#A3A3A3] font-medium">
                    Who do you want to become?
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe your career goals, what you want to learn, where you see yourself in 1-2 years..."
                    value={formData.prompt_text}
                    onChange={(e) => update("prompt_text", e.target.value)}
                    rows={4}
                    className="rounded-xl border-[#262626] focus:border-[#00FF88]/50 bg-[#1A1A1A] text-white placeholder:text-[#525252] resize-none"
                  />
                </div>
                <RoleSelector
                  selected={formData.target_roles}
                  onChange={(roles) => update("target_roles", roles)}
                  label="Target roles"
                />
                <div className="space-y-3">
                  <Label className="text-sm text-[#A3A3A3] font-medium">Target level</Label>
                  <RadioGroup
                    value={formData.target_level}
                    onValueChange={(v) => update("target_level", v as Level)}
                    className="flex gap-3"
                  >
                    {LEVELS.map((level) => (
                      <label
                        key={level}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all text-sm ${
                          formData.target_level === level
                            ? "border-[#00FF88]/30 bg-[#00FF88]/5 text-white"
                            : "border-[#262626] bg-[#1A1A1A] text-[#737373] hover:border-[#333]"
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

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-[#525252] uppercase tracking-wider">Name</p>
                    <p className="text-white font-medium">{formData.name}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-[#525252] uppercase tracking-wider">Email</p>
                    <p className="text-[#A3A3A3]">{formData.email}</p>
                  </div>
                </div>
                <div className="h-px bg-[#262626]" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-[#525252] uppercase tracking-wider">Current roles</p>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.current_roles.map((role) => (
                        <Badge key={role} variant="secondary" className="bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20 rounded-lg text-xs">
                          {ROLE_LABELS[role]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-[#525252] uppercase tracking-wider">Target roles</p>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.target_roles.map((role) => (
                        <Badge key={role} variant="secondary" className="bg-[#A78BFA]/10 text-[#A78BFA] border border-[#A78BFA]/20 rounded-lg text-xs">
                          {ROLE_LABELS[role]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="h-px bg-[#262626]" />
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-[#525252] uppercase tracking-wider">Career goals</p>
                  <p className="text-[#A3A3A3] text-sm leading-relaxed">{formData.prompt_text}</p>
                </div>
                {formData.resume_text && (
                  <>
                    <div className="h-px bg-[#262626]" />
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-[#525252] uppercase tracking-wider">Resume</p>
                      <p className="text-[#A3A3A3] text-sm line-clamp-3 leading-relaxed">{formData.resume_text}</p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="px-8 py-5 border-t border-[#262626] flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 1}
              className="text-[#525252] hover:text-white cursor-pointer rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back
            </Button>
            {step < totalSteps ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="rounded-xl bg-white text-[#0A0A0A] hover:bg-white/90 cursor-pointer px-6 font-semibold"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-xl bg-[#00FF88] text-[#0A0A0A] hover:bg-[#00FF88]/90 cursor-pointer px-6 font-semibold shadow-[0_0_20px_rgba(0,255,136,0.15)]"
              >
                {loading ? "Creating your profile..." : "Complete Setup"}
                {!loading && <Check className="w-4 h-4 ml-1.5" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
