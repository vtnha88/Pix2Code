# Pixel2Code

Pixel2Code is a local-first design-to-code prototype. It includes scripts to build and run a separate local llama.cpp server. Pixel2Code itself does **not** connect to that server, run AI inference, analyze image pixels, generate code, or export projects.

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
npm run test:llama
```

## Frontend structure

`apps/web` is the Next.js App Router application. Its route pages stay small and delegate to feature components under `src/components`. Project data and prototype preferences are persisted in browser local storage. The UI currently has no inference backend.

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
- Component gallery, llama.cpp setup instructions, generation history, and local preferences.

Project images are previewed locally in the browser and are not uploaded to a service. Project records and settings are stored in browser local storage. The generation sequence remains illustrative only.

## llama.cpp setup

The scripts build a pinned [llama.cpp](https://github.com/ggml-org/llama.cpp) revision for CPU-only inference, download a vision model and its projector, and run `llama-server` on localhost. On macOS, install the Xcode Command Line Tools (`xcode-select --install`), Git, CMake, curl, and shasum first. Internet access is needed for the initial source checkout and model downloads.

From the project root:

```bash
npm run llama:install
npm run llama:run -- \
  --model "$PWD/Qwen2.5-VL-3B-Instruct-Q4_K_M.gguf" \
  --mmproj "$PWD/mmproj-Qwen2.5-VL-3B-Instruct-Q8_0.gguf"
```

The build is stored in the ignored `.local/llama.cpp` directory. Installation stops rather than overwriting a modified or different checkout. If an initial checkout fails, inspect that directory before removing it and retrying. Set `LLAMA_BUILD_JOBS` to change the default of two build jobs.

You can instead use another compatible GGUF model from a source you trust; check its license and hardware requirements. For vision, choose a model supported by llama.cpp and, if its documentation requires a separate projector, provide the matching file:

```bash
npm run llama:run -- --model "/absolute/path/to/vision-model.gguf" --mmproj "/absolute/path/to/mmproj.gguf"
```

### Suggested model for screenshots

For initial experimentation with screenshot understanding, `npm run llama:install` downloads **Qwen2.5-VL-3B-Instruct**, a vision-language model, and its projector into the project root:

1. [Qwen2.5-VL-3B-Instruct-Q4_K_M.gguf](https://huggingface.co/ggml-org/Qwen2.5-VL-3B-Instruct-GGUF/resolve/main/Qwen2.5-VL-3B-Instruct-Q4_K_M.gguf?download=true) — the model.
2. [mmproj-Qwen2.5-VL-3B-Instruct-Q8_0.gguf](https://huggingface.co/ggml-org/Qwen2.5-VL-3B-Instruct-GGUF/resolve/main/mmproj-Qwen2.5-VL-3B-Instruct-Q8_0.gguf?download=true) — the matching vision projector needed to process images.

The downloads total approximately 2.8 GB (decimal), in addition to the build. They are ignored by Git. The installer verifies SHA-256 checksums, reuses verified files, and refuses to overwrite a file with a different checksum. If a download fails, rerun the installer; incomplete downloads are discarded.

This is a starting point, not a guarantee of frontend code quality or performance. The model and projector have not yet been tested with this project; older Intel CPUs may be slow. A separate coding model may be useful for improving generated code in a future integration.

The server runs in the foreground at `http://127.0.0.1:8080`; stop it with Ctrl+C. It restricts browser CORS to the server's own origin but does not require an API key: other local processes can access it. To customize its port or context size, append `--port 8081 --context 2048`. Once it has finished loading the model, verify it in another terminal:

```bash
curl --fail http://127.0.0.1:8080/health
curl --fail http://127.0.0.1:8080/v1/models
```

If the server does not start, check the terminal output, the model and projector paths, available RAM, and whether the port is already in use. Inference on older Intel CPUs can be slow. Once the source, dependencies, and model files are present, running the server does not require an internet connection.

Running the server enables its own local API, but the Pixel2Code UI does not yet connect to it. Vision support depends on the selected model and projector; starting the server alone does not analyze screenshots or generate frontend code.

## Planned integration boundary

The UI is organized so local inference services can be added without coupling them to presentation components. Future work can introduce typed API/domain packages, validated IR schemas, model adapters, vision analysis, code generation, preview isolation, comparison, and project export. Those capabilities are not implemented or represented as working in this release.
