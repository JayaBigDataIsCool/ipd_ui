import React, { useState } from 'react';
import { 
  Box, 
  IconButton, 
  Tooltip, 
  Typography,
  Slider,
  Paper
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

interface PDFViewerProps {
  fileUrl: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
  const [zoom, setZoom] = useState(100);

  // Handle zoom
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handleResetZoom = () => setZoom(100);

  // Handle download
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'document.pdf';
    link.click();
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        bgcolor: '#F5F5F7',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Controls */}
      <Paper
        elevation={2}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
          p: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Tooltip title="Zoom Out">
          <IconButton size="small" onClick={handleZoomOut}>
            <ZoomOutIcon />
          </IconButton>
        </Tooltip>

        <Box sx={{ width: 100 }}>
          <Slider
            size="small"
            value={zoom}
            min={50}
            max={200}
            onChange={(_, value) => setZoom(value as number)}
            sx={{ color: '#007AFF' }}
          />
        </Box>

        <Tooltip title="Zoom In">
          <IconButton size="small" onClick={handleZoomIn}>
            <ZoomInIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Reset Zoom">
          <IconButton size="small" onClick={handleResetZoom}>
            <RestartAltIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Download PDF">
          <IconButton size="small" onClick={handleDownload}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>

        <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>
          {zoom}%
        </Typography>
      </Paper>

      {/* PDF Container */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            width: `${zoom}%`,
            minWidth: '100%',
            height: '100%',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top left',
            transition: 'transform 0.2s ease'
          }}
        >
          <iframe
            src={`${fileUrl}#toolbar=0&view=FitH`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block'
            }}
            title="PDF Viewer"
          />
        </Box>
      </Box>
    </Box>
  );
}; 