import type { ProjectConfig } from '../types';

export class CICDGenerator {
  generateGitHubActions(config: ProjectConfig): string {
    const hasWebApp = config.resources.some(r => 
      ['staticWebApp', 'webApp', 'functionApp'].includes(r.type)
    );

    const buildSteps = hasWebApp ? `
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
` : '';

    return `name: Deploy Azure Infrastructure

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

permissions:
  id-token: write
  contents: read

env:
  AZURE_ENV_NAME: \${{ vars.AZURE_ENV_NAME }}
  AZURE_LOCATION: ${config.region}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
${buildSteps}
      - name: Install azd
        uses: Azure/setup-azd@v1.0.0

      - name: Log in to Azure
        uses: azure/login@v2
        with:
          client-id: \${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: \${{ secrets.AZURE_TENANT_ID }}
          subscription-id: \${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Provision Infrastructure
        run: azd provision --no-prompt
        env:
          AZURE_SUBSCRIPTION_ID: \${{ secrets.AZURE_SUBSCRIPTION_ID }}
          AZURE_LOCATION: ${config.region}

      - name: Deploy Application
        run: azd deploy --no-prompt

      - name: Output Deployment Info
        run: azd env get-values
`;
  }

  generateAzurePipelines(config: ProjectConfig): string {
    const hasWebApp = config.resources.some(r => 
      ['staticWebApp', 'webApp', 'functionApp'].includes(r.type)
    );

    const buildSteps = hasWebApp ? `
          - task: NodeTool@0
            displayName: 'Setup Node.js'
            inputs:
              versionSpec: '18.x'

          - script: npm ci
            displayName: 'Install dependencies'

          - script: npm run build
            displayName: 'Build application'
` : '';

    return `trigger:
  branches:
    include:
      - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  azureServiceConnection: 'Azure-Service-Connection'
  azureLocation: '${config.region}'
  azureEnvName: '$(Build.SourceBranchName)-$(Build.BuildId)'

stages:
  - stage: Build
    displayName: 'Build Application'
    jobs:
      - job: BuildJob
        displayName: 'Build'
        steps:${buildSteps || '\n          - script: echo "No build steps required"\n            displayName: "Skip build"'}

  - stage: Provision
    displayName: 'Provision Infrastructure'
    dependsOn: Build
    jobs:
      - job: ProvisionJob
        displayName: 'Provision with azd'
        steps:
          - task: AzureCLI@2
            displayName: 'Install azd'
            inputs:
              azureSubscription: $(azureServiceConnection)
              scriptType: 'bash'
              scriptLocation: 'inlineScript'
              inlineScript: |
                curl -fsSL https://aka.ms/install-azd.sh | bash

          - task: AzureCLI@2
            displayName: 'azd provision'
            inputs:
              azureSubscription: $(azureServiceConnection)
              scriptType: 'bash'
              scriptLocation: 'inlineScript'
              inlineScript: |
                azd provision --no-prompt
            env:
              AZURE_ENV_NAME: $(azureEnvName)
              AZURE_LOCATION: $(azureLocation)

  - stage: Deploy
    displayName: 'Deploy Application'
    dependsOn: Provision
    condition: succeeded()
    jobs:
      - job: DeployJob
        displayName: 'Deploy with azd'
        steps:
          - task: AzureCLI@2
            displayName: 'azd deploy'
            inputs:
              azureSubscription: $(azureServiceConnection)
              scriptType: 'bash'
              scriptLocation: 'inlineScript'
              inlineScript: |
                azd deploy --no-prompt
            env:
              AZURE_ENV_NAME: $(azureEnvName)
              AZURE_LOCATION: $(azureLocation)

          - task: AzureCLI@2
            displayName: 'Output deployment info'
            inputs:
              azureSubscription: $(azureServiceConnection)
              scriptType: 'bash'
              scriptLocation: 'inlineScript'
              inlineScript: |
                azd env get-values
            env:
              AZURE_ENV_NAME: $(azureEnvName)
`;
  }

  generateDeploymentScript(config: ProjectConfig): string {
    const hasWebApp = config.resources.some(r => 
      ['staticWebApp', 'webApp', 'functionApp'].includes(r.type)
    );

    const buildSection = hasWebApp ? `
# Build application if package.json exists
if [ -f "package.json" ]; then
    echo "📦 Building application..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed"
        echo "Install it from: https://nodejs.org/"
        exit 1
    fi
    
    # Install dependencies
    echo "📥 Installing dependencies..."
    npm install
    
    # Build
    echo "🔨 Building..."
    npm run build
    
    echo "✅ Build complete!"
    echo ""
fi
` : '';

    return `#!/bin/bash
# Deployment script for ${config.name}
# Generated by BicepFlex

set -e

echo "🚀 Starting deployment for ${config.name}..."
echo "📍 Region: ${config.region}"
echo "📦 Resources: ${config.resources.length}"
echo ""

# Check if azd is installed
if ! command -v azd &> /dev/null; then
    echo "❌ Azure Developer CLI (azd) is not installed"
    echo "Install it with: curl -fsSL https://aka.ms/install-azd.sh | bash"
    exit 1
fi

# Check if logged in to Azure
echo "🔐 Checking Azure login status..."
if ! az account show &> /dev/null; then
    echo "❌ Not logged in to Azure"
    echo "Run: az login"
    exit 1
fi
${buildSection}
# Set environment variables
export AZURE_ENV_NAME="\${AZURE_ENV_NAME:-${config.name}-\$(date +%s)}"
export AZURE_LOCATION="${config.region}"

echo "🌍 Environment: \$AZURE_ENV_NAME"
echo "📍 Location: \$AZURE_LOCATION"
echo ""

# Initialize azd environment (if not already done)
if [ ! -f ".azure/\$AZURE_ENV_NAME/.env" ]; then
    echo "🔧 Initializing azd environment..."
    azd env new \$AZURE_ENV_NAME --location \$AZURE_LOCATION
fi

# Provision infrastructure
echo "🏗️  Provisioning infrastructure..."
azd provision --no-prompt

# Deploy application
echo "🚢 Deploying application..."
azd deploy --no-prompt

# Output deployment information
echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Deployment Information:"
azd env get-values

echo ""
echo "🎉 Your infrastructure is ready!"
echo ""
echo "Useful commands:"
echo "  azd monitor    - View application metrics"
echo "  azd down       - Delete all resources"
echo "  azd env list   - List environments"
`;
  }

  generateReadme(config: ProjectConfig): string {
    return `# ${config.name}

Infrastructure as Code for ${config.name}, generated by BicepFlex.

## 📋 Prerequisites

- [Azure Developer CLI (azd)](https://learn.microsoft.com/azure/developer/azure-developer-cli/)
- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli)
- Azure subscription

## 🚀 Quick Start

\`\`\`bash
# Install Azure Developer CLI
curl -fsSL https://aka.ms/install-azd.sh | bash

# Login to Azure
az login

# Deploy everything
azd up
\`\`\`

## 📦 What Gets Deployed

This configuration deploys the following Azure resources to **${config.region}**:

${config.resources
  .map(
    (r) =>
      `- **${r.displayName}** (${r.sku.tier} - ${r.sku.name})\n  ${r.name}`
  )
  .join('\n')}

**Estimated Monthly Cost:** $${config.resources
      .reduce((sum, r) => sum + (r.pricing?.estimatedMonthlyCost || 0), 0)
      .toFixed(2)}

## 🛠️ Development Commands

\`\`\`bash
# Provision infrastructure only
azd provision

# Deploy application code
azd deploy

# View deployed resources
azd env get-values

# Monitor application
azd monitor

# Clean up resources
azd down
\`\`\`

## 📁 Project Structure

\`\`\`
.
├── infra/                  # Infrastructure as Code
│   ├── main.bicep         # Main infrastructure template
│   └── main.parameters.json
├── azure.yaml             # Azure Developer CLI configuration
├── .azure/                # Azure environment settings
└── deploy.sh             # Deployment script
\`\`\`

## 🔐 Required Secrets

For CI/CD deployment, configure these secrets:

### GitHub Actions
- \`AZURE_CLIENT_ID\`
- \`AZURE_TENANT_ID\`
- \`AZURE_SUBSCRIPTION_ID\`

### Azure Pipelines
- Configure \`Azure-Service-Connection\` service connection

## 🌍 Deployment Regions

This infrastructure is configured for **${config.region}**.

To deploy to a different region, update the \`AZURE_LOCATION\` environment variable:

\`\`\`bash
export AZURE_LOCATION="westus2"
azd up
\`\`\`

## 📊 Cost Management

- View estimated costs in Azure Portal
- Set up budget alerts
- Use Azure Cost Management for detailed analysis
- Consider using Azure Hybrid Benefit if applicable

## 🔧 Customization

Edit \`infra/main.bicep\` to modify:
- Resource configurations
- SKU tiers
- Additional resources
- Networking setup

After making changes:
\`\`\`bash
azd provision
\`\`\`

## 📚 Learn More

- [Azure Developer CLI Documentation](https://learn.microsoft.com/azure/developer/azure-developer-cli/)
- [Bicep Documentation](https://learn.microsoft.com/azure/azure-resource-manager/bicep/)
- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

## 🆘 Troubleshooting

**Deployment fails?**
- Check you're logged in: \`az account show\`
- Verify subscription: \`az account list\`
- Check quotas and limits in target region

**Need to start over?**
\`\`\`bash
azd down --force --purge
azd up
\`\`\`

---

*Generated by [BicepFlex](https://github.com/yourusername/bicepflex) - Azure Infrastructure Made Easy*
`;
  }
}

export const cicdGenerator = new CICDGenerator();
