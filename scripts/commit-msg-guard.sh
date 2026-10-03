#!/usr/bin/env bash
# Garde-fou AVANT chaque commit : refuse un message contamine.
#
# Erreur observee en session : quatre messages de commit contenaient des
# caracteres CJK generes par accident (« 总 », « 胸 », « 定义ait »). Aucun n'a
# casse le code, mais un message qui ment sur ce qu'il a change est pire qu'un
# message absent. Un `git commit --amend` les a corriges a chaque fois ; mieux
# vaut attraper avant d'ecrire dans l'historique.
#
# Portee : UNIQUEMENT le message que je commite. Les sources francaises
# legitimes ne sont jamais verifiees par ce script.
#
# Usage : scripts/commit-msg-guard.sh <fichier-message>
set -uo pipefail

MSG_FILE="${1:?usage: commit-msg-guard.sh <fichier-message>}"
[ -f "$MSG_FILE" ] || { echo "fichier introuvable: $MSG_FILE"; exit 1; }

# BSD grep (macOS) n'a pas -P, et un `grep -P` qui echoue silencieusement laisse
# passer n'importe quoi — c'est ce qui rendait la premiere version de ce script
# inoffensive tout en affichant « message propre ». Perl est present partout ou
# ce depot developpe, donc c'est lui qui fait la detection.
HITS=$(perl -CSD -ne 'print "  ligne $.\t$_" if /[\x{4E00}-\x{9FFF}\x{3040}-\x{30FF}\x{AC00}-\x{D7AF}]/' "$MSG_FILE")
if [ -n "$HITS" ]; then
  echo "REFUS — caracteres CJK inattendus dans le message de commit :"
  echo "$HITS" | head -5
  echo "Si c'est legitime (source non-francaise), re-examine avant de contourner."
  exit 1
fi

echo "message propre — commit autorise"