import Image from "next/image";
import { CreditCard } from "lucide-react";

const GATEWAY_ICON_SRC: Record<string, string> = {
  zarinpal: "/assets/svgs/zarinpal.svg",
  zibal: "/assets/svgs/zibal.svg",
  sep: "/assets/svgs/sep.svg",
  pasargad: "/assets/svgs/pasargad.svg",
  mellat: "/assets/svgs/mellat.svg",
  irankish: "/assets/svgs/irankish.svg",
};

export function PaymentGatewayIcon({
  gateway,
  className,
}: {
  gateway: string;
  className?: string;
}) {
  const src = GATEWAY_ICON_SRC[gateway];
  if (!src) {
    return (
      <span
        className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-ink/8 text-ink-muted ${className ?? ""}`}
      >
        <CreditCard className="size-4" aria-hidden />
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={32}
      height={32}
      className={`size-8 shrink-0 object-contain ${className ?? ""}`}
      unoptimized
    />
  );
}
