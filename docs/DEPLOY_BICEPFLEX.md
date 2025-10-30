# 🚀 Deploying BicepFlex to Azure

## Quick Start: Self-Hosting BicepFlex

### **Method 1: Using BicepFlex UI** (Recommended)

1. **Start BicepFlex locally:**
   ```bash
   npm run dev
   ```

2. **In the UI:**
   - Click ⚡ "Quick Start"
   - Go to "Framework-Specific" tab
   - Select **"React SPA (Vite)"**
   - Set project name to `bicepflex`
   - Enable GitHub Actions or Azure Pipelines
   - Click "Generate & Download"

3. **The generated files include:**
   - ✅ `infra/main.bicep` - Static Web App configuration
   - ✅ `.github/workflows/deploy.yml` - **Build steps included!**
   - ✅ `azure.yaml` - azd configuration
   - ✅ `deploy.sh` - Deployment script with build

4. **Deploy:**
   ```bash
   # Place files in repo root (they're already there)
   git add infra/ azure.yaml .github/
   git commit -m "Add Azure infrastructure"
   git push
   
   # Or deploy locally:
   ./deploy.sh
   ```

### **What's Different Now (Option B Implemented):**

The generated CI/CD **now includes build steps**:

```yaml
# GitHub Actions automatically does:
- Setup Node.js 18
- npm ci
- npm run build
- azd provision
- azd deploy
```

The deployment script also builds before deploying:
```bash
# deploy.sh now includes:
npm install
npm run build
azd up
```

---

## 🎯 For Your Specific Use Case

### **Deploying BicepFlex from This Repo:**

```bash
# 1. Generate infra using BicepFlex UI
npm run dev
# Select "React SPA (Vite)" template
# Name it "bicepflex"
# Download files

# 2. Files are generated in your Downloads
# Copy them to repo root:
cp ~/Downloads/infra ./
cp ~/Downloads/azure.yaml ./
cp ~/Downloads/.github/workflows/deploy.yml ./.github/workflows/

# 3. Configure GitHub secrets:
# AZURE_CLIENT_ID
# AZURE_TENANT_ID
# AZURE_SUBSCRIPTION_ID

# 4. Push and watch it deploy:
git add infra/ azure.yaml .github/
git commit -m "Add deployment infrastructure"
git push origin main

# GitHub Actions will:
# - Install dependencies
# - Build the app (npm run build)
# - Provision Azure resources
# - Deploy to Static Web App
```

---

## 💡 Future: The `npx bicepflex` Approach

### **Why This Would Be Powerful:**

```bash
# In any project directory:
npx bicepflex init

# Interactive wizard asks:
# - Detect project type? (Yes - finds package.json, sees Vite)
# - Project name? (bicepflex)
# - Region? (eastus)
# - CI/CD platform? (GitHub Actions)

# Generates files directly in your repo
# No browser needed, works in CI/CD
```

### **Architecture for `npx` Version:**

```
@bicepflex/
├── cli/           # Node CLI package
│   ├── bin/
│   │   └── bicepflex.js
│   ├── commands/
│   │   ├── init.js
│   │   ├── generate.js
│   │   └── ui.js (spawns local web server)
│   └── detectors/
│       ├── detect-framework.js
│       └── detect-buildtool.js
│
├── core/          # Shared logic
│   ├── generators/
│   ├── validators/
│   └── templates/
│
└── web/           # This SPA (existing)
    └── (current codebase)
```

### **Commands It Could Support:**

```bash
# Interactive mode
npx bicepflex init

# Quick generation
npx bicepflex generate --template=react-spa --name=myapp

# Open web UI locally
npx bicepflex ui

# Auto-detect and generate
npx bicepflex init --detect --yes

# Export/import
npx bicepflex export > config.json
npx bicepflex import config.json

# CI/CD friendly
npx bicepflex generate --config=bicepflex.json --output=./infra
```

### **Detection Logic:**

```javascript
// detect-framework.js
export function detectFramework() {
  const pkg = require('./package.json');
  
  if (pkg.dependencies?.next) return 'nextjs';
  if (pkg.dependencies?.vite && pkg.dependencies?.react) return 'react-vite';
  if (pkg.dependencies?.['@vue/cli-service']) return 'vue';
  if (pkg.dependencies?.['@angular/core']) return 'angular';
  
  // Detect by files
  if (fs.existsSync('next.config.js')) return 'nextjs';
  if (fs.existsSync('vite.config.ts')) return 'vite';
  
  return 'unknown';
}
```

### **Use Cases:**

1. **Onboarding**: `npx bicepflex init` in a fresh project
2. **CI/CD**: `npx bicepflex generate --ci` in workflows
3. **Scaffolding**: Like `create-react-app` but for infrastructure
4. **Quick updates**: `npx bicepflex update` to regenerate with new SKUs

### **Discoverability:**

```bash
# Developers find it via:
npm search bicepflex
npx bicepflex --help

# Or in package.json scripts:
{
  "scripts": {
    "infra:init": "bicepflex init",
    "infra:deploy": "bicepflex deploy"
  }
}
```

---

## 🎓 Recommendation

### **For Now:**
✅ **Option B is implemented** - Enhanced React SPA template with build steps
✅ You can deploy BicepFlex using the generated files
✅ Works for anyone deploying Vite/React apps

### **For Later:**
Consider building `@bicepflex/cli` because:
1. **Better DX**: `npx bicepflex init` vs visiting a website
2. **CI/CD Integration**: Can be used in automated workflows
3. **Project-aware**: Detects and auto-configures
4. **Package ecosystem**: Becomes a standard tool like `create-react-app`
5. **Offline capable**: No internet needed after install

### **Migration Path:**
1. Extract template/generator logic to `@bicepflex/core`
2. Create `@bicepflex/cli` that uses the core
3. Keep web UI for visual users
4. All three share the same templates/generators

This follows the pattern of:
- `create-react-app` (CLI) + React DevTools (UI)
- `prisma` (CLI) + Prisma Studio (UI)
- `terraform` (CLI) + Terraform Cloud (UI)

---

## 🚀 Next Steps

**To deploy BicepFlex right now:**
1. Use the React SPA (Vite) template in the UI
2. The generated files now include build steps
3. Deploy with `./deploy.sh` or push to trigger GitHub Actions

**To build `npx bicepflex` later:**
1. Extract generators to a `core` package
2. Build CLI wrapper
3. Publish to npm
4. Keep web UI as alternative interface

Both approaches are valuable and complement each other! 🎯
