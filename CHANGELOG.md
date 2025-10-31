# Changelog

All notable changes to BicepFlex will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - Foundation & Infrastructure
- LICENSE file (MIT License)
- CONTRIBUTING.md with comprehensive contribution guidelines
- CHANGELOG.md for tracking project changes
- GitHub Actions workflows for CI/CD (lint, test, build jobs)
- Test infrastructure with Vitest and React Testing Library
- Comprehensive test suite for core services (24 tests)
- TypeScript interfaces for type safety (BicepParameter, BicepOutput, AzdService)

### Added - User Experience (Phase 1: Core UX)
- **Dark Mode Support**: Full light/dark theme with persistent user preference
- **Smart Cost Alert System**: 3-tier warning system with cost optimization suggestions
- **Enhanced Validation Panel**: Real-time best practices validation with filtering

### Added - User Experience (Phase 2: Deployment Success)
- **Deployment Readiness Checklist**: Progressive checklist with 6-7 deployment prerequisites
- **Resource Naming Helper**: Azure-compliant naming validation for 15 resource types
- **Auto-Save Indicator**: Visual save status with timestamp display

### Added - User Experience (Phase 3: Workflow Efficiency)
- **Download as Package**: Shell script download with complete project structure
- **Quick Copy Commands**: 8 essential Azure CLI commands with one-click copy
- **Enhanced Keyboard Shortcuts**: 9 shortcuts organized by category

### Added - User Experience (Phase 4: Advanced Features)
- **Best Practices Scorecard**: 4 quality scores (Overall, Security, Cost, Reliability)
- **Template Library**: 8 pre-configured project templates (Web, API, Data, Full-Stack, etc.)
- **Cost Comparison Tool**: Side-by-side SKU comparison with savings calculator
- **Resource Search & Filter**: Real-time search/filter/sort for resource management

### Added - User Experience (Phase 5: Polish & Integration)
- **Resource Dependency Viewer**: Visualize dependencies and deployment order
- **Multi-Format Export**: Export as Markdown, JSON, or deployment steps guide
- **Inline Documentation Helper**: Contextual help bubbles throughout the application
- **Comprehensive README**: Professional documentation with feature list and quick start

### Added - User Experience (Phase 6: External Data Integrations)
- **Azure Pricing Insights**: Real-time cost optimization from Azure Retail Prices API
  - Region-specific pricing recommendations
  - SKU optimization suggestions (up to 60% savings)
  - Service-specific cost-saving tips
  - Automated savings calculations
- **Region Health Status**: Live Azure service availability monitoring
  - Real-time status for 10+ Azure services
  - Health indicators (healthy/degraded/outage)
  - Expandable service grid
  - Links to Azure Status page
- **Contextual Documentation**: 25+ smart Azure documentation links
  - Resource-specific guides (9 resource types)
  - Bicep documentation (4 guides)
  - Deployment guides (3 resources)
  - Cost optimization resources
  - Category-based organization

### Added - User Experience (Phase 7: Advanced Analytics)
- **Cost Projection & Forecasting**: Long-term budget planning
  - Multi-timeframe projections (6 months, 1 year, 2 years)
  - Growth modeling with 3% monthly growth simulation
  - Visual month-by-month cost trends
  - Reserved Instances recommendations (up to 72% savings)
  - Resource count projections
- **Security Checklist & Assessment**: Comprehensive security posture analysis
  - 13 automated security checks across 5 categories
  - Network security validation (firewall, private endpoints)
  - Identity & access management checks (Key Vault, managed identity, RBAC)
  - Data protection validation (encryption, backups, storage security)
  - Monitoring & logging assessment (Application Insights, security alerts)
  - Code security scanning (secrets detection)
  - Priority-based recommendations (Critical, High, Medium, Low)
  - Overall security score with category breakdowns

### Changed
- Updated package.json repository URL to wallissam/BicepFlex
- Improved TypeScript type safety by eliminating all `any` types
- Fixed React hooks violations (useQuery.map → useQueries)
- Enhanced UI components with dark mode support
- Improved cost estimation accuracy
- Updated dependencies to resolve security vulnerabilities

### Fixed
- TypeScript build errors (unused imports, missing resource types, Tailwind dynamic classes)
- Security vulnerabilities in dependencies (3 of 5 fixed)
- All ESLint warnings and errors (27 → 0)
- Regex escape character warnings
- Unused variable warnings
- Template string escape issues
- React hooks violations (useQuery.map → useQueries)
- Tailwind CSS purging issues with dynamic class names

### Security
- Fixed 3 of 5 npm audit vulnerabilities
- Added CodeQL security scanning (0 alerts)
- Implemented comprehensive security checklist (13 automated checks)
- Enhanced secret management validation
- Network security validation (firewall rules, private endpoints)
- Data encryption validation (transit and rest)

### Security
- Fixed 3 npm audit vulnerabilities (inquirer, tmp)
- Remaining 2 moderate vulnerabilities require Vite 7 upgrade

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
