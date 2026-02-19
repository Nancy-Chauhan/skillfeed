"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ROLES, ROLE_LABELS, type Role } from "@/lib/utils/constants";

interface RoleSelectorProps {
  selected: Role[];
  onChange: (roles: Role[]) => void;
  label: string;
}

export function RoleSelector({ selected, onChange, label }: RoleSelectorProps) {
  function toggleRole(role: Role) {
    if (selected.includes(role)) {
      onChange(selected.filter((r) => r !== role));
    } else {
      onChange([...selected, role]);
    }
  }

  return (
    <div className="space-y-3">
      <Label className="text-[13px] text-white/40">{label}</Label>
      <div className="grid grid-cols-2 gap-2">
        {ROLES.map((role) => (
          <label
            key={role}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
              selected.includes(role)
                ? "border-violet-500/30 bg-violet-500/[0.06]"
                : "border-white/[0.04] hover:border-white/[0.08]"
            }`}
          >
            <Checkbox
              checked={selected.includes(role)}
              onCheckedChange={() => toggleRole(role)}
            />
            <span className="text-sm text-white/60">{ROLE_LABELS[role]}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
