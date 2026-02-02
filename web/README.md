# Charleston Pride - Web Application

Next.js web application for Charleston Pride, featuring a statically exported site with Sanity CMS for content management.

## Tech Stack

- **Framework**: Next.js 15.1.0 (static export)
- **CMS**: Sanity CMS v3
- **Styling**: Bootstrap 5 + Soft UI Design System Pro
- **TypeScript**: Full type safety with generated Sanity types
- **Deployment**: Azure Static Web Apps

## Getting Started

### Prerequisites

- Node.js 20.14.0 or higher
- npm 10.7.0 or higher

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Sanity Studio

The Sanity Studio is integrated into the Next.js app and available at:

- Development: [http://localhost:3000/studio](http://localhost:3000/studio)
- Production: `https://yourdomain.com/studio`

To run Sanity Studio standalone:

```bash
npm run studio
```

This starts the studio on [http://localhost:3333](http://localhost:3333).

## Available Scripts

- **`npm run dev`** - Start development server on port 3000
- **`npm run build`** - Build for production (static export to `/build`)
- **`npm run start`** - Start production server (serves static export)
- **`npm run studio`** - Run Sanity Studio standalone on port 3333
- **`npm run typegen`** - Generate TypeScript types from Sanity schema
- **`npm run lint`** - Run ESLint
- **`npm run format`** - Format code with Prettier

## Project Structure

```
web/
├── app/                    # Next.js App Router
│   ├── (pages)/           # Dynamic pages
│   ├── layout.tsx         # Root layout
│   └── studio/            # Sanity Studio route
├── components/            # React components
│   ├── card/             # Card components
│   ├── header/           # Header components
│   └── portableText/     # Portable Text renderers
├── sanity/               # Web-specific Sanity configuration
│   └── lib/              
│       ├── client.ts     # Sanity client instance
│       ├── env.ts        # Sanity project configuration
│       ├── image.ts      # Image URL builder utilities
│       └── utils.ts      # Helper functions
├── styles/               # SCSS stylesheets
│   ├── globals.scss      # Global styles & Bootstrap imports
│   ├── custom/           # Custom overrides
│   └── soft-design-system-pro/  # Theme files
├── public/               # Static assets
├── next.config.mjs       # Next.js configuration
├── sanity.config.ts      # Sanity Studio configuration
└── tsconfig.json         # TypeScript configuration
```

## Configuration

### Sanity Configuration

Sanity credentials are configured in `sanity/lib/env.ts`:

```typescript
export const apiVersion = "2024-08-04";
export const dataset = "production";
export const projectId = "jgra26o6";
export const studioUrl = "http://localhost:3333";
```

### TypeScript Path Aliases

The project uses TypeScript path aliases configured in `tsconfig.json`:

- **`@/*`** - Maps to `web/*` (local application code)
- **`@sanity/*`** - Maps to `../sanity-schema/*` (shared schema from parent directory)

Example imports:

```typescript
import { client } from "@/sanity/lib/client";           // Local web client
import { Page } from "@sanity/lib/sanity.types";        // Shared types
import { homeQuery } from "@sanity/queries";            // Shared queries
```

## Building for Production

The application is configured for static export:

```bash
npm run build
```

This generates a static site in the `/build` directory that can be deployed to any static hosting service.

### Build Configuration

- **Output**: Static HTML/CSS/JS export
- **Output Directory**: `build/`
- **Trailing Slash**: Enabled
- **Image Optimization**: Disabled (for static export compatibility)

## Deployment

The application automatically deploys to Azure Static Web Apps via GitHub Actions when changes are pushed to the `main` branch.

### Manual Deployment

After building, deploy the `/build` directory to your hosting provider:

```bash
npm run build
# Deploy the /build directory
```

## Development Notes

### Sass Deprecation Warnings

You may see Sass deprecation warnings during development. These are from the Soft UI Design System theme and Bootstrap, and do not affect functionality. They will be addressed in future updates.

### Type Generation

After modifying Sanity schemas in `../sanity-schema/`, regenerate types:

```bash
npm run typegen
```

This command:
1. Extracts the schema to `schema.json`
2. Generates TypeScript types to `sanity/lib/sanity.types.ts`

The generated types are automatically used throughout the application.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [TypeScript](https://www.typescriptlang.org/docs)
