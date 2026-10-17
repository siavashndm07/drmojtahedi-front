import type { ComponentType, SVGProps } from "react";
import { FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";
import BaleIcon from "@/components/icons/social/BaleIcon";
import EitaaIcon from "@/components/icons/social/EitaaIcon";
import InstagramIcon from "@/components/icons/social/InstagramIcon";
import RubikaIcon from "@/components/icons/social/RubikaIcon";
import TelegramIcon from "@/components/icons/social/TelegramIcon";
import { siteConfig } from "@/config/site";

export type SocialLinkIcon = ComponentType<
  { size?: number; className?: string } & SVGProps<SVGSVGElement>
>;

export type SocialKey =
  | "instagram"
  | "telegram"
  | "whatsapp"
  | "twitter"
  | "linkedin"
  | "bale"
  | "eita"
  | "rubika";

export type FooterSocialLink = {
  id: SocialKey;
  label: string;
  labelFa: string;
  Icon: SocialLinkIcon;
};

export const FOOTER_SOCIAL_LINKS: FooterSocialLink[] = [
  { id: "instagram", label: "Instagram", labelFa: "اینستاگرام", Icon: InstagramIcon },
  { id: "telegram", label: "Telegram", labelFa: "تلگرام", Icon: TelegramIcon },
  { id: "whatsapp", label: "WhatsApp", labelFa: "واتساپ", Icon: FaWhatsapp },
  { id: "twitter", label: "X / Twitter", labelFa: "توییتر", Icon: FaTwitter },
  { id: "linkedin", label: "LinkedIn", labelFa: "لینکدین", Icon: FaLinkedin },
  { id: "bale", label: "Bale", labelFa: "بله", Icon: BaleIcon },
  { id: "eita", label: "Eitaa", labelFa: "ایتا", Icon: EitaaIcon },
  { id: "rubika", label: "Rubika", labelFa: "روبیکا", Icon: RubikaIcon },
];

export function resolveSocialHref(
  id: SocialKey,
  social?: Partial<Record<string, string>> | null,
): string {
  const fromApi = social?.[id]?.trim() ?? "";
  if (fromApi) return fromApi;
  return siteConfig.social[id]?.trim() ?? "";
}

export function getActiveSocialLinks(social?: Partial<Record<string, string>> | null) {
  return FOOTER_SOCIAL_LINKS.map((item) => ({
    ...item,
    href: resolveSocialHref(item.id, social),
  })).filter((item) => Boolean(item.href));
}
