# Creative Intelligence Gallery

The ultimate showcase for high-performance HTML5 ads. Explore, review, and curate premium creative galleries with professional-grade intelligence.

## Current features

- Google sign-in and protected routes through Supabase Auth
- Responsive gallery with search, filters, sorting, and creative detail dialogs
- Mock gallery records and preview images for local development
- Drag-and-drop ZIP selection with client-side validation
- Automatic detection of creative sizes from ZIP folder names
- Thumbnail extraction and validation from the ZIP
- Light and dark themes

> [!NOTE]
> Gallery data currently comes from `src/test/mockData.ts`. Submitting the upload form only simulates an upload; it does not yet save the ZIP, thumbnail, or metadata to Supabase.

## Tech stack

- React 19 and TypeScript
- Vite 8
- Tailwind CSS 4
- Base UI and shadcn components
- Supabase Auth
- JSZip and react-dropzone
- React Router

## Prerequisites

- Node.js 20.19+ or 22.12+ (required by Vite 8)
- npm
- A Supabase project with Google authentication configured

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

3. In Supabase, enable the Google provider and add your local URL (normally `http://localhost:5173`) to the allowed redirect URLs.

4. Start the development server:

   ```bash
   npm run dev
   ```

The app throws a startup error when either required Supabase variable is missing.

## Available scripts

| Command           | Purpose                                             |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Start the Vite development server                   |
| `npm run build`   | Type-check and create a production build in `dist/` |
| `npm run lint`    | Run ESLint across the project                       |
| `npm run preview` | Preview the production build locally                |

## ZIP requirements

The upload form accepts one ZIP file up to **50 MB**. A valid archive should contain:

- One or more creative folders named with a size prefix, such as `300x250-CreativeName/`
- A thumbnail named `thumbnail.jpeg`, `thumbnail.jpg`, `thumbnail.png`, `thumbnail.webp`, or `thumbnail.gif`

The creative folders and thumbnail may be at the ZIP root or inside one common parent folder. The thumbnail limit is **500 KB**. Analysis happens locally in the browser; the current submit action waits briefly and reports success without persisting files.

Example:

```text
MyCreative/
├── thumbnail.png
├── 300x250-MyCreative/
│   └── ...
└── 970x250-MyCreative/
    └── ...
```

## Mock data

Development gallery entries live in `src/test/mockData.ts`, with preview assets in `public/previews/`. These files are safe to commit when they contain only non-sensitive test content.

The mock `zip_path` values currently point to `zips/Test.zip`, but no matching public ZIP is included, so download behavior is not yet backed by a test archive.

Before using real data, replace the mock import in `src/features/gallery/components/GalleryContent/index.tsx` with a data source and implement the storage/database steps marked in the upload modal.

## Repository safety

The included `.gitignore` excludes dependencies, build output, local environment files, and logs. In particular, keep `.env.local` out of version control. Supabase publishable keys are designed for client use, but secrets such as service-role keys must never be committed.
