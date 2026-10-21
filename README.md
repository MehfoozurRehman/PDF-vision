# PDF Vision

A desktop PDF workspace: an Electron shell around a Next.js 14 interface, with a PDF viewer, signature tools, and a separate Stirling-PDF server for the heavy document operations.

## The problem

Everyday PDF work (viewing, merging, splitting, exporting, signing) is usually spread across web tools and paid desktop editors. PDF Vision brings these tasks into one desktop window. The interface and viewer run locally in the renderer, and document processing is delegated to a backend, so the project is a study in splitting responsibilities between a desktop shell, a UI layer and a PDF engine.

## What it does

- **Viewing**: `PDFViewer.tsx` renders the active document with `pdfjs-dist` (pdf.js), loading its worker from `/pdf.worker.min.js`.
- **Merge, split and export**: `MergeModal`, `SplitModal` and `ExportModal` call the Stirling-PDF API through a `useStirlingAPI` hook. The same hook covers compression, watermarking, password changes and PDF-to-image conversion.
- **Signing (in progress)**: `SignModal` lets you draw or type a signature and pick a font. The desktop shell can generate a 2048-bit RSA key pair and an X.509 certificate with `node-forge`. Applying the signature to the PDF is still a TODO.
- **Native desktop integration**: Open and save dialogs, message boxes, and app version and path lookups are exposed to the renderer through a narrow `contextBridge` API in `preload.js`.
- **Document workspace panels**: Thumbnails, bookmarks, layers and annotations panels sit beside the viewer, with a quick-actions toolbar and a tools menu.

## How it's built

- **Shell**: Electron 27. `main.js` opens a `BrowserWindow`. In development it loads `http://localhost:3000`. In production it loads the static export from `out/`.
- **Renderer**: Next.js 14 with `output: "export"`, React 18, Tailwind CSS 3 and React Hot Toast. State lives in two React context stores with `useReducer` (`src/store/pdf-store.tsx` and `src/store/ui-store.tsx`).
- **Decision 1: PDF engine behind an HTTP boundary.** Heavy operations go to a Stirling-PDF server. `src/api/stirling-client.ts` is a typed client with a default base URL of `http://localhost:8081`, and `src/api/endpoints.ts` maps each operation to its route. `INTEGRATION_PLAN.md` records the reasoning for this.
- **Decision 2: privileged code stays in the preload.** Key generation runs in `preload.js` and is exposed as `cryptoAPI`, so the renderer never loads `node-forge` or touches Node APIs directly.

## Running it locally

Requires Node.js 18 or later, and a Stirling-PDF server on port 8081 for merge, split and export. Stirling-PDF is not included in this repo.

```bash
pnpm install        # or: npm install
pnpm dev:next       # web UI only, at http://localhost:3000
pnpm dev            # Next.js and Electron together
pnpm build          # Next.js production build
pnpm build:electron # packaged desktop app via electron-builder
```


## What I learned and what I'd do next

- **Signing is half built.** Key and certificate generation work, but `SignModal` does not yet place the signature on the document.
- **Several features are stubbed.** Undo and redo, in-document search highlighting, Bates numbering and saving settings have UI but no logic. The source has about two dozen TODO comments.
- **Unused dependencies.** `fabric`, `jspdf`, `@headlessui/react`, `framer-motion` and the `@react-pdf-viewer/*` packages are listed in `package.json` but not imported anywhere in `src`. Either build on them or remove them.
- **Packaging config points at missing files.** The `electron-builder` config references `assets/icon.ico` and `assets/icon.icns`, and there is no `assets/` folder in the repo.
- **Make the backend URL configurable.** The Stirling-PDF base URL is hard-coded as a default in the client. It should come from an environment setting.
- **Add tests.** There is no test suite. The Stirling client and the PDF operation hooks are the first candidates.

## Author

Created by [Mehfooz-ur-Rehman](https://github.com/MehfoozurRehman).
