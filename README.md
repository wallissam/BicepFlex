# BicepFlex 💪

> **Professional Azure Bicep Template Generator with Best Practices Built-In**

[![Build Status](https://github.com/wallissam/BicepFlex/workflows/CI/badge.svg)](https://github.com/wallissam/BicepFlex/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

BicepFlex is a comprehensive, user-friendly tool for generating production-ready Azure Bicep templates. With 16 advanced features, dark mode support, and intelligent cost optimization, it's the fastest way to create professional infrastructure-as-code.

## ✨ Features

### 🚀 Quick Project Setup
- **8 Pre-Configured Templates**: Web App, Serverless API, Microservices, Full-Stack, and more
- **One-Click Apply**: Setup complete projects in 30 seconds
- **Template Library**: Filter by category (Web, API, Data, Containers)

### 🎨 Modern User Experience
- **Dark Mode**: Professional theme with persistent preference
- **Auto-Save**: Never lose your work
- **Keyboard Shortcuts**: 9 shortcuts for power users
- **Inline Help**: Contextual documentation throughout

### 💰 Cost Management
- **Smart Cost Alerts**: 3-tier warning system ($100/$500 thresholds)
- **Cost Comparison**: Side-by-side SKU comparison with savings calculator
- **Monthly/Yearly Projections**: Make informed decisions
- **Top Cost Drivers**: Identify expensive resources instantly

### 🏆 Quality Assurance
- **Best Practices Scorecard**: 4 quality scores (Overall, Security, Cost, Reliability)
- **Real-Time Validation**: Catch issues before deployment
- **Deployment Readiness**: Pre-deployment checklist with progress tracking
- **Resource Dependencies**: Visualize deployment order

### 🔧 Developer Tools
- **Resource Naming Helper**: Azure-compliant naming for 15 resource types
- **Quick Copy Commands**: 8 essential Azure CLI commands
- **Multi-Format Export**: Markdown, JSON, deployment steps
- **Resource Search & Filter**: Find resources instantly in large projects

### 📦 Generated Outputs
- **Bicep Templates**: Main infrastructure definition
- **Parameters File**: Environment-specific values
- **Azure.yaml**: Azure Developer CLI configuration
- **CI/CD Pipelines**: GitHub Actions or Azure Pipelines
- **Deployment Scripts**: Ready-to-run PowerShell and Bash scripts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser
- (Optional) Azure CLI for deployment

### Installation

```bash
# Clone the repository
git clone https://github.com/wallissam/BicepFlex.git
cd BicepFlex

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to start building!

### Building for Production

```bash
# Build web application
npm run build:web

# Build CLI tool
npm run build:cli

# Run tests
npm test

# Run linting
npm run lint
```

## 📖 Usage

### Web Application

1. **Setup Project**: Enter project name and select Azure region
2. **Select Resources**: Choose from 15+ Azure resource types
3. **Configure**: Customize SKUs, naming, and properties with inline help
4. **Review**: Check scorecard, validate, and preview costs
5. **Generate**: Download Bicep templates and deployment scripts

## 🎯 Supported Resource Types

- **Compute**: Web Apps, Function Apps, Container Apps, Virtual Machines, AKS
- **Data**: SQL Database, Cosmos DB, Storage Accounts
- **Integration**: Service Bus, Event Hub
- **Caching**: Redis Cache
- **Management**: Key Vault, Application Insights, Container Registry
- **Web**: Static Web Apps

## 📊 Quality Metrics

- **Test Coverage**: 24 comprehensive tests
- **TypeScript**: 100% type-safe, zero `any` types
- **Build**: Zero errors, zero warnings
- **Security**: 60% of vulnerabilities fixed
- **Linting**: Clean codebase with ESLint
- **CI/CD**: Automated quality gates

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Vite](https://vitejs.dev/)
- Icons by [Lucide](https://lucide.dev/)
- Testing with [Vitest](https://vitest.dev/)

## 📚 Resources

- [Azure Bicep Documentation](https://learn.microsoft.com/azure/azure-resource-manager/bicep/)
- [Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/)
- [Azure Best Practices](https://learn.microsoft.com/azure/azure-resource-manager/bicep/best-practices)

---

**Made with ❤️ for the Azure community**
