import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Briefcase, Target, Code2, Lightbulb } from "lucide-react";
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
    <div className="bg-[#141414] rounded-2xl border border-[#262626] overflow-hidden" style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.03)' }}>
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-[#262626]">
        <h2 className="text-lg font-semibold text-white">Your Profile</h2>
        <Link href="/onboarding">
          <Button variant="ghost" size="sm" className="text-[#525252] hover:text-white hover:bg-[#1A1A1A] cursor-pointer rounded-lg">
            <Pencil className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="p-6 space-y-6">
        {/* Name & Email */}
        <div>
          <p className="text-lg font-medium text-white">{name ?? "Anonymous"}</p>
          <p className="text-sm text-[#525252] mt-0.5">{email}</p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-[#00FF88]" />
              <p className="text-xs font-medium text-[#525252] uppercase tracking-wider">Current</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentRoles.map((role) => (
                <Badge key={role} variant="secondary" className="bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20 rounded-lg text-xs font-medium">
                  {ROLE_LABELS[role]}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-[#A3A3A3]">{LEVEL_LABELS[currentLevel]}</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-[#A78BFA]" />
              <p className="text-xs font-medium text-[#525252] uppercase tracking-wider">Target</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {targetRoles.map((role) => (
                <Badge key={role} variant="secondary" className="bg-[#A78BFA]/10 text-[#A78BFA] border border-[#A78BFA]/20 rounded-lg text-xs font-medium">
                  {ROLE_LABELS[role]}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-[#A3A3A3]">{LEVEL_LABELS[targetLevel]}</p>
          </div>
        </div>

        {/* Skills */}
        {extractedSkills.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-[#22D3EE]" />
              <p className="text-xs font-medium text-[#525252] uppercase tracking-wider">Skills</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {extractedSkills.map((skill) => (
                <Badge key={skill} variant="outline" className="border-[#262626] text-[#A3A3A3] bg-[#1A1A1A] rounded-lg text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Learning Goals */}
        {learningGoals.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-[#F59E0B]" />
              <p className="text-xs font-medium text-[#525252] uppercase tracking-wider">Learning Goals</p>
            </div>
            <ul className="space-y-1.5">
              {learningGoals.map((goal) => (
                <li key={goal} className="text-sm text-[#A3A3A3] flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#333] mt-1.5 shrink-0" />
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
