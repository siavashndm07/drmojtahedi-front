export type OralHistoryInterview = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  durationLabel: string;
  narrator: string;
  collection: string;
  description: string;
  transcriptExcerpt: string;
  source: string;
  /** Optional real media URL when digitized; null = UI-only mock player */
  audioSrc: string | null;
  relatedHref?: string;
  relatedLabel?: string;
  status: "published" | "coming-soon";
};

export const mockOralHistory: OralHistoryInterview[] = [
  {
    id: "oh-1",
    slug: "oral-history-interview",
    title: "مصاحبهٔ تاریخ شفاهی با دکتر مجتهدی",
    subtitle: "بنیاد مطالعات ایران · ۱۹۸۸",
    year: "۱۹۸۸",
    durationLabel: "حدود ۴۵ دقیقه",
    narrator: "دکتر محمدعلی مجتهدی گیلانی",
    collection: "تاریخ شفاهی ایران",
    description:
      "روایت خودِ مجتهدی از تحصیل در فرانسه، ریاست البرز و بنیان‌گذاری دانشگاه صنعتی شریف — ضبط‌شده در مجموعهٔ تاریخ شفاهی بنیاد مطالعات ایران.",
    transcriptExcerpt:
      "من همیشه به شاگردان می‌گفتم: به مملکت‌تان خدمت کنید. مدرسه و دانشگاه فقط برای مدرک نیست؛ برای ساختن آدم است…",
    source: "fis-iran.org / iranhistory.net",
    audioSrc: null,
    relatedHref: "/archive/oral-history-interview",
    relatedLabel: "آیتم آرشیو",
    status: "published",
  },
  {
    id: "oh-2",
    slug: "khaterat-mojtahedi-audio",
    title: "برخوانی از خاطرات دکتر مجتهدی",
    subtitle: "به کوشش حبیب لاجوردی",
    year: "۱۳۸۰",
    durationLabel: "نسخهٔ متنی · صوت به‌زودی",
    narrator: "بر پایهٔ مصاحبه با دکتر مجتهدی",
    collection: "خاطرات و تاریخ شفاهی",
    description:
      "متن تاریخ شفاهی منتشرشده؛ نسخهٔ صوتی پس از آماده‌سازی دیجیتال در همین بخش افزوده می‌شود.",
    transcriptExcerpt:
      "از لاهیجان تا سوربن، و از البرز تا شریف — مسیر یک معلم که آموزش را خدمت به کشور می‌دانست.",
    source: "انتشارات صفحه سفید / مرکز مطالعات خاورمیانه هاروارد",
    audioSrc: null,
    relatedHref: "/library/khaterat-dr-mojtahedi",
    relatedLabel: "کتاب خاطرات",
    status: "coming-soon",
  },
];
