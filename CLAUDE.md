# retex-config

Ce fichier hérite des règles du CLAUDE.md global.

## Structure
- `docs/` : documentation. Les décisions techniques vont dans `docs/decisions/`.
- `.claude/hooks/` : garde-fous et automatisations.
- `.claude/skills/` : workflows IA réutilisables, un sous-dossier par skill avec un `SKILL.md`.
- `tools/` : scripts utilitaires et prompts modulaires.
- `src/` : code source. Ajouter un `CLAUDE.md` local par module si besoin.

Ne pas créer d'autre dossier à la racine.
