import React from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  TextField,
  Paper,
  LinearProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ProcessedDocument } from '../types/document';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ProcessingResultsProps {
  document: ProcessedDocument | null;
  processing: boolean;
  isUpdating?: boolean;
  updateSuccess?: boolean;
}

export const ProcessingResults: React.FC<ProcessingResultsProps> = ({
  document,
  processing,
  isUpdating = false,
  updateSuccess = false
}) => {
  if (!document && !processing) {
    return (
      <Paper elevation={0} className="document-section">
        <Box p={4}>
          <Typography variant="h5" gutterBottom sx={{ color: '#1d1d1f', fontWeight: 600 }}>
            How It Works
          </Typography>
          
          <Box className="feature-highlight">
            <span className="feature-highlight-icon">📄</span>
            <Box>
              <Typography className="feature-highlight-text">
                Upload Your Document
              </Typography>
              <Typography className="step-tip">
                Drag and drop or click to upload PDF, images, or Word documents
              </Typography>
            </Box>
          </Box>

          <Box className="feature-highlight">
            <span className="feature-highlight-icon">🤖</span>
            <Box>
              <Typography className="feature-highlight-text">
                AI Processing
              </Typography>
              <Typography className="step-tip">
                Our AI will automatically extract key information from your document
              </Typography>
            </Box>
          </Box>

          <Box className="feature-highlight">
            <span className="feature-highlight-icon">✅</span>
            <Box>
              <Typography className="feature-highlight-text">
                Review & Confirm
              </Typography>
              <Typography className="step-tip">
                Verify the extracted information and make any necessary adjustments
              </Typography>
            </Box>
          </Box>

          <Box mt={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1d1d1f' }}>
              Supported Document Types
            </Typography>
            <Box display="flex" gap={2} mt={2}>
              <Box className="file-type-badge">
                <Typography>📄 PDF Files</Typography>
              </Box>
              <Box className="file-type-badge">
                <Typography>🖼️ Images</Typography>
              </Box>
              <Box className="file-type-badge">
                <Typography>📝 Word Docs</Typography>
              </Box>
            </Box>
          </Box>

          <Box mt={4} p={3} sx={{ background: 'rgba(0, 122, 255, 0.05)', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              💡 Tip: For best results, ensure your documents are clear and well-scanned. 
              Our AI works best with properly formatted documents.
            </Typography>
          </Box>
        </Box>
      </Paper>
    );
  }

  if (processing) {
    return (
      <Paper elevation={0} className="document-section">
        <Box display="flex" flexDirection="column" alignItems="center" gap={3} p={4}>
          <CircularProgress size={48} />
          <Typography variant="h6" color="text.secondary">
            Processing document...
          </Typography>
          <LinearProgress 
            className="processing-indicator" 
            sx={{ width: '100%', borderRadius: 1 }} 
          />
        </Box>
      </Paper>
    );
  }

  if (!document) {
    return (
      <Paper elevation={0} className="document-section">
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center"
          p={6}
          minHeight={400}
        >
          <Typography variant="h6" color="text.secondary">
            Upload a document to see extracted information
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (isUpdating) {
    return (
      <Paper elevation={0} className="document-section">
        <Box display="flex" flexDirection="column" alignItems="center" gap={3} p={4}>
          <CircularProgress size={48} />
          <Typography variant="h6" color="text.secondary">
            Saving changes...
          </Typography>
          <LinearProgress sx={{ width: '100%', borderRadius: 1 }} />
        </Box>
      </Paper>
    );
  }

  if (updateSuccess) {
    return (
      <Paper elevation={0} className="document-section">
        <Box display="flex" flexDirection="column" alignItems="center" gap={3} p={4}>
          <CheckCircleIcon sx={{ fontSize: 48, color: '#34C759' }} />
          <Typography variant="h6" color="success.main">
            Changes saved successfully!
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} className="document-section">
      <Box p={3}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h5" gutterBottom sx={{
            background: 'linear-gradient(135deg, #AF52DE, #FF2D55)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600,
            mb: 3
          }}>
            {document.title}
          </Typography>

          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 3,
            p: 2,
            borderRadius: 2,
            background: 'rgba(0, 122, 255, 0.05)'
          }}>
            <Typography variant="body2" color="text.secondary">
              Confidence Score:
            </Typography>
            <Typography variant="body2" color="primary" fontWeight={500}>
              {(document.confidence * 100).toFixed(1)}%
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" gap={3}>
            <AnimatePresence>
              {document.fields.map((field, index) => (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="form-field"
                >
                  <TextField
                    fullWidth
                    label={field.label}
                    defaultValue={document.extractedData[field.key]}
                    multiline={field.multiline}
                    rows={field.multiline ? 3 : 1}
                    InputProps={{
                      startAdornment: field.prefix ? (
                        <Typography color="text.secondary" sx={{ mr: 1 }}>
                          {field.prefix}
                        </Typography>
                      ) : null,
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        </motion.div>
      </Box>
    </Paper>
  );
}; 