# BicepFlex CLI Guide

## 🚀 Installation

### Global Installation (Recommended)

Once published to npm, you can install globally:

```bash
npm install -g bicepflex
```

Then use it anywhere:

```bash
bicepflex init
bicepflex init-web
npx bicepflex generate --template=react-vite --name=my-app
```

### Local Development

To test locally before publishing:

```bash
# In the bicepflex directory
npm run build
npm link

# Now you can use it globally
bicepflex --help
```

## 📖 Usage

### 1. Interactive CLI Setup (Recommended for Beginners)

The interactive mode asks you questions and generates everything automatically:

```bash
bicepflex init
```

**Features:**
- Detects your framework automatically (Next.js, React+Vite, Vue, etc.)
- Asks about database, storage, monitoring
- Generates Bicep files, CI/CD workflows, deployment scripts
- Provides clear next steps

**Options:**
- `--force` - Overwrite existing files
- `--output <path>` - Output directory (default: current directory)

### 2. Launch Web UI

If you prefer a visual interface:

```bash
bicepflex init-web
# or
bicepflex ui
```

**Options:**
- `--port <number>` - Port for web server (default: 5173)

This starts the full Vite-powered web UI where you can:
- Configure resources visually
- See pricing estimates in real-time
- Compare regions
- Download generated files

### 3. Quick Generate from Template

For CI/CD or when you know exactly what you want:

```bash
# Generate from template
bicepflex generate --template=react-vite --name=my-app

# With CI/CD options
bicepflex generate --template=nextjs --name=my-nextjs-app --cicd=both

# Generate from config file
bicepflex generate --config=bicepflex.json
```

**Options:**
- `--template <name>` - Template ID (use `bicepflex templates` to list)
- `--config <path>` - Path to JSON config file
- `--name <name>` - Project name
- `--output <path>` - Output directory
- `--force` - Overwrite existing files
- `--cicd <platform>` - CI/CD platform: `github`, `azure`, `both`, or `none`

### 4. List Available Templates

```bash
bicepflex templates
# or
bicepflex list
```

Shows all available framework templates with:
- Template ID
- Framework name
- Tags (React, Vue, Angular, etc.)
- Estimated monthly cost

## 🎯 Common Workflows

### For a New React App

```bash
# In your React project directory
bicepflex init

# Follow prompts:
# - Project name: my-react-app
# - Region: eastus
# - Use detected framework: Yes (React + Vite)
# - CI/CD: GitHub Actions
# - Database: Yes - Cosmos DB
# - Storage: Yes
# - Monitoring: Yes

# Files generated:
# ✓ infra/main.bicep
# ✓ infra/main.parameters.json
# ✓ azure.yaml
# ✓ .azure/config
# ✓ .github/workflows/azure-deploy.yml
# ✓ deploy.sh
# ✓ README.infra.md
```

### For CI/CD Pipeline

```bash
# In your CI/CD workflow, use non-interactive mode
bicepflex generate --template=react-vite --name=my-app --cicd=github --force
```

### For Quick Prototyping

```bash
# Launch the web UI for visual configuration
bicepflex ui

# Configure everything visually
# Download the generated files
# Extract to your project
```

## 📁 Generated Files

### Infrastructure Files

- `infra/main.bicep` - Main Bicep template with all Azure resources
- `infra/main.parameters.json` - Parameters for deployment
- `azure.yaml` - Azure Developer CLI configuration
- `.azure/config` - Azure CLI settings

### CI/CD Files

- `.github/workflows/azure-deploy.yml` - GitHub Actions workflow (if selected)
- `azure-pipelines.yml` - Azure Pipelines configuration (if selected)
- `deploy.sh` - Manual deployment script

### Documentation

- `README.infra.md` - Complete deployment guide with commands

## 🔧 Configuration File Format

You can save a configuration and reuse it with `--config`:

```json
{
  "name": "my-azure-app",
  "region": "eastus",
  "resources": [
    {
      "id": "web-1",
      "name": "web",
      "type": "staticWebApp",
      "displayName": "Web Application",
      "sku": { "name": "Free", "tier": "Free" },
      "region": "eastus",
      "properties": {
        "appLocation": "/",
        "outputLocation": "dist"
      },
      "dependencies": []
    }
  ],
  "estimatedMonthlyCost": 0
}
```

## 🌍 Framework Detection

BicepFlex automatically detects your framework by examining:

1. **package.json dependencies:**
   - Next.js: `next`
   - React + Vite: `react` + `vite`
   - Vue: `vue` or `@vue/cli-service`
   - Angular: `@angular/core`
   - Express: `express`

2. **Config files:**
   - `next.config.js/mjs`
   - `vite.config.ts/js`
   - `angular.json`

3. **Confidence levels:**
   - **High**: Found in package.json with matching config file
   - **Medium**: Found config file but no package.json confirmation
   - **Low**: Guessed based on partial information

## 🎨 Templates Available

Run `bicepflex templates` for the full list. Common ones:

| Template ID | Framework | Use Case |
|------------|-----------|----------|
| `react-vite` | React + Vite | Modern React SPA |
| `nextjs-app` | Next.js | Full-stack React with SSR |
| `vue-spa` | Vue.js | Vue single-page app |
| `angular-app` | Angular | Enterprise Angular app |
| `express-api` | Express | Node.js REST API |
| `static-website` | Static | HTML/CSS/JS website |

## 🚀 Deployment

After generating files:

### Option 1: GitHub Actions (Recommended)

```bash
# 1. Set up GitHub secrets:
# - AZURE_CLIENT_ID
# - AZURE_TENANT_ID
# - AZURE_SUBSCRIPTION_ID

# 2. Commit and push
git add infra/ azure.yaml .github/
git commit -m "Add Azure infrastructure"
git push

# GitHub Actions will automatically deploy
```

### Option 2: Manual Deployment

```bash
# 1. Login to Azure
az login

# 2. Run deployment script
bash deploy.sh

# Or use Azure Developer CLI directly
azd up
```

## 📊 Cost Estimation

Templates include estimated monthly costs:

- **Free Tier**: $0/month (Static Web Apps Free tier)
- **Basic**: $15-30/month (Basic App Service + Basic SQL)
- **Standard**: $50-150/month (Standard tier with monitoring)
- **Premium**: $200+/month (Premium SKUs with HA)

*Actual costs depend on usage and region*

## 🆘 Troubleshooting

### "Template not found"

```bash
# List available templates
bicepflex templates

# Use exact template ID
bicepflex generate --template=react-vite --name=my-app
```

### "Files already exist"

```bash
# Use --force to overwrite
bicepflex init --force
```

### "Cannot detect framework"

```bash
# Manually specify template
bicepflex init
# Then select framework from list when prompted
```

### Web UI won't start

```bash
# Make sure you're in the bicepflex project directory
cd /path/to/bicepflex
bicepflex ui

# Or check if port is in use
bicepflex ui --port 3000
```

## 🔗 Links

- **Documentation**: https://github.com/yourusername/bicepflex
- **Issues**: https://github.com/yourusername/bicepflex/issues
- **Azure Developer CLI**: https://learn.microsoft.com/azure/developer/azure-developer-cli/
- **Bicep Docs**: https://learn.microsoft.com/azure/azure-resource-manager/bicep/

## 📝 Examples

### Complete Example: Deploying a Next.js App

```bash
# 1. Create/navigate to your Next.js project
cd my-nextjs-app

# 2. Generate infrastructure
bicepflex init

# Follow prompts:
# ✓ Project name: my-nextjs-app
# ✓ Region: eastus
# ✓ Framework: Next.js (detected)
# ✓ CI/CD: GitHub Actions
# ✓ Database: Cosmos DB
# ✓ Monitoring: Yes

# 3. Review generated files
cat infra/main.bicep
cat README.infra.md

# 4. Set up Azure credentials
az login
export AZURE_SUBSCRIPTION_ID="your-sub-id"

# 5. Deploy
bash deploy.sh

# Or set up CI/CD:
gh secret set AZURE_CLIENT_ID --body="..."
gh secret set AZURE_TENANT_ID --body="..."
gh secret set AZURE_SUBSCRIPTION_ID --body="..."

git add -A
git commit -m "Add Azure infrastructure"
git push
```

## 🎯 Best Practices

1. **Start with `init`** - Use interactive mode first to understand options
2. **Review generated files** - Always check the generated Bicep before deploying
3. **Use CI/CD** - Automate deployments with GitHub Actions or Azure Pipelines
4. **Version control** - Commit infrastructure code alongside application code
5. **Test in stages** - Deploy to dev/staging before production
6. **Monitor costs** - Use Azure Cost Management to track spending
7. **Use templates** - Save successful configurations for reuse

## 🚀 Publishing to npm

To publish this package to npm:

```bash
# 1. Update package.json
# - Set "private": false
# - Update repository URL
# - Update author

# 2. Build
npm run build

# 3. Test locally
npm link
bicepflex --help

# 4. Publish
npm login
npm publish

# 5. Test installation
npm install -g bicepflex
npx bicepflex init
```

---

**Happy deploying! 🎉**
