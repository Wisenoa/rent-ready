import Link from "next/link";
import { SmartHeaderCta } from "@/components/smart-header-cta";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f4] font-[family-name:var(--font-sans)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-stone-200/60 bg-[#f8f7f4]/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-xl font-semibold tracking-tight text-stone-900">
            RentReady
          </Link>

          <div className="flex items-center gap-3">
            <SmartHeaderCta />
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-stone-200/60 bg-[#f8f7f4]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-sm text-stone-500 sm:flex-row sm:justify-between sm:px-6">
          <p>&copy; {new Date().getFullYear()} RentReady. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="transition-colors hover:text-stone-700">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="transition-colors hover:text-stone-700">
              Confidentialité
            </Link>
            <Link href="/cgu" className="transition-colors hover:text-stone-700">
              CGU
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
