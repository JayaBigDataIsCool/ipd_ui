import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentUploader } from './components/DocumentUploader';
import { ProcessingResults } from './components/ProcessingResults';
import { ProcessedDocument } from './types/document';
import { MockDocumentProcessor } from './services/documentProcessor';
import { theme } from './theme';
import './App.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function App() {
  const [processedDoc, setProcessedDoc] = useState<ProcessedDocument | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const processor = new MockDocumentProcessor();
  const [activeStep, setActiveStep] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const steps = ['Upload Document', 'Review & Validate', 'Confirm & Save'];

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

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, 2));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleConfirm = async () => {
    setIsUpdating(true);
    try {
      // Simulate API call to update DynamoDB
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUpdateSuccess(true);
      // Reset after 2 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
        setProcessedDoc(null);
        setUploadedFile(null);
        setActiveStep(0);
      }, 2000);
    } catch (error) {
      setError('Failed to update database');
    } finally {
      setIsUpdating(false);
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

        <Box mb={4}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Grid container spacing={3}>
          {/* Left side - Document Upload */}
          <Grid item xs={12} md={8}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`step-${activeStep}`}
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

          {/* Right side - Processing Results */}
          <Grid item xs={12} md={4}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`results-${activeStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                <ProcessingResults
                  document={processedDoc}
                  processing={processing}
                  isUpdating={isUpdating}
                  updateSuccess={updateSuccess}
                />
              </motion.div>
            </AnimatePresence>
          </Grid>
        </Grid>

        {/* Navigation Controls */}
        <Box
          mt={4}
          display="flex"
          justifyContent="space-between"
          className="navigation-controls"
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            disabled={activeStep === 0 || processing || isUpdating}
            variant="outlined"
          >
            Back
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              endIcon={<CheckCircleIcon />}
              onClick={handleConfirm}
              disabled={!processedDoc || processing || isUpdating}
              variant="contained"
              className="confirm-button"
            >
              {isUpdating ? 'Saving...' : updateSuccess ? 'Saved!' : 'Confirm & Save'}
            </Button>
          ) : (
            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={handleNext}
              disabled={!processedDoc || processing || isUpdating}
              variant="contained"
            >
              Next
            </Button>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
