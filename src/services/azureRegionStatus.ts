/**
 * Azure Region Status Service
 * Fetches real-time Azure service availability and health information
 */

export interface RegionStatus {
  region: string;
  displayName: string;
  available: boolean;
  services: ServiceStatus[];
  healthStatus: 'healthy' | 'degraded' | 'outage';
  lastUpdated: string;
}

export interface ServiceStatus {
  name: string;
  available: boolean;
  status: 'available' | 'limited' | 'unavailable';
}

export interface AzureServiceHealth {
  region: string;
  incidents: HealthIncident[];
  maintenances: MaintenanceEvent[];
}

export interface HealthIncident {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'information';
  affectedServices: string[];
  affectedRegions: string[];
  status: 'active' | 'resolved';
  lastUpdate: string;
}

export interface MaintenanceEvent {
  id: string;
  title: string;
  affectedServices: string[];
  affectedRegions: string[];
  scheduledStart: string;
  scheduledEnd: string;
}

class AzureRegionStatusService {
  private cache: Map<string, { data: RegionStatus; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  /**
   * Get region status with caching
   * Note: In production, this would call Azure Status API
   * Currently returns mock data for demonstration
   */
  async getRegionStatus(region: string): Promise<RegionStatus> {
    // Check cache
    const cached = this.cache.get(region);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    // In production, would call:
    // const response = await fetch(`https://status.azure.com/api/v2/regions/${region}/status`);
    
    // Mock data for now
    const status: RegionStatus = {
      region,
      displayName: this.getRegionDisplayName(region),
      available: true,
      services: this.getMockServiceStatuses(region),
      healthStatus: 'healthy',
      lastUpdated: new Date().toISOString(),
    };

    // Cache the result
    this.cache.set(region, { data: status, timestamp: Date.now() });
    return status;
  }

  /**
   * Get Azure service health for a region
   * Returns current incidents and planned maintenance
   */
  async getServiceHealth(region: string): Promise<AzureServiceHealth> {
    // In production, would integrate with Azure Service Health API
    // https://learn.microsoft.com/en-us/rest/api/resourcehealth/
    
    return {
      region,
      incidents: [],
      maintenances: [],
    };
  }

  /**
   * Check if a specific service is available in a region
   */
  async isServiceAvailable(region: string, serviceName: string): Promise<boolean> {
    const status = await this.getRegionStatus(region);
    const service = status.services.find(s => s.name === serviceName);
    return service?.available ?? false;
  }

  private getRegionDisplayName(region: string): string {
    const names: Record<string, string> = {
      'eastus': 'East US',
      'eastus2': 'East US 2',
      'westus': 'West US',
      'westus2': 'West US 2',
      'westus3': 'West US 3',
      'centralus': 'Central US',
      'northeurope': 'North Europe',
      'westeurope': 'West Europe',
      'uksouth': 'UK South',
      'ukwest': 'UK West',
      'southeastasia': 'Southeast Asia',
      'eastasia': 'East Asia',
      'australiaeast': 'Australia East',
      'japaneast': 'Japan East',
      'brazilsouth': 'Brazil South',
      'southindia': 'South India',
      'canadacentral': 'Canada Central',
    };
    return names[region] || region;
  }

  private getMockServiceStatuses(_region: string): ServiceStatus[] {
    // Mock data - in production, this would come from Azure API
    const allServices = [
      'App Service',
      'SQL Database',
      'Storage Account',
      'Functions',
      'Cosmos DB',
      'Key Vault',
      'Container Apps',
      'Application Insights',
      'Service Bus',
      'Event Hub',
    ];

    return allServices.map(name => ({
      name,
      available: true,
      status: 'available' as const,
    }));
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export const azureRegionStatusService = new AzureRegionStatusService();
