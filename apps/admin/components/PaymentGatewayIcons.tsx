import Image from "next/image";
import { CreditCard } from "lucide-react";
import type { PaymentGateway } from "@/lib/api/settings";

const GATEWAY_ICON_SRC: Record<Exclude<PaymentGateway, "none">, string> = {
  zarinpal: "/assets/svgs/zarinpal.svg",
  zibal: "/assets/svgs/zibal.svg",
  sep: "/assets/svgs/sep.svg",
  pasargad: "/assets/svgs/pasargad.svg",
  mellat: "/assets/svgs/mellat.svg",
  irankish: "/assets/svgs/irankish.svg",
};

const GATEWAY_ICON_LABEL: Record<Exclude<PaymentGateway, "none">, string> = {
  zarinpal: "Zarinpal",
  zibal: "Zibal",
  sep: "SEP Saman",
  pasargad: "Pasargad PEP",
  mellat: "Bank Mellat",
  irankish: "Tejarat / Iran Kish",
};

export function NoGatewayIcon({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink/8 text-ink-muted ${className ?? ""}`}
    >
      <CreditCard className="h-4 w-4" aria-hidden />
    </span>
  );
}

export function PaymentGatewayIcon({
  gateway,
  className,
}: {
  gateway: PaymentGateway;
  className?: string;
}) {
  if (gateway === "none") {
    return <NoGatewayIcon className={className} />;
  }

  return (
    <Image
      src={GATEWAY_ICON_SRC[gateway]}
      alt={GATEWAY_ICON_LABEL[gateway]}
      width={32}
      height={32}
      className={`h-8 w-8 shrink-0 object-contain ${className ?? ""}`}
      unoptimized
    />
  );
}
