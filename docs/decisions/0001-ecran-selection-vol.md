# 0001. Écran « Sélectionner un vol » : stack, tokens et mocks

Date : 2026-11-23

## Contexte

Intégrer au pixel près la « Piste 1 » de la maquette Figma (fichier `fGq3wAPki8REd2QvFno8D7`, section `152:2022`).
La section contient trois écrans (liste repliée, carte dépliée, skeleton) et le composant « Vol Card » (états Default et Deployed).
Le dépôt était vide, sans stack ni design system.

## Décisions

- **Stack** : Vite, React 19, TypeScript, CSS Modules. Pas de Tailwind.
- **Tokens** : `src/theme/tokens.css` est le seul fichier qui contient des valeurs littérales. Primitives (`--color-*`), sémantique (`--sem-*`), espacements, rayons, typo en `rem`, motion. Les noms Figma `Vert foncé` et `sem-text-default` sont repris.
- **Pas d'opacité sur le texte** : l'heure d'arrivée (navy à 85 % dans Figma) est aplatie en couleur pleine `--color-navy-600`.
- **Bordure des cartes** : dessinée en ombre intérieure, comme le trait « inside » de Figma, pour garder les hauteurs exactes (112, 144, 126).
- **Interactions** :
  - Premier chargement : écran entier en skeleton (frame « 1018 · Skeleton »).
  - Changement de date : l'onglet change tout de suite, le sous-titre suit, seule la liste repasse en skeleton.
  - Carte vol : clic pour déplier ou replier (une seule ouverte), choix du tarif Eco ou Premium.
- **Skeleton** : animation de couleur reprise de Figma (1,6 s, pic à 18 %). La vague descend l'écran avec 0,5 ms de décalage par pixel. Coupée si `prefers-reduced-motion`.
- **Mocks** : `src/mocks/flights.ts`. Le 20 août reprend les contenus de la maquette. Les autres jours sont dérivés de façon déterministe, et le vol le moins cher vaut le prix de l'onglet. Délai réseau simulé de 900 à 1 300 ms, requêtes annulées si on change de date en cours de route.

## Points ouverts

- **Contraste de l'onglet sélectionné** : blanc sur `#f46856` donne 3,0:1. C'est sous le seuil AA de 4,5:1 pour du texte en 12 et 14 px. À corriger dans la maquette (fond plus foncé ou texte navy).
- La vague décorative des cartes à deux prix a la même couleur que son fond, elle est donc invisible. Elle est intégrée telle quelle.
- Les pastilles « 2 voyageurs » et « 1 bagage » sont affichées en lecture seule, faute d'interaction définie.
