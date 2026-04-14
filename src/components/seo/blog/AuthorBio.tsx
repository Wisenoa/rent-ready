import { Shield, Star } from "lucide-react";

const author = {
  name: "Équipe RentReady",
  role: "Experts en gestion locative",
  bio: "L'équipe RentReady est composée d'experts en droit immobilier, gestion locative et technologie. Nous accompagnons les propriétaires bailleurs dans la simplification de leur gestion au quotidien.",
  initials: "RR",
};

export function AuthorBio() {
  return (
    <div className="mt-12 rounded-xl border border-stone-200 bg-stone-50 p-6 sm:p-8">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
          {author.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-stone-900">{author.name}</span>
            <span className="text-stone-400">·</span>
            <span className="text-sm text-stone-500">{author.role}</span>
          </div>

          <p className="mb-3 text-sm leading-relaxed text-stone-600">
            {author.bio}
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <Shield className="size-3.5 text-green-600" />
              Contenu vérifié
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <Star className="size-3.5 text-amber-500" />
              Mis à jour 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
