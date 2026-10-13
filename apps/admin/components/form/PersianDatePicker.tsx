"use client";

import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { controlClassName } from "./Input";
import { toEnglishDigits, toPersianDigits } from "@/lib/digits";

type PersianDatePickerProps = {
  id?: string;
  value: string;
  onChange: (next: string) => void;
  /** date = display label (YYYY/MM/DD); datetime = ISO / datetime-local for API */
  mode?: "date" | "datetime";
  placeholder?: string;
  className?: string;
  error?: boolean;
};

function parseDateLabel(value: string): DateObject | null {
  const raw = toEnglishDigits(value.trim());
  if (!raw) return null;
  const parsed = new DateObject({
    date: raw,
    format: "YYYY/MM/DD",
    calendar: persian,
    locale: persian_fa,
  });
  return parsed.isValid ? parsed : null;
}

function parseDateTime(value: string): DateObject | null {
  const raw = value.trim();
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  return new DateObject({ date, calendar: persian, locale: persian_fa });
}

function toLocalDateTimeValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function PersianDatePicker({
  id,
  value,
  onChange,
  mode = "date",
  placeholder = "۱۴۰۳/۰۵/۰۲",
  className = "",
  error = false,
}: PersianDatePickerProps) {
  const pickerValue =
    mode === "datetime" ? parseDateTime(value) : parseDateLabel(value);

  return (
    <DatePicker
      id={id}
      value={pickerValue}
      onChange={(date: DateObject | null) => {
        if (!date) {
          onChange("");
          return;
        }
        if (mode === "datetime") {
          onChange(toLocalDateTimeValue(date.toDate()));
          return;
        }
        onChange(toPersianDigits(date.format("YYYY/MM/DD")));
      }}
      calendar={persian}
      locale={persian_fa}
      format={mode === "datetime" ? "YYYY/MM/DD HH:mm" : "YYYY/MM/DD"}
      calendarPosition="bottom-right"
      containerClassName="w-full"
      inputClass={controlClassName(error, `text-start ${className}`)}
      placeholder={placeholder}
      editable
      plugins={
        mode === "datetime"
          ? [<TimePicker key="time" hideSeconds position="bottom" />]
          : undefined
      }
    />
  );
}
