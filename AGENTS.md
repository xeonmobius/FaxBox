# Agent Guidelines for FaxBox

This is a Tauri v2 desktop application using React 19, TypeScript, and Rust. Follow these conventions when working in this repository.

## Development Commands

**Running the Application**
- `npm run tauri dev` - Run full desktop app with hot reload (port 1420)
- `npm run dev` - Run Vite dev server for web-only testing

**Building**
- `npm run build` - Build TypeScript and bundle with Vite
- `npm run tauri build` - Build production desktop app (runs npm run build automatically)

**No explicit test setup** - If adding tests, choose a framework (Vitest, Jest, React Testing Library) and document the single-test command here.

## TypeScript/React Conventions

**Code Style**
- Functional components with hooks only (no class components)
- All code in `src/` directory
- Use `import type { ... }` for type-only imports when possible
- Default export for main component per file: `export default Component`
- Named exports for utilities and types: `export const helper = ...`, `export type Type = ...`

**Imports Order**
1. React imports
2. Third-party packages (@tauri-apps, etc.)
3. Relative imports (./, ../)
4. CSS/asset imports last (before component definition)

Example:
```typescript
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { MyType } from "./types";
import "./App.css";
```

**Naming Conventions**
- Components: PascalCase (App.tsx, UserProfile.tsx)
- Functions/variables: camelCase (greet, setGreetMsg, handleClick)
- Types/interfaces: PascalCase (UserData, ApiResponse)
- Constants: UPPER_SNAKE_CASE (API_BASE_URL)
- Files: match export name (ComponentName.tsx for ComponentName component)

**State & Side Effects**
- Use `useState` for local component state
- Use async/await for Tauri command invocations: `const result = await invoke("commandName", { param })`
- Handle errors gracefully with try/catch for async operations

**TypeScript Rules** (from tsconfig.json)
- Strict mode enabled - always provide explicit types
- No unused locals or parameters - remove or prefix with underscore
- Use `interface` for object shapes, `type` for unions/primitives
- No `any` types - use `unknown` with type guards instead

## Tauri/Rust Conventions

**Tauri Commands (Backend)**
- Define commands in `src-tauri/src/lib.rs` with `#[tauri::command]` attribute
- Accept parameters as references: `fn greet(name: &str) -> String`
- Return serializable types (String, structs with #[derive(Serialize)])
- Register commands in the Builder: `.invoke_handler(tauri::generate_handler![greet, other_cmd])`

**Frontend Command Invocation**
- Import from core API: `import { invoke } from "@tauri-apps/api/core"`
- Call with command name string and params object: `invoke("greet", { name: "Alice" })`

## Styling Conventions

- Use regular CSS files (no CSS modules or Tailwind configured)
- Support dark mode using `@media (prefers-color-scheme: dark)`
- Use semantic HTML: `<main>`, `<section>`, `<form>` instead of excessive `<div>`
- CSS variable system in `:root` for theming
- Transitions on interactive elements (0.25s typical)

## Error Handling

**Frontend**
- Wrap async Tauri calls in try/catch
- Display user-friendly error messages (don't show raw Rust errors)
- Consider loading states for async operations

**Backend**
- Use `.expect()` only when error should never occur in production
- Return `Result<T, E>` types for operations that can fail
- Map Rust errors to friendly error strings when returning to frontend

## File Organization

```
src/
├── main.tsx          # Entry point (React root)
├── App.tsx           # Main application component
├── App.css           # Global styles
├── components/       # Reusable UI components
├── types.ts          # Shared TypeScript types
└── utils.ts          # Helper functions

src-tauri/src/
├── main.rs           # Entry point (calls lib::run)
└── lib.rs            # Tauri commands and app builder
```

## When Making Changes

1. Read existing files to understand patterns before modifying
2. Use `npm run tauri dev` to test desktop integration
3. Ensure TypeScript compiles without errors (`npm run build`)
4. Test both light and dark mode if styling changes
5. Follow the existing import ordering and naming conventions
