import { useState, useEffect } from 'react';
import { azureRegionStatusService, type RegionStatus } from '../services/azureRegionStatus';
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';

export default function RegionHealthIndicator({ region }: { region: string }) {
  const [status, setStatus] = useState<RegionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const loadRegionStatus = async () => {
      setLoading(true);
      try {
        const regionStatus = await azureRegionStatusService.getRegionStatus(region);
        setStatus(regionStatus);
      } catch (error) {
        console.error('Failed to load region status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRegionStatus();
  }, [region]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <RefreshCw className="h-3 w-3 animate-spin" />
        <span>Checking region status...</span>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  const getHealthIcon = () => {
    switch (status.healthStatus) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'outage':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getHealthColor = () => {
    switch (status.healthStatus) {
      case 'healthy':
        return 'green';
      case 'degraded':
        return 'amber';
      case 'outage':
        return 'red';
    }
  };

  const color = getHealthColor();
  const unavailableServices = status.services.filter(s => !s.available);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between gap-2 p-2 rounded-lg border transition-colors ${
          color === 'green'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30'
            : color === 'amber'
            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30'
        }`}
      >
        <div className="flex items-center gap-2">
          {getHealthIcon()}
          <div className="text-left">
            <div
              className={`text-sm font-medium ${
                color === 'green'
                  ? 'text-green-800 dark:text-green-200'
                  : color === 'amber'
                  ? 'text-amber-800 dark:text-amber-200'
                  : 'text-red-800 dark:text-red-200'
              }`}
            >
              {status.displayName} Status
            </div>
            <div
              className={`text-xs ${
                color === 'green'
                  ? 'text-green-600 dark:text-green-400'
                  : color === 'amber'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {status.healthStatus === 'healthy' && 'All services operational'}
              {status.healthStatus === 'degraded' && `${unavailableServices.length} service(s) degraded`}
              {status.healthStatus === 'outage' && `${unavailableServices.length} service(s) unavailable`}
            </div>
          </div>
        </div>
        
        <RefreshCw
          className={`h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''} ${
            color === 'green'
              ? 'text-green-600 dark:text-green-400'
              : color === 'amber'
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        />
      </button>

      {expanded && (
        <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg space-y-2">
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
            Service Availability
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {status.services.map(service => (
              <div
                key={service.name}
                className="flex items-center gap-2 text-xs"
              >
                {service.available ? (
                  <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                )}
                <span
                  className={
                    service.available
                      ? 'text-slate-700 dark:text-slate-300'
                      : 'text-red-700 dark:text-red-300'
                  }
                >
                  {service.name}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                Last updated: {new Date(status.lastUpdated).toLocaleTimeString()}
              </span>
              <a
                href="https://status.azure.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
              >
                Azure Status
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
