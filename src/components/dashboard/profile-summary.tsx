import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { ROLE_LABELS, LEVEL_LABELS, type Role, type Level } from "@/lib/utils/constants";

interface ProfileSummaryProps {
  name: string | null;
  email: string;
  currentRoles: Role[];
  targetRoles: Role[];
  currentLevel: Level;
  targetLevel: Level;
  extractedSkills: string[];
  learningGoals: string[];
}

export function ProfileSummary({
  name,
  email,
  currentRoles,
  targetRoles,
  currentLevel,
  targetLevel,
  extractedSkills,
  learningGoals,
}: ProfileSummaryProps) {
  return (
    <div className="gradient-border rounded-xl overflow-hidden bg-[#111113]">
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/[0.04]">
        <h2 className="text-[15px] font-semibold text-white">Profile</h2>
        <Link href="/onboarding">
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white/80 hover:bg-white/[0.04] cursor-pointer rounded-md h-7 text-xs">
            <Pencil className="w-3 h-3 mr-1.5" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <p className="text-base font-semibold text-white">{name ?? "Anonymous"}</p>
          <p className="font-mono text-xs text-white/60 mt-0.5">{email}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2.5">
            <p className="font-mono text-[11px] text-white/55 uppercase tracking-wider">current</p>
            <div className="flex flex-wrap gap-1.5">
              {currentRoles.map((role) => (
                <Badge key={role} variant="secondary" className="font-mono bg-white/[0.04] text-white/70 border border-white/[0.06] rounded-full text-[11px] px-2.5">
                  {ROLE_LABELS[role]}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-white/70">{LEVEL_LABELS[currentLevel]}</p>
          </div>
          <div className="space-y-2.5">
            <p className="font-mono text-[11px] text-white/55 uppercase tracking-wider">target</p>
            <div className="flex flex-wrap gap-1.5">
              {targetRoles.map((role) => (
                <Badge key={role} variant="secondary" className="font-mono bg-violet-500/[0.08] text-violet-400/80 border border-violet-500/[0.15] rounded-full text-[11px] px-2.5">
                  {ROLE_LABELS[role]}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-white/70">{LEVEL_LABELS[targetLevel]}</p>
          </div>
        </div>

        {extractedSkills.length > 0 && (
          <div className="space-y-2.5">
            <p className="font-mono text-[11px] text-white/55 uppercase tracking-wider">skills</p>
            <div className="flex flex-wrap gap-1.5">
              {extractedSkills.map((skill) => (
                <Badge key={skill} variant="outline" className="font-mono border-white/[0.06] text-white/70 rounded-full text-[11px] px-2.5">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {learningGoals.length > 0 && (
          <div className="space-y-2.5">
            <p className="font-mono text-[11px] text-white/55 uppercase tracking-wider">goals</p>
            <ul className="space-y-1.5">
              {learningGoals.map((goal) => (
                <li key={goal} className="text-sm text-white/70 flex items-start gap-2.5">
                  <span className="font-mono text-violet-400/60 mt-px select-none">-</span>
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
