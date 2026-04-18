#!/usr/bin/env python3
"""Fix SEO metadata descriptions and titles in marketing pages."""
import os, re

MARKETING_DIR = 'src/app/(marketing)'

# Maps: file -> {desc: new_description, title: new_title}
fixes = {
    'blog/page.tsx': {
        'title': 'Blog location | Conseils gestion locative | RentReady',
        'desc': 'Conseils pratiques pour propriétaires bailleurs: gestion locative, quittances, révision IRL, entretien, bail et的法律房产信息.',
    },
    'cgu/page.tsx': {
        'desc': "Conditions générales d'utilisation de RentReady. Informations légales complètes sur l'utilisation de notre plateforme de gestion locative en ligne.",
    },
    'demo/page.tsx': {
        'desc': 'Réservez une démo RentReady de 30 minutes. Découvrez comment automatiser votre gestion locative: quittances, détection loyer, révision IRL.',
    },
    'features/page.tsx': {
        'desc': 'Fonctionnalités RentReady: quittances conformes, détection automatique, révision IRL, portail locataire, gestion des baux et financement.',
    },
    'glossaire-immobilier/page.tsx': {
        'title': 'Glossaire immobilier | Définitions location | RentReady',
        'desc': 'Glossaire complet de limmobilier en France: gestion locative, bail, quittance, charges, dépôt de garantie, révision loyer et 法律术语.',
    },
    'mentions-legales/page.tsx': {
        'desc': 'Mentions légales de RentReady. Logiciel de gestion locative en ligne pour propriétaires bailleurs en France. Éditeur, hébergement et contacts.',
    },
    'modeles/bail-professionnel/page.tsx': {
        'desc': 'Téléchargez notre modèle de bail professionnel gratuit. Contrat conforme au droit français, clauses essentielles et annexes pour location professionnelle.',
    },
    'modeles/conge-locataire/page.tsx': {
        'desc': 'Modèle gratuit de congé locataire à donner au propriétaire. Préavis de 1 ou 3 mois selon la situation. Formulaire prêt à utiliser.',
    },
    'modeles/contrat-de-location/page.tsx': {
        'desc': 'Téléchargez notre modèle de contrat de location gratuit et conforme au droit français. Bail résidentiel avec clauses obligatoires.',
    },
    'modeles/quittance-de-loyer/page.tsx': {
        'desc': 'Téléchargez notre modèle de quittance de loyer gratuit et conforme. Document officiel pour justifier le paiement du loyer et des charges.',
    },
    'offline/page.tsx': {
        'desc': 'RentReady est actuellement en maintenance. Toutes les fonctionnalités seront bientôt de retour. Merci de votre patience.',
    },
    'outils/calculateur-caution/page.tsx': {
        'desc': 'Calculez le dépôt de garantie maximum légal pour votre location en France. Outil gratuit respectant les plafonds selon la zone géographique.',
    },
    'modeles/etat-des-lieux/page.tsx': {
        'desc': "Téléchargez notre modèle détat des lieux gratuit et conforme. Document officiel pour inventorier le logement au début et fin de bail.",
    },
    'politique-confidentialite/page.tsx': {
        'desc': 'Politique de confidentialité de RentReady. Comment nous protégeons vos données personnelles, cookies et vos droits RGPD.',
    },
    'locations/page.tsx': {
        'desc': 'Trouvez votre prochaine location avec RentReady. Outils et conseils pour propriétaires et locataires: gestion, bail, quittances et 法律信息.',
    },
}

def get_meta_text(content):
    """Extract the metadata export block as text."""
    m = re.search(r'export\s+const\s+metadata.*?=\s*\{', content)
    if not m:
        return None, None
    raw = content[m.start():]
    depth = 0
    for i, c in enumerate(raw):
        if c == '{': depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                return content[m.start():m.start()+i+1], m.start()
    return None, None

def fix_string_prop(meta_text, prop_name, new_value):
    """Replace a metadata string property value. Handles multiline values."""
    # Pattern: propname: "value" (single line) OR propname:\n  "value" (multiline)
    # Strategy: find "propname:" and then scan forward for a double-quoted string
    pattern = re.compile(rf'({re.escape(prop_name)}\s*:\s*)(\"|\n\s*\")', re.MULTILINE)
    m = pattern.search(meta_text)
    if not m:
        return meta_text, False
    
    start = m.start()
    quote_char = m.group(2)
    
    if quote_char == '"':
        # Single line: find the closing quote
        after = meta_text[m.start():]
        # Find the closing quote - skip escaped quotes
        i = len(m.group(1))  # start after "propname: "
        if after[i] == '"':
            # Find closing quote
            j = i + 1
            while j < len(after):
                if after[j] == '\\':
                    j += 2
                elif after[j] == '"':
                    break
                else:
                    j += 1
            new_text = meta_text[:start] + f'{prop_name}: "{new_value}"' + meta_text[start+j+1:]
            return new_text, True
    else:
        # Multiline: propname:\n  "value"
        # Find the opening quote after optional whitespace+newline
        after = meta_text[m.start():]
        # Find first double quote
        dq_idx = after.find('"')
        if dq_idx < 0:
            return meta_text, False
        # Find closing quote
        j = dq_idx + 1
        while j < len(after):
            if after[j] == '\\':
                j += 2
            elif after[j] == '"':
                break
            else:
                j += 1
        # Replace
        new_text = meta_text[:start] + f'{prop_name}: "{new_value}"' + meta_text[start+j+1:]
        return new_text, True
    
    return meta_text, False

# Also fix titles that are too long
title_fixes = {
    'blog/page.tsx': 'Blog location | Conseils gestion locative | RentReady',
    'glossaire-immobilier/page.tsx': 'Glossaire immobilier | Définitions location | RentReady',
}

# Fix remaining pages with bad OG descriptions
og_desc_fixes = {
    'blog/page.tsx': {
        'openGraph_desc': 'Conseils pratiques pour propriétaires bailleurs: gestion locative, quittances, révision IRL, entretien et juridique.',
    },
    'cgu/page.tsx': {
        'openGraph_desc': "Conditions générales d'utilisation de RentReady, plateforme de gestion locative en ligne pour propriétaires en France.",
    },
    'demo/page.tsx': {
        'openGraph_desc': 'Réservez une démo de 30 min. Découvrez comment automatiser votre gestion locative: quittances, détection loyer, révision IRL.',
    },
    'features/page.tsx': {
        'openGraph_desc': 'Toutes les fonctionnalités RentReady: quittances conformes, détection automatique, révision IRL, portail locataire.',
    },
}

# Also fix the OG titles that exceed 60 chars
og_title_fixes = {
    'blog/page.tsx': 'Blog location | Conseils bailleurs | RentReady',
    'glossaire-immobilier/page.tsx': 'Glossaire immobilier | Définitions | RentReady',
}

print("=== Fixing metadata ===")
for rel_path, data in fixes.items():
    fp = os.path.join(MARKETING_DIR, rel_path)
    if not os.path.exists(fp):
        print(f"MISSING: {fp}")
        continue
    
    content = open(fp).read()
    meta_text, meta_start = get_meta_text(content)
    if meta_text is None:
        print(f"NO METADATA: {rel_path}")
        continue
    
    modified = False
    
    if 'desc' in data:
        new_meta, ok = fix_string_prop(meta_text, 'description', data['desc'])
        if ok:
            content = content[:meta_start] + new_meta + content[meta_start+len(meta_text):]
            modified = True
    
    if 'title' in data:
        new_meta, ok = fix_string_prop(meta_text, 'title', data['title'])
        if ok:
            content = content[:meta_start] + new_meta + content[meta_start+len(meta_text):]
            modified = True
    
    if modified:
        open(fp, 'w').write(content)
        print(f"FIXED: {rel_path}")
    else:
        print(f"NO CHANGE: {rel_path}")

print("\n=== Fixing OG titles (too long) ===")
for rel_path, new_title in og_title_fixes.items():
    fp = os.path.join(MARKETING_DIR, rel_path)
    if not os.path.exists(fp):
        continue
    content = open(fp).read()
    meta_text, meta_start = get_meta_text(content)
    if meta_text is None:
        continue
    
    new_meta, ok = fix_string_prop(meta_text, 'title', new_title)
    if ok:
        content = content[:meta_start] + new_meta + content[meta_start+len(meta_text):]
        open(fp, 'w').write(content)
        print(f"FIXED OG title: {rel_path}")

print("\nDone")