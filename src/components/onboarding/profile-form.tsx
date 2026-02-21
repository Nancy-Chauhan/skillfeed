"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RoleSelector } from "./role-selector";
import { LevelSelector } from "./level-selector";
import { ArrowLeft, ArrowRight, Loader2, Check } from "lucide-react";
import { CURRENT_ROLES, TARGET_ROLES, LEVELS, type Role, type Level } from "@/lib/utils/constants";

interface FormData {
  name: string;
  prompt_text: string;
  current_roles: Role[];
  target_roles: Role[];
  current_level: Level | null;
  target_level: Level | null;
}

interface ExistingProfile {
  id: string;
  current_roles: Role[];
  target_roles: Role[];
  current_level: Level;
  target_level: Level;
  prompt_text: string | null;
}

interface ProfileFormProps {
  defaultName?: string;
  defaultEmail?: string;
  redirectTo?: string;
  existingProfile?: ExistingProfile;
}

export function ProfileForm({
  defaultName = "",
  defaultEmail = "",
  redirectTo = "/waitlist",
  existingProfile,
}: ProfileFormProps) {
  const router = useRouter();
  const isEdit = !!existingProfile;
  const [step, setStep] = useState(isEdit ? 1 : 0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: defaultName,
    prompt_text: existingProfile?.prompt_text ?? "",
    current_roles: existingProfile?.current_roles ?? [],
    target_roles: existingProfile?.target_roles ?? [],
    current_level: existingProfile?.current_level ?? null,
    target_level: existingProfile?.target_level ?? null,
  });
  const [customCurrentRoles, setCustomCurrentRoles] = useState<string[]>([]);
  const [customTargetRoles, setCustomTargetRoles] = useState<string[]>([]);

  const totalSteps = 2;

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function canProceed(): boolean {
    switch (step) {
      case 0:
        return true;
      case 1:
        return (formData.current_roles.length > 0 || customCurrentRoles.length > 0)
          && formData.current_level !== null;
      case 2:
        return (formData.target_roles.length > 0 || customTargetRoles.length > 0)
          && formData.target_level !== null
          && formData.prompt_text.trim().length > 0;
      default:
        return false;
    }
  }

  function goToStep(target: number) {
    setDirection(target > step ? 1 : -1);
    setStep(target);
  }

  function handleNext() {
    if (step < totalSteps && canProceed()) goToStep(step + 1);
  }

  function handleBack() {
    if (step > 0) goToStep(step - 1);
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      // Fold custom roles into prompt_text so the AI parser can extract context
      const parts: string[] = [];
      if (customCurrentRoles.length > 0) {
        parts.push(`My current roles also include: ${customCurrentRoles.join(", ")}.`);
      }
      if (customTargetRoles.length > 0) {
        parts.push(`I also want to transition into: ${customTargetRoles.join(", ")}.`);
      }
      parts.push(formData.prompt_text);
      const promptText = parts.join(" ");

      const payload = {
        name: formData.name.trim() || undefined,
        prompt_text: promptText,
        current_roles: formData.current_roles,
        target_roles: formData.target_roles,
        current_level: formData.current_level ?? undefined,
        target_level: formData.target_level ?? undefined,
      };

      const res = isEdit
        ? await fetch(`/api/users/${existingProfile.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  const firstName = defaultName.trim().split(/\s+/)[0];
  const greeting = firstName || defaultEmail || "there";

  const questionSteps = [
    {
      title: "What do you do?",
      subtitle: "Select everything that fits your current work.",
    },
    {
      title: "Where do you want to be?",
      subtitle: "Pick your targets and tell us your goals — our AI handles the rest.",
    },
  ];

  const animStyle = { "--step-direction": `${direction * 20}px` } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4 pt-16 sm:pt-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-500/[0.03] blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <span className="font-mono text-sm font-semibold text-white tracking-tight">
            skillfeed<span className="text-violet-400">_</span>
          </span>
        </div>

        {/* Progress bar — hidden on welcome screen */}
        {step > 0 && (
          <div className="mb-10 max-w-[200px] mx-auto">
            <div className="h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Card */}
        <div className="gradient-border rounded-xl overflow-hidden bg-white/[0.02]">
          {/* Welcome screen (step 0) */}
          {step === 0 && (
            <div
              key="content-0"
              className="px-6 sm:px-8 py-12 text-center animate-step-enter"
              style={animStyle}
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Welcome, {greeting}!
              </h1>
              <p className="text-sm text-white/60 mt-3 max-w-md mx-auto">
                Just a few quick questions to personalize your feed — takes less than 2 minutes.
              </p>
              <Button
                onClick={handleNext}
                className="mt-8 rounded-lg bg-white text-[#09090B] hover:bg-white/90 cursor-pointer px-8 py-2.5 font-medium transition-colors text-base"
              >
                Let&apos;s go
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Question steps (1 & 2) */}
          {step > 0 && (
            <>
              {/* Header — animated per step */}
              <div className="px-6 sm:px-8 pt-8 pb-2">
                <h1
                  key={`title-${step}`}
                  className="text-2xl sm:text-3xl font-bold text-white tracking-tight animate-step-enter"
                  style={animStyle}
                >
                  {questionSteps[step - 1].title}
                </h1>
                <p
                  key={`sub-${step}`}
                  className="text-sm text-white/60 mt-2 animate-step-enter"
                  style={{ ...animStyle, animationDelay: "40ms" }}
                >
                  {questionSteps[step - 1].subtitle}
                </p>
              </div>

              {/* Content — animated per step */}
              <div
                key={`content-${step}`}
                className="px-6 sm:px-8 py-6 space-y-6 min-h-[220px] animate-step-enter"
                style={{ ...animStyle, animationDelay: "70ms" }}
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <RoleSelector
                      roles={CURRENT_ROLES}
                      selected={formData.current_roles}
                      onChange={(roles) => update("current_roles", roles)}
                      customRoles={customCurrentRoles}
                      onCustomRolesChange={setCustomCurrentRoles}
                      label="Your roles"
                    />
                    <LevelSelector
                      levels={LEVELS}
                      selected={formData.current_level}
                      onChange={(level) => update("current_level", level)}
                      label="Your level"
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <RoleSelector
                      roles={TARGET_ROLES}
                      selected={formData.target_roles}
                      onChange={(roles) => update("target_roles", roles)}
                      customRoles={customTargetRoles}
                      onCustomRolesChange={setCustomTargetRoles}
                      label="Target roles"
                    />
                    <LevelSelector
                      levels={LEVELS}
                      selected={formData.target_level}
                      onChange={(level) => update("target_level", level)}
                      label="Target level"
                    />
                    <div className="space-y-2">
                      <p className="text-[13px] text-white/70">Your background & goals</p>
                      <Textarea
                        id="prompt"
                        placeholder={"e.g. I'm a backend engineer with 3 years of experience in Python and Go. I want to move into ML engineering — specifically building and deploying production ML systems..."}
                        value={formData.prompt_text}
                        onChange={(e) => update("prompt_text", e.target.value)}
                        rows={4}
                        className="rounded-lg border-white/[0.06] focus:border-violet-500/40 bg-white/[0.03] text-white placeholder:text-white/50 resize-none focus:ring-1 focus:ring-violet-500/20"
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
                    <p className="text-sm text-red-400 font-mono">{error}</p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="px-6 sm:px-8 py-4 border-t border-white/[0.04] flex justify-between">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={step === 0}
                  className={`text-white/60 hover:text-white/80 hover:bg-white/[0.04] cursor-pointer rounded-lg ${step === 0 ? "invisible" : ""}`}
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Back
                </Button>
                {step < totalSteps ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="rounded-lg bg-white text-[#09090B] hover:bg-white/90 cursor-pointer px-6 font-medium transition-colors"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !canProceed()}
                    className="rounded-lg bg-violet-500 text-white hover:bg-violet-400 cursor-pointer px-6 font-medium transition-all duration-200 shadow-[0_0_20px_rgba(167,139,250,0.2)]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                        {isEdit ? "Saving..." : "Joining..."}
                      </>
                    ) : (
                      <>
                        {isEdit ? "Save Changes" : "Join Waitlist"}
                        <Check className="w-4 h-4 ml-1.5" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
