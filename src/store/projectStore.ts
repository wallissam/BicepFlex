import { create } from 'zustand';
import type { ProjectConfig, ResourceConfig, WizardStep } from '../types';

interface ProjectStore {
  project: ProjectConfig;
  currentStep: number;
  steps: WizardStep[];
  
  setProjectName: (name: string) => void;
  setRegion: (region: string) => void;
  addResource: (resource: ResourceConfig) => void;
  updateResource: (id: string, updates: Partial<ResourceConfig>) => void;
  removeResource: (id: string) => void;
  setCurrentStep: (step: number) => void;
  completeStep: (stepId: string) => void;
  resetProject: () => void;
  calculateTotalCost: () => number;
}

const initialSteps: WizardStep[] = [
  {
    id: 'basics',
    title: 'Project Basics',
    description: 'Name your project and choose a region',
    completed: false,
  },
  {
    id: 'resources',
    title: 'Select Resources',
    description: 'Choose the Azure services you need',
    completed: false,
  },
  {
    id: 'configure',
    title: 'Configure',
    description: 'Configure each resource',
    completed: false,
  },
  {
    id: 'review',
    title: 'Review & Generate',
    description: 'Review your infrastructure and generate code',
    completed: false,
  },
];

const initialProject: ProjectConfig = {
  name: '',
  region: 'eastus',
  resources: [],
  estimatedMonthlyCost: 0,
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  project: initialProject,
  currentStep: 0,
  steps: initialSteps,

  setProjectName: (name: string) => {
    set((state) => ({
      project: { ...state.project, name },
    }));
  },

  setRegion: (region: string) => {
    set((state) => ({
      project: { ...state.project, region },
    }));
  },

  addResource: (resource: ResourceConfig) => {
    set((state) => ({
      project: {
        ...state.project,
        resources: [...state.project.resources, resource],
      },
    }));
  },

  updateResource: (id: string, updates: Partial<ResourceConfig>) => {
    set((state) => ({
      project: {
        ...state.project,
        resources: state.project.resources.map((r) =>
          r.id === id ? { ...r, ...updates } : r
        ),
      },
    }));
  },

  removeResource: (id: string) => {
    set((state) => ({
      project: {
        ...state.project,
        resources: state.project.resources.filter((r) => r.id !== id),
      },
    }));
  },

  setCurrentStep: (step: number) => {
    set({ currentStep: step });
  },

  completeStep: (stepId: string) => {
    set((state) => ({
      steps: state.steps.map((s) =>
        s.id === stepId ? { ...s, completed: true } : s
      ),
    }));
  },

  resetProject: () => {
    set({
      project: initialProject,
      currentStep: 0,
      steps: initialSteps,
    });
  },

  calculateTotalCost: () => {
    const { project } = get();
    return project.resources.reduce(
      (total, resource) => total + (resource.pricing?.estimatedMonthlyCost || 0),
      0
    );
  },
}));
