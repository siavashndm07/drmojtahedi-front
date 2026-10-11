"use client";

import {
  Checkbox,
  FileField,
  FormButton,
  FormField,
  TextArea,
  TextBox,
} from "@/components/forms/FormPrimitives";
import { Card } from "@/components/ui/Card";
import { useState } from "react";

export function MemoriesForm() {
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <Card className="mx-auto max-w-2xl" padding="lg">
      {submitted ? (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-pine">درخواست ثبت شد (آزمایشی)</h2>
          <p className="text-sm leading-7 text-ink-muted">
            در نسخهٔ MVP ارسال به سرور متصل نیست. پس از اتصال Django، محتوا پس از بررسی
            منتشر می‌شود.
          </p>
          <FormButton type="button" variant="outline" onClick={() => setSubmitted(false)}>
            ارسال دوباره
          </FormButton>
        </div>
      ) : (
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <p className="rounded-xl bg-mint-soft px-4 py-3 text-sm text-ink-muted dark:bg-mint">
            در این نسخه MVP ارسال آزمایشی است و به سرور متصل نیست.
          </p>

          <FormField id="name" label="نام" required>
            <TextBox id="name" name="name" required placeholder="نام شما" />
          </FormField>

          <FormField id="email" label="ایمیل" required>
            <TextBox id="email" name="email" type="email" required placeholder="email@example.com" />
          </FormField>

          <FormField id="relationship" label="نسبت / ارتباط" hint="اختیاری">
            <TextBox id="relationship" name="relationship" placeholder="مثلاً دانش‌آموز سابق" />
          </FormField>

          <FormField id="title" label="عنوان" required>
            <TextBox id="title" name="title" required placeholder="عنوان خاطره" />
          </FormField>

          <FormField id="story" label="روایت" required>
            <TextArea id="story" name="story" required rows={6} placeholder="متن خاطره..." />
          </FormField>

          <FileField id="media" name="media" label="رسانه (اختیاری)" hint="عکس یا سند" />

          <Checkbox
            id="consent"
            name="consent"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            required
            variant="card"
            label="موافقت با انتشار پس از بررسی"
            description="ارسال محتوا به معنی انتشار فوری نیست. محتوا پس از بررسی منتشر خواهد شد."
          />

          <FormButton type="submit" fullWidth disabled={!consent}>
            ارسال برای بررسی
          </FormButton>
        </form>
      )}
    </Card>
  );
}
