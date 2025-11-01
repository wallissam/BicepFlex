import { azureDocsService, type DocLink } from '../services/azureDocs';
import { BookOpen, ExternalLink, Sparkles, DollarSign, Shield, Wrench } from 'lucide-react';

export default function ContextualDocs({ 
  resourceType, 
  context = 'resource' 
}: { 
  resourceType?: string;
  context?: 'resource' | 'bicep' | 'deployment' | 'cost';
}) {
  let docs: DocLink[] = [];
  let title = '';
  
  switch (context) {
    case 'bicep':
      docs = azureDocsService.getBicepDocs();
      title = 'Bicep Documentation';
      break;
    case 'deployment':
      docs = azureDocsService.getDeploymentDocs();
      title = 'Deployment Guides';
      break;
    case 'cost':
      docs = azureDocsService.getCostOptimizationDocs();
      title = 'Cost Optimization';
      break;
    case 'resource':
    default:
      if (resourceType) {
        docs = azureDocsService.getResourceDocs(resourceType);
        title = 'Resource Documentation';
      }
      break;
  }

  if (docs.length === 0) {
    return null;
  }

  const getCategoryIcon = (category: DocLink['category']) => {
    switch (category) {
      case 'getting-started':
        return <Sparkles className="h-3 w-3" />;
      case 'best-practices':
        return <Shield className="h-3 w-3" />;
      case 'pricing':
        return <DollarSign className="h-3 w-3" />;
      case 'troubleshooting':
        return <Wrench className="h-3 w-3" />;
      default:
        return <BookOpen className="h-3 w-3" />;
    }
  };

  const getCategoryColor = (category: DocLink['category']) => {
    switch (category) {
      case 'getting-started':
        return 'text-blue-600 dark:text-blue-400';
      case 'best-practices':
        return 'text-green-600 dark:text-green-400';
      case 'pricing':
        return 'text-amber-600 dark:text-amber-400';
      case 'troubleshooting':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
          {title}
        </h4>
      </div>

      <div className="space-y-2">
        {docs.map((doc, index) => (
          <a
            key={index}
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start gap-2">
              <div className={`mt-0.5 ${getCategoryColor(doc.category)}`}>
                {getCategoryIcon(doc.category)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                    {doc.title}
                  </span>
                  <ExternalLink className="h-3 w-3 text-slate-400 flex-shrink-0" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {doc.description}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          💡 These links provide additional context and best practices from official Azure documentation
        </p>
      </div>
    </div>
  );
}
