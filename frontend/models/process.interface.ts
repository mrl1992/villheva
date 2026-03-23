export interface ProcessStep {
  title: string;
  description: string;
}

export interface Process {
  _id?: string;
  title: string;
  subtitle: string;
  description?: string;
  steps: ProcessStep[];
  finalRemark?: string;
}
