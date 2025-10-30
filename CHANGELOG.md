# Changelog

All notable changes to BicepFlex will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- LICENSE file (MIT License)
- CONTRIBUTING.md with contribution guidelines
- CHANGELOG.md for tracking project changes
- GitHub Actions workflows for CI/CD
- Test infrastructure with Vitest and React Testing Library
- Comprehensive test suite for core services

### Changed
- Updated package.json repository URL to correct GitHub repository
- Improved TypeScript type safety by removing `any` types
- Fixed React hooks violations in components

### Fixed
- Security vulnerabilities in dependencies (npm audit)
- All ESLint warnings and errors
- Regex escape character warnings
- Unused variable warnings

## [0.1.0] - 2024-10-30

### Added
- Initial release
- Interactive CLI for Azure infrastructure setup
- Web UI for visual configuration
- Framework detection (React, Next.js, Vue, Angular, Express)
- Bicep template generation
- CI/CD workflow generation (GitHub Actions, Azure Pipelines)
- Azure pricing integration
- Cost estimation
- Multi-region support
- Best practices validation
- Tag management
- Export/import configurations
- Comprehensive documentation

### Features
- 🎯 Interactive CLI with framework auto-detection
- 🌐 Web UI with real-time pricing
- 📦 Pre-configured framework templates
- 💰 Cost estimation before deployment
- 🔄 CI/CD ready (GitHub Actions & Azure Pipelines)
- 🏗️ Security best practices built-in
- 🌍 Multi-region comparison

[Unreleased]: https://github.com/wallissam/BicepFlex/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/wallissam/BicepFlex/releases/tag/v0.1.0
