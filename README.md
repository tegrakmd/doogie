# Maison Verin — Scroll-Powered Slider (Next.js / TypeScript)

Migration du projet vanilla JS + GSAP vers Next.js 15 (App Router) + TypeScript.

## Installation

```bash
npm install
npm run dev
```

Place ensuite tes images (`1.png`, `2.jpg`, `3.png`, `4.png`, `5.jpg`) dans `public/images/`.

## Ce qui a changé par rapport au projet original

- **Architecture en composants** : `Navbar`, `Footer`, `Slider` au lieu d'un seul `index.html` / `script.js`.
- **CSS Modules** au lieu d'un `style.css` global (classes scopées : `.nav`, `.slider`, `.slideTitle`, etc.). La seule exception est `.slideTitle :global(.word)`, car les spans `.word` sont injectés dynamiquement par SplitText et ne passent pas par JSX — il faut donc `:global()` pour les cibler.
- **`titleEl.splitInstance`** (propriété custom posée sur un noeud DOM) remplacée par une `Map<Element, SplitText>` — plus propre en TypeScript, pas d'`any` nécessaire.
- **Toute la logique GSAP reste imperative**, dans un `useEffect` avec cleanup complet (listeners, tweens, `SplitText.revert()`) — c'est le pattern le plus fiable pour ce genre d'animation pilotée par manipulation directe du DOM ; la réécrire en state React aurait cassé la fluidité des transitions GSAP.
- **`SplitText`** s'importe directement depuis `gsap/SplitText` (le plugin est gratuit depuis que GSAP est passé open source sous Webflow — plus besoin du registre npm GreenSock ni du CDN Skypack).
- Petite correction de typo CSS : `letter-spacing: -0.0125` (sans unité, invalide) → `-0.0125em`.

## Structure

```
app/
  layout.tsx
  page.tsx
  globals.css
components/
  Navbar.tsx + Navbar.module.css
  Footer.tsx + Footer.module.css
  Slider.tsx + Slider.module.css
types/
  slide.ts
public/images/
```
# doogie
