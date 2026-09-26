export default function NotFound() {
  return (
    <div className="content-shell section-pad">
      <p className="eyebrow">۴۰۴</p>
      <h1 className="text-display mt-3 text-3xl md:text-4xl">صفحه پیدا نشد</h1>
      <p className="mt-4 max-w-xl text-ink-muted">
        نشانی درخواست‌شده در این پلتفرم وجود ندارد یا جابه‌جا شده است.
      </p>
      <a
        href="/"
        className="btn-primary mt-8"
      >
        بازگشت به خانه
      </a>
    </div>
  );
}
