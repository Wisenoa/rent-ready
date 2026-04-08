import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4] px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-[#1a1a1a] font-mono mb-4">404</div>
        <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-3">
          Page introuvable
        </h1>
        <p className="text-[#6b6b6b] mb-8 text-base">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#16a34a] text-white font-semibold rounded-lg hover:bg-[#15803d] transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
