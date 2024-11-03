import { ProcessedDocument, DocumentField } from '../types/document';

// Define the interface for the service
export interface DocumentProcessorService {
  processDocument(file: File): Promise<ProcessedDocument>;
}

// Define template types to fix type indexing error
type DocumentTemplate = {
  title: string;
  fields: DocumentField[];
};

type DocumentTemplates = {
  [key: string]: DocumentTemplate;
};

// Mock implementation
export class MockDocumentProcessor implements DocumentProcessorService {
  private static readonly PROCESSING_DELAY = 1500;

  private static readonly DOCUMENT_TEMPLATES: DocumentTemplates = {
    invoice: {
      title: "Invoice Processing",
      fields: [
        { key: "invoiceNumber", label: "Invoice Number", type: "string", format: "INV-YYYY-XXXX" },
        { key: "issueDate", label: "Issue Date", type: "date" },
        { key: "dueDate", label: "Due Date", type: "date" },
        { key: "totalAmount", label: "Total Amount", type: "number", prefix: "$" },
        { key: "taxAmount", label: "Tax Amount", type: "number", prefix: "$" },
        { key: "vendorName", label: "Vendor Name", type: "string" },
        { key: "vendorAddress", label: "Vendor Address", type: "string", multiline: true }
      ]
    },
    resume: {
      title: "Resume Processing",
      fields: [
        { key: "fullName", label: "Full Name", type: "string" },
        { key: "email", label: "Email", type: "string", format: "email" },
        { key: "phone", label: "Phone", type: "string", format: "phone" },
        { key: "education", label: "Education", type: "string", multiline: true },
        { key: "experience", label: "Work Experience", type: "string", multiline: true },
        { key: "skills", label: "Skills", type: "string", multiline: true }
      ]
    }
  };

  async processDocument(file: File): Promise<ProcessedDocument> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, MockDocumentProcessor.PROCESSING_DELAY));

    // Randomly select a document type
    const documentTypes = Object.keys(MockDocumentProcessor.DOCUMENT_TEMPLATES);
    const randomType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
    const template = MockDocumentProcessor.DOCUMENT_TEMPLATES[randomType];

    // Generate random values for fields
    const extractedData = MockDocumentProcessor.generateRandomData(template.fields);

    return {
      type: randomType,
      title: template.title,
      fields: template.fields,
      extractedData,
      confidence: Math.random() * 0.3 + 0.7, // Random confidence between 70-100%
      processingTime: Math.random() * 1000 + 500 // Random processing time 500-1500ms
    };
  }

  private static generateRandomData(fields: DocumentField[]): Record<string, any> {
    const result: Record<string, any> = {};
    
    fields.forEach(field => {
      switch (field.type) {
        case 'string':
          if (field.format === 'email') {
            result[field.key] = 'example@domain.com';
          } else if (field.format === 'phone') {
            result[field.key] = '(555) 123-4567';
          } else if (field.format?.includes('INV')) {
            result[field.key] = `INV-${new Date().getFullYear()}-${Math.random().toString().slice(2, 6)}`;
          } else {
            result[field.key] = `Sample ${field.label}`;
          }
          break;
          
        case 'date':
          result[field.key] = new Date().toISOString().split('T')[0];
          break;
          
        case 'number':
          result[field.key] = (Math.random() * 1000).toFixed(2);
          break;
          
        default:
          result[field.key] = `Sample ${field.label}`;
      }
    });
    
    return result;
  }
}

// Real implementation (to be implemented later)
export class ApiDocumentProcessor implements DocumentProcessorService {
  async processDocument(file: File): Promise<ProcessedDocument> {
    throw new Error('API implementation not yet available');
  }
} 