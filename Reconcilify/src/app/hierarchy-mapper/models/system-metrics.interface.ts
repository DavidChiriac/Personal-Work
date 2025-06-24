export interface ISystemMetrics {
  systemCode: number;
  systemName?: string;
  totalProductsNumber: number;
  totalCorrectlyClassified: number;
  totalClassificationIssues: number;
  missingClassification: number;
  incorrectClassification: number;
  classificationStatusComplianceScore?: number;
}
