import { useProjectStore } from '../store/projectStore';
import { bestPracticesValidator } from '../services/bestPracticesValidator';
import { Shield, DollarSign, Zap, Award, TrendingUp } from 'lucide-react';

export default function BestPracticesScorecard() {
  const { project } = useProjectStore();
  
  if (project.resources.length === 0) return null;
  
  const issues = bestPracticesValidator.validate(project);
  
  // Calculate scores
  const errors = issues.filter(i => i.severity === 'error').length;
  const warnings = issues.filter(i => i.severity === 'warning').length;
  
  // Overall score (0-100)
  const errorPenalty = errors * 10;
  const warningPenalty = warnings * 5;
  const overallScore = Math.max(0, 100 - errorPenalty - warningPenalty);
  
  // Security score - based on actual security checks
  const hasKeyVault = project.resources.some(r => r.type === 'keyVault');
  const hasManagedIdentity = project.resources.some(r => 
    r.properties?.managedIdentity || r.properties?.enableManagedIdentity
  );
  
  const securityIssues = issues.filter(i => 
    i.severity === 'error' && (i.message.toLowerCase().includes('security') || 
    i.message.toLowerCase().includes('password') || 
    i.message.toLowerCase().includes('key'))
  );
  
  let securityScore = 100;
  if (!hasKeyVault) securityScore -= 25; // Key Vault is critical for secrets
  if (!hasManagedIdentity) securityScore -= 15;
  securityScore -= Math.min(securityIssues.length * 10, 40);
  if (!hasManagedIdentity) securityScore -= 20; // Managed Identity improves security
  if (!hasAppInsights) securityScore -= 15; // App Insights for monitoring
  securityScore -= securityIssues.length * 10; // Each security issue costs 10 points
  securityScore = Math.max(0, securityScore);
  
  // Cost optimization score - based on actual resource costs and SKU selections
  const totalMonthlyCost = project.resources.reduce((sum, r) => sum + (r.pricing?.estimatedMonthlyCost || 0), 0);
  const avgCostPerResource = totalMonthlyCost / Math.max(1, project.resources.length);
  
  let costScore = 100;
  if (totalMonthlyCost > 500) costScore -= 30; // Very expensive project
  else if (totalMonthlyCost > 200) costScore -= 15; // Expensive project
  if (avgCostPerResource > 100) costScore -= 15; // High average cost per resource
  
  const hasPremiumResources = project.resources.some(r => r.sku.tier.toLowerCase().includes('premium'));
  if (hasPremiumResources) {
    const premiumCount = project.resources.filter(r => r.sku.tier.toLowerCase().includes('premium')).length;
    const totalCount = project.resources.length;
    if (premiumCount / totalCount > 0.5) costScore -= 20; // More than half premium
  }
  
  costScore = Math.max(0, costScore);
  
  // Reliability score
  const hasMonitoring = project.resources.some(r => r.type === 'appInsights');
  const reliabilityScore = hasMonitoring ? 85 : 70;
  
  const scores = [
    {
      title: 'Overall',
      score: overallScore,
      icon: Award,
      color: overallScore >= 80 ? 'green' : overallScore >= 60 ? 'amber' : 'red',
      description: overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Needs Improvement',
    },
    {
      title: 'Security',
      score: securityScore,
      icon: Shield,
      color: securityScore >= 80 ? 'green' : securityScore >= 60 ? 'amber' : 'red',
      description: securityScore >= 80 ? 'Strong security posture' : securityScore >= 60 ? 'Security can be improved' : 'Security issues detected',
    },
    {
      title: 'Cost',
      score: costScore,
      icon: DollarSign,
      color: costScore >= 80 ? 'green' : costScore >= 60 ? 'amber' : 'red',
      description: costScore >= 80 ? 'Cost-optimized' : costScore >= 60 ? 'Moderate costs' : 'High costs detected',
    },
    {
      title: 'Reliability',
      score: reliabilityScore,
      icon: Zap,
      color: reliabilityScore >= 80 ? 'green' : reliabilityScore >= 60 ? 'amber' : 'red',
      description: hasMonitoring ? 'Monitoring enabled' : 'Add monitoring',
    },
  ];
  
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-500',
          text: 'text-green-600 dark:text-green-400',
          border: 'border-green-200 dark:border-green-800',
          lightBg: 'bg-green-50 dark:bg-green-900/20',
        };
      case 'amber':
        return {
          bg: 'bg-amber-500',
          text: 'text-amber-600 dark:text-amber-400',
          border: 'border-amber-200 dark:border-amber-800',
          lightBg: 'bg-amber-50 dark:bg-amber-900/20',
        };
      case 'red':
        return {
          bg: 'bg-red-500',
          text: 'text-red-600 dark:text-red-400',
          border: 'border-red-200 dark:border-red-800',
          lightBg: 'bg-red-50 dark:bg-red-900/20',
        };
      default:
        return {
          bg: 'bg-slate-500',
          text: 'text-slate-600 dark:text-slate-400',
          border: 'border-slate-200 dark:border-slate-700',
          lightBg: 'bg-slate-50 dark:bg-slate-900/20',
        };
    }
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm">
      {/* Compact Header */}
      <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Quality Score</h3>
          </div>
          {overallScore >= 80 && (
            <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
          )}
        </div>
      </div>

      {/* Compact Score Cards - Stacked */}
      <div className="p-3 space-y-2">
        {scores.map((score) => {
          const colors = getColorClasses(score.color);
          const Icon = score.icon;
          
          return (
            <div key={score.title} className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1">
                <Icon className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-900 dark:text-white">{score.title}</span>
                    <span className={`text-sm font-bold ${colors.text} ml-2`}>{score.score}</span>
                  </div>
                  <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${colors.bg} transition-all duration-500`}
                      style={{ width: `${score.score}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compact Summary */}
      <div className="px-3 pb-3">
        <div className="text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
          {overallScore >= 80 ? (
            <span className="text-green-600 dark:text-green-400 font-medium">✓ Production Ready</span>
          ) : overallScore >= 60 ? (
            <span className="text-amber-600 dark:text-amber-400 font-medium">⚠ Review Warnings</span>
          ) : (
            <span className="text-red-600 dark:text-red-400 font-medium">✗ Fix Errors</span>
          )}
        </div>
      </div>
    </div>
  );
}
