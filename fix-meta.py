#!/usr/bin/env python3
import os, re

MARKETING_DIR = 'src/app/(marketing)'

fixes = {
    'blog/page.tsx': {
        'title': 'Blog gestion locative | Conseils bailleurs | RentReady',
        'desc': 'Conseils et guides pratiques pour propriétaires bailleurs: gestion locative, quittances, révision IRL, entretien, bail et juridique locatif.',
    },
    'cgu/page.tsx': {
        'desc': "Conditions générales d'utilisation de RentReady, plateforme de gestion locative en ligne pour propriétaires bailleurs en France. Informations légales complètes.",
    },
    'demo/page.tsx': {
        'desc': 'Réservez une démo RentReady de 30 min. Découvrez comment automatiser votre gestion locative: quittances conformes, détection loyer, révision IRL.',
    },
    'features/page.tsx': {
        'desc': 'Toutes les fonctionnalités RentReady: quittances de loyer conformes, détection automatique, révision IRL, portail locataire, gestion des baux.',
    },
    'glossaire-immobilier/page.tsx': {
        'title': 'Glossaire immobilier | Définitions location | RentReady',
        'desc': "Glossaire complet de l'immobilier en France: définitions des termes de location, gestion locative, bail, quittance, charges et检修.",
    },
    'mentions-legales/page.tsx': {
        'desc': 'Mentions légales de RentReady, logiciel de gestion locative en ligne pour propriétaires bailleurs en France. Éditeur, hébergement, contacts.',
    },
    'modeles/bail-professionnel/page.tsx': {
        'desc': 'Téléchargez notre modèle de bail professionnel gratuit. Contrat conforme au droit français, clauses essentielles et annexes pour location professionnelle.',
    },
    'modeles/conge-locataire/page.tsx': {
        'desc': 'Modèle gratuit de congé locataire à donner au propriétaire. Préavis 1 ou 3 mois selon la situation. Formulaire prêt à utiliser avec instructions.',
    },
    'modeles/contrat-de-location/page.tsx': {
        'desc': 'Téléchargez notre modèle de contrat de location gratuit et conforme au droit français. Bail résidentiel avec clauses obligatoires et annexes.',
    },
    'modeles/quittance-de-loyer/page.tsx': {
        'desc': 'Téléchargez notre modèle de quittance de loyer gratuit et conforme. Document officiel pour justifier le paiement du loyer et des charges.',
    },
    'offline/page.tsx': {
        'desc': 'RentReady est actuellement en maintenance. Toutes les fonctionnalités seront bientôt de retour. Merci pour votre patience.',
    },
    'outils/calculateur-caution/page.tsx': {
        'desc': 'Calculez le dépôt de garantie maximum légal pour votre location en France. Outil gratuit respectant les plafonds selon la zone géographique.',
    },
    'modeles/etat-des-lieux/page.tsx': {
        'desc': "Téléchargez notre modèle d'état des lieux gratuit et conforme. Document officiel pour inventorier l'état du logement au début et fin de bail.",
    },
    'politique-confidentialite/page.tsx': {
        'desc': 'Politique de confidentialité de RentReady. Comment nous protégeons vos données personnelles, utilisation des cookies et vos droits RGPD.',
    },
}

# Verify lengths
for fp, data in fixes.items():
    if 'desc' in data:
        l = len(data['desc'])
        status = 'OK' if 120 <= l <= 160 else 'FIXME'
        print(f"{status} {l:3d} chars: {fp}")
        if l < 120 or l > 160:
            print(f"  DESC: {data['desc']}")

print("\nFixing descriptions...")
for rel_path, data in fixes.items():
    fp = os.path.join(MARKETING_DIR, rel_path)
    if not os.path.exists(fp):
        print(f"MISSING: {fp}")
        continue
    content = open(fp).read()
    
    modified = False
    
    def fix_meta_prop(content, prop_name, new_value):
        """Find and replace a metadata string property value."""
        # Match: propname: "value" or propname:\n  "value"
        # We need to find the property in the metadata block
        start_m = re.search(r'export\s+const\s+metadata.*?=\s*\{', content)
        if not start_m:
            return content, False
        
        raw = content[start_m.start():]
        depth = 0; end_pos = 0
        for i, c in enumerate(raw):
            if c == '{': depth += 1
            elif c == '}': 
                depth -= 1
                if depth == 0: end_pos = i; break
        
        meta_start = start_m.start()
        meta_end = meta_start + end_pos + 1
        meta_text = content[meta_start:meta_end]
        
        # Find the property
        # Try simple pattern: propertyname: "value"
        pattern = re.compile(rf'{prop_name}\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"')
        m = pattern.search(meta_text)
        if m:
            old_full = m.group(0)
            new_full = f'{prop_name}: "{new_value}"'
            content = content.replace(old_full, new_full, 1)
            return content, True
        
        # Try with single quotes
        pattern2 = re.compile(rf"{prop_name}\s*:\s*'([^'\\]*(?:\\.[^'\\]*)*)'")
        m2 = pattern2.search(meta_text)
        if m2:
            old_full = m2.group(0)
            new_full = f"{prop_name}: '{new_value}'"
            content = content.replace(old_full, new_full, 1)
            return content, True
        
        return content, False
    
    if 'desc' in data:
        content, ok = fix_meta_prop(content, 'description', data['desc'])
        modified = modified or ok
        if not ok:
            print(f"  WARN: could not fix description in {rel_path}")
    
    if 'title' in data:
        content, ok = fix_meta_prop(content, 'title', data['title'])
        modified = modified or ok
        if not ok:
            print(f"  WARN: could not fix title in {rel_path}")
    
    if modified:
        open(fp, 'w').write(content)
        print(f"FIXED: {rel_path}")
    else:
        print(f"NO CHANGE: {rel_path}")

print("\nDone")