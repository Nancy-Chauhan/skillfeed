"use client";

import { useState, useRef } from "react";
import { ROLE_LABELS, type Role } from "@/lib/utils/constants";
import { Plus, X } from "lucide-react";

interface RoleSelectorProps {
  roles: readonly Role[];
  selected: Role[];
  onChange: (roles: Role[]) => void;
  customRoles?: string[];
  onCustomRolesChange?: (roles: string[]) => void;
  label: string;
}

export function RoleSelector({
  roles,
  selected,
  onChange,
  customRoles = [],
  onCustomRolesChange,
  label,
}: RoleSelectorProps) {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function toggleRole(role: Role) {
    if (selected.includes(role)) {
      onChange(selected.filter((r) => r !== role));
    } else {
      onChange([...selected, role]);
    }
  }

  function addCustomRole() {
    const trimmed = inputValue.trim();
    if (!trimmed || !onCustomRolesChange) return;
    if (customRoles.includes(trimmed)) return;
    onCustomRolesChange([...customRoles, trimmed]);
    setInputValue("");
  }

  function removeCustomRole(role: string) {
    onCustomRolesChange?.(customRoles.filter((r) => r !== role));
  }

  function handleOpenInput() {
    setShowInput(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <div className="space-y-3">
      <p className="text-[13px] text-white/40">
        {label} <span className="text-white/15">— select all that apply</span>
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {roles.map((role, i) => (
          <button
            key={role}
            type="button"
            onClick={() => toggleRole(role)}
            style={{ animationDelay: `${i * 25}ms` }}
            className={`animate-pill-enter px-3 py-2.5 rounded-lg border text-sm font-medium cursor-pointer
              transition-all duration-200 active:scale-[0.97] ${
              selected.includes(role)
                ? "bg-violet-500 text-white border-violet-500 shadow-[0_0_12px_rgba(167,139,250,0.25)]"
                : "border-white/[0.08] text-white/40 hover:border-white/[0.15] hover:text-white/55"
            }`}
          >
            {ROLE_LABELS[role]}
          </button>
        ))}
      </div>

      {/* Custom roles */}
      {onCustomRolesChange && (
        <div className="space-y-2">
          {customRoles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500 text-white border border-violet-500 text-sm font-medium shadow-[0_0_12px_rgba(167,139,250,0.25)]"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => removeCustomRole(role)}
                    className="text-white/60 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {showInput ? (
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addCustomRole(); }
                  if (e.key === "Escape") { setShowInput(false); setInputValue(""); }
                }}
                onBlur={() => { if (!inputValue.trim()) setShowInput(false); }}
                placeholder="e.g. Platform Engineer"
                className="h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.03] text-white text-sm placeholder:text-white/15 focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 outline-none flex-1"
              />
              <button
                type="button"
                onClick={addCustomRole}
                disabled={!inputValue.trim()}
                className="h-9 px-3 rounded-lg bg-white/[0.06] text-white/40 hover:text-white/60 text-sm font-medium cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-default"
              >
                Add
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpenInput}
              className="inline-flex items-center gap-1.5 text-[13px] text-white/20 hover:text-white/40 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add your own
            </button>
          )}
        </div>
      )}
    </div>
  );
}
