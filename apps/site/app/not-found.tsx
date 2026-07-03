import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="panel-card max-w-lg rounded-[2rem] p-10 text-center">
        <p className="eyebrow">404</p>
        <h1 className="display-title mt-4 text-5xl">Missing motion frame.</h1>
        <p className="copy-muted mt-4 text-base">
          The page you requested is not part of this composition.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full border border-white/10 px-5 py-3 text-sm font-medium"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
