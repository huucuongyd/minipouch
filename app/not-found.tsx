import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-xs tracking-[0.25em] text-sage uppercase">404</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">Trang này chưa được may xong</h1>
      <p className="mt-4 text-muted">Có lẽ đường dẫn hơi lệch. Về trang chủ chọn túi nhé.</p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm text-paper"
      >
        Về NuBeNa
      </Link>
    </div>
  );
}
