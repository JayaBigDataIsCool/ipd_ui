import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import Form from '@rjsf/mui';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  Typography, 
  Container, 
  Box, 
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Stack,
  Paper,
  useMediaQuery
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#0071e3',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f7',
    },
  },
  typography: {
    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 1.1,
    },
    h2: {
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    body1: {
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          padding: '12px 32px',
          fontSize: '1rem',
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
  },
});

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [jsonSchema, setJsonSchema] = useState<RJSFSchema | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setJsonSchema(null);

    const reader = new FileReader();
    reader.onload = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(uploadedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc', '.docx']
    }
  });

  const processDocument = async () => {
    setIsProcessing(true);
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const schemas = Object.values(sampleResponses);
    const randomSchema = schemas[Math.floor(Math.random() * schemas.length)];
    setJsonSchema(randomSchema);
    setIsProcessing(false);
  };

  const handleReset = () => {
    setFile(null);
    setFilePreview('');
    setJsonSchema(null);
  };

  const handleTryItNowClick = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} className="app-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Stack spacing={8} className="hero-section">
            <Box className="hero-content" textAlign="center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <Typography variant="h1" className="hero-title" gutterBottom>
                  Transform Documents Into
                  <span className="gradient-text"> Intelligent Insights</span>
                </Typography>
                <Typography variant="h5" className="hero-subtitle" color="text.secondary">
                  Experience the future of document processing
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="stats-container"
              >
                <Grid container spacing={4} justifyContent="center">
                  {[
                    { value: "95%", label: "Accuracy" },
                    { value: "10x", label: "Faster" },
                    { value: "24/7", label: "Available" },
                    { value: "100%", label: "Secure" }
                  ].map((stat, index) => (
                    <Grid item key={index}>
                      <Paper elevation={0} className="stat-card">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                        >
                          <Typography variant="h2" className="stat-value">
                            {stat.value}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {stat.label}
                          </Typography>
                        </motion.div>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Box>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="main-content"
            >
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card className="upload-section glass-morphism">
                    <CardContent>
                      <AnimatePresence mode="wait">
                        {!file ? (
                          <motion.div
                            key="dropzone"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <div {...getRootProps()} className="dropzone-container">
                              <input {...getInputProps()} />
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <CloudUploadIcon className="upload-icon" />
                                <Typography variant="h6">
                                  Drop your document here
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  or click to browse
                                </Typography>
                              </motion.div>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            {/* Preview content */}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card className="result-section glass-morphism">
                    <CardContent>
                      <AnimatePresence mode="wait">
                        {jsonSchema ? (
                          <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <Form
                              schema={jsonSchema}
                              validator={validator}
                              onSubmit={console.log}
                              className="dynamic-form"
                            />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="empty-state"
                          >
                            <Typography variant="h6" color="text.secondary">
                              Upload a document to see the magic happen
                            </Typography>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          </Stack>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
}

export default App;
