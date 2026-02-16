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
      <Label className="text-sm text-[#A3A3A3] font-medium">{label}</Label>
      <div className="grid grid-cols-2 gap-3">
        {ROLES.map((role) => (
          <label
            key={role}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              selected.includes(role)
                ? "border-[#00FF88]/30 bg-[#00FF88]/5"
                : "border-[#262626] bg-[#1A1A1A] hover:border-[#333]"
            }`}
          >
            <Checkbox
              checked={selected.includes(role)}
              onCheckedChange={() => toggleRole(role)}
            />
            <span className="text-sm text-white">{ROLE_LABELS[role]}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
