# Contributing to BicepFlex

Thank you for your interest in contributing to BicepFlex! This document provides guidelines and instructions for contributing.

## 🤝 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Basic knowledge of TypeScript, React, and Azure Bicep

### Setup Development Environment

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/BicepFlex.git
   cd BicepFlex
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev        # Web UI
   npm run dev:cli    # CLI development
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

## 📝 Development Workflow

### Making Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes:**
   ```bash
   npm run lint       # Check code style
   npm run build      # Verify it builds
   npm test           # Run tests (if available)
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```
   
   We follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

5. **Push and create a Pull Request:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Pull Request Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Ensure all checks pass (lint, build, tests)
- Keep changes focused and atomic
- Update documentation as needed

## 🎨 Code Style

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types - use proper type definitions
- Export types that may be reused
- Document complex types with JSDoc comments

### React Components

- Use functional components with hooks
- Follow the existing component structure
- Keep components focused and single-purpose
- Use proper TypeScript types for props

### File Organization

```
src/
├── components/     # React UI components
├── services/       # Business logic and API clients
├── store/          # State management (Zustand)
├── types/          # TypeScript type definitions
├── data/           # Static data and configurations
└── utils/          # Utility functions
```

## 🧪 Testing

- Write tests for new features
- Ensure existing tests pass
- Test manually in both CLI and Web UI modes
- Validate generated Bicep templates:
  ```bash
  az bicep build --file infra/main.bicep
  ```

## 📚 Documentation

When adding new features:

1. Update relevant documentation in `/docs`
2. Add JSDoc comments for public APIs
3. Update README.md if user-facing
4. Add examples for new CLI commands

## 🐛 Reporting Bugs

When reporting bugs, include:

- Clear description of the issue
- Steps to reproduce
- Expected vs. actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots if applicable

Use the GitHub issue tracker and label appropriately.

## 💡 Feature Requests

We welcome feature requests! Please:

- Check if it's already been requested
- Clearly describe the use case
- Explain why it would benefit users
- Consider if it fits the project's scope

## 🔍 Adding New Azure Resources

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md#-adding-a-new-resource-type) for detailed instructions on adding support for new Azure resource types.

## 📦 Release Process

Maintainers handle releases:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create a git tag
4. Publish to npm
5. Create GitHub release

## 🎯 Areas We'd Love Help With

- 🧪 Adding test coverage
- 📖 Improving documentation
- 🌍 Supporting more Azure regions
- 🔧 Adding new Azure resource types
- 🐛 Fixing bugs
- ⚡ Performance improvements

## ❓ Questions?

- Check existing documentation
- Search closed issues
- Open a discussion on GitHub Discussions
- Reach out to maintainers

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to BicepFlex! 💪**
