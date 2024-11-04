import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { secureLogger } from '../utils/secureLogger';

interface DocumentUploaderProps {
  onFileSelect: (file: File) => void;
  processing: boolean;
  error: string | null;
  uploadedFile: File | null;
}
export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onFileSelect,
  processing,
  error,
  uploadedFile
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: files => {
      secureLogger.log('File selected for upload');
      onFileSelect(files[0]);
    },
    disabled: processing,
    multiple: false,
    onDropRejected: () => {
      secureLogger.warn('File upload rejected');
    },
    onError: (error) => {
      secureLogger.error('File upload error:', error);
    }
  });


  return (
    <Box
      {...getRootProps()}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        cursor: 'pointer',
        p: 4,
        pt: 8,
        background: isDragActive ? 'rgba(0, 122, 255, 0.05)' : 'transparent',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <input {...getInputProps()} />

      {isDragActive && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #007AFF, #5856D6)',
            borderRadius: '12px',
          }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%',
          marginTop: '-40px',
          position: 'relative'
        }}
      >
        <motion.div
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            marginBottom: '20px'
          }}
        >
          <FileUploadOutlinedIcon
            sx={{
              fontSize: '64px',
              color: '#007AFF',
              filter: 'drop-shadow(0 4px 12px rgba(0, 122, 255, 0.2))'
            }}
          />
        </motion.div>

        <Typography
          variant="h3"
          sx={{
            color: '#007AFF',
            fontWeight: 600,
            mb: 2,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Drag & drop your document
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: '#86868b',
            mb: 6,
            fontWeight: 'normal',
            fontSize: { xs: '1rem', md: '1.1rem' }
          }}
        >
          or click to browse from your computer
        </Typography>

        <motion.div
          animate={{
            scale: isDragActive ? 1.02 : 1,
            borderColor: isDragActive ? '#007AFF' : 'rgba(0, 122, 255, 0.2)'
          }}
          transition={{ duration: 0.3 }}
          style={{
            padding: '32px',
            borderRadius: '16px',
            border: '2px dashed rgba(0, 122, 255, 0.2)',
            background: 'rgba(0, 122, 255, 0.02)',
            marginBottom: '24px'
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: '#86868b',
              mb: 3,
              fontWeight: 500
            }}
          >
            Supports the following file types:
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              justifyContent: 'center'
            }}
          >
            {[
              'PDFs', 'Images', 'Word Docs', 'Spreadsheets', 'Presentations',
              'Scanned Docs', 'Contracts', 'Invoices', 'Reports', 'Forms'
            ].map((type, index) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: '20px',
                    background: 'rgba(0, 122, 255, 0.05)',
                    border: '1px solid rgba(0, 122, 255, 0.1)',
                    color: '#007AFF',
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(0, 122, 255, 0.08)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  {type}
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </motion.div>
    </Box>
  );
};