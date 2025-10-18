# 🚀 BicepFlex

**Azure infrastructure generator using Bicep** - The flexible way to deploy to Azure

BicepFlex helps you generate production-ready Azure infrastructure code (Bicep) with CI/CD pipelines in minutes, not hours. Available as both a beautiful web UI and a powerful CLI tool.

## ✨ Features

- 🎯 **Interactive CLI** - Guided setup with framework detection
- 🌐 **Web UI** - Visual configuration with real-time pricing
- 📦 **Framework Templates** - Pre-configured for React, Next.js, Vue, Angular, and more
- 💰 **Cost Estimation** - See estimated monthly costs before deploying
- 🔄 **CI/CD Ready** - GitHub Actions and Azure Pipelines support
- 🏗️ **Best Practices** - Built-in validation and security recommendations
- 🌍 **Multi-Region** - Compare costs and features across Azure regions

## 🎬 Quick Start

### Install

```bash
npm install -g bicepflex
```

### Interactive Setup (Recommended)

```bash
cd my-project
bicepflex init
```

The CLI will:
- ✅ Auto-detect your framework (React, Next.js, Vue, etc.)
- ✅ Ask about databases, storage, monitoring
- ✅ Generate Bicep files and CI/CD workflows
- ✅ Provide deployment instructions

### Visual Configuration

Prefer a graphical interface?

```bash
bicepflex ui
```

Opens a web interface where you can visually configure your infrastructure.

### Quick Generate

Know exactly what you want?

```bash
bicepflex generate --template=react-vite --name=my-app
```

## 📖 Usage

### Three Ways to Use BicepFlex

#### 1. Interactive CLI (Best for beginners)

```bash
bicepflex init
```

Asks questions and generates everything automatically.

#### 2. Web UI (Best for visual learners)

```bash
bicepflex ui
```

Configure everything in your browser with instant feedback.

#### 3. Quick Generate (Best for automation)

```bash
bicepflex generate --template=nextjs --name=my-app --cicd=github
```

Non-interactive mode perfect for CI/CD pipelines.

## 🎯 Examples

### React + Vite App

```bash
# In your React project
bicepflex init

# Follow prompts:
# ✓ Detects React + Vite automatically
# ✓ Generates Static Web App
# ✓ Includes GitHub Actions workflow
# ✓ Ready to deploy in minutes
```

### Next.js with Database

```bash
bicepflex generate \
  --template=nextjs-app \
  --name=my-nextjs-app \
  --cicd=github

# Generates:
# - Static Web App for Next.js
# - Cosmos DB for data
# - App Insights for monitoring
# - GitHub Actions workflow
# - Deployment scripts
```

### Express API with SQL

```bash
cd my-api
bicepflex init

# Select:
# ✓ Framework: Express
# ✓ Database: Azure SQL
# ✓ CI/CD: Azure Pipelines
# ✓ Monitoring: Yes
```

## 📋 Available Templates

Run `bicepflex templates` for the full list:

| Template | Framework | Use Case |
|----------|-----------|----------|
| `react-vite` | React + Vite | Modern React SPA |
| `nextjs-app` | Next.js | Full-stack with SSR |
| `vue-spa` | Vue.js | Vue single-page app |
| `angular-app` | Angular | Enterprise Angular app |
| `express-api` | Express | Node.js REST API |

## 🔧 CLI Commands

### `bicepflex init`

Interactive setup with framework detection.

```bash
bicepflex init [options]

Options:
  --force         Overwrite existing files
  --output <path> Output directory (default: current)
```

### `bicepflex ui` / `bicepflex init-web`

Launch the web UI.

```bash
bicepflex ui [options]

Options:
  --port <number> Port for web server (default: 5173)
```

### `bicepflex generate`

Generate from template or config file.

```bash
bicepflex generate [options]

Options:
  --template <name>  Template ID (e.g., react-vite)
  --config <path>    JSON config file
  --name <name>      Project name
  --output <path>    Output directory
  --force            Overwrite existing files
  --cicd <platform>  github, azure, both, or none
```

### `bicepflex templates` / `bicepflex list`

List all available templates.

## 📁 Generated Files

BicepFlex generates everything you need:

```
your-project/
├── infra/
│   ├── main.bicep               # Infrastructure as Code
│   └── main.parameters.json     # Deployment parameters
├── .github/workflows/
│   └── azure-deploy.yml         # GitHub Actions CI/CD
├── azure.yaml                   # Azure Developer CLI config
├── deploy.sh                    # Manual deployment script
└── README.infra.md             # Deployment guide
```

## 🚀 Deployment

### Option 1: GitHub Actions (Recommended)

1. Set up GitHub secrets:
   ```bash
   gh secret set AZURE_CLIENT_ID --body="..."
   gh secret set AZURE_TENANT_ID --body="..."
   gh secret set AZURE_SUBSCRIPTION_ID --body="..."
   ```

2. Push to trigger deployment:
   ```bash
   git add infra/ azure.yaml .github/
   git commit -m "Add Azure infrastructure"
   git push
   ```

### Option 2: Manual Deployment

```bash
# Login to Azure
az login

# Deploy
bash deploy.sh
```

### Option 3: Azure Developer CLI

```bash
azd up
```

## 💰 Cost Estimation

Templates include estimated monthly costs:

- **Free Tier**: $0/month (Static Web Apps Free)
- **Basic**: $15-30/month (Basic App Service + SQL)
- **Standard**: $50-150/month (Standard tier + monitoring)
- **Premium**: $200+/month (Premium SKUs with HA)

> *Actual costs depend on usage and region*

## 🎓 Framework Detection

BicepFlex automatically detects your framework:

| Framework | Detection Method |
|-----------|-----------------|
| Next.js | `package.json` has `next` |
| React + Vite | `package.json` has `react` + `vite` |
| Vue | `package.json` has `vue` |
| Angular | `package.json` has `@angular/core` |
| Express | `package.json` has `express` |

## 🔐 Security Best Practices

BicepFlex enforces security by default:

- ✅ HTTPS-only endpoints
- ✅ Managed identities where possible
- ✅ Key Vault for secrets
- ✅ Network security groups
- ✅ Latest TLS versions
- ✅ Minimal permissions

## 🛠️ Development

### Setup

```bash
git clone https://github.com/yourusername/bicepflex.git
cd bicepflex
npm install
```

### Run Web UI

```bash
npm run dev
```

### Test CLI

```bash
npm run dev:cli
```

### Build

```bash
npm run build        # Build everything
npm run build:web    # Build web UI only
npm run build:cli    # Build CLI only
```

### Test Locally

```bash
npm link
bicepflex --help
```

## 📚 Documentation

- **CLI Guide**: [CLI_GUIDE.md](./CLI_GUIDE.md)
- **Deployment Guide**: [DEPLOY_BICEPFLEX.md](./DEPLOY_BICEPFLEX.md)
- **Development**: [DEVELOPMENT.md](./DEVELOPMENT.md)

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](./LICENSE)

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/bicepflex/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/bicepflex/discussions)
- **Documentation**: [Full Docs](https://github.com/yourusername/bicepflex/wiki)

## 🙏 Acknowledgments

Built with:
- [Bicep](https://docs.microsoft.com/azure/azure-resource-manager/bicep/) - Azure Infrastructure as Code
- [Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/) - Deployment tooling
- [Vite](https://vitejs.dev/) - Web UI build tool
- [React](https://react.dev/) - UI framework
- [Commander.js](https://github.com/tj/commander.js/) - CLI framework

---

**Made with ❤️ for the Azure community**

*Deploy faster. Deploy smarter. Deploy with BicepFlex.*
