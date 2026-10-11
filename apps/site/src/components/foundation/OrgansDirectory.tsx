"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { organGroupLabels } from "@/lib/mock/foundation";
import type { FoundationOrganMember, OrganGroup } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { toPersianDigits } from "@/lib/utils/digits";

type Filter = OrganGroup | "all";

export function OrgansDirectory({ members }: { members: FoundationOrganMember[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const base: Record<Filter, number> = {
      all: members.length,
      boards: 0,
      members: 0,
      representatives: 0,
      other: 0,
    };
    for (const m of members) base[m.group] += 1;
    return base;
  }, [members]);

  const visible = useMemo(
    () => (filter === "all" ? members : members.filter((m) => m.group === filter)),
    [filter, members],
  );

  const pills: Filter[] = ["all", "boards", "members", "representatives", "other"];

  return (
    <div className="space-y-8">
      <div
        className="inline-flex flex-wrap gap-2 rounded-full border border-ink/10 bg-surface p-1.5 shadow-sm"
        role="tablist"
        aria-label="فیلتر ارکان"
      >
        {pills.map((id) => {
          const active = filter === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                active
                  ? "bg-pine text-white shadow-sm"
                  : "text-ink-muted hover:bg-mint-soft hover:text-pine",
              )}
            >
              {organGroupLabels[id]}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px]",
                  active ? "bg-white/20 text-white" : "bg-ink/5 text-ink-muted",
                )}
              >
                {toPersianDigits(counts[id])}
              </span>
            </button>
          );
        })}
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((member) => (
          <li
            key={member.id}
            className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="pine">{member.role}</Badge>
                {member.status === "coming-soon" ? (
                  <Badge tone="placeholder">به‌زودی</Badge>
                ) : null}
              </div>
              <h3 className="mt-3 text-lg font-medium text-ink">{member.name}</h3>
              {member.location ? (
                <p className="mt-1 text-xs text-bronze">{member.location}</p>
              ) : null}
              {member.note ? (
                <p className="mt-3 text-sm leading-7 text-ink-muted">{member.note}</p>
              ) : null}
            </div>
            <p className="mt-4 text-xs text-ink-muted">{organGroupLabels[member.group]}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
