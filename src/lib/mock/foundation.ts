import type {
  AssessmentProgram,
  CollaborateOption,
  EducationProgram,
  FoundationOrganMember,
  FoundationProject,
  LibraryItem,
  Sponsor,
} from "@/lib/types";

/**
 * Seed content adapted from the public pages of drmojtahedi.com
 * (معرفی بنیاد، اساس‌نامه، ارکان، اخبار، تماس، پروژه‌ها، مرکز ارزیابی).
 */

export const mockFoundationIntro = {
  title: "بنیاد فرهنگی دکتر مجتهدی، عام‌المنفعه",
  legalName: "موسسه فرهنگی هنری بنیاد دکترمحمدعلی مجتهدی گیلانی",
  tagline: "به مملکت‌تان خدمت کنید",
  foundedYear: "۱۳۹۴",
  registrationNumber: "۳۶۹۸۲",
  nationalId: "۱۴۰۰۵۲۹۲۴۱۰",
  licenseNumber: "۵۸۰۷",
  licenseDate: "۱۳۹۴/۰۸/۱۱",
  summary:
    "بنیاد دکتر محمدعلی مجتهدی گیلانی در سال ۱۳۹۴ همزمان با سالروز ولادت حضرت رضا (ع) توسط هیئت مؤسسی از دوستان، همشهریان و دانش‌آموختگان دبیرستان البرز و دانشگاه صنعتی شریف در تهران پایه‌گذاری شد.",
  history:
    "موضوع تأسیس بنیاد سال‌ها نقل محافل فرهنگی و دانشگاهی بود و در نهایت با همت دانش‌آموختگان البرز و شریف به تحقق پیوست. بنیاد با گرایش فرهنگی و هنری (چندمنظوره) در ادارهٔ ثبت شرکت‌ها و مؤسسات غیرتجاری ثبت شد و مجوز فعالیت از وزارت فرهنگ و ارشاد اسلامی دریافت کرد.",
  sections: [
    {
      id: "mission",
      title: "مأموریت",
      body: "استفاده از تجربیات دانش‌آموختگان مکتب دکتر مجتهدی برای افزایش سطح معلومات دانش‌آموزان و دانشجویان، ارتقای دانش و بینش عمومی، اشاعهٔ فرهنگ و هنر اصیل، و سازماندهی دست‌پروردگان او در مراکز آموزشی وابسته.",
    },
    {
      id: "programs",
      title: "برنامه‌ها",
      body: "اعطای جایزه و نشان علمی‌فرهنگی، بورسیه و حمایت مالی از نخبگان، تأسیس و تجهیز مراکز فرهنگی و آموزشی، و همکاری برای ایجاد مجتمع و موزه — به‌ویژه در لاهیجان.",
    },
    {
      id: "pillars",
      title: "ارکان فعالیت",
      body: "یکی از چهار رکن بنیاد، توسعهٔ سرمایه‌های اجتماعی و فعالیت‌های آموزشی است (انسان‌افزاری): ارزیابی روان‌سنجی، مربیگری، مشاوره و آموزش.",
    },
  ],
} as const;

/** اساس‌نامه — خلاصهٔ فصول بر اساس متن منتشرشدهٔ اساسنامهٔ رسمی */
export const mockCharterChapters = [
  {
    id: "identity",
    title: "نام، نوع و تابعیت",
    body: "نام مؤسسه «موسسه فرهنگی هنری بنیاد دکترمحمدعلی مجتهدی‌گیلانی» است. بنیاد با اهداف فرهنگی، غیرتجاری، غیرسیاسی و غیرصنفی تأسیس شده و غیرانتفاعی است؛ سرمایه و تابعیت آن ایرانی است.",
  },
  {
    id: "address",
    title: "نشانی و مدت فعالیت",
    body: "نشانی: تهران، خیابان شهید کلاهدوز، چهارراه قنات، خیابان رحمانی، پلاک ۱۳ — کدپستی ۱۹۵۱۷۳۳۱۶۴. مدت فعالیت از تاریخ صدور مجوز تا تأیید وزارت فرهنگ و ارشاد اسلامی است.",
  },
  {
    id: "objectives",
    title: "اهداف",
    body: "افزایش معلومات دانش‌آموزان و دانشجویان؛ ارتقای دانش و بینش عمومی؛ اشاعهٔ فرهنگ و هنر اصیل؛ سازماندهی دانش‌آموختگان مجتهدی؛ اعطای جایزه و بورسیه؛ تأسیس مراکز فرهنگی؛ همکاری برای مجتمع و موزه به‌ویژه در لاهیجان.",
  },
  {
    id: "activities",
    title: "موضوع فعالیت‌ها",
    body: "اطلاع‌رسانی و بانک‌های اطلاعاتی؛ گردآوری مستندات فرهنگی‌تاریخی؛ پژوهش؛ همایش و نمایشگاه؛ نشر و عرضهٔ محصولات فرهنگی؛ تولید فیلم و محتوای آموزشی؛ دوره‌های آموزشی مهارتی فرهنگی‌هنری.",
  },
  {
    id: "finance",
    title: "سرمایه و منابع درآمد",
    body: "سرمایهٔ اولیه از سوی مؤسسان تأمین شد. منابع درآمد شامل فعالیت‌های بنیاد، کمک افراد و سازمان‌ها، موقوفات، حق عضویت، فروش نشریات و خدمات، و سایر منابع مصوب هیئت موسس است.",
  },
  {
    id: "structure",
    title: "ارکان",
    body: "ارکان بنیاد مطابق اساس‌نامه شامل هیئت موسس، هیئت امناء، هیئت رئیسه و سایر نقش‌های تعریف‌شده است. جزئیات اعضا در صفحهٔ ارکان بنیاد آمده است.",
  },
] as const;

export const mockOrganMembers: FoundationOrganMember[] = [
  {
    id: "org-ashtari",
    name: "بهزاد اشتری",
    role: "عضو هیئت موسس",
    group: "boards",
    note: "کارشناسی ارشد علوم سیاسی · فارغ‌التحصیل ۱۳۴۵ دبیرستان البرز",
    status: "published",
  },
  {
    id: "org-anisipour",
    name: "حسین انیسی‌پور",
    role: "عضو هیئت موسس",
    group: "boards",
    note: "فارغ‌التحصیل ۱۳۴۵ دبیرستان ماندگار البرز",
    status: "published",
  },
  {
    id: "org-sharifi",
    name: "حمید شریفی",
    role: "عضو هیئت موسس",
    group: "boards",
    note: "دکترای داروسازی · فارغ‌التحصیل ۴۸–۴۹ دبیرستان البرز",
    status: "published",
  },
  {
    id: "org-shiri",
    name: "مهندس محمود شیری",
    role: "عضو هیئت موسس",
    group: "boards",
    note: "کارشناسی مهندسی متالورژی · از شاگردان نخستین دورهٔ دانشگاه صنعتی شریف (۱۳۴۵)؛ جایگزین آقای طبیب‌زاده‌نوری از ۱۴۰۰/۰۲/۰۸",
    status: "published",
  },
  {
    id: "org-mahjoobi",
    name: "استاد حسین محجوبی اصیل",
    role: "عضو هیئت موسس",
    group: "boards",
    note: "نقاش · فارغ‌التحصیل ۱۳۳۱ دبیرستان البرز؛ اهداکنندهٔ آثار «حرکت و زندگی» و «برج البرز»",
    status: "published",
  },
  {
    id: "org-mehdipour",
    name: "محمدحسین مهدی‌پور",
    role: "عضو هیئت موسس",
    group: "boards",
    note: "از مؤسسان بنیاد؛ تماس رسمی بنیاد از طریق روابط عمومی",
    status: "published",
  },
  {
    id: "org-yavarzadeh",
    name: "نعمت‌الله یاورزاده",
    role: "عضو هیئت موسس",
    group: "boards",
    note: "از مؤسسان بنیاد فرهنگی دکتر مجتهدی",
    status: "published",
  },
  {
    id: "org-sabet",
    name: "ابراهیم ثابت",
    role: "بازرس قانونی",
    group: "other",
    note: "بازرس قانونی بنیاد؛ امضاکنندهٔ توافقنامهٔ اهدای آثار محجوبی",
    status: "published",
  },
  {
    id: "org-board",
    name: "هیئت رئیسه",
    role: "هیئت رئیسه",
    group: "boards",
    note: "فهرست کامل اعضا به‌تدریج از سامانهٔ ارکان تکمیل می‌شود.",
    status: "coming-soon",
  },
  {
    id: "org-trustees",
    name: "هیئت امناء",
    role: "هیئت امناء",
    group: "boards",
    note: "نظارت عالی بر سیاست‌های بنیاد.",
    status: "coming-soon",
  },
  {
    id: "org-continuous",
    name: "اعضای پیوسته",
    role: "عضو پیوسته",
    group: "members",
    note: "عضویت فعال و مستمر مطابق اساس‌نامه.",
    status: "coming-soon",
  },
  {
    id: "org-honorary",
    name: "اعضای افتخاری",
    role: "عضو افتخاری",
    group: "members",
    status: "coming-soon",
  },
  {
    id: "org-affiliate",
    name: "اعضای وابسته",
    role: "عضو وابسته",
    group: "members",
    status: "coming-soon",
  },
  {
    id: "org-legal",
    name: "اعضای حقوقی",
    role: "عضو حقوقی",
    group: "members",
    status: "coming-soon",
  },
  {
    id: "org-chabahar",
    name: "نمایندهٔ بنیاد در چابهار",
    role: "نمایندهٔ منطقه‌ای",
    group: "representatives",
    location: "چابهار",
    note: "هماهنگی برنامه‌ها و توافق‌های منطقه‌ای در مکران.",
    status: "published",
  },
  {
    id: "org-hamedan",
    name: "نمایندهٔ بنیاد در استان همدان",
    role: "نمایندهٔ منطقه‌ای",
    group: "representatives",
    location: "همدان",
    status: "coming-soon",
  },
  {
    id: "org-iranshahr",
    name: "نمایندهٔ بنیاد در ایرانشهر",
    role: "نمایندهٔ منطقه‌ای",
    group: "representatives",
    location: "ایرانشهر",
    status: "coming-soon",
  },
  {
    id: "org-complex-council",
    name: "شورای برنامه‌ریزی مجتمع فرهنگی گردشگری",
    role: "شورای برنامه‌ریزی",
    group: "other",
    note: "برنامه‌ریزی مجموعهٔ فرهنگی گردشگری دکتر مجتهدی.",
    status: "published",
  },
];

export const organGroupLabels: Record<
  FoundationOrganMember["group"] | "all",
  string
> = {
  all: "همه",
  boards: "هیئت‌ها",
  members: "انواع عضویت",
  representatives: "نمایندگان",
  other: "سایر ارکان",
};

export const mockBooks: LibraryItem[] = [
  {
    id: "book-khedmat",
    slug: "be-mamlekatoon-khedmat-konid",
    title: "به مملکتتون خدمت کنید",
    description:
      "کتاب ارزشمند برگرفته از خاطرات و گفتارهای دکتر مجتهدی؛ چاپ ششم در آستانهٔ انتشار (اعلام بنیاد، اردیبهشت ۱۴۰۳).",
    author: "دکتر محمدعلی مجتهدی گیلانی",
    year: "چاپ ششم · ۱۴۰۳",
    itemType: "book",
    status: "published",
    source: "روابط عمومی بنیاد · drmojtahedi.com",
  },
  {
    id: "book-khaterat",
    slug: "khaterat-dr-mojtahedi",
    title: "خاطرات دکتر محمدعلی مجتهدی",
    description:
      "متن تاریخ شفاهی به کوشش حبیب لاجوردی — مصاحبه با مجتهدی در مجموعهٔ تاریخ شفاهی ایران (چاپ خرداد ۱۳۸۰).",
    author: "حبیب لاجوردی · تاریخ شفاهی ایران",
    year: "۱۳۸۰ / ۲۰۰۰",
    itemType: "book",
    status: "published",
    source: "مرکز مطالعات خاورمیانه هاروارد",
  },
  {
    id: "book-alborz",
    slug: "sadename-alborz",
    title: "سده‌نامهٔ دبیرستان البرز",
    description: "مرجع تاریخی دربارهٔ البرز و دوران ریاست دکتر مجتهدی.",
    author: "مجموعهٔ نویسندگان",
    year: "۱۳۵۴",
    itemType: "book",
    status: "published",
    source: "چاپ اقبال",
  },
  {
    id: "book-articles",
    slug: "maghalat-mojtahedi",
    title: "مقالات و گفتارها",
    description:
      "مجموعهٔ در حال گردآوری از مقالات مرتبط با آموزش، مدیریت مدرسه و تأسیس دانشگاه — بخش مقالات سایت پیشین بنیاد.",
    itemType: "article",
    status: "coming-soon",
    source: "آرشیو بنیاد",
  },
];

export const mockProjects: FoundationProject[] = [
  {
    id: "proj-memorial",
    slug: "khane-farhangi-va-yadman",
    title: "خانهٔ فرهنگی و بنای یادمانی دکتر مجتهدی",
    description:
      "پروژهٔ خانهٔ فرهنگی و بنای یادمان — از جمله پیگیری مقدمات ساخت یادمان و موزه در لاهیجان یا تهران؛ ایدهٔ تابلوی «برج البرز» استاد محجوبی برای یادمان در تپه‌های اطراف لاهیجان.",
    phase: "پیگیری و برنامه‌ریزی",
    location: "لاهیجان / تهران",
    href: "/complex",
    coverTone: "pine",
    status: "published",
    source: "پروژه‌های بنیاد · drmojtahedi.com",
  },
  {
    id: "proj-complex",
    slug: "majmooe-farhangi",
    title: "مجموعهٔ فرهنگی گردشگری دکتر مجتهدی",
    description:
      "موزه، پارک، آمفی‌تئاتر، کتابخانه و فضاهای آموزشی در چارچوب چشم‌انداز مجتمع فرهنگی گردشگری.",
    phase: "طراحی و معرفی",
    location: "در حال برنامه‌ریزی",
    href: "/complex",
    coverTone: "bronze",
    status: "published",
    source: "بنیاد فرهنگی دکتر مجتهدی",
  },
  {
    id: "proj-assessment",
    slug: "markaz-arzyabi",
    title: "مرکز ارزیابی و توسعهٔ مدیران",
    description:
      "مرکز تخصصی با همکاری انجمن مدیریت منابع انسانی ایران برای سنجش استعداد و سبک رهبری و توسعهٔ مدیران.",
    phase: "فعال",
    location: "تهران",
    href: "/education/assessment",
    coverTone: "ink",
    status: "published",
    source: "مرکز ارزیابی بنیاد",
  },
  {
    id: "proj-skills",
    slug: "markaz-tosee-maharat",
    title: "مرکز توسعهٔ مهارت و سرمایهٔ اجتماعی",
    description:
      "رکن انسان‌افزاری بنیاد: ارزیابی روان‌سنجی، مربیگری، مشاوره و آموزش — با همکاری شرکت آروین.",
    phase: "فعال",
    href: "/education",
    coverTone: "pine",
    status: "published",
    source: "خدمات آموزشی بنیاد",
  },
  {
    id: "proj-chabahar",
    slug: "tavafoghname-chabahar",
    title: "توافقنامهٔ منطقهٔ آزاد چابهار",
    description:
      "همکاری بنیاد با سازمان منطقهٔ آزاد چابهار؛ پیگیری نحوهٔ اجرای توافقنامه از سوی شورای عالی مناطق آزاد.",
    phase: "پیگیری اجرا",
    location: "چابهار",
    href: "/projects",
    coverTone: "bronze",
    status: "published",
    source: "اخبار بنیاد · مهر ۱۴۰۲",
  },
  {
    id: "proj-digital",
    slug: "platform-digital-miras",
    title: "پلتفرم دیجیتال میراث",
    description:
      "آرشیو، زندگی‌نامه، مجله، اخبار و رویدادها روی بستر وب برای دسترسی عمومی.",
    phase: "MVP منتشرشده",
    href: "/",
    coverTone: "pine",
    status: "published",
    source: "روابط عمومی بنیاد",
  },
];

export const mockAssessment: AssessmentProgram = {
  id: "assessment-center",
  slug: "markaz-arzyabi-modiran",
  title: "مرکز ارزیابی و توسعهٔ مدیران",
  description:
    "بر اساس رسالت بنیاد در توسعهٔ سرمایه‌های انسانی و اجتماعی و شعار «به مملکت‌تان خدمت کنید»، این مرکز با همکاری انجمن مدیریت منابع انسانی ایران ایجاد شده است. ارزیابی‌های لازم برای بررسی استعداد و سبک رهبری فراهم است و با گزارش تحلیلی جامع مشخص می‌شود هر فرد برای چه مدیریتی، در چه شرایطی و سطحی آمادگی دارد.",
  audience: "سازمان‌ها و شرکت‌ها برای انتخاب یا توسعهٔ مدیران؛ افراد علاقه‌مند به شناخت استعداد رهبری",
  outcomes: [
    "گزارش تحلیلی جامع استعداد و سبک رهبری",
    "شناخت نقاط قابل بهبود برای نقش مدیریتی فعلی",
    "پشتیبانی از انتخاب و تحول مدیران سازمانی",
    "پیوند با مرکز توسعهٔ مهارت و سرمایهٔ اجتماعی بنیاد",
  ],
  status: "published",
  source: "eEvaluationCenter · drmojtahedi.com",
};

export const mockEducationPrograms: EducationProgram[] = [
  {
    id: "edu-skills-center",
    slug: "markaz-tosee-maharat",
    title: "مرکز توسعهٔ مهارت و سرمایهٔ اجتماعی",
    description:
      "یکی از چهار رکن فعالیت بنیاد؛ تمرکز بر انسان‌افزاری از طریق ارزیابی روان‌سنجی، مربیگری، مشاوره و آموزش.",
    programType: "resource",
    audience: "جوانان، مدیران و علاقه‌مندان توسعهٔ فردی",
    status: "published",
    source: "LearningArchive · ۱۳۹۸/۰۶/۰۳",
  },
  {
    id: "edu-courses-catalog",
    slug: "fehrest-doreha",
    title: "فهرست دوره‌های آموزشی",
    description: "کاتالوگ دوره‌های مهارتی و فرهنگی بنیاد — جزئیات از آرشیو آموزشی سایت پیشین.",
    programType: "course",
    audience: "عموم علاقه‌مندان",
    status: "coming-soon",
    source: "LearningArchive",
  },
  {
    id: "edu-assessment-link",
    slug: "arzyabi-modiran",
    title: "ارزیابی مدیران",
    description: "مسیر ورود به مرکز ارزیابی و توسعهٔ مدیران.",
    programType: "workshop",
    audience: "مدیران و سازمان‌ها",
    status: "published",
    source: "بنیاد",
  },
];

export const mockCollaborateOptions: CollaborateOption[] = [
  {
    id: "col-volunteer",
    slug: "davtalabi",
    title: "همکاری داوطلبانه",
    description: "همراهی در رویدادها، آرشیو، راهنمایی بازدید و برنامه‌های آموزشی.",
    kind: "volunteer",
    status: "published",
  },
  {
    id: "col-partner",
    slug: "sherakat-sazmani",
    title: "شراکت سازمانی",
    description: "همکاری دانشگاه‌ها، انجمن‌ها و مؤسسات فرهنگی با بنیاد.",
    kind: "partner",
    status: "published",
  },
  {
    id: "col-research",
    slug: "hamkari-pazhoheshi",
    title: "همکاری پژوهشی",
    description: "پروژه‌های مشترک دربارهٔ تاریخ آموزش، البرز و شریف.",
    kind: "research",
    status: "published",
  },
  {
    id: "col-artifact",
    slug: "ehdaye-asar",
    title: "اهدای سند و اثر",
    description:
      "سپردن عکس، سند، کتاب یا اثر هنری — مانند اهدای آثار استاد محجوبی برای یادمان و موزه.",
    kind: "donate-artifact",
    status: "published",
  },
  {
    id: "col-corporate",
    slug: "hamyari-sherkati",
    title: "حمایت شرکتی",
    description: "اسپانسرشیپ برنامه‌ها و پروژه‌های عام‌المنفعهٔ بنیاد.",
    kind: "corporate",
    status: "published",
  },
];

export const mockSponsors: Sponsor[] = [
  {
    id: "sp-bina",
    slug: "bina-pardazesh-gil",
    title: "بینا پردازش گیل",
    description: "حامی سازمانی بنیاد.",
    kind: "organization",
    logoLabel: "بینا",
    status: "published",
  },
  {
    id: "sp-ghaderi",
    slug: "kambiz-ghaderi",
    title: "آقای دکتر کامبیز قادری",
    description: "حامی گرامی بنیاد.",
    kind: "individual",
    logoLabel: "ک.ق",
    status: "published",
  },
  {
    id: "sp-makran",
    slug: "majma-yavaran-makran",
    title: "مجمع یاوران فرهنگ و اندیشه مکران",
    description: "حامی سازمانی برنامه‌های مکران.",
    kind: "organization",
    logoLabel: "مکران",
    status: "published",
  },
  {
    id: "sp-montaser",
    slug: "ardeshir-montaser",
    title: "دکتر اردشیر منتصرکوهساری",
    description: "حامی گرامی بنیاد.",
    kind: "individual",
    logoLabel: "ا.م",
    status: "published",
  },
  {
    id: "sp-sotoudeh",
    slug: "khosrow-sotoudeh",
    title: "آقای خسرو ستوده",
    description: "حامی گرامی بنیاد.",
    kind: "individual",
    logoLabel: "خ.س",
    status: "published",
  },
  {
    id: "sp-parandian",
    slug: "zohreh-parandian",
    title: "سرکار خانم زهره پرندیان",
    description: "حامی گرامی بنیاد.",
    kind: "individual",
    logoLabel: "ز.پ",
    status: "published",
  },
  {
    id: "sp-arvin",
    slug: "sherkat-arvin",
    title: "شرکت آروین",
    description: "مجری مرکز توسعه مهارت و سرمایه اجتماعی؛ حامی سازمانی.",
    kind: "organization",
    logoLabel: "آروین",
    status: "published",
  },
];

/** لینک‌ها و دوستان — از فوتر سایت پیشین */
export const mockPartnerLinks = [
  {
    id: "pl-alborz-alumni",
    title: "جامعه فارغ‌التحصیلان دبیرستان ماندگار البرز",
    href: "https://drmojtahedi.com/",
  },
  {
    id: "pl-sharif",
    title: "دانشگاه صنعتی شریف",
    href: "https://www.sharif.edu/",
  },
  {
    id: "pl-ut-engineers",
    title: "کانون مهندسان فارغ‌التحصیل دانشگاه تهران",
    href: "https://drmojtahedi.com/",
  },
  {
    id: "pl-sharif-alumni",
    title: "انجمن فارغ‌التحصیلان دانشگاه صنعتی شریف",
    href: "https://drmojtahedi.com/",
  },
  {
    id: "pl-alborz",
    title: "دبیرستان ماندگار البرز",
    href: "https://drmojtahedi.com/",
  },
  {
    id: "pl-ut",
    title: "دانشگاه تهران",
    href: "https://ut.ac.ir/",
  },
  {
    id: "pl-arvin",
    title: "آروین، مجری مرکز توسعه مهارت و سرمایه اجتماعی",
    href: "https://drmojtahedi.com/",
  },
  {
    id: "pl-hr",
    title: "انجمن مدیریت منابع انسانی ایران",
    href: "https://drmojtahedi.com/",
  },
  {
    id: "pl-aut",
    title: "دانشگاه صنعتی امیرکبیر",
    href: "https://aut.ac.ir/",
  },
  {
    id: "pl-nethami",
    title: "موسسه حامیان اشتغال و کارآفرینی، نت حامی",
    href: "https://drmojtahedi.com/",
  },
  {
    id: "pl-saeetek",
    title: "شرکت مشاوران نوآوری و فناوری ساعی‌تک",
    href: "https://drmojtahedi.com/",
  },
] as const;
