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

type FieldErrors = Partial<
  Record<"name" | "email" | "title" | "story" | "consent", string>
>;

export function MemoriesForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState("");
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "این فیلد الزامی است.";
    if (!email.trim()) next.email = "این فیلد الزامی است.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "ایمیل معتبر وارد کنید.";
    }
    if (!title.trim()) next.title = "این فیلد الزامی است.";
    if (!story.trim()) next.story = "این فیلد الزامی است.";
    if (!consent) next.consent = "برای ارسال باید موافقت کنید.";
    setFieldErrors(next);
    if (Object.keys(next).length) return;
    setSubmitted(true);
  }

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
        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          <p className="rounded-xl bg-mint-soft px-4 py-3 text-sm text-ink-muted dark:bg-mint">
            در این نسخه MVP ارسال آزمایشی است و به سرور متصل نیست.
          </p>

          <FormField id="name" label="نام" required error={fieldErrors.name}>
            <TextBox
              id="name"
              name="name"
              value={name}
              error={fieldErrors.name}
              placeholder="نام شما"
              onChange={(e) => {
                setName(e.target.value);
                setFieldErrors((prev) => ({ ...prev, name: undefined }));
              }}
            />
          </FormField>

          <FormField id="email" label="ایمیل" required error={fieldErrors.email}>
            <TextBox
              id="email"
              name="email"
              type="email"
              value={email}
              error={fieldErrors.email}
              placeholder="email@example.com"
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
            />
          </FormField>

          <FormField id="relationship" label="نسبت / ارتباط" hint="اختیاری">
            <TextBox
              id="relationship"
              name="relationship"
              value={relationship}
              placeholder="مثلاً دانش‌آموز سابق"
              onChange={(e) => setRelationship(e.target.value)}
            />
          </FormField>

          <FormField id="title" label="عنوان" required error={fieldErrors.title}>
            <TextBox
              id="title"
              name="title"
              value={title}
              error={fieldErrors.title}
              placeholder="عنوان خاطره"
              onChange={(e) => {
                setTitle(e.target.value);
                setFieldErrors((prev) => ({ ...prev, title: undefined }));
              }}
            />
          </FormField>

          <FormField id="story" label="روایت" required error={fieldErrors.story}>
            <TextArea
              id="story"
              name="story"
              value={story}
              error={fieldErrors.story}
              rows={6}
              placeholder="متن خاطره..."
              onChange={(e) => {
                setStory(e.target.value);
                setFieldErrors((prev) => ({ ...prev, story: undefined }));
              }}
            />
          </FormField>

          <FileField id="media" name="media" label="رسانه (اختیاری)" hint="عکس یا سند" />

          <Checkbox
            id="consent"
            name="consent"
            checked={consent}
            error={fieldErrors.consent}
            onChange={(event) => {
              setConsent(event.target.checked);
              setFieldErrors((prev) => ({ ...prev, consent: undefined }));
            }}
            variant="card"
            label="موافقت با انتشار پس از بررسی"
            description="ارسال محتوا به معنی انتشار فوری نیست. محتوا پس از بررسی منتشر خواهد شد."
          />

          <FormButton type="submit" fullWidth>
            ارسال برای بررسی
          </FormButton>
        </form>
      )}
    </Card>
  );
}
