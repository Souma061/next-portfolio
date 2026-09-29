export interface ArchitectureHop {
  step: string;
  title: string;
  description: string;
  latencyOrThroughput: string;
  badge?: string;
}

export interface BenchmarkComparison {
  metric: string;
  customEngine: string;
  naiveBaseline: string;
  industryAlternative?: string;
  delta: string;
}

export interface ChaosTestScenario {
  name: string;
  adversarialAttack: string;
  mitigation: string;
  result: string;
  status: 'SURVIVED' | 'PASSED' | 'ZERO_FAILURES';
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  role: string;
  category: 'distributed' | 'search' | 'realtime' | 'infra';
  statusBadge: string;
  tags: string[];
  summary: string;
  problemStatement: string;
  architectureHops: ArchitectureHop[];
  benchmarks: BenchmarkComparison[];
  chaosScenarios: ChaosTestScenario[];
  codeSnippets: {
    title: string;
    language: string;
    code: string;
    description: string;
  }[];
  githubUrl: string;
  liveUrl?: string;
  stars?: string;
  featured: boolean;
}

export interface HardwareReceipt {
  id: string;
  number: string;
  title: string;
  metric: string;
  metricSubtext: string;
  badge: string;
  badgeType: 'optimal' | 'verified' | 'neutral';
  description: string;
  sparklineData?: number[];
}
