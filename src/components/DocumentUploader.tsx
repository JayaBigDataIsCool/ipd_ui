import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

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
    onDrop: files => onFileSelect(files[0]),
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc', '.docx']
    },
    multiple: false,
    disabled: processing
  });

  return (
    <Paper elevation={0} className="document-section">
      {!uploadedFile ? (
        <Box
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''} ${processing ? 'processing' : ''}`}
        >
          <input {...getInputProps()} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            {processing ? (
              <CircularProgress size={64} className="upload-icon" />
            ) : (
              <CloudUploadIcon className="upload-icon" />
            )}
            <Typography variant="h5" sx={{ fontWeight: 500, color: '#1d1d1f' }}>
              {isDragActive ? 'Drop your document here' : 'Drag & drop your document'}
            </Typography>
            <Typography variant="body2" className="support-text">
              Supports the following file types:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <span className="file-type-badge">PDF</span>
              <span className="file-type-badge">Images</span>
              <span className="file-type-badge">Word</span>
            </Box>
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </motion.div>
        </Box>
      ) : (
        <Box className="document-preview-container">
          <Box className="preview-header" sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
            <Box display="flex" alignItems="center" gap={1}>
              <InsertDriveFileIcon className="file-icon" />
              <Typography className="filename" noWrap>{uploadedFile.name}</Typography>
            </Box>
          </Box>
          
          <Box className="preview-content">
            {uploadedFile.type.startsWith('image/') ? (
              <motion.img
                src={URL.createObjectURL(uploadedFile)}
                alt="Document preview"
                className="document-preview-image"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            ) : uploadedFile.type === 'application/pdf' ? (
              <Box className="pdf-preview">
                <object
                  data={URL.createObjectURL(uploadedFile)}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  style={{ 
                    minHeight: '700px',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  <Box 
                    className="pdf-fallback"
                    sx={{ 
                      p: 4, 
                      textAlign: 'center',
                      background: 'rgba(0,0,0,0.03)',
                      borderRadius: 2
                    }}
                  >
                    <Typography color="text.secondary">
                      Unable to display PDF directly. 
                      <a 
                        href={URL.createObjectURL(uploadedFile)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          color: '#007AFF',
                          textDecoration: 'none',
                          marginLeft: '8px'
                        }}
                      >
                        Click here to open
                      </a>
                    </Typography>
                  </Box>
                </object>
              </Box>
            ) : (
              <Box 
                className="document-icon-preview"
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 2,
                  p: 4
                }}
              >
                <InsertDriveFileIcon sx={{ fontSize: 64, color: 'primary.main' }} />
                <Typography color="text.secondary">
                  Preview not available for this file type
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Paper>
  );
}; 