import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/shared/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { Badge } from "@/components/ui/Badge";
import { getPerson, listPeople } from "@/lib/api/people";
import { listNews } from "@/lib/api/news";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

const kindLabels: Record<string, string> = {
  student: "شاگرد",
  colleague: "همکار",
  founder: "مؤسس",
  family: "خانواده",
  organ: "ارکان",
  other: "مرتبط",
};

export async function generateStaticParams() {
  const people = await listPeople();
  return people.map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const person = await getPerson(slug);
  if (!person) {
    return buildPageMetadata({
      title: "فرد یافت نشد",
      path: `/heritage/people/${slug}`,
    });
  }
  return buildPageMetadata({
    title: person.name || person.title,
    description: person.description,
    path: `/heritage/people/${person.slug}`,
  });
}

export default async function PersonPage({ params }: Props) {
  const { slug } = await params;
  const [person, people, news] = await Promise.all([
    getPerson(slug),
    listPeople(),
    listNews(),
  ]);
  if (!person) notFound();

  const displayName = person.name || person.title;
  const relatedPeople = people
    .filter((p) => p.id !== person.id && p.kind === person.kind)
    .slice(0, 3);
  const relatedNews = news
    .filter((item) => {
      const blob = `${item.title} ${item.description ?? ""}`;
      return (
        blob.includes(person.name) ||
        blob.includes(person.title) ||
        (person.name.split(" ").pop()
          ? blob.includes(person.name.split(" ").pop()!)
          : false)
      );
    })
    .slice(0, 3);

  return (
    <div>
      <PageHero
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "میراث و تاریخ", href: "/heritage" },
          { label: "افراد", href: "/heritage/people" },
          { label: displayName },
        ]}
        eyebrow={person.kind ? kindLabels[person.kind] : "فرد"}
        title={displayName}
        description={person.description}
        statusLabel={person.status === "coming-soon" ? "به‌زودی" : undefined}
        actions={
          <>
            <Link
              href="/heritage/people"
              className="inline-flex rounded-lg border border-ink/10 bg-surface px-5 py-3 text-sm font-medium hover:border-pine/40"
            >
              همه افراد
            </Link>
            {person.kind === "student" ? (
              <Link
                href="/heritage/students"
                className="inline-flex rounded-lg bg-pine px-5 py-3 text-sm font-medium text-white hover:bg-pine-dark"
              >
                شاگردان
              </Link>
            ) : null}
          </>
        }
      />
      <div className="content-shell section-pad !pt-8 space-y-8">
        <FadeIn>
          <article className="mx-auto max-w-3xl rounded-2xl border border-ink/10 bg-surface p-6 md:p-8">
            <div className="flex flex-wrap gap-2">
              {person.role ? <Badge tone="pine">{person.role}</Badge> : null}
              {person.relationship ? (
                <Badge tone="bronze">{person.relationship}</Badge>
              ) : null}
            </div>
            {person.biography ? (
              <p className="mt-6 text-base leading-9 text-ink-muted">
                {person.biography}
              </p>
            ) : person.description ? (
              <p className="mt-6 text-base leading-9 text-ink-muted">
                {person.description}
              </p>
            ) : null}
            {person.source ? (
              <p className="mt-6 text-xs text-ink-muted">منبع: {person.source}</p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3 border-t border-ink/10 pt-6 text-sm">
              <Link href="/about/timeline" className="font-semibold text-pine hover:underline">
                خط زمان
              </Link>
              <Link href="/about/biography" className="font-semibold text-pine hover:underline">
                زندگی‌نامه
              </Link>
              <Link href="/contribute" className="font-semibold text-pine hover:underline">
                ارسال خاطره مرتبط
              </Link>
            </div>
          </article>
        </FadeIn>

        {relatedPeople.length > 0 ? (
          <FadeIn>
            <section className="mx-auto max-w-3xl">
              <h2 className="text-display text-xl text-ink">افراد مرتبط</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {relatedPeople.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/heritage/people/${p.slug}`}
                      className="block rounded-xl border border-ink/10 bg-surface px-4 py-3 text-sm transition hover:border-pine/35"
                    >
                      <span className="font-medium text-ink">{p.name}</span>
                      {p.role ? (
                        <span className="mt-1 block text-xs text-ink-muted">{p.role}</span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </FadeIn>
        ) : null}

        {relatedNews.length > 0 ? (
          <FadeIn>
            <section className="mx-auto max-w-3xl">
              <h2 className="text-display text-xl text-ink">اخبار مرتبط</h2>
              <ul className="mt-4 space-y-2">
                {relatedNews.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/news/${item.slug}`}
                      className="block rounded-xl border border-ink/10 bg-surface px-4 py-3 text-sm transition hover:border-pine/35"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </FadeIn>
        ) : null}
      </div>
    </div>
  );
}
