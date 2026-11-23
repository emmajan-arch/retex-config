# retex-config

## Lancer le projet

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # vérification TypeScript + build
```

Écran actuel : sélection de vol (maquette Figma « Piste 1 »). Voir `docs/decisions/0001-ecran-selection-vol.md`.

## Structure

- `docs/` : documentation (architecture, ADR, runbooks, design system).
  - `decisions/` : journal des décisions techniques.
- `.claude/` : configuration IA du projet.
  - `hooks/` : garde-fous et scripts d'automatisation.
  - `skills/` : workflows IA réutilisables, un dossier par skill avec un `SKILL.md`.
- `tools/` : scripts utilitaires et prompts modulaires.
- `src/` : code source de l'application.
