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
- Component files drop the `.component` suffix: `app.ts`, `app.html`, `app.css` (not `app.component.ts`)
- Use Angular signals (`signal()`, `computed()`) for reactive state — not `BehaviorSubject` or plain properties
- All components are standalone (use `imports: [...]` directly in `@Component`, not in a module)
- Routes are declared in `src/app/app.routes.ts` and provided via `provideRouter(routes)` in `app.config.ts`
- Global styles in `src/styles.css`; component styles are scoped to their `.css` file

**TypeScript:** strict mode is fully enabled including `noImplicitReturns`, `noPropertyAccessFromIndexSignature`, and strict Angular template checks.

**Formatting:** Prettier with `singleQuote: true`, `printWidth: 100`, and the `angular` parser for `.html` files.
