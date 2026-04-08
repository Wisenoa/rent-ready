"use client";

// Global error boundary — replaces root layout when an error occurs
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4]">
      <div className="text-center max-w-md px-4">
        <div className="text-6xl font-bold text-stone-900 font-mono mb-4">
          Erreur
        </div>
        <h1 className="text-2xl font-semibold text-stone-900 mb-3">
          Quelque chose s'est mal passé
        </h1>
        <p className="text-stone-600 mb-8 text-base">
          Une erreur inattendue s'est produite. Veuillez essayer
          novamente.
        </p>
        {error?.digest && (
          <p className="text-xs text-stone-400 mb-4 font-mono">
            ID: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center justify-center px-6 py-3 bg-[#16a34a] text-white font-semibold rounded-lg hover:bg-[#15803d] transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}