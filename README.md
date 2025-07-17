# Learn Erlang Step-by-Step

An interactive tutorial website for learning Erlang by building a WebSocket chat server from scratch. This project teaches Erlang through hands-on coding, progressing from basic syntax to building a production-ready distributed chat system.

## 🎯 What You'll Build

Through 35 progressive lessons, you'll build a complete WebSocket chat server while learning:

- Erlang fundamentals and functional programming
- OTP (Open Telecom Platform) patterns
- Concurrent and distributed systems
- Real-time communication with WebSockets
- Production deployment and operations

## ✨ Features

- **Interactive Koans**: Fill-in-the-blank exercises with immediate feedback
- **Progressive Learning**: Each lesson builds on the previous ones
- **Real Project**: Build an actual chat server, not just toy examples
- **Modern UI**: Dark/light mode, syntax highlighting, progress tracking
- **Responsive Design**: Works great on desktop and mobile
- **Fast Search**: Quick lesson search with keyboard shortcuts (Cmd/Ctrl+K)

## 🚀 Getting Started

### Prerequisites

- Node.js 22
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/pennypack/learn-erlang.git
cd learn-erlang

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:4321
```

### Building for Production

```bash
# Type check and build
npm run build

# Preview production build
npm run preview
```

## 📝 Contributing

We welcome contributions! Here's how you can help:

### Reporting Issues

- Check existing issues first
- Use issue templates when available
- Include browser/OS information for UI issues
- Provide code examples for content issues

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run type checking: `npx astro check`
5. Commit with clear messages: `git commit -m "Add: your feature"`
6. Push to your fork: `git push origin feature/your-feature`
7. Open a pull request

### Content Guidelines

When contributing lessons or koans:

- Follow the existing lesson structure
- Keep examples practical and building toward the chat server
- Write clear, concise explanations
- Include 6-8 koans per lesson testing key concepts
- Test all code examples
- Follow the writing style in existing lessons

### Code Style

- Use TypeScript for new components
- Follow existing formatting (2 space indentation)
- Keep components small and focused
- Add comments for complex logic

### Adding New Lessons

1. Create a new file in `src/content/lessons/`
2. Use the required frontmatter:

```markdown
---
title: "Your Lesson Title"
description: "Brief description"
postNumber: 36
publishDate: 2025-01-17T00:00:00Z
tags: ["erlang", "your-topic"]
difficulty: "intermediate"
prerequisites: [1, 2, 3]
---
```

3. Write content following the established pattern
4. Add interactive koans at the end
5. Test the lesson thoroughly

## 🏗️ Project Structure

```
src/
├── components/       # UI components
├── content/
│   ├── config.ts    # Content schema
│   └── lessons/     # Tutorial lessons
├── layouts/         # Page layouts
├── pages/           # Routes
└── styles/          # Global styles
```

## 🛠️ Tech Stack

- **Framework**: Astro
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Syntax Highlighting**: Expressive Code
- **Interactive Koans**: Custom Erlang interpreter

## 🧮 JavaScript Erlang Interpreter

The interactive koans are powered by a custom JavaScript-based Erlang interpreter located in `/js-erlang-interpreter`. This interpreter:

- Supports basic Erlang syntax for educational exercises
- Handles pattern matching, lists, atoms, and function calls
- Provides immediate feedback for learning
- Runs entirely in the browser for a seamless experience

### Current Limitations

The interpreter is designed for teaching basic concepts and currently supports:
- Simple pattern matching
- List operations
- Basic arithmetic and comparisons
- Atoms and tuples
- Simple function definitions

### Contributing to the Interpreter

The interpreter needs enhancement to support more advanced koans. Areas for improvement include:
- Map syntax and operations
- Process spawning and message passing
- More complex pattern matching scenarios
- Binary syntax
- Guards and list comprehensions
- Module system basics

If you're interested in extending the interpreter, see `/js-erlang-interpreter/README.md` for implementation details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- The Erlang/OTP team for creating an amazing platform
- The Astro team for their fantastic framework
- All contributors who help improve this tutorial

## 🔗 Links

- [Live Site](https://learnerlang.com)
- [Report Issues](https://github.com/pennypack/learn-erlang/issues)
- [Discussions](https://github.com/pennypack/learn-erlang/discussions)

---

Built with ❤️ by Pennypack Software and the Erlang Community
