import { useState } from 'react';
import { Wand2, Check, AlertCircle, Info } from 'lucide-react';
import type { AzureResourceType } from '../types';

interface NamingRule {
  minLength: number;
  maxLength: number;
  allowedChars: string;
  mustStartWith?: string;
  mustEndWith?: string;
  globallyUnique: boolean;
  examples: string[];
}

const namingRules: Record<AzureResourceType, NamingRule> = {
  webApp: {
    minLength: 2,
    maxLength: 60,
    allowedChars: 'Alphanumeric and hyphens',
    mustStartWith: 'Letter or number',
    mustEndWith: 'Letter or number',
    globallyUnique: true,
    examples: ['my-webapp-prod', 'webapp-east-001'],
  },
  staticWebApp: {
    minLength: 2,
    maxLength: 60,
    allowedChars: 'Alphanumeric and hyphens',
    globallyUnique: true,
    examples: ['my-static-site', 'frontend-app'],
  },
  functionApp: {
    minLength: 2,
    maxLength: 60,
    allowedChars: 'Alphanumeric and hyphens',
    mustStartWith: 'Letter or number',
    mustEndWith: 'Letter or number',
    globallyUnique: true,
    examples: ['my-function-app', 'api-functions-prod'],
  },
  containerApp: {
    minLength: 2,
    maxLength: 32,
    allowedChars: 'Lowercase, numbers, hyphens',
    mustStartWith: 'Letter',
    mustEndWith: 'Alphanumeric',
    globallyUnique: false,
    examples: ['my-container-app', 'api-service'],
  },
  cosmosDb: {
    minLength: 3,
    maxLength: 44,
    allowedChars: 'Lowercase, numbers, hyphens',
    mustStartWith: 'Letter',
    globallyUnique: true,
    examples: ['my-cosmos-db', 'nosql-database'],
  },
  sqlDatabase: {
    minLength: 1,
    maxLength: 128,
    allowedChars: 'Alphanumeric, underscore, hyphen, period',
    globallyUnique: false,
    examples: ['ProductionDB', 'my-sql-database'],
  },
  storageAccount: {
    minLength: 3,
    maxLength: 24,
    allowedChars: 'Lowercase and numbers only',
    globallyUnique: true,
    examples: ['mystorageaccount', 'proddata2024'],
  },
  keyVault: {
    minLength: 3,
    maxLength: 24,
    allowedChars: 'Alphanumeric and hyphens',
    mustStartWith: 'Letter',
    mustEndWith: 'Letter or number',
    globallyUnique: true,
    examples: ['my-keyvault', 'kv-prod-secrets'],
  },
  appInsights: {
    minLength: 1,
    maxLength: 260,
    allowedChars: 'Alphanumeric, hyphens, periods, underscores, parentheses',
    globallyUnique: false,
    examples: ['my-app-insights', 'monitoring-prod'],
  },
  serviceBus: {
    minLength: 6,
    maxLength: 50,
    allowedChars: 'Alphanumeric and hyphens',
    mustStartWith: 'Letter',
    mustEndWith: 'Letter or number',
    globallyUnique: true,
    examples: ['my-servicebus', 'messaging-prod'],
  },
  eventHub: {
    minLength: 6,
    maxLength: 50,
    allowedChars: 'Alphanumeric and hyphens',
    mustStartWith: 'Letter',
    mustEndWith: 'Letter or number',
    globallyUnique: true,
    examples: ['my-eventhub', 'events-stream'],
  },
  redis: {
    minLength: 1,
    maxLength: 63,
    allowedChars: 'Alphanumeric and hyphens',
    mustStartWith: 'Letter',
    mustEndWith: 'Letter or number',
    globallyUnique: true,
    examples: ['my-redis-cache', 'cache-prod'],
  },
};

interface ResourceNamingHelperProps {
  resourceType: AzureResourceType;
  currentName: string;
  onNameGenerated: (name: string) => void;
}

export default function ResourceNamingHelper({ 
  resourceType, 
  currentName,
  onNameGenerated 
}: ResourceNamingHelperProps) {
  const [showHelper, setShowHelper] = useState(false);
  const rules = namingRules[resourceType];

  if (!rules) return null;

  const validateName = (name: string): { valid: boolean; message?: string } => {
    if (name.length < rules.minLength) {
      return { valid: false, message: `Too short (min ${rules.minLength} chars)` };
    }
    if (name.length > rules.maxLength) {
      return { valid: false, message: `Too long (max ${rules.maxLength} chars)` };
    }
    
    // Storage account specific validation
    if (resourceType === 'storageAccount') {
      if (!/^[a-z0-9]+$/.test(name)) {
        return { valid: false, message: 'Only lowercase letters and numbers allowed' };
      }
    }
    
    // General alphanumeric with hyphens validation
    if (resourceType !== 'storageAccount' && !/^[a-zA-Z0-9-]+$/.test(name)) {
      return { valid: false, message: 'Only alphanumeric and hyphens allowed' };
    }

    if (rules.mustStartWith === 'Letter' && !/^[a-zA-Z]/.test(name)) {
      return { valid: false, message: 'Must start with a letter' };
    }

    return { valid: true };
  };

  const generateName = () => {
    const timestamp = Date.now().toString().slice(-6);
    const prefix = resourceType.toLowerCase().replace(/([A-Z])/g, '-$1');
    let generated = `${prefix}-${timestamp}`;
    
    // Apply resource-specific rules
    if (resourceType === 'storageAccount') {
      generated = generated.replace(/-/g, '').toLowerCase();
    }
    
    // Ensure within length limits
    if (generated.length > rules.maxLength) {
      generated = generated.substring(0, rules.maxLength);
    }
    
    onNameGenerated(generated);
  };

  const validation = validateName(currentName);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowHelper(!showHelper)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1"
        >
          <Info className="w-4 h-4" />
          <span>Naming Rules</span>
        </button>
        
        <button
          type="button"
          onClick={generateName}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1"
        >
          <Wand2 className="w-4 h-4" />
          <span>Generate Name</span>
        </button>
      </div>

      {/* Validation Status */}
      {currentName && (
        <div className={`flex items-center space-x-2 text-sm ${
          validation.valid 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          {validation.valid ? (
            <>
              <Check className="w-4 h-4" />
              <span>Valid name</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4" />
              <span>{validation.message}</span>
            </>
          )}
        </div>
      )}

      {/* Helper Panel */}
      {showHelper && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm space-y-2">
          <div>
            <strong className="text-blue-900 dark:text-blue-100">Requirements:</strong>
            <ul className="mt-1 space-y-1 text-blue-800 dark:text-blue-200 ml-4 list-disc">
              <li>Length: {rules.minLength}-{rules.maxLength} characters</li>
              <li>{rules.allowedChars}</li>
              {rules.mustStartWith && <li>Must start with: {rules.mustStartWith}</li>}
              {rules.mustEndWith && <li>Must end with: {rules.mustEndWith}</li>}
              {rules.globallyUnique && (
                <li className="text-amber-700 dark:text-amber-300">
                  ⚠️ Must be globally unique across all Azure
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <strong className="text-blue-900 dark:text-blue-100">Examples:</strong>
            <ul className="mt-1 space-y-1 text-blue-700 dark:text-blue-300 ml-4">
              {rules.examples.map((example, idx) => (
                <li key={idx}>
                  <code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 rounded text-xs">
                    {example}
                  </code>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
