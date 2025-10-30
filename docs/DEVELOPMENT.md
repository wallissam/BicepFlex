# 🛠️ BicepFlex Development Guide

This guide is for developers who want to understand, modify, or extend BicepFlex.

## 📁 Project Structure

```
bicepflex/
├── src/
│   ├── components/          # React UI components
│   │   ├── StepIndicator.tsx           # Wizard step navigation
│   │   ├── ProjectBasics.tsx           # Step 1: Project setup
│   │   ├── ResourceSelector.tsx        # Step 2: Resource selection
│   │   ├── ResourceConfigurator.tsx    # Step 3: Configuration
│   │   └── ReviewAndGenerate.tsx       # Step 4: Code generation
│   │
│   ├── services/            # Business logic & API integrations
│   │   ├── azurePricing.ts            # Azure Retail Prices API client
│   │   └── bicepGenerator.ts          # Bicep template generation
│   │
│   ├── store/               # State management
│   │   └── projectStore.ts            # Zustand store for app state
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts                   # All shared types
│   │
│   ├── data/                # Static data & configurations
│   │   └── resourceTemplates.ts       # Resource definitions & metadata
│   │
│   ├── utils/               # Utility functions
│   │   └── cn.ts                      # Tailwind class merging
│   │
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles & Tailwind
│
├── public/                  # Static assets
├── AZURE_SOURCES.md         # Documentation of data sources
├── DEVELOPMENT.md           # This file
└── README.md                # User-facing documentation
```

## 🏗️ Architecture

### State Management (Zustand)

The application uses Zustand for lightweight, type-safe state management. The main store (`projectStore.ts`) manages:

- **Project configuration**: name, region, resources
- **Wizard state**: current step, completed steps
- **Resource management**: add, update, remove resources
- **Cost calculation**: aggregate pricing from all resources

```typescript
// Example: Adding a resource
const { addResource } = useProjectStore();
addResource({
  id: 'webapp-123',
  name: 'myapp',
  type: 'webApp',
  // ... other properties
});
```

### Data Fetching (TanStack Query)

We use React Query for:
- Caching Azure Pricing API responses
- Automatic background refetching
- Loading & error states
- Request deduplication

```typescript
// Example: Fetching pricing data
const { data, isLoading } = useQuery({
  queryKey: ['pricing', 'webApp', 'eastus'],
  queryFn: () => azurePricingService.getPricing('Azure App Service', 'eastus'),
});
```

### Azure Pricing Service

Located in `src/services/azurePricing.ts`, this service:

1. **Fetches pricing data** from Azure Retail Prices API
2. **Caches responses** to minimize API calls
3. **Calculates monthly costs** based on unit prices
4. **Filters by region and SKU** using OData queries

Key methods:
- `getPricing(serviceName, region, skuName)` - Get raw pricing data
- `getServicePricing(serviceName, region)` - Get pricing map by SKU
- `getRegionsForService(serviceName)` - List available regions

### Bicep Generator Service

Located in `src/services/bicepGenerator.ts`, this generates:

1. **Bicep templates** with proper syntax and best practices
2. **Parameter files** for azure.yaml integration
3. **azure.yaml** configuration for azd
4. **Azure config** for default settings

```typescript
// Example: Generate all files
const files = bicepGenerator.generateInfrastructureFiles(projectConfig);
// Returns: Map<filename, content>
```

Each resource type has its own generation method:
- `generateWebAppBicep()` - App Service + Plan
- `generateFunctionAppBicep()` - Function App + Storage dependency
- `generateCosmosDbBicep()` - Cosmos DB with serverless mode
- etc.

## 🎨 UI Components

### Wizard Pattern

The application follows a multi-step wizard pattern:

1. **StepIndicator**: Visual progress bar with step navigation
2. **Step Components**: Each step is a separate component
3. **State Persistence**: All choices saved in Zustand store
4. **Validation**: Steps auto-complete when valid

### Component Communication

Components communicate via:
- **Zustand store**: Shared state across components
- **Props**: Parent → Child data flow
- **Callbacks**: Child → Parent events

## 📊 Adding a New Resource Type

Follow these steps to add support for a new Azure resource:

### 1. Update Types (`src/types/index.ts`)

```typescript
export type AzureResourceType =
  | 'webApp'
  | 'newResource'  // Add your type
  | ...
```

### 2. Add Resource Template (`src/data/resourceTemplates.ts`)

```typescript
newResource: {
  type: 'newResource',
  displayName: 'My New Resource',
  description: 'Description of the resource',
  icon: '🎯',  // Emoji icon
  category: 'compute',  // or database, storage, etc.
  defaultSKUs: [
    { name: 'Basic', tier: 'Basic' },
    { name: 'Standard', tier: 'Standard' },
  ],
  requiredProperties: ['propertyName'],
  optionalProperties: [],
  commonDependencies: [],
}
```

### 3. Add Service Name Mapping (`src/data/resourceTemplates.ts`)

```typescript
export const serviceNameMapping: Record<string, string> = {
  // ... existing mappings
  newResource: 'Azure Service Name',  // Exact name from Pricing API
};
```

### 4. Implement Bicep Generator (`src/services/bicepGenerator.ts`)

```typescript
private generateNewResourceBicep(resource: ResourceConfig): string {
  return `// New Resource for ${resource.displayName}
resource ${resource.name} 'Microsoft.Provider/resourceType@2023-01-01' = {
  name: '\${environmentName}-${resource.name}'
  location: location
  sku: {
    name: '${resource.sku.name}'
    tier: '${resource.sku.tier}'
  }
  properties: {
    // Resource-specific properties
  }
}`;
}
```

Add to the switch statement in `generateResourceBicep()`:
```typescript
case 'newResource':
  return this.generateNewResourceBicep(resource);
```

### 5. Test Your Resource

1. Start dev server: `npm run dev`
2. Navigate through the wizard
3. Select your new resource
4. Configure it
5. Generate and verify the Bicep output

## 🧪 Testing

### Manual Testing Checklist

- [ ] All wizard steps navigate correctly
- [ ] Resources can be added and removed
- [ ] SKU selection updates pricing
- [ ] Property changes are saved
- [ ] Generated Bicep is valid
- [ ] Files can be downloaded
- [ ] Responsive design works on mobile

### Validating Generated Bicep

```bash
# Install Bicep CLI
az bicep install

# Validate a generated template
az bicep build --file infra/main.bicep
```

## 🔧 Common Customizations

### Change Color Scheme

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#yourcolor',
    600: '#yourdarkercolor',
    // ...
  }
}
```

### Add New Wizard Step

1. Add step to `initialSteps` in `projectStore.ts`
2. Create new component in `src/components/`
3. Add case in `App.tsx` `renderStep()` function
4. Update navigation logic if needed

### Modify Pricing Display

Edit the pricing calculations in:
- `src/services/azurePricing.ts` - API integration
- `src/components/ResourceConfigurator.tsx` - Display logic
- `src/components/ReviewAndGenerate.tsx` - Summary view

## 🐛 Debugging

### Common Issues

**Pricing API returns empty results**
- Check service name in `serviceNameMapping`
- Verify region name format (lowercase, no spaces)
- Test query directly: `https://prices.azure.com/api/retail/prices?$filter=serviceName eq 'Azure App Service'`

**Build fails with TypeScript errors**
- Run `npm run build` to see all errors
- Check for unused imports
- Verify type definitions match usage

**Bicep generation produces invalid syntax**
- Validate with `az bicep build`
- Check parameter interpolation syntax
- Verify resource API versions

### Debug Mode

Enable React Query DevTools (add to `main.tsx`):

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Add inside QueryClientProvider:
<ReactQueryDevtools initialIsOpen={false} />
```

## 📚 Useful Resources

### Azure APIs
- [Retail Prices API Docs](https://learn.microsoft.com/rest/api/cost-management/retail-prices)
- [ARM Template Reference](https://learn.microsoft.com/azure/templates/)
- [Bicep Documentation](https://learn.microsoft.com/azure/azure-resource-manager/bicep/)

### Libraries
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)

## 🚀 Performance Optimization

Current optimizations:
- ✅ Query caching (5 min stale time)
- ✅ Pricing service in-memory cache
- ✅ Code splitting ready (Vite)
- ✅ Production build minification

Potential improvements:
- [ ] Virtual scrolling for large resource lists
- [ ] Debounced search input
- [ ] Service worker for offline support
- [ ] Bundle size optimization

## 🔐 Security Considerations

- ✅ No sensitive data stored in state
- ✅ No authentication required (public APIs only)
- ✅ HTTPS enforced for API calls
- ✅ No eval() or dangerous DOM manipulation
- ⚠️ User-generated names should be sanitized before deployment

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

Output: `dist/` directory

### Deploy to Static Hosting

**Vercel/Netlify:**
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 18+

**Azure Static Web Apps:**
```bash
az staticwebapp create \
  --name bicepflex \
  --resource-group rg-bicepflex \
  --source . \
  --location "East US 2" \
  --branch main \
  --app-location "/" \
  --output-location "dist"
```

## 🤝 Contributing Guidelines

1. **Code Style**: Follow existing patterns
2. **Types**: Always use TypeScript, no `any` (unless necessary)
3. **Comments**: Add JSDoc for complex functions
4. **Commits**: Use conventional commits
5. **Testing**: Test manually before committing

## 📞 Need Help?

- Check existing code patterns
- Read inline comments
- Review type definitions
- Ask in discussions

---

Happy coding! 💪
