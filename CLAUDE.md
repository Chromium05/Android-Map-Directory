# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Critical: Expo SDK 55

This project is on **Expo SDK 55** (`expo ~55.0.24`, React 19.2, React Native 0.83). APIs have changed significantly from older SDKs. Read the versioned docs at https://docs.expo.dev/versions/v55.0.0/ before writing code. The `expo` MCP server (`read_documentation`, `learn`) and the skills under `.agents/skills/` (e.g. `building-native-ui`, `upgrading-expo`) are the authoritative references.

## Commands

```bash
npm start            # expo start (dev server, pick platform from the prompt)
npm run android      # expo start --android
npm run ios          # expo start --ios
npm run web          # expo start --web
npm run lint         # expo lint (ESLint)
npm run reset-project # moves starter code to app-example/, blanks the app dir
```

There is **no test runner configured** — no Jest, no test scripts. Don't assume `npm test` exists.

`tsc` runs via the editor / `expo-env.d.ts`; type-check with `npx tsc --noEmit` if needed (strict mode is on).

## Architecture

**Expo Router with file-based routing.** Entry is `expo-router/entry` (see `package.json` `main`). Routes live in `src/app/`. `typedRoutes` is enabled, so route hrefs are type-checked.

- `src/app/_layout.tsx` — root layout: wraps the app in `@react-navigation/native` `ThemeProvider` (light/dark by `useColorScheme`), renders `AnimatedSplashOverlay` + `AppTabs`.
- `src/app/index.tsx` (Beranda/Home), `peta.tsx` (Peta/Map), `info.tsx` (Info) — the three tab screens. **UI copy is in Indonesian.**

**Platform-specific files via Metro extensions.** Files resolve by platform suffix: `foo.tsx` (native/default) vs `foo.web.tsx` (web). This is load-bearing for tabs:
- `app-tabs.tsx` uses `expo-router/unstable-native-tabs` (`NativeTabs`) — native bottom tabs.
- `app-tabs.web.tsx` uses `expo-router/ui` (`Tabs`/`TabList`/`TabTrigger`) — a custom top bar.
- Same pattern for `animated-icon` and `use-color-scheme`. When editing one variant, check whether the `.web` counterpart needs the same change.

**Theming is centralized in `src/constants/theme.ts`.** Single source of truth for `Colors` (light/dark objects with identical keys), `Spacing` (4dp base scale: `one`=4 … `eight`=32), `Radius`, `Fonts` (Plus Jakarta Sans / JetBrains Mono), and `BottomTabInset`. Consume colors through the `useTheme()` hook (`src/hooks/use-theme.ts`), which picks the active scheme. `ThemeColor` is the union of color-token keys.

**Themed primitives** — prefer these over raw RN components so styling stays token-driven:
- `ThemedText` (`type` = typography scale like `display`/`titleM`/`monoTag`; `themeColor` = a `ThemeColor`). Legacy type aliases (`title`, `subtitle`, `small`…) map onto the new scale.
- `ThemedView` (`type` = a `ThemeColor` used as `backgroundColor`).

Import via the `@/*` alias → `src/*` and `@/assets/*` → `assets/*` (configured in `tsconfig.json`).

## Design reference

`Design.md` is the full design spec (in Indonesian) — color tokens, typography, component specs (FloorBadge, StatusPill, Map Pin, Bottom Sheet, etc.), and per-screen layouts. The token values there mirror `src/constants/theme.ts`. Consult it before building new UI components or screens.

## Build & deploy

EAS is configured (`eas.json`, project id in `app.json`). Profiles: `development` (dev client, internal), `preview` (internal), `production` (auto-increment). Use the `expo` MCP `build_*` / `workflow_*` / `build_submit` tools. The React Compiler is enabled (`experiments.reactCompiler`).
