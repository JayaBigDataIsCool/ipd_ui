import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { 
  Container, 
  Grid,
  Typography,
  Box
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentUploader } from './components/DocumentUploader';
import { ProcessingResults } from './components/ProcessingResults';
import { ProcessedDocument } from './types/document';
import { MockDocumentProcessor } from './services/documentProcessor';
import { theme } from './theme';
import './App.css';

function App() {
  const [processedDoc, setProcessedDoc] = useState<ProcessedDocument | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const processor = new MockDocumentProcessor();

  const handleFileSelect = async (file: File) => {
    setUploadedFile(file);
    try {
      setProcessing(true);
      setError(null);
      const result = await processor.processDocument(file);
      setProcessedDoc(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} className="app-container">
        <Box mb={6} textAlign="center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h1" className="app-title" gutterBottom>
              Intelligent Document Processing
            </Typography>
            <Typography variant="h6" className="app-subtitle">
              Upload your document and let AI extract the information
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={3}>
          {/* Left side - Document Upload - Now 8 columns */}
          <Grid item xs={12} md={8}>
            <AnimatePresence mode="wait">
              <motion.div
                key="uploader"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <DocumentUploader
                  onFileSelect={handleFileSelect}
                  processing={processing}
                  error={error}
                  uploadedFile={uploadedFile}
                />
              </motion.div>
            </AnimatePresence>
          </Grid>

          {/* Right side - Processing Results - Now 4 columns */}
          <Grid item xs={12} md={4}>
            <AnimatePresence mode="wait">
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                <ProcessingResults
                  document={processedDoc}
                  processing={processing}
                />
              </motion.div>
            </AnimatePresence>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
