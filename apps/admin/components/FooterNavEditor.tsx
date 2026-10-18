"use client";

import { useState } from "react";
import {
  Archive,
  BookOpen,
  Briefcase,
  Camera,
  CircleHelp,
  Clapperboard,
  Compass,
  FolderKanban,
  GraduationCap,
  HandHeart,
  Handshake,
  Home,
  Images,
  Landmark,
  MapPin,
  MessagesSquare,
  Newspaper,
  Plus,
  Scale,
  Search,
  Sparkles,
  Trash2,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import {
  FOOTER_ICON_IDS,
  FOOTER_ICON_LABELS,
  type FooterIconId,
  type FooterNavLink,
  type FooterNavSection,
} from "@drmojtahedi/shared";
import { Checkbox, Field, Input } from "@/components/form";

const ICONS: Record<FooterIconId, LucideIcon> = {
  home: Home,
  person: UserRound,
  biography: BookOpen,
  timeline: Compass,
  foundation: Landmark,
  charter: Scale,
  organs: Briefcase,
  students: GraduationCap,
  news: Newspaper,
  magazine: Newspaper,
  books: BookOpen,
  projects: FolderKanban,
  gallery: Images,
  photos: Camera,
  video: Clapperboard,
  collaborate: Handshake,
  memories: MessagesSquare,
  support: HandHeart,
  sponsors: HandHeart,
  contact: CircleHelp,
  search: Search,
  places: MapPin,
  archive: Archive,
  sparkles: Sparkles,
};

function newId() {
  return `f-${Math.random().toString(36).slice(2, 8)}`;
}

function IconSelect({
  id,
  value,
  onChange,
}: {
  id: string;
  value: FooterIconId;
  onChange: (next: FooterIconId) => void;
}) {
  const [open, setOpen] = useState(false);
  const Selected = ICONS[value] ?? Sparkles;

  return (
    <div className="relative">
      <button
        type="button"
        id={id}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-full items-center gap-2 rounded-xl border border-ink/10 bg-cream/30 px-3 text-sm text-ink transition hover:border-pine/30 dark:bg-surface/80"
      >
        <Selected className="h-4 w-4 shrink-0 text-pine" aria-hidden />
        <span className="truncate">{FOOTER_ICON_LABELS[value]}</span>
      </button>
      {open ? (
        <div
          role="listbox"
          aria-label="آیکون"
          className="absolute z-30 mt-1 grid max-h-56 w-56 grid-cols-2 gap-1 overflow-auto rounded-xl border border-ink/10 bg-surface p-2 shadow-lg"
        >
          {FOOTER_ICON_IDS.map((iconId) => {
            const Icon = ICONS[iconId];
            const active = iconId === value;
            return (
              <button
                key={iconId}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(iconId);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-start text-xs ${
                  active
                    ? "bg-pine text-white"
                    : "text-ink hover:bg-mint-soft/70 dark:hover:bg-mint/30"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="truncate">{FOOTER_ICON_LABELS[iconId]}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function FooterNavEditor({
  value,
  onChange,
}: {
  value: FooterNavSection[];
  onChange: (next: FooterNavSection[]) => void;
}) {
  function patchSection(index: number, patch: Partial<FooterNavSection>) {
    onChange(value.map((section, i) => (i === index ? { ...section, ...patch } : section)));
  }

  function patchLink(sectionIndex: number, linkIndex: number, patch: Partial<FooterNavLink>) {
    onChange(
      value.map((section, si) =>
        si !== sectionIndex
          ? section
          : {
              ...section,
              links: section.links.map((link, li) =>
                li === linkIndex ? { ...link, ...patch } : link,
              ),
            },
      ),
    );
  }

  function removeLink(sectionIndex: number, linkIndex: number) {
    onChange(
      value.map((section, si) =>
        si !== sectionIndex
          ? section
          : { ...section, links: section.links.filter((_, li) => li !== linkIndex) },
      ),
    );
  }

  function addLink(sectionIndex: number) {
    onChange(
      value.map((section, si) =>
        si !== sectionIndex
          ? section
          : {
              ...section,
              links: [
                ...section.links,
                { label: "", href: "/", icon: "sparkles" as const, enabled: true },
              ],
            },
      ),
    );
  }

  return (
    <div className="space-y-4">
      {value.map((section, sectionIndex) => (
        <div key={section.id} className="space-y-3 rounded-xl border border-ink/10 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Checkbox
              id={`footer-section-${section.id}`}
              label="نمایش این ستون در فوتر"
              checked={section.enabled}
              onChange={(e) => patchSection(sectionIndex, { enabled: e.target.checked })}
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, i) => i !== sectionIndex))}
              className="inline-flex items-center gap-1 text-xs text-ink-muted transition hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
              حذف ستون
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="عنوان ستون" htmlFor={`footer-title-${section.id}`}>
              <Input
                id={`footer-title-${section.id}`}
                value={section.title}
                onChange={(e) => patchSection(sectionIndex, { title: e.target.value })}
              />
            </Field>
            <Field label="آیکون ستون" htmlFor={`footer-icon-${section.id}`}>
              <IconSelect
                id={`footer-icon-${section.id}`}
                value={section.icon}
                onChange={(icon) => patchSection(sectionIndex, { icon })}
              />
            </Field>
          </div>
          <div className="space-y-2">
            {section.links.map((link, linkIndex) => (
              <div
                key={`${section.id}-${linkIndex}`}
                className="grid gap-2 rounded-lg border border-ink/5 p-3 md:grid-cols-[9rem_1fr_1fr_auto_auto] md:items-center"
              >
                <IconSelect
                  id={`footer-link-icon-${section.id}-${linkIndex}`}
                  value={link.icon}
                  onChange={(icon) => patchLink(sectionIndex, linkIndex, { icon })}
                />
                <Input
                  value={link.label}
                  placeholder="متن پیوند"
                  aria-label="متن پیوند"
                  onChange={(e) =>
                    patchLink(sectionIndex, linkIndex, { label: e.target.value })
                  }
                />
                <Input
                  value={link.href}
                  dir="ltr"
                  className="text-start"
                  placeholder="/path یا https://"
                  aria-label="آدرس پیوند"
                  onChange={(e) =>
                    patchLink(sectionIndex, linkIndex, { href: e.target.value })
                  }
                />
                <Checkbox
                  id={`footer-link-${section.id}-${linkIndex}`}
                  label="نمایش"
                  checked={link.enabled}
                  onChange={(e) =>
                    patchLink(sectionIndex, linkIndex, { enabled: e.target.checked })
                  }
                />
                <button
                  type="button"
                  aria-label="حذف پیوند"
                  onClick={() => removeLink(sectionIndex, linkIndex)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink-muted transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addLink(sectionIndex)}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-3 py-1.5 text-xs font-medium text-ink transition hover:border-pine/30"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            افزودن پیوند
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([
            ...value,
            {
              id: newId(),
              title: "ستون جدید",
              icon: "sparkles",
              enabled: true,
              links: [{ label: "", href: "/", icon: "sparkles", enabled: true }],
            },
          ])
        }
        className="inline-flex items-center gap-1.5 rounded-full bg-pine px-4 py-2 text-xs font-medium text-white transition hover:bg-pine-dark"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
        افزودن ستون
      </button>
    </div>
  );
}
