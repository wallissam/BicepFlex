import axios from 'axios';
import type { AzureRetailPriceResponse, AzureRetailPrice, PricingInfo } from '../types/index.js';

const AZURE_PRICING_API = 'https://prices.azure.com/api/retail/prices';

export class AzurePricingService {
  private cache = new Map<string, AzureRetailPrice[]>();

  async getPricing(
    serviceName: string,
    region?: string,
    skuName?: string
  ): Promise<AzureRetailPrice[]> {
    const cacheKey = `${serviceName}-${region}-${skuName}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      let filter = `serviceName eq '${serviceName}'`;
      
      if (region) {
        filter += ` and armRegionName eq '${region}'`;
      }
      
      if (skuName) {
        filter += ` and armSkuName eq '${skuName}'`;
      }

      // Only get consumption pricing for now
      filter += " and priceType eq 'Consumption'";

      const response = await axios.get<AzureRetailPriceResponse>(AZURE_PRICING_API, {
        params: {
          $filter: filter,
        },
      });

      const items = response.data.Items;
      this.cache.set(cacheKey, items);
      
      return items;
    } catch (error) {
      console.error('Error fetching Azure pricing:', error);
      return [];
    }
  }

  async getServicePricing(
    serviceName: string,
    region: string
  ): Promise<Map<string, PricingInfo>> {
    const prices = await this.getPricing(serviceName, region);
    const pricingMap = new Map<string, PricingInfo>();

    for (const price of prices) {
      const key = price.armSkuName || price.skuName;
      
      if (!pricingMap.has(key)) {
        // Estimate monthly cost based on unit of measure
        const hoursPerMonth = 730;
        let estimatedMonthlyCost = price.unitPrice;

        if (price.unitOfMeasure === '1 Hour') {
          estimatedMonthlyCost = price.unitPrice * hoursPerMonth;
        } else if (price.unitOfMeasure === '1/Day') {
          estimatedMonthlyCost = price.unitPrice * 30;
        } else if (price.unitOfMeasure === '1/Month' || price.unitOfMeasure.includes('/Month')) {
          estimatedMonthlyCost = price.unitPrice;
        } else if (price.unitOfMeasure === '1 GB' || price.unitOfMeasure === '1 GB/Month') {
          // Storage: estimate 100 GB usage
          estimatedMonthlyCost = price.unitPrice * 100;
        } else if (price.unitOfMeasure.includes('Transaction')) {
          // Transaction-based: estimate 1M transactions/month
          const multiplier = parseInt(price.unitOfMeasure.replace(/[^0-9]/g, '')) || 1;
          estimatedMonthlyCost = (price.unitPrice / multiplier) * 1_000_000;
        }

        pricingMap.set(key, {
          skuName: key,
          productName: price.productName,
          unitPrice: price.unitPrice,
          currencyCode: price.currencyCode,
          unitOfMeasure: price.unitOfMeasure,
          estimatedMonthlyCost,
        });
      }
    }

    return pricingMap;
  }

  async getRegionsForService(serviceName: string): Promise<string[]> {
    try {
      const filter = `serviceName eq '${serviceName}'`;
      const response = await axios.get<AzureRetailPriceResponse>(AZURE_PRICING_API, {
        params: {
          $filter: filter,
          $top: 1000,
        },
      });

      const regions = new Set<string>();
      response.data.Items.forEach((item: AzureRetailPrice) => {
        if (item.armRegionName) {
          regions.add(item.armRegionName);
        }
      });

      return Array.from(regions).sort();
    } catch (error) {
      console.error('Error fetching regions:', error);
      return [];
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export const azurePricingService = new AzurePricingService();
