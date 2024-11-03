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

interface ProcessingResultsProps {
  document: ProcessedDocument | null;
  processing: boolean;
}

export const ProcessingResults: React.FC<ProcessingResultsProps> = ({
  document,
  processing
}) => {
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