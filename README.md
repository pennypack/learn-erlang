# Learn Erlang Step-By-Step Tutorial Website

An Astro-based tutorial website for learning Erlang by building a WebSocket chat server from scratch.

## Features

- 📚 **Content Collections** - Structured tutorial posts with metadata
- 🎨 **Dark/Light Mode** - Automatic and manual theme switching
- 🔍 **Search Functionality** - Quick post search with keyboard shortcuts
- 📊 **Progress Tracking** - LocalStorage-based completion tracking
- ⏱️ **Reading Time** - Estimated reading time for each post
- 📑 **Table of Contents** - Auto-generated for longer posts
- 🖨️ **Print-Friendly** - Optimized CSS for printing
- ⌨️ **Keyboard Navigation** - Arrow keys for prev/next, Cmd+K for search
- 🔥 **Syntax Highlighting** - Erlang code highlighting with copy buttons
- 📱 **Responsive Design** - Mobile-friendly layout
- 🚀 **GitHub Integration** - Edit links and issue templates

## Project Structure

```
src/
├── components/         # Reusable Astro components
├── content/           
│   ├── config.ts      # Content collection schema
│   └── posts/         # Tutorial markdown files
├── layouts/           # Page layouts
├── pages/             # Route pages
└── styles/            # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Adding New Posts

1. Create a new markdown file in `src/content/posts/`:

```markdown
---
title: "Your Post Title"
description: "Brief description"
postNumber: 2
publishDate: 2024-01-03T00:00:00Z
tags: ["erlang", "concurrency"]
difficulty: "intermediate"
estimatedReadingTime: 20
prerequisites: [0, 1]
---

Your content here...
```

2. Posts are automatically added to navigation and homepage

## Configuration

### Site Settings

Edit `astro.config.mjs`:

```js
export default defineConfig({
  site: 'https://your-domain.com',
  // Other config...
});
```

### GitHub Integration

Update GitHub URLs in:
- `src/components/Header.astro`
- `src/components/Sidebar.astro`
- `src/layouts/PostLayout.astro`

## Deployment

### GitHub Pages

1. Push to GitHub
2. Enable GitHub Pages in repository settings
3. GitHub Actions will automatically deploy on push to main

### Vercel

```bash
npm run build
# Deploy dist/ folder
```

## Customization

### Themes

Edit theme colors in:
- `tailwind.config.mjs`
- `src/styles/global.css`

### Code Highlighting

Configure in `astro.config.mjs`:

```js
expressiveCode({
  themes: ['dracula', 'github-light'],
  // Other options...
})
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT