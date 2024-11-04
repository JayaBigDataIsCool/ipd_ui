import React, { useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  TextField,
  Paper,
  LinearProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ProcessedDocument } from '../types/document';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { secureLogger } from '../utils/secureLogger';

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
  useEffect(() => {
    if (processing) {
      secureLogger.log('Document processing started');
    }
    if (updateSuccess) {
      secureLogger.log('Document update successful');
    }
    if (isUpdating) {
      secureLogger.log('Document update in progress');
    }
  }, [processing, updateSuccess, isUpdating]);

  if (!document && !processing) {
    return (
      <Paper elevation={0} className="document-section" sx={{ height: '100%' }}>
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="flex-start"
          sx={{ 
            height: '100%',
            p: 4,
            pt: 8,
            background: 'linear-gradient(135deg, rgba(175, 82, 222, 0.03), rgba(255, 45, 85, 0.03))'
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ 
              textAlign: 'center',
              marginTop: '-40px'
            }}
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <AutoAwesomeIcon 
                sx={{ 
                  fontSize: 48, 
                  color: '#AF52DE',
                  mb: 2,
                  filter: 'drop-shadow(0 4px 12px rgba(175, 82, 222, 0.3))'
                }} 
              />
            </motion.div>
            <Typography 
              variant="h3"
              sx={{
                background: 'linear-gradient(135deg, #AF52DE, #FF2D55)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              AI-Powered Document Processing
            </Typography>
            <Typography 
              color="text.secondary" 
              sx={{ 
                maxWidth: 300, 
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.1rem' },
                mb: 6
              }}
            >
              Upload a document to see the magic happen. Our AI will extract and organize the information automatically.
            </Typography>
          </motion.div>
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