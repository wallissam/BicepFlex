# 💪 BicepFlex

**Trivialise your Azure infrastructure as code generation**

BicepFlex is a beautiful, modern Single Page Application (SPA) that makes it dead simple to generate production-ready Azure infrastructure definitions for the [Azure Developer CLI (azd)](https://learn.microsoft.com/azure/developer/azure-developer-cli/). Stop wrestling with Bicep syntax and deployment configurations—BicepFlex guides you through a wizard-like experience to create 100% valid infrastructure code with real-time pricing estimates.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Core Functionality
- 🎯 **Wizard-Based Interface**: Step-by-step guidance for infrastructure definition
- 💰 **Real-Time Pricing**: Live cost estimates from Azure Retail Prices API
- 🎨 **Modern UI**: Beautiful, responsive interface built with React + TailwindCSS
- 📦 **12+ Azure Resources**: Support for Web Apps, Functions, Databases, Storage, and more
- 🔍 **Schema Validation**: Generate 100% valid Bicep templates
- 📊 **Visual Configuration**: Configure SKUs and properties with an intuitive UI
- 📁 **Complete Project Generation**: Creates all necessary files (Bicep, azure.yaml, config)
- 🌍 **25+ Azure Regions**: Choose from all major Azure regions worldwide
- ⚡ **Fast & Lightweight**: Built with Vite for lightning-fast dev experience

### Premium Features
- 🚀 **Quick Start Templates**: 5 pre-configured templates for common scenarios
- 💾 **Auto-Save Progress**: LocalStorage persistence - never lose your work
- ⌨️ **Keyboard Shortcuts**: Power-user navigation (Ctrl+Arrow, Ctrl+S, etc.)
- 🌐 **Regional Cost Comparison**: Compare costs across up to 5 regions simultaneously
- 💡 **Contextual Tooltips**: Helpful hints throughout the interface
- 🎭 **Smooth Animations**: Professional micro-interactions and transitions
- 🛡️ **Error Recovery**: Graceful error handling with recovery options
- ✅ **Live Validation**: Real-time feedback on inputs with visual indicators

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern web browser

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 📖 How It Works

### The Wizard Flow

**Step 1: Project Basics**
- Name your project
- Choose your primary Azure region
- Get a preview of resource naming

**Step 2: Select Resources**
- Browse 12+ Azure resource types
- Filter by category (compute, database, storage, etc.)
- Search for specific resources
- Add multiple instances of the same resource type

**Step 3: Configure**
- Select pricing tiers (SKUs) for each resource
- View real-time cost estimates
- Configure resource-specific properties
- Set up runtime configurations

**Step 4: Review & Generate**
- Review all selected resources and total cost
- View generated Bicep templates
- Download all infrastructure files
- Get deployment instructions

### Generated Files

BicepFlex generates a complete, deployment-ready infrastructure package:

```
📁 Your Project
├── 📄 infra/
│   ├── main.bicep                  # Main infrastructure template
│   └── main.parameters.json        # Parameter values
├── 📄 azure.yaml                   # Azure Developer CLI config
└── 📄 .azure/
    └── config                      # Azure config defaults
```

## 🔗 Reliable Data Sources

BicepFlex uses **official Microsoft sources** for 100% accuracy:

### 1. Azure Retail Prices API
- **URL**: `https://prices.azure.com/api/retail/prices`
- **Purpose**: Real-time pricing for all Azure services
- **Features**: No auth required, OData filtering, regularly updated
- **Docs**: [Azure Retail Prices API](https://learn.microsoft.com/rest/api/cost-management/retail-prices)

### 2. Azure Resource Manager (ARM) Schemas
- **GitHub**: [azure-resource-manager-schemas](https://github.com/Azure/azure-resource-manager-schemas)
- **Purpose**: Official JSON schemas for validation
- **Features**: Complete schema definitions, version-specific

### 3. Azure Developer CLI (azd)
- **GitHub**: [azure-dev](https://github.com/Azure/azure-dev)
- **Purpose**: azure.yaml schema and validation
- **Features**: Template structure validation, environment management

### 4. Awesome AZD
- **GitHub**: [awesome-azd](https://github.com/Azure/awesome-azd)
- **Purpose**: Community templates and best practices
- **Features**: Real-world examples, multi-service architectures

See [AZURE_SOURCES.md](./AZURE_SOURCES.md) for detailed information on all data sources.

## 🏗️ Supported Azure Resources

| Resource | Category | Description |
|----------|----------|-------------|
| Web App | Compute | Host web applications with App Service |
| Static Web App | Compute | Modern web apps with serverless APIs |
| Function App | Compute | Event-driven serverless compute |
| Container App | Container | Run containers without managing infrastructure |
| Cosmos DB | Database | Globally distributed, multi-model database |
| SQL Database | Database | Fully managed relational database |
| Storage Account | Storage | Scalable cloud storage |
| Key Vault | Security | Secure secrets, keys, and certificates |
| Application Insights | Monitoring | Application performance monitoring |
| Service Bus | Messaging | Reliable cloud messaging |
| Redis Cache | Database | In-memory data store |
| Container Registry | Container | Store and manage container images |

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: TailwindCSS 3
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **YAML Processing**: yaml package
- **Schema Validation**: ajv

## 📋 Deployment to Azure

Once you've generated your infrastructure files:

```bash
# Install Azure Developer CLI
npm install -g @azure/azd

# Initialize your project (if not already done)
azd init

# Deploy everything to Azure
azd up
```

That's it! 🎉 Your infrastructure will be provisioned in Azure.

## 🎯 Use Cases

- **Rapid Prototyping**: Quickly scaffold infrastructure for new projects
- **Learning Azure**: Understand Azure resources and pricing
- **Vibe Coding**: Get infrastructure sorted while you focus on code
- **Cost Estimation**: Compare different SKUs and configurations
- **Template Generation**: Create baseline templates for customization
- **Team Onboarding**: Help new team members understand Azure options

## 🎉 What's New (Latest Release)

- ✅ **Quick Start Templates**: 5 ready-to-use templates for instant productivity
- ✅ **Regional Cost Comparison**: Save up to 30% by choosing the right region
- ✅ **Keyboard Shortcuts**: Navigate like a pro with Ctrl shortcuts
- ✅ **Auto-Save**: Your work is automatically saved to browser storage
- ✅ **Enhanced Validation**: Real-time feedback with visual indicators
- ✅ **Error Boundaries**: Graceful recovery from unexpected errors
- ✅ **Tooltips Everywhere**: Self-documenting interface

See [ENHANCEMENTS.md](./ENHANCEMENTS.md) for detailed feature documentation.

## 🚧 Roadmap

- [ ] Export to GitHub Actions / Azure Pipelines
- [ ] Import existing azd templates
- [ ] AI-powered resource recommendations
- [ ] Multi-region deployment support
- [ ] Cost optimization suggestions
- [ ] Model Context Protocol (MCP) server integration
- [ ] Terraform output format
- [ ] Template marketplace integration
- [ ] Custom resource templates
- [ ] Dark mode theme

## 🤝 Contributing

Contributions are welcome! This is an open project for the Azure community.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with ❤️ using [Azure Developer CLI](https://azure.github.io/azure-dev/)
- Pricing data from [Azure Retail Prices API](https://prices.azure.com)
- Inspired by the need for better IaC tooling in the vibe coding era

## 📚 Learn More

- [Azure Developer CLI Documentation](https://learn.microsoft.com/azure/developer/azure-developer-cli/)
- [Bicep Documentation](https://learn.microsoft.com/azure/azure-resource-manager/bicep/)
- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)
- [Awesome AZD Templates](https://github.com/Azure/awesome-azd)

---

**Made with 💪 for developers who want to focus on code, not config**
