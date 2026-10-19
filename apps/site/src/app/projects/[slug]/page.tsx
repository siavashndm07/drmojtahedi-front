import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  FolderKanban,
  Handshake,
  MapPin,
  Milestone,
} from "lucide-react";
import { ProjectProgress } from "@/components/foundation/ProjectProgress";
import { FadeIn } from "@/components/shared/FadeIn";
import {
  getProject,
  listProjects,
  relatedProjects,
} from "@/lib/api/foundation";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { toPersianDigits } from "@/lib/utils/digits";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await listProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    return buildPageMetadata({
      title: "پروژه یافت نشد",
      path: `/projects/${slug}`,
    });
  }
  return buildPageMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const [project, all] = await Promise.all([getProject(slug), listProjects()]);
  if (!project) notFound();

  const related = relatedProjects(all, project.id);
  const coverSrc = project.heroImage?.src;
  const relatedHref =
    project.href &&
    project.href !== "/projects" &&
    !project.href.startsWith(`/projects/${project.slug}`)
      ? project.href
      : null;

  return (
    <div>
      <header className="relative isolate min-h-[22rem] overflow-hidden bg-pine sm:min-h-[26rem] lg:min-h-[28rem]">
        {coverSrc ? (
          <div className="absolute inset-0">
            <Image
              src={coverSrc}
              alt={project.heroImage?.alt || project.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-pine-dark via-pine to-[#1a3d3a]" />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/20"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-l from-pine/35 to-transparent mix-blend-multiply"
          aria-hidden
        />

        <div className="content-wide relative flex min-h-[22rem] flex-col justify-end pb-8 pt-6 sm:min-h-[26rem] sm:pb-10 lg:min-h-[28rem] lg:pb-12">
          <nav aria-label="مسیر" className="mb-6 text-xs text-white/75">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-white">
                  خانه
                </Link>
              </li>
              <li aria-hidden className="text-white/40">
                /
              </li>
              <li>
                <Link href="/projects" className="transition hover:text-white">
                  پروژه‌های بنیاد
                </Link>
              </li>
              <li aria-hidden className="text-white/40">
                /
              </li>
              <li className="line-clamp-1 text-white/90">{project.title}</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-white/85">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-medium backdrop-blur-sm">
                <FolderKanban className="size-3.5" aria-hidden />
                پروژه
              </span>
              {project.phase ? (
                <span className="inline-flex items-center gap-1">
                  <Milestone className="size-3.5" aria-hidden />
                  {project.phase}
                </span>
              ) : null}
              {project.location ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" aria-hidden />
                  {project.location}
                </span>
              ) : null}
              {project.status === "coming-soon" ? (
                <span className="rounded-full bg-white/15 px-3 py-1 font-medium backdrop-blur-sm">
                  به‌زودی
                </span>
              ) : null}
            </div>

            <h1 className="text-display mt-4 text-3xl leading-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              {project.title}
            </h1>
            {project.description ? (
              <p className="mt-4 max-w-2xl text-sm leading-8 text-white/85 sm:text-base">
                {project.description}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <div className="border-b border-ink/10 bg-cream/60 dark:bg-surface/40">
        <div className="content-wide flex flex-wrap items-center justify-between gap-3 py-3 text-xs text-ink-muted">
          <div className="flex flex-wrap items-center gap-3">
            {project.phase ? (
              <span className="inline-flex items-center gap-1.5">
                <Milestone className="size-3.5 text-mint-deep" aria-hidden />
                {project.phase}
              </span>
            ) : null}
            {project.location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5 text-mint-deep" aria-hidden />
                {project.location}
              </span>
            ) : null}
          </div>
          <Link
            href="/collaborate"
            className="inline-flex items-center gap-1.5 font-medium text-pine transition hover:text-pine-dark"
          >
            <Handshake className="size-3.5" aria-hidden />
            همکاری با بنیاد
          </Link>
        </div>
      </div>

      <article className="content-wide pb-8 pt-10 lg:pb-12 lg:pt-12">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_18rem] xl:gap-16">
          <div className="min-w-0">
            <FadeIn>
              <div className="relative overflow-hidden rounded-2xl border border-pine/15 bg-gradient-to-br from-mint-soft/80 to-surface p-6 dark:from-mint/30 sm:p-7">
                <div
                  className="absolute -start-6 -top-6 size-24 rounded-full bg-mint/30 blur-2xl"
                  aria-hidden
                />
                <div className="relative">
                  <p className="text-xs font-semibold tracking-wide text-mint-deep">
                    دربارهٔ پروژه
                  </p>
                  {project.description ? (
                    <p className="mt-3 text-justify text-base leading-9 text-ink sm:text-[1.05rem] sm:leading-10">
                      {project.description}
                    </p>
                  ) : null}
                  <ProjectProgress
                    value={project.progressPercent}
                    className="mt-6 max-w-md"
                  />
                </div>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="mt-10 space-y-6 text-sm leading-8 text-ink-muted sm:text-[0.95rem] sm:leading-9">
                <p className="text-justify">
                  این پروژه بخشی از برنامه‌های فرهنگی، آموزشی و عمرانی بنیاد
                  فرهنگی دکتر مجتهدی است. هدف، پاسداشت میراث آموزشی ایشان و ایجاد
                  فضاهایی برای آموزش، پژوهش و دسترسی عمومی به اسناد و آثار مرتبط
                  است.
                </p>
                <p className="text-justify">
                  برای همراهی، پیشنهاد همکاری، یا دریافت جزئیات بیشتر می‌توانید از
                  صفحهٔ همکاری و حمایت با بنیاد در ارتباط باشید.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="mt-10 flex flex-col gap-3 border-t border-ink/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/projects"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-pine/35 hover:text-pine sm:w-auto"
                >
                  <ArrowLeft className="size-4 rotate-180" aria-hidden />
                  بازگشت به پروژه‌ها
                </Link>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  {relatedHref ? (
                    <Link
                      href={relatedHref}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-pine/35 hover:text-pine sm:w-auto"
                    >
                      ادامهٔ مرتبط
                      <ArrowLeft className="size-4" aria-hidden />
                    </Link>
                  ) : null}
                  <Link
                    href="/support"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-pine px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pine-dark sm:w-auto"
                  >
                    حمایت از بنیاد
                    <ArrowLeft className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </FadeIn>

            {project.source ? (
              <p className="mt-6 text-xs text-ink-muted">منبع: {project.source}</p>
            ) : null}
          </div>

          <aside className="mt-12 hidden lg:block lg:self-stretch">
            <div className="sticky top-24 max-h-[calc(100vh-6.5rem)] space-y-6 overflow-y-auto overscroll-contain pb-2 [scrollbar-width:thin]">
              <div className="rounded-2xl border border-ink/10 bg-surface p-5">
                <p className="text-xs font-semibold text-ink">اطلاعات</p>
                <dl className="mt-3 space-y-2.5 text-xs text-ink-muted">
                  {project.phase ? (
                    <div className="flex justify-between gap-3">
                      <dt>مرحله</dt>
                      <dd className="font-medium text-ink">{project.phase}</dd>
                    </div>
                  ) : null}
                  {project.location ? (
                    <div className="flex justify-between gap-3">
                      <dt>مکان</dt>
                      <dd className="font-medium text-ink">{project.location}</dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between gap-3">
                    <dt>وضعیت</dt>
                    <dd className="font-medium text-ink">
                      {project.status === "coming-soon" ? "به‌زودی" : "فعال"}
                    </dd>
                  </div>
                  {project.progressPercent != null ? (
                    <div className="flex justify-between gap-3">
                      <dt>پیشرفت</dt>
                      <dd className="font-medium tabular-nums text-ink" dir="ltr">
                        {toPersianDigits(project.progressPercent)}٪
                      </dd>
                    </div>
                  ) : null}
                </dl>
                <ProjectProgress
                  value={project.progressPercent}
                  showLabel={false}
                  className="mt-4"
                />
              </div>

              <div className="overflow-hidden rounded-2xl border border-pine/15">
                <div className="bg-pine p-5 text-white">
                  <p className="inline-flex items-center gap-2 text-xs font-semibold text-white/70">
                    <Handshake className="size-3.5" aria-hidden />
                    همراهی
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-7">
                    می‌توانید در پیشبرد این پروژه با بنیاد همراه شوید.
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      href="/collaborate"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-mint-soft transition hover:text-white"
                    >
                      همکاری
                      <ArrowLeft className="size-3.5" aria-hidden />
                    </Link>
                    <Link
                      href="/support"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-mint-soft transition hover:text-white"
                    >
                      حمایت
                      <ArrowLeft className="size-3.5" aria-hidden />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 ? (
          <FadeIn>
            <section className="mt-16 border-t border-ink/10 pt-12 lg:mt-20">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">ادامه</p>
                  <h2 className="text-display mt-2 text-2xl text-ink">
                    پروژه‌های دیگر
                  </h2>
                </div>
                <Link
                  href="/projects"
                  className="text-sm font-semibold text-mint-deep transition hover:text-pine"
                >
                  همه پروژه‌ها
                </Link>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/projects/${item.slug}`}
                    className="group grid overflow-hidden rounded-3xl border border-pine/10 bg-surface shadow-sm transition hover:-translate-y-0.5 hover:border-pine/35 hover:shadow-card sm:grid-cols-[9rem_1fr]"
                  >
                    <div className="relative aspect-[16/10] bg-mint-soft sm:aspect-auto sm:min-h-full">
                      {item.heroImage?.src ? (
                        <Image
                          src={item.heroImage.src}
                          alt={item.heroImage.alt || item.title}
                          fill
                          sizes="200px"
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-col justify-center p-5">
                      {item.phase ? (
                        <p className="text-[11px] font-medium text-mint-deep">
                          {item.phase}
                        </p>
                      ) : null}
                      <h3 className="mt-2 font-bold leading-7 text-ink transition group-hover:text-mint-deep">
                        {item.title}
                      </h3>
                      {item.description ? (
                        <p className="mt-2 line-clamp-2 text-xs leading-6 text-ink-muted">
                          {item.description}
                        </p>
                      ) : null}
                      <ProjectProgress
                        value={item.progressPercent}
                        size="sm"
                        className="mt-3"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </FadeIn>
        ) : null}
      </article>
    </div>
  );
}
