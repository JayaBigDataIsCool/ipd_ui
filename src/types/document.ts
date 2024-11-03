export interface DocumentField {
  key: string;
  label: string;
  type: string;
  format?: string;
  prefix?: string;
  multiline?: boolean;
  items?: any;
}

export interface ProcessedDocument {
  type: string;
  title: string;
  fields: DocumentField[];
  extractedData: Record<string, any>;
  confidence: number;
  processingTime: number;
}

export interface DocumentResponse {
  success: boolean;
  data?: ProcessedDocument;
  error?: string;
} 