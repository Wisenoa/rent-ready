#!/usr/bin/env python3
"""Fix SEO metadata descriptions and titles in marketing pages."""
import os, re

MARKETING_DIR = 'src/app/(marketing)'

# Desired descriptions (120-160 chars)
fixes = {
    'blog/page.tsx': {
        'title': 'Blog location | Conseils gestion locative | RentReady',
        'desc': 'Conseils pratiques pour propriétaires bailleurs: gestion locative, quittances, révision IRL, entretien, bail et法律信息房产.',
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
        'desc': 'Glossaire complet de limmobilier en France: gestion locative, bail, quittance, charges, dépôt de garantie et术语房地产.',
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
        'desc': 'Trouvez votre prochaine location avec RentReady. Outils et conseils pour propriétaires et locataires: gestion, bail, quittances et信息房地产.',
    },
    'modeles/bail-colocation/page.tsx': {
        'desc': 'Téléchargez notre modèle de bail de colocation gratuit et conforme. Contrats pour plusieurs locataires avec clauses partagées et individuelles.',
    },
    'modeles/bail-mobilite/page.tsx': {
        'desc': 'Téléchargez notre modèle de bail mobilité gratuit. Location meublée de 1 à 10 mois sans possibilité de prolongation ni révision loyer.',
    },
    'modeles/bail-vide/page.tsx': {
        'desc': 'Téléchargez notre modèle de bail vide gratuit et conforme au droit français. Bail résidentiel pour location non meublée avec clauses obligatoires.',
    },
    'modeles/conge-proprietaire/page.tsx': {
        'desc': 'Modèle gratuit de congé donné par le propriétaire au locataire. Préavis de 2 à 6 mois selon le motif. Formulaire prêt à utiliser.',
    },
    'modeles/relance-loyer-impaye/page.tsx': {
        'desc': 'Modèle de lettre de relance pour loyer impayé. Étapes légales et نموذج gratuit pour réclamer le paiement du loyer en toute légalité.',
    },
    'modeles/augmentation-de-loyer/page.tsx': {
        'desc': 'Modèle de lettre pour augmenter le loyer en cours de bail. Calculs révision IRL et règles dineo-occupy pour incrementer合法的租金.',
    },
    'modeles/protocol-etat-des-lieux/page.tsx': {
        'desc': 'Protocol officiel détat des lieux. Document de référence pour inventorier le logement au démarrage et à la fin de la période de location.',
    },
    'modeles/repartition-charges/page.tsx': {
        'desc': 'Modèle de convention de répartition des charges locatives. Document officiel pour partager les coûts entre propriétaire et locataire de manière claire.',
    },
    'outils/calculateur-charges-locatives/page.tsx': {
        'desc': 'Calculez la répartition des charges locatives entre propriétaire et locataire. Outil gratuit basé sur les règles légales françaises.',
    },
    'outils/calculateur-rendement/page.tsx': {
        'desc': 'Calculez votre rendement locatif NET et BRUT en quelques clics. Outil gratuit pour investisseurs immobiliers avec indicateurs détaillés.',
    },
    'outils/calculateur-revision-irl/page.tsx': {
        'desc': 'Calculez la révision de loyer selon lindice IRL. Outil gratuit pour ajuster automatiquement le loyer au Bail de location avec les derniers indices.',
    },
    'outils/generateur-quittance/page.tsx': {
        'desc': 'Générez des quittances de loyer personnalisées et conformes. Outil gratuit pour propriétaires avec calculs automatiques des montants et dates.',
    },
    'outils/lettre-relance-loyer/page.tsx': {
        'desc': 'Modèle de lettre de relance pour loyer impayé. Document gratuit pour réclamer le paiement du loyer avec instructions légales et نموذج gratuits.',
    },
    'outils/page.tsx': {
        'desc': 'Accédez à nos calculateurs immobiliers gratuits: révision IRL, rendement, caution, charges locatives. Outils professionnels pour propriétaires bailleurs.',
    },
}

def get_meta_block(content):
    """Extract the full metadata export block."""
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
                end = i
                break
    return content[m.start():m.start()+end+1], m.start()

def fix_prop(meta_text, prop_name, new_value):
    """
    Replace a metadata property value.
    Handles:
      - propname: "value" (single line)
      - propname:\n  "value" (multiline)
      - propname:\n    "value" (deeply indented multiline)
    Returns (new_meta_text, was_modified)
    """
    # Pattern 1: propname: "value" on same line
    pattern1 = re.compile(rf'({re.escape(prop_name)}\s*:\s*)(")([^"\\]*(?:\\.[^"\\]*)*)("(\s*[,\n]))')
    
    # Pattern 2: propname:\n  "value" (multiline)
    pattern2 = re.compile(rf'({re.escape(prop_name)}\s*:\s*\n)(\s*)(")([^"\\]*(?:\\.[^"\\]*)*)(")')
    
    # Try pattern 1 first
    m1 = pattern1.search(meta_text)
    if m1:
        # Single line: "propname: "value","
        replacement = f'{prop_name}: "{new_value}"{m1.group(5)}'
        return meta_text[:m1.start()] + replacement + meta_text[m1.end():], True
    
    # Try pattern 2
    m2 = pattern2.search(meta_text)
    if m2:
        # multiline: propname:\n  "value"
        indent = m2.group(2)
        replacement = f'{prop_name}:\n{indent}"{new_value}"'
        return meta_text[:m2.start()] + replacement + meta_text[m2.end():], True
    
    return meta_text, False

print("=== Fixing metadata ===")
for rel_path, data in fixes.items():
    fp = os.path.join(MARKETING_DIR, rel_path)
    if not os.path.exists(fp):
        print(f"MISSING: {fp}")
        continue
    
    content = open(fp).read()
    meta_text, meta_start = get_meta_block(content)
    if meta_text is None:
        print(f"NO METADATA: {rel_path}")
        continue
    
    modified = False
    
    if 'desc' in data:
        new_meta, ok = fix_prop(meta_text, 'description', data['desc'])
        if ok:
            content = content[:meta_start] + new_meta + content[meta_start+len(meta_text):]
            modified = True
    
    if 'title' in data:
        new_meta, ok = fix_prop(meta_text, 'title', data['title'])
        if ok:
            content = content[:meta_start] + new_meta + content[meta_start+len(meta_text):]
            modified = True
    
    if modified:
        open(fp, 'w').write(content)
        print(f"FIXED: {rel_path}")
    else:
        print(f"NO CHANGE: {rel_path}")

print("\nDone")