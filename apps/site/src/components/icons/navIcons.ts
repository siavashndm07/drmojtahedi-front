import type { LucideIcon } from "lucide-react";
import {
  Archive,
  AudioLines,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  Camera,
  CircleHelp,
  Clapperboard,
  Compass,
  Construction,
  FileText,
  FolderKanban,
  GraduationCap,
  HandHeart,
  Handshake,
  Home,
  Images,
  Landmark,
  Languages,
  Library,
  MapPin,
  Menu,
  MessagesSquare,
  Mic,
  Mountain,
  Newspaper,
  Scale,
  Search,
  Sparkles,
  Theater,
  Trees,
  UserRound,
  Users,
  X,
} from "lucide-react";

export type NavIconName =
  | "home"
  | "person"
  | "about"
  | "biography"
  | "timeline"
  | "legacy"
  | "heritage"
  | "people"
  | "places"
  | "institutions"
  | "foundation"
  | "charter"
  | "organs"
  | "students"
  | "museum"
  | "collections"
  | "exhibitions"
  | "visit"
  | "complex"
  | "facilities"
  | "architecture"
  | "park"
  | "amphitheater"
  | "construction"
  | "events"
  | "news"
  | "education"
  | "courses"
  | "workshops"
  | "resources"
  | "assessment"
  | "projects"
  | "collaborate"
  | "sponsors"
  | "gallery"
  | "books"
  | "archive"
  | "documents"
  | "photos"
  | "audio"
  | "video"
  | "oralHistory"
  | "library"
  | "magazine"
  | "search"
  | "support"
  | "memories"
  | "contact"
  | "menu"
  | "close"
  | "language"
  | "sparkles";

export const navIcons: Record<NavIconName, LucideIcon> = {
  home: Home,
  person: UserRound,
  about: CircleHelp,
  biography: BookOpen,
  timeline: Compass,
  legacy: Sparkles,
  heritage: Landmark,
  people: Users,
  places: MapPin,
  institutions: Building2,
  foundation: Landmark,
  charter: Scale,
  organs: Briefcase,
  students: GraduationCap,
  museum: Landmark,
  collections: Archive,
  exhibitions: Sparkles,
  visit: MapPin,
  complex: Building2,
  facilities: Compass,
  architecture: Mountain,
  park: Trees,
  amphitheater: Theater,
  construction: Construction,
  events: CalendarDays,
  news: Newspaper,
  education: GraduationCap,
  courses: BookOpen,
  workshops: MessagesSquare,
  resources: FileText,
  assessment: Sparkles,
  projects: FolderKanban,
  collaborate: Handshake,
  sponsors: HandHeart,
  gallery: Images,
  books: BookOpen,
  archive: Archive,
  documents: FileText,
  photos: Camera,
  audio: AudioLines,
  video: Clapperboard,
  oralHistory: Mic,
  library: Library,
  magazine: Newspaper,
  search: Search,
  support: HandHeart,
  memories: MessagesSquare,
  contact: CircleHelp,
  menu: Menu,
  close: X,
  language: Languages,
  sparkles: Sparkles,
};

export function getNavIcon(name?: NavIconName): LucideIcon {
  if (!name) return CircleHelp;
  return navIcons[name] ?? CircleHelp;
}
