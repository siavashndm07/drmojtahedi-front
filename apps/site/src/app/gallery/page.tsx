import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Camera, Clapperboard, Images } from "lucide-react";
import { GatewayGrid } from "@/components/foundation/ContentCards";
import { PageHero } from "@/components/shared/PageHero";
import { listGalleries } from "@/lib/api/galleries";
import { toPersianDigits } from "@/lib/utils/digits";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "گالری",
  description: "آلبوم‌های تصویر و ویدئوی بنیاد فرهنگی دکتر مجتهدی.",
  path: "/gallery",
});

const gateways = [
  {
    href: "/archive/photographs",
    title: "عکس‌های آرشیو",
    description: "عکس‌های تاریخی و آثار اهدایی.",
    icon: Camera,
  },
  {
    href: "/archive/video",
    title: "ویدئوهای آرشیو",
    description: "فیلم و روایت‌های تصویری ثبت‌شده در آرشیو.",
    icon: Clapperboard,
  },
  {
    href: "/archive",
    title: "آرشیو کامل",
    description: "اسناد، صوت و سایر رسانه‌ها.",
    icon: Images,
  },
];

export default async function GalleryPage() {
  const albums = await listGalleries();

  return (
    <div>
      <PageHero
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "گالری" }]}
        eyebrow="آرشیو دیداری"
        title="گالری"
        description="آلبوم‌های تصویر و ویدئو، هر کدام با عنوان خودش."
      />
      <div className="content-shell section-pad !pt-8 space-y-12">
        {albums.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/15 px-4 py-12 text-center text-sm text-ink-muted">
            هنوز آلبومی منتشر نشده است.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <li key={album.id}>
                <Link
                  href={`/gallery/${album.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm transition hover:-translate-y-0.5 hover:border-pine/40 hover:shadow-card"
                >
                  <div className="relative aspect-[16/10] bg-mint-soft">
                    {album.coverUrl ? (
                      <Image
                        src={album.coverUrl}
                        alt={album.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-pine">
                        {album.kind === "videos" ? (
                          <Clapperboard className="size-8" />
                        ) : (
                          <Images className="size-8" />
                        )}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs text-pine">
                      {album.kind === "videos" ? "ویدئو" : "تصاویر"} ·{" "}
                      {toPersianDigits(album.itemCount)} مورد
                    </p>
                    <h2 className="mt-2 text-lg font-medium group-hover:text-pine">
                      {album.title}
                    </h2>
                    {album.description ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-7 text-ink-muted">
                        {album.description}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div>
          <h2 className="text-display mb-6 text-2xl">آرشیو تاریخی</h2>
          <GatewayGrid items={gateways} />
        </div>
      </div>
    </div>
  );
}
