import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GalleryAlbum from "@/components/gallery/GalleryAlbum";
import { PageHero } from "@/components/shared/PageHero";
import { getGallery } from "@/lib/api/galleries";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await getGallery(slug);
  if (!album) {
    return buildPageMetadata({
      title: "گالری یافت نشد",
      path: `/gallery/${slug}`,
    });
  }
  return buildPageMetadata({
    title: album.title,
    description: album.description || album.title,
    path: `/gallery/${album.id}`,
  });
}

export default async function GalleryDetailPage({ params }: Props) {
  const { slug } = await params;
  const album = await getGallery(slug);
  if (!album) notFound();

  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "گالری", href: "/gallery" },
          { label: album.title },
        ]}
        eyebrow={album.kind === "videos" ? "ویدئو" : "تصاویر"}
        title={album.title}
        description={album.description || undefined}
        actions={
          <Link
            href="/gallery"
            className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
          >
            همه گالری‌ها
          </Link>
        }
      />
      <div className="content-shell section-pad !pt-8">
        <GalleryAlbum title={album.title} kind={album.kind} items={album.items ?? []} />
      </div>
    </div>
  );
}
