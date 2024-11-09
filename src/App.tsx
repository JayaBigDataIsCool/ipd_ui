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
import { ApiDocumentProcessor } from './services/documentProcessor';
import { theme } from './theme';
import './App.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SecurityIcon from '@mui/icons-material/Security';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { secureLogger } from './utils/secureLogger';
import { PDFViewer } from './components/PDFViewer';

function App() {
  const [processedDoc, setProcessedDoc] = useState<ProcessedDocument | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const processor = new ApiDocumentProcessor();
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
      secureLogger.log('Document processed successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      secureLogger.error('Document processing failed:', errorMessage);
      setError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, 2));
  };

  const handleBack = () => {
    if (activeStep === 0 && uploadedFile) {
      // Reset file and processed doc when going back from first step
      setUploadedFile(null);
      setProcessedDoc(null);
    } else {
      setActiveStep((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleConfirm = async () => {
    setIsUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUpdateSuccess(true);
      secureLogger.log('Document saved successfully');
      setTimeout(() => {
        setUpdateSuccess(false);
        setProcessedDoc(null);
        setUploadedFile(null);
        setActiveStep(0);
      }, 2000);
    } catch (error) {
      secureLogger.error('Failed to update database:', error);
      setError('Failed to update database');
    } finally {
      setIsUpdating(false);
    }
  };

  const renderDocumentPreview = (file: File) => {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    const fileUrl = URL.createObjectURL(file);

    // Images
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileType || '')) {
      return (
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            bgcolor: '#fff'
          }}
        >
          <img
            src={fileUrl}
            alt="Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
          />
        </Box>
      );
    }

    // PDFs
    if (fileType === 'pdf') {
      return <PDFViewer fileUrl={fileUrl} />;
    }

    // Fallback for other file types
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        p: 3
      }}>
        <InsertDriveFileIcon sx={{ fontSize: 60, color: '#007AFF', mb: 2 }} />
        <Typography variant="h6">{file.name}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Unknown type'}
        </Typography>
      </Box>
    );
  };

  // Add a state to track if we're in document view
  const isDocumentView = Boolean(uploadedFile);

  return (
    <ThemeProvider theme={theme}>
      <Authenticator>
        {({ signOut }) => (
          <Container className="app-container" sx={{ py: 2 }}>
            {/* Sign Out Button - Always visible */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mb: 2
            }}>
              <Button
                onClick={signOut}
                sx={{
                  background: 'linear-gradient(135deg, #AF52DE, #FF2D55)',
                  color: 'white',
                  px: 3,
                  py: 1,
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  boxShadow: '0 2px 12px rgba(175, 82, 222, 0.15)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #9B3DE0, #FF1493)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 16px rgba(175, 82, 222, 0.25)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Sign Out
              </Button>
            </Box>

            {/* Hero Section - Only show on landing page */}
            {!isDocumentView && (
              <Box className="hero-section" sx={{ mb: 2 }}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <Typography
                    variant="h1"
                    className="app-title"
                    sx={{
                      fontSize: 'clamp(2.2rem, 4vw, 3.5rem) !important',  // Reduced font size
                      mb: 1  // Reduced margin
                    }}
                  >
                    Transform Documents
                    <br />
                    with AI Intelligence
                  </Typography>
                  <Typography
                    className="app-subtitle"
                    sx={{
                      fontSize: 'clamp(1rem, 1.5vw, 1.2rem) !important',  // Reduced font size
                      mb: 2  // Reduced margin
                    }}
                  >
                    Powered by advanced machine learning for unmatched document understanding
                  </Typography>

                  {/* Features section */}
                  <Box sx={{
                    display: 'flex',
                    gap: { xs: 1, md: 1.5 },  // Reduced gap
                    justifyContent: 'center',
                    flexWrap: 'nowrap',
                    mt: 2,  // Reduced margin
                    mb: 1,  // Reduced margin
                    maxWidth: '1200px',
                    mx: 'auto'
                  }}>
                    {[
                      {
                        icon: <AutoFixHighIcon sx={{ fontSize: '1.4rem' }} />,
                        text: 'Smart Analysis',
                        gradient: 'linear-gradient(135deg, #AF52DE 20%, #FF2D55 90%)'
                      },
                      {
                        icon: <RocketLaunchIcon sx={{ fontSize: '1.4rem' }} />,
                        text: 'Fast Process',
                        gradient: 'linear-gradient(135deg, #FF3B30 20%, #FF9500 90%)'
                      },
                      {
                        icon: <WorkspacePremiumIcon sx={{ fontSize: '1.4rem' }} />,
                        text: 'High Accuracy',
                        gradient: 'linear-gradient(135deg, #8A2BE2 20%, #FF1493 90%)'
                      },
                      {
                        icon: <SecurityIcon sx={{ fontSize: '1.4rem' }} />,
                        text: 'Secure',
                        gradient: 'linear-gradient(135deg, #34C759 20%, #30B0C7 90%)'
                      },
                      {
                        icon: <IntegrationInstructionsIcon sx={{ fontSize: '1.4rem' }} />,
                        text: 'Easy Setup',
                        gradient: 'linear-gradient(135deg, #007AFF 20%, #5856D6 90%)'
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={item.text}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.5 + index * 0.1,
                          duration: 0.4,
                          ease: "easeOut"
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            background: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '12px',
                            px: 1.5,
                            py: 1,
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.8)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
                            }
                          }}
                        >
                          <Box
                            sx={{
                              background: item.gradient,
                              borderRadius: '8px',
                              p: 0.75,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              boxShadow: `0 4px 15px ${item.gradient.split(' ')[2]}25`
                            }}
                          >
                            {item.icon}
                          </Box>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              background: item.gradient,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {item.text}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              </Box>
            )}

            {/* Main Content Area */}
            <Box className="main-content-section" sx={{
              pb: 8,
              mt: isDocumentView ? 0 : 4 // Adjust top margin based on view
            }}>
              <Grid
                container
                spacing={2}
                className="main-content-wrapper"
                sx={{
                  minHeight: isDocumentView ? 'calc(100vh - 150px)' : 'calc(100vh - 250px)', // Increased height for document view
                  position: 'relative'
                }}
              >
                {/* Document Display - Left side */}
                <Grid
                  item
                  xs={12}
                  md={8}
                  lg={9}
                  sx={{
                    height: 'calc(100vh - 180px)', // Adjusted height
                    position: 'relative'
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%', // Take full height
                      border: '1px solid rgba(0, 122, 255, 0.1)',
                      borderRadius: 3,
                      overflow: 'hidden',
                      display: 'flex', // Added flex display
                      flexDirection: 'column'
                    }}
                  >
                    {uploadedFile ? (
                      <Box 
                        sx={{ 
                          flex: 1, // Take remaining space
                          position: 'relative',
                          height: '100%', // Full height
                          overflow: 'hidden'
                        }}
                      >
                        {renderDocumentPreview(uploadedFile)}
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
                <Grid
                  item
                  xs={12}
                  md={4}
                  lg={3}
                  sx={{
                    height: isDocumentView ? 'calc(100vh - 100px)' : 'calc(100vh - 200px)', // Increased height for document view
                    overflow: 'hidden'
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      border: '1px solid rgba(0, 122, 255, 0.1)',
                      borderRadius: 3,
                      overflow: 'hidden'
                    }}
                  >
                    <ProcessingResults
                      document={processedDoc}
                      processing={processing}
                      isUpdating={isUpdating}
                      updateSuccess={updateSuccess}
                    />
                  </Paper>
                </Grid>
              </Grid>

              {/* Floating Action Bar */}
              <motion.div
                className="floating-action-bar"
                initial={{ y: 20, opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  position: 'fixed',
                  bottom: 20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 1000
                }}
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
                      disabled={(!uploadedFile && activeStep === 0) || processing || isUpdating}
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
        )}
      </Authenticator>
    </ThemeProvider>
  );
}

export default withAuthenticator(App);
