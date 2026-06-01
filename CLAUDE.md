# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server at http://localhost:4200
npm run build      # production build → dist/
npm test           # run unit tests with Vitest
npx prettier --write .   # format all files
```

To run a single test file:
```bash
npx vitest run src/app/app.spec.ts
```

## Architecture

Angular 21 standalone-components app (no NgModules). Entry point is `src/main.ts` → bootstraps `App` via `appConfig`.

**Key conventions:**
- Component files drop the `.component` suffix: `app.ts`, `app.html`, `app.css`
- Use Angular signals (`signal()`, `computed()`) for reactive state — not `BehaviorSubject`
- All components are standalone (`imports: [...]` in `@Component`, not in a module)
- Routes in `src/app/app.routes.ts`, provided via `provideRouter(routes)` in `app.config.ts`
- Global styles in `src/styles.css`; component styles are scoped to their `.css` file
- **Always use CSS variables — never hardcode color values**
- **Always reuse existing CSS classes before creating new ones**

## Design System

System name: **Nexo**. Palette defined in `src/styles.css`:

```
--color-primary:       #1c1c1e   grafite escuro — sidebar, btn-primary, paginação ativa
--color-primary-mid:   #2c2c2e   hover btn-primary, sidebar footer
--color-primary-light: #3a3a3c   grafite claro
--color-accent:        #00897b   verde esmeralda — destaques, botões success, input focus
--color-accent-dark:   #00695c   hover btn-success, textos sobre accent-light
--color-accent-light:  #e0f2f1   fundos sutis — table header, badges, card icons
--color-bg:            #f2f2f7   fundo geral
--color-text:          #1c1c1e
--color-text-secondary:#6b6b6e
--color-border:        #e0e0e0
--color-danger:        #c62828
```

## Available Pipes

- `currencyBr` — formata para BRL (R$ 1.234,56)
- `dateBr` — formata para DD/MM/YYYY

## TypeScript

Strict mode: `noImplicitReturns`, `noPropertyAccessFromIndexSignature`, strict Angular template checks.

## Formatting

Prettier: `singleQuote: true`, `printWidth: 100`, parser `angular` para `.html`.
