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
  StepLabel,
  Paper
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
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

function App() {
  const [processedDoc, setProcessedDoc] = useState<ProcessedDocument | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const processor = new MockDocumentProcessor();
  const [activeStep, setActiveStep] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const steps = [
    {
      label: 'Upload Document',
      description: 'Drag & drop or click to select'
    },
    {
      label: 'Review & Validate',
      description: 'Verify extracted information'
    },
    {
      label: 'Confirm & Save',
      description: 'Save processed data'
    }
  ];

  const documentTypes = [
    {
      name: 'Documents',
      icon: '📄',
      description: 'PDFs, Word, Text files',
      examples: 'Contracts, Reports, Letters'
    },
    {
      name: 'Images',
      icon: '🖼️',
      description: 'PNG, JPG, Scanned files',
      examples: 'Receipts, Business Cards, Forms'
    },
    {
      name: 'Spreadsheets',
      icon: '📊',
      description: 'Excel, CSV, Tables',
      examples: 'Financial Data, Reports, Lists'
    }
  ];

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
      <Container className="app-container">
        <Box className="hero-section" sx={{ mb: 3 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h1" className="app-title">
              Transform Documents
              <br />
              with AI Intelligence
            </Typography>
            <Typography className="app-subtitle">
              Powered by advanced machine learning for unmatched document understanding
            </Typography>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Box sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                mt: 4,
                flexWrap: 'wrap'
              }}>
                {[
                  { icon: '🤖', text: 'AI-Powered Extraction' },
                  { icon: '⚡️', text: 'Real-time Processing' },
                  { icon: '🎯', text: '99.9% Accuracy' }
                ].map((item, index) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      background: 'rgba(0, 122, 255, 0.05)',
                      borderRadius: 2,
                      px: 2,
                      py: 1
                    }}>
                      <Typography fontSize="1.2rem">{item.icon}</Typography>
                      <Typography
                        sx={{
                          color: '#007AFF',
                          fontWeight: 500,
                          fontSize: '0.9rem'
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </motion.div>
        </Box>

        {/* Main Content Area */}
        <Box className="main-content-section">
          <Grid container spacing={4} className="main-content-wrapper">
            {/* Document Display - Left side */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  minHeight: '600px',
                  border: '1px solid rgba(0, 122, 255, 0.1)',
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                {uploadedFile ? (
                  // Document Preview
                  <Box sx={{
                    height: '100%',
                    width: '100%',
                    p: 3,
                    bgcolor: '#fff'
                  }}>
                    <object
                      data={URL.createObjectURL(uploadedFile)}
                      type={uploadedFile.type}
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                    >
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%'
                      }}>
                        <InsertDriveFileIcon sx={{ fontSize: 60, color: '#007AFF', mb: 2 }} />
                        <Typography variant="h6">{uploadedFile.name}</Typography>
                      </Box>
                    </object>
                  </Box>
                ) : (
                  <DocumentUploader
                    onFileSelect={handleFileSelect}
                    processing={processing}
                    error={error}
                    uploadedFile={uploadedFile}
                  />
                )}
              </Paper>
            </Grid>

            {/* Results Panel - Right side */}
            <Grid item xs={12} md={4} lg={3}>
              <ProcessingResults
                document={processedDoc}
                processing={processing}
                isUpdating={isUpdating}
                updateSuccess={updateSuccess}
              />
            </Grid>
          </Grid>

          {/* Floating Action Bar */}
          <motion.div
            className="floating-action-bar"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Box className="action-bar-content">
              <Box className="step-indicator">
                {steps.map((step, index) => (
                  <Box
                    key={step.label}
                    className={`step-dot ${index <= activeStep ? 'active' : ''}`}
                  />
                ))}
              </Box>

              <Box className="action-buttons">
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={handleBack}
                  disabled={activeStep === 0 || processing || isUpdating}
                  variant="text"
                  className="nav-button back-button"
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
                    {isUpdating ? 'Saving...' : updateSuccess ? 'Saved!' : 'Confirm'}
                  </Button>
                ) : (
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleNext}
                    disabled={!processedDoc || processing || isUpdating}
                    variant="contained"
                    className="next-button"
                  >
                    Continue
                  </Button>
                )}
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
