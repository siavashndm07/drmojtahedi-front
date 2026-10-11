import { apiFetch, ApiError } from "@/lib/api/client";
import { isApiEnabled } from "@/lib/api/config";

export type AiChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AiChatConfig = {
  enabled: boolean;
  welcomeMessage: string;
};

const MOCK_WELCOME =
  "سلام! من دستیار بنیاد فرهنگی دکتر مجتهدی هستم. دربارهٔ زندگی‌نامه، اخبار، پروژه‌ها، گالری یا عضویت بپرسید.";

function mockReply(messages: AiChatMessage[]): string {
  const last =
    [...messages].reverse().find((m) => m.role === "user")?.content.trim() ??
    "";
  const q = last.toLowerCase();

  if (!last) {
    return "سؤالتان را بنویسید تا راهنمایی کنم.";
  }
  if (/عضویت|عضو|ثبت.?نام|حساب/.test(q)) {
    return "برای عضویت به صفحهٔ «عضویت» بروید و از حساب کاربری، پروفایل و حق عضویت را تکمیل کنید. ورود با پیامک از دکمهٔ حساب در هدر در دسترس است.";
  }
  if (/کمک|حمایت|اهدا|donate|donation|بلاعوض/.test(q)) {
    return "برای کمک بلاعوض می‌توانید از صفحهٔ «حمایت» یا «کمک بلاعوض» در حساب کاربری اقدام کنید. سوابق کمک‌ها هم در همان بخش قابل مشاهده است.";
  }
  if (/خبر|اخبار|news/.test(q)) {
    return "تازه‌های بنیاد در بخش «اخبار» منتشر می‌شود. از صفحهٔ اصلی یا منوی منابع می‌توانید به فهرست اخبار بروید.";
  }
  if (/مقاله|مجله|magazine|article/.test(q)) {
    return "مقالات تحریری در بخش «مجله» هستند؛ از منوی منابع یا پیش‌نمایش مجله در صفحهٔ اصلی وارد شوید.";
  }
  if (/آرشیو|عکس|ویدئو|سند|گالری/.test(q)) {
    return "آرشیو دیجیتال و گالری تصاویر/ویدئو در بخش‌های «آرشیو» و «گالری» قرار دارند. جزئیات هر آیتم با عنوان فارسی در مسیر صفحه نمایش داده می‌شود.";
  }
  if (/زندگی.?نامه|بیوگرافی|مجتهدی|البرز|شریف|لاهیجان|خط.?زمان/.test(q)) {
    return "روایت زندگی دکتر مجتهدی در «زندگی‌نامه» و «خط زمان» آمده است. میراث و بنیاد هم از منوی «دکتر مجتهدی» در دسترس است.";
  }
  if (/تماس|آدرس|تلفن|ایمیل|contact/.test(q)) {
    return "راه‌های ارتباطی در صفحهٔ «تماس» آمده است. برای پشتیبانی مستقیم همان صفحه را ببینید.";
  }
  if (/پروژه|پروژه‌ها|projects/.test(q)) {
    return "پروژه‌های جاری بنیاد در صفحهٔ «پروژه‌ها» معرفی شده‌اند.";
  }
  if (/سلام|درود|hi|hello/.test(q)) {
    return MOCK_WELCOME;
  }

  return "در حال حاضر پاسخ‌های آزمایشی فعال است. می‌توانید دربارهٔ عضویت، حمایت، اخبار، مجله، آرشیو، زندگی‌نامه یا تماس بپرسید — یا از جستجوی سایت استفاده کنید.";
}

export async function getAiChatConfig(): Promise<AiChatConfig> {
  if (!isApiEnabled()) {
    return { enabled: true, welcomeMessage: MOCK_WELCOME };
  }
  try {
    return await apiFetch<AiChatConfig>("/ai/chat/config/", {
      scope: "public",
    });
  } catch {
    return { enabled: false, welcomeMessage: "" };
  }
}

export async function postAiChat(
  messages: AiChatMessage[],
): Promise<{ reply: string; provider?: string; model?: string }> {
  if (!isApiEnabled()) {
    await new Promise((r) => setTimeout(r, 450 + Math.random() * 400));
    return { reply: mockReply(messages), provider: "mock" };
  }
  try {
    return await apiFetch("/ai/chat/", {
      method: "POST",
      scope: "public",
      body: JSON.stringify({ messages }),
    });
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new Error("ارسال ناموفق بود");
  }
}
