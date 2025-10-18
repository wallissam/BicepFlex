# Reliable Azure Data Sources for BicepFlex

## Official Microsoft Sources

### 1. Azure Retail Prices API (PRIMARY SOURCE)
**URL**: `https://prices.azure.com/api/retail/prices`
**Purpose**: Real-time pricing data for all Azure services
**Documentation**: https://learn.microsoft.com/en-us/rest/api/cost-management/retail-prices/azure-retail-prices
**Features**:
- No authentication required
- Supports filtering by region, service, SKU
- Returns current retail prices
- Updated regularly by Microsoft
- REST API with OData query support

**Example Query**:
```
https://prices.azure.com/api/retail/prices?$filter=serviceName eq 'Virtual Machines' and armRegionName eq 'eastus'
```

### 2. Azure Resource Manager (ARM) Schemas
**GitHub**: https://github.com/Azure/azure-resource-manager-schemas
**Purpose**: Official JSON schemas for all Azure resource types
**Features**:
- Complete schema validation
- Version-specific schemas
- Used by VS Code Azure extensions
- Evergreen source maintained by Microsoft
- Can be consumed programmatically

### 3. Azure REST API Specifications
**GitHub**: https://github.com/Azure/azure-rest-api-specs
**Purpose**: OpenAPI/Swagger specs for all Azure services
**Features**:
- Complete API specifications
- Resource type definitions
- Valid property values and constraints
- Location/region information per service

### 4. Azure CLI & SDK
**Package**: `@azure/arm-*` npm packages
**Purpose**: Programmatic access to Azure Resource Manager
**Features**:
- List available locations per subscription
- Get resource provider capabilities
- Validate resource configurations
- TypeScript definitions included

### 5. Azure Bicep CLI
**Tool**: `az bicep` or standalone `bicep` CLI
**Purpose**: Bicep template validation and compilation
**Features**:
- Built-in schema validation
- Linting and best practices
- Compile to ARM JSON
- Parameter validation
- Can be integrated as dependency

### 6. Azure Developer CLI (azd)
**GitHub**: https://github.com/Azure/azure-dev
**Tool**: `azd`
**Purpose**: Template schema and validation
**Features**:
- `azure.yaml` schema definition
- Template structure validation
- Environment management
- Infrastructure provisioning

**Schema Location**: https://raw.githubusercontent.com/Azure/azure-dev/main/schemas/v1.0/azure.yaml.json

### 7. Awesome AZD Templates
**GitHub**: https://github.com/Azure/awesome-azd
**Purpose**: Community and official azd templates
**Features**:
- Real-world template examples
- Best practices
- Multi-service architectures
- Can extract patterns and configurations

## Recommended Integration Strategy

### For BicepFlex Implementation:

1. **Schema Validation**: 
   - Bundle ARM schemas from azure-resource-manager-schemas
   - Use Bicep CLI for template validation
   - Validate azure.yaml against azd schema

2. **Pricing Data**:
   - Direct integration with Azure Retail Prices API
   - Cache results for performance
   - Real-time cost estimation

3. **Resource Configuration**:
   - Extract from azure-rest-api-specs
   - Use ARM schemas for valid properties
   - Cross-reference with awesome-azd templates

4. **SKU & Region Data**:
   - Query Azure Retail Prices API for available SKUs
   - Use Azure REST API for region-specific capabilities
   - Filter by resource type and availability

5. **Template Generation**:
   - Generate Bicep (preferred) or ARM JSON
   - Validate using Bicep CLI
   - Generate azure.yaml for azd compatibility
   - Include .azure/config for defaults

## API Examples

### Get VM SKUs and Pricing for East US:
```bash
curl "https://prices.azure.com/api/retail/prices?\$filter=serviceName eq 'Virtual Machines' and armRegionName eq 'eastus' and priceType eq 'Consumption'"
```

### Get App Service Pricing:
```bash
curl "https://prices.azure.com/api/retail/prices?\$filter=serviceName eq 'Azure App Service' and armRegionName eq 'eastus'"
```

### Get All Available Regions:
```bash
curl "https://prices.azure.com/api/retail/prices?\$filter=serviceName eq 'Virtual Machines'&\$select=armRegionName" | jq -r '.Items[].armRegionName' | sort -u
```

## NPM Packages to Consider

1. **@azure/arm-resources** - Resource management
2. **@azure/arm-subscriptions** - Subscription and location data
3. **@azure/arm-commerce** - Usage and rate card APIs
4. **ajv** - JSON schema validation
5. **yaml** - YAML parsing and generation

## Alternative: Consume Bicep as MCP

Consider creating an MCP server that:
- Wraps Bicep CLI functionality
- Provides schema validation
- Generates templates
- Estimates costs using Pricing API

This would make BicepFlex itself an MCP tool that can be called by AI assistants.

## Data Freshness

- **Pricing API**: Real-time, no caching needed beyond session
- **ARM Schemas**: Update monthly, cache acceptable
- **REST API Specs**: Update weekly, cache acceptable
- **awesome-azd**: Pull latest on demand or weekly

## Notes

- No authentication required for Retail Prices API
- ARM schemas are public and freely accessible
- Consider bundling frequently used schemas
- Use CDN/cache for schema files
- Implement graceful fallbacks if APIs unavailable
