# Pixel2Code

Pixel2Code is a frontend-only foundation for a local-first design-to-code workspace. This release focuses on navigation, project management, screenshot previews, and interactive UI prototypes. It does **not** run AI inference, connect to Ollama, analyze image pixels, generate code, or export projects.

## Requirements

- Node.js 20.9 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Workspace scripts

```bash
npm run typecheck
npm run lint
npm run build
```

## Frontend structure

`apps/web` is the Next.js App Router application. Its route pages stay small and delegate to feature components under `src/components`. Project data and prototype preferences are persisted in browser local storage; TanStack Query is configured for future API integration. No backend is required.

```text
apps/web/src/
├── app/                 # App Router routes and shared styles
├── components/
│   ├── dashboard/
│   ├── layout/
│   ├── library/
│   ├── models/
│   ├── projects/
│   ├── settings/
│   └── workspace/
├── lib/                 # Demo content and shared utilities
├── stores/              # Zustand prototype state
└── types/               # Frontend domain types
```

## Implemented prototype flows

- Dashboard and project overview.
- Create, rename, duplicate, delete, search, filter, and sort projects.
- Project workspace with image upload, drag-and-drop, and in-browser PNG/JPG/WEBP preview.
- Design explorer, layer selection, sample design tokens, inspector controls, and editable code placeholder.
- Simulated generation progress, explicitly marked as a demo.
- Component gallery, model settings, generation history, and local preferences.

Project images are previewed locally in the browser and are not uploaded to a service. Project records and settings are stored in browser local storage. The generation sequence and model statuses are illustrative only.

## Planned integration boundary

The UI is organized so an API client and local inference services can be added without coupling them to presentation components. Future work can introduce typed API/domain packages, validated IR schemas, model adapters, vision analysis, code generation, preview isolation, comparison, and project export. Those capabilities are not implemented or represented as working in this release.
