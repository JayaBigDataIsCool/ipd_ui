import { ProcessedDocument, DocumentField } from '../types/document';

// Define the interface for the service
export interface DocumentProcessorService {
  processDocument(file: File): Promise<ProcessedDocument>;
}

// Real API implementation
export class ApiDocumentProcessor implements DocumentProcessorService {
  private readonly API_ENDPOINT = 'https://rwhzxfffd7.execute-api.us-east-1.amazonaws.com/dev';
  private readonly POLL_INTERVAL = 10000; // 10 seconds
  private readonly MAX_RETRIES = 30; // 5 minutes maximum polling time

  async processDocument(file: File): Promise<ProcessedDocument> {
    try {
      // Initial upload
      const jobId = await this.uploadDocument(file);

      // Poll for results
      const results = await this.pollForResults(jobId);

      // Transform the results into ProcessedDocument format
      return this.transformResults(results);
    } catch (error) {
      console.error('Document processing error:', error);
      throw error;
    }
  }

  private async uploadDocument(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(this.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message || 'Upload failed');
    }

    return data.jobId;
  }

  private async pollForResults(jobId: string): Promise<any> {
    let retries = 0;

    while (retries < this.MAX_RETRIES) {
      const response = await fetch(`${this.API_ENDPOINT}/status/${jobId}`);
      const data = await response.json();

      switch (data.status) {
        case 'completed':
          return data.results;
        case 'failed':
          throw new Error(data.error || 'Processing failed');
        case 'processing':
          // Continue polling
          await new Promise(resolve => setTimeout(resolve, this.POLL_INTERVAL));
          retries++;
          break;
        default:
          throw new Error(`Unknown status: ${data.status}`);
      }
    }

    throw new Error('Processing timeout - please try again');
  }

  private transformResults(results: any): ProcessedDocument {
    return {
      type: results.data?.document_type || 'Unknown',
      title: `${results.data?.document_type || 'Document'} Processing`,
      fields: [], // We don't need to transform fields
      extractedData: results.data || {}, // Pass the entire data structure as is
      confidence: parseFloat(results.data?.confidence || '0'),
      processingTime: 0
    };
  }
} 