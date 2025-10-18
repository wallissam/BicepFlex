export interface ResourceTag {
  key: string;
  value: string;
}

export interface TagPreset {
  name: string;
  description: string;
  tags: ResourceTag[];
}

export const commonTagPresets: TagPreset[] = [
  {
    name: 'Environment Tags',
    description: 'Standard environment classification',
    tags: [
      { key: 'Environment', value: 'Production' },
      { key: 'ManagedBy', value: 'BicepFlex' },
      { key: 'DeployedBy', value: 'azd' },
    ],
  },
  {
    name: 'Cost Center',
    description: 'For cost allocation and tracking',
    tags: [
      { key: 'CostCenter', value: 'Engineering' },
      { key: 'Project', value: 'MyProject' },
      { key: 'Owner', value: 'team@company.com' },
    ],
  },
  {
    name: 'Compliance',
    description: 'Regulatory and compliance tags',
    tags: [
      { key: 'Compliance', value: 'GDPR' },
      { key: 'DataClassification', value: 'Confidential' },
      { key: 'BusinessUnit', value: 'IT' },
    ],
  },
  {
    name: 'Operational',
    description: 'Operations and maintenance',
    tags: [
      { key: 'MaintenanceWindow', value: 'Sunday-2AM-4AM' },
      { key: 'BackupPolicy', value: 'Daily' },
      { key: 'AutoShutdown', value: 'Enabled' },
    ],
  },
];
