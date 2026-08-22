# PDF Vision: Professional Desktop PDF Editor & Annotation Suite

A cross-platform desktop PDF editor, annotation suite, electronic signature signer, and document manipulation tool built with Electron, Next.js 14, React 18, Fabric.js, PDF-Lib, and `@react-pdf-viewer`.

## Overview

`PDF-vision` delivers desktop-grade PDF productivity tools:
- **Interactive Annotation & Drawing**: Vector canvas overlay with Fabric.js (`fabric`) for highlighting, redaction, and shape drawing.
- **Document Manipulation**: Page reordering, splitting, merging, and stamping using `pdf-lib` and `jspdf`.
- **Digital Signatures**: Cryptographic pass/cert signing integration with `node-forge`.
- **PDF Viewing**: Comprehensive pagination, text search, and zooming via `@react-pdf-viewer/core`.

## Tech Stack

- **Desktop Framework**: [Electron](https://www.electronjs.org/) (v27) & [Next.js](https://nextjs.org/) (v14)
- **PDF Engines**: `pdf-lib`, `jspdf`, `pdfjs-dist`, `@react-pdf-viewer/core`
- **Canvas & Drawing**: Fabric.js (`fabric`)
- **State Management**: Zustand
- **Styling**: Tailwind CSS (v3), Framer Motion, Heroicons

## Prerequisites

- Node.js (v18 or higher recommended)
- Package manager (`pnpm` or `npm`)

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

2. **Run in Development Mode**:
   ```bash
   pnpm dev
   ```

3. **Run Web Client Only**:
   ```bash
   pnpm dev:next
   ```

## Available Scripts

- `pnpm dev` - Concurrently starts Next.js development server and Electron shell.
- `pnpm build` - Compiles the Next.js production build.
- `pnpm build:electron` - Bundles the Electron desktop executable via `electron-builder`.
- `pnpm pack:win` - Packages a Windows installer.
- `pnpm dist` - Generates distribution installers across platforms.

## Author

Created by [Mehfooz-ur-Rehman](https://github.com/MehfoozurRehman).
