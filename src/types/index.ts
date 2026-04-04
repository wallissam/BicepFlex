// Azure Resource Types
export type AzureResourceType =
  | 'webApp'
  | 'staticWebApp'
  | 'functionApp'
  | 'containerApp'
  | 'cosmosDb'
  | 'sqlDatabase'
  | 'storageAccount'
  | 'keyVault'
  | 'appInsights'
  | 'serviceBus'
  | 'eventHub'
  | 'redis'
  | 'containerRegistry'
  | 'virtualMachine'
  | 'aks';

// Azure Regions
export interface AzureRegion {
  name: string;
  displayName: string;
  geography: string;
}

// Azure SKU
export interface AzureSKU {
  name: string;
  tier: string;
  size?: string;
  family?: string;
  capacity?: number;
}

// Pricing Information
export interface PricingInfo {
  skuName: string;
  productName: string;
  unitPrice: number;
  currencyCode: string;
  unitOfMeasure: string;
  estimatedMonthlyCost: number;
}

// Resource Configuration
export interface ResourceConfig {
  id: string;
  name: string;
  type: AzureResourceType;
  displayName: string;
  sku: AzureSKU;
  region: string;
  properties: Record<string, string | number | boolean>;
  dependencies: string[];
  pricing?: PricingInfo;
}

// Project Configuration
export interface ProjectConfig {
  name: string;
  region: string;
  resources: ResourceConfig[];
  estimatedMonthlyCost: number;
}

// Wizard Step
export interface WizardStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

// Azure Retail Price API Response
export interface AzureRetailPrice {
  currencyCode: string;
  tierMinimumUnits: number;
  retailPrice: number;
  unitPrice: number;
  armRegionName: string;
  location: string;
  effectiveStartDate: string;
  meterId: string;
  meterName: string;
  productId: string;
  skuId: string;
  productName: string;
  skuName: string;
  serviceName: string;
  serviceId: string;
  serviceFamily: string;
  unitOfMeasure: string;
  type: string;
  isPrimaryMeterRegion: boolean;
  armSkuName: string;
}

export interface AzureRetailPriceResponse {
  BillingCurrency: string;
  CustomerEntityId: string;
  CustomerEntityType: string;
  Items: AzureRetailPrice[];
  NextPageLink: string | null;
  Count: number;
}

// Template Generation
export interface BicepTemplate {
  content: string;
  parameters: Record<string, BicepParameterDefinition>;
  outputs: Record<string, BicepOutputDefinition>;
}

export interface BicepParameterDefinition {
  type: string;
  defaultValue?: string;
  minLength?: number;
  maxLength?: number;
  metadata?: { description: string };
}

export interface BicepOutputDefinition {
  type: string;
  value: string;
}

export interface AzdConfig {
  name: string;
  services: Record<string, AzdServiceConfig>;
  resources?: Record<string, AzdResourceConfig>;
}

export interface AzdServiceConfig {
  project: string;
  language: string;
  host: string;
}

export interface AzdResourceConfig {
  type: string;
  [key: string]: string;
}

// Resource Templates
export interface ResourceTemplate {
  type: AzureResourceType;
  displayName: string;
  description: string;
  icon: string;
  category: 'compute' | 'database' | 'storage' | 'messaging' | 'security' | 'monitoring' | 'container';
  defaultSKUs: AzureSKU[];
  requiredProperties: string[];
  optionalProperties: string[];
  commonDependencies: AzureResourceType[];
  docsUrl?: string;
  bicepDocsUrl?: string;
  pricingUrl?: string;
  bestPractices?: string[];
}
