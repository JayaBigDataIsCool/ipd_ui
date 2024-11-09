import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  Tooltip, 
  Typography,
  Slider,
  Paper,
  Divider,
  Badge
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';

interface PDFViewerProps {
  fileUrl: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Add function to detect total pages
  const detectTotalPages = async () => {
    try {
      // Try to get the PDF document
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        // Simple page count detection based on "/Page" occurrences
        const pageMatches = content.match(/\/Page\W/g);
        if (pageMatches) {
          setTotalPages(pageMatches.length);
        }
      };
      
      reader.readAsBinaryString(blob);
    } catch (error) {
      console.error('Error detecting pages:', error);
    }
  };

  // Call detectTotalPages on mount
  useEffect(() => {
    detectTotalPages();
  }, [fileUrl]);

  // Update iframe src when page changes
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = `${fileUrl}#page=${currentPage}&view=FitH&toolbar=0`;
    }
  }, [currentPage, fileUrl]);

  // Handle page navigation
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages]);

  // Handle zoom
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handleResetZoom = () => setZoom(100);
  const handleFitToScreen = () => setZoom(100);

  // Handle download
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'document.pdf';
    link.click();
  };

  // Handle print
  const handlePrint = () => {
    const printWindow = window.open(fileUrl);
    printWindow?.print();
  };

  // Handle fullscreen
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
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
      {/* Top Controls */}
      <Paper
        elevation={2}
        sx={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          p: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
        }}
      >
        {/* Page Navigation with better visibility */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          background: 'rgba(0, 122, 255, 0.05)',
          borderRadius: '8px',
          px: 1
        }}>
          <Tooltip title="Previous Page (←)">
            <IconButton 
              size="small" 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <NavigateBeforeIcon />
            </IconButton>
          </Tooltip>
          
          <Typography sx={{ 
            fontSize: '0.9rem',
            color: '#1D1D1F',
            fontWeight: 500,
            minWidth: '80px',
            textAlign: 'center'
          }}>
            {currentPage} / {totalPages}
          </Typography>
          
          <Tooltip title="Next Page (→)">
            <IconButton 
              size="small" 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <NavigateNextIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* Zoom Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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

          <Typography variant="caption" sx={{ 
            color: '#666',
            minWidth: '45px'
          }}>
            {zoom}%
          </Typography>
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* Additional Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Fit to Screen">
            <IconButton size="small" onClick={handleFitToScreen}>
              <FitScreenIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Reset Zoom">
            <IconButton size="small" onClick={handleResetZoom}>
              <RestartAltIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Toggle Fullscreen">
            <IconButton size="small" onClick={handleFullscreen}>
              <FullscreenIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* Document Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Download PDF">
            <IconButton size="small" onClick={handleDownload}>
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Print">
            <IconButton size="small" onClick={handlePrint}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* PDF Container */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          position: 'relative',
          mt: 7
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
            ref={iframeRef}
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