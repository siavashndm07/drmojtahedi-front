import type { Metadata } from "next";
import { OrgansDirectory } from "@/components/foundation/OrgansDirectory";
import { PageHero } from "@/components/shared/PageHero";
import { listOrganMembers } from "@/lib/api/foundation";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "ارکان بنیاد",
  description:
    "هیئت موسس، هیئت رئیسه، هیئت امناء، انواع عضویت و نمایندگان منطقه‌ای بنیاد.",
  path: "/foundation/organs",
});

export default async function OrgansPage() {
  const members = await listOrganMembers();

  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "معرفی بنیاد", href: "/foundation" },
          { label: "ارکان بنیاد" },
        ]}
        eyebrow="ساختار نهادی"
        title="ارکان بنیاد"
        description="به‌جای فهرست بلند در منو، همهٔ نقش‌ها در یک صفحه با فیلتر گروه‌بندی شده‌اند. جزئیات اسامی پس از تأیید رسمی تکمیل می‌شود."
      />
      <div className="content-shell section-pad !pt-8">
        <OrgansDirectory members={members} />
      </div>
    </div>
  );
}
