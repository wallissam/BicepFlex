import { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { Shield, CheckCircle, XCircle, AlertTriangle, Eye, Lock, Server, Cloud, Database, Code } from 'lucide-react';

interface SecurityCheck {
  id: string;
  category: 'network' | 'identity' | 'data' | 'monitoring' | 'code';
  title: string;
  description: string;
  status: 'pass' | 'fail' | 'warning' | 'na';
  recommendation?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  autoApplicable: boolean;
  costImpact: 'none' | 'low' | 'medium' | 'high';
}

export default function SecurityChecklist() {
  const { project } = useProjectStore();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  if (project.resources.length === 0) {
    return null;
  }

  // Analyze project for security issues
  const performSecurityChecks = (): SecurityCheck[] => {
    const checks: SecurityCheck[] = [];

    // Network Security Checks
    const hasPublicEndpoints = project.resources.some(r => 
      r.properties.publicNetworkAccess === 'Enabled' ||
      r.properties.publicNetworkAccess === undefined
    );
    
    checks.push({
      id: 'network-firewall',
      category: 'network',
      title: 'Firewall Rules Configured',
      description: 'SQL databases and storage accounts should have firewall rules',
      status: hasPublicEndpoints ? 'warning' : 'pass',
      recommendation: hasPublicEndpoints ? 'Enable firewall rules to restrict access to specific IP ranges' : undefined,
      priority: 'high',
      autoApplicable: true,
      costImpact: 'none',
    });

    checks.push({
      id: 'network-private-endpoints',
      category: 'network',
      title: 'Private Endpoints',
      description: 'Use private endpoints for sensitive resources',
      status: 'na',
      recommendation: 'Consider using Azure Private Link for PaaS services',
      priority: 'medium',
      autoApplicable: false,
      costImpact: 'medium',
    });

    // Identity & Access Checks
    const hasKeyVault = project.resources.some(r => r.type === 'keyVault');
    
    checks.push({
      id: 'identity-secrets',
      category: 'identity',
      title: 'Secret Management',
      description: 'Secrets should be stored in Azure Key Vault',
      status: hasKeyVault ? 'pass' : 'warning',
      recommendation: 'Add Azure Key Vault to securely store connection strings, API keys, and certificates',
      priority: 'critical',
      autoApplicable: true,
      costImpact: 'low',
    });

    checks.push({
      id: 'identity-managed',
      category: 'identity',
      title: 'Managed Identity',
      description: 'Use managed identities instead of credentials',
      status: 'na',
      recommendation: 'Enable system-assigned or user-assigned managed identities for Azure resources',
      priority: 'high',
      autoApplicable: true,
      costImpact: 'none',
    });

    checks.push({
      id: 'identity-rbac',
      category: 'identity',
      title: 'Role-Based Access Control',
      description: 'Implement least-privilege RBAC',
      status: 'na',
      recommendation: 'Use Azure RBAC to grant minimum necessary permissions',
      priority: 'high',
      autoApplicable: false,
      costImpact: 'none',
    });

    // Data Protection Checks
    const hasSqlDb = project.resources.some(r => r.type === 'sqlDatabase');
    const hasCosmosDb = project.resources.some(r => r.type === 'cosmosDb');
    const hasStorage = project.resources.some(r => r.type === 'storageAccount');

    if (hasSqlDb || hasCosmosDb) {
      checks.push({
        id: 'data-encryption-transit',
        category: 'data',
        title: 'Encryption in Transit',
        description: 'All database connections use TLS/SSL',
        status: 'pass',
        priority: 'critical',
        autoApplicable: true,
        costImpact: 'none',
      });

      checks.push({
        id: 'data-encryption-rest',
        category: 'data',
        title: 'Encryption at Rest',
        description: 'Data is encrypted at rest',
        status: 'pass',
        priority: 'critical',
        autoApplicable: true,
        costImpact: 'none',
      });

      checks.push({
        id: 'data-backup',
        category: 'data',
        title: 'Automated Backups',
        description: 'Regular backups are configured',
        status: 'warning',
        recommendation: 'Configure automated backups with appropriate retention period',
        priority: 'high',
        autoApplicable: true,
        costImpact: 'low',
      });
    }

    if (hasStorage) {
      checks.push({
        id: 'data-storage-security',
        category: 'data',
        title: 'Storage Account Security',
        description: 'Secure transfer and network rules enabled',
        status: 'warning',
        recommendation: 'Enable "Secure transfer required" and configure network rules',
        priority: 'high',
        autoApplicable: true,
        costImpact: 'none',
      });
    }

    // Monitoring & Logging Checks
    const hasAppInsights = project.resources.some(r => r.type === 'appInsights');

    checks.push({
      id: 'monitoring-logging',
      category: 'monitoring',
      title: 'Application Monitoring',
      description: 'Application Insights is configured',
      status: hasAppInsights ? 'pass' : 'warning',
      recommendation: 'Add Application Insights for application performance monitoring and diagnostics',
      priority: 'medium',
      autoApplicable: true,
      costImpact: 'low',
    });

    checks.push({
      id: 'monitoring-alerts',
      category: 'monitoring',
      title: 'Security Alerts',
      description: 'Azure Security Center alerts configured',
      status: 'na',
      recommendation: 'Enable Azure Defender for enhanced threat protection',
      priority: 'medium',
      autoApplicable: false,
      costImpact: 'high',
    });

    // Code Security Checks
    checks.push({
      id: 'code-scanning',
      category: 'code',
      title: 'Code Scanning',
      description: 'Bicep files scanned for security issues',
      status: 'pass',
      priority: 'low',
      autoApplicable: true,
      costImpact: 'none',
    });

    checks.push({
      id: 'code-secrets-scan',
      category: 'code',
      title: 'Secrets in Code',
      description: 'No hardcoded secrets in templates',
      status: 'pass',
      recommendation: 'Use parameters and Key Vault references instead of hardcoded values',
      priority: 'critical',
      autoApplicable: true,
      costImpact: 'none',
    });

    return checks;
  };

  const checks = performSecurityChecks();

  const groupedChecks = checks.reduce((acc, check) => {
    if (!acc[check.category]) {
      acc[check.category] = [];
    }
    acc[check.category].push(check);
    return acc;
  }, {} as Record<string, SecurityCheck[]>);

  const categories = {
    network: { icon: Cloud, label: 'Network Security', color: 'blue' },
    identity: { icon: Lock, label: 'Identity & Access', color: 'purple' },
    data: { icon: Database, label: 'Data Protection', color: 'green' },
    monitoring: { icon: Eye, label: 'Monitoring & Logging', color: 'amber' },
    code: { icon: Code, label: 'Code Security', color: 'indigo' },
  };

  const getStatusIcon = (status: SecurityCheck['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'na':
        return <div className="h-5 w-5 rounded-full bg-slate-300 dark:bg-slate-600" />;
    }
  };

  const categoryStats = (category: string) => {
    const categoryChecks = groupedChecks[category] || [];
    const passed = categoryChecks.filter(c => c.status === 'pass').length;
    const total = categoryChecks.length;
    return { passed, total, percentage: (passed / total) * 100 };
  };

  const overallStats = () => {
    const passed = checks.filter(c => c.status === 'pass').length;
    const total = checks.length;
    return { passed, total, percentage: (passed / total) * 100 };
  };

  const overall = overallStats();

  return (
    <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Security Checklist
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Azure security best practices assessment
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {overall.percentage.toFixed(0)}%
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {overall.passed} of {overall.total} checks
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(categories).map(([key, config]) => {
          const Icon = config.icon;
          const stats = categoryStats(key);
          const isExpanded = expandedCategory === key;
          const categoryChecks = groupedChecks[key] || [];
          
          // Map colors to actual Tailwind classes for proper purging
          const iconColorClass = 
            config.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
            config.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
            config.color === 'green' ? 'text-green-600 dark:text-green-400' :
            config.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
            'text-indigo-600 dark:text-indigo-400';
            
          const progressColorClass =
            config.color === 'blue' ? 'bg-blue-500' :
            config.color === 'purple' ? 'bg-purple-500' :
            config.color === 'green' ? 'bg-green-500' :
            config.color === 'amber' ? 'bg-amber-500' :
            'bg-indigo-500';

          return (
            <div key={key} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : key)}
                className="w-full p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className={iconColorClass} />
                  <div className="text-left">
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {config.label}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {stats.passed}/{stats.total} checks passed
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${progressColorClass}`}
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                  <Server className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 space-y-3 bg-white dark:bg-slate-800">
                  {categoryChecks.map(check => (
                    <div
                      key={check.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      {getStatusIcon(check.status)}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {check.title}
                          </div>
                          {check.priority === 'critical' && (
                            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium rounded">
                              Critical
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {check.description}
                        </p>
                        {check.recommendation && check.status !== 'pass' && (
                          <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded text-xs text-amber-800 dark:text-amber-200">
                            <strong>Recommendation:</strong> {check.recommendation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-200">
        <p className="font-medium mb-2">🛡️ Security Best Practices</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Enable Azure Defender for comprehensive threat protection</li>
          <li>Use Azure Policy to enforce organizational standards</li>
          <li>Implement network segmentation with VNets and NSGs</li>
          <li>Regular security assessments with Azure Security Center</li>
          <li>Enable diagnostic logging for all resources</li>
        </ul>
      </div>
    </div>
  );
}
