import { createTheme, alpha } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#007AFF',
      light: '#5856D6',
      dark: '#0055b3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#AF52DE',
      light: '#FF2D55',
      dark: '#8944ab',
    },
    error: {
      main: '#FF3B30',
      light: '#FF9500',
    },
    background: {
      default: '#f5f5f7',
      paper: 'rgba(255, 255, 255, 0.8)',
    },
    text: {
      primary: '#1d1d1f',
      secondary: '#86868b',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          padding: '12px 24px',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          background: `linear-gradient(135deg, 
            #FF3B30 0%, 
            #FF9500 50%, 
            #FF3B30 100%
          )`,
          backgroundSize: '200% 200%',
          animation: 'gradientShift 15s ease infinite',
          color: '#ffffff',
          fontWeight: 600,
          '&:hover': {
            transform: 'scale(1.02)',
            backgroundPosition: 'right center',
            boxShadow: '0 8px 32px rgba(255, 59, 48, 0.25)',
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, 
            #007AFF 0%, 
            #5856D6 50%, 
            #007AFF 100%
          )`,
          backgroundSize: '200% 200%',
          animation: 'gradientShift 15s ease infinite',
          '&:hover': {
            backgroundPosition: 'right center',
            boxShadow: '0 8px 32px rgba(0, 122, 255, 0.25)',
          },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, 
            #AF52DE 0%, 
            #FF2D55 50%, 
            #AF52DE 100%
          )`,
          backgroundSize: '200% 200%',
          animation: 'gradientShift 15s ease infinite',
          '&:hover': {
            backgroundPosition: 'right center',
            boxShadow: '0 8px 32px rgba(175, 82, 222, 0.25)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 12px rgba(0, 122, 255, 0.1)',
            },
            '&.Mui-focused': {
              background: '#ffffff',
              boxShadow: '0 8px 32px rgba(0, 122, 255, 0.15)',
            },
          },
        },
      },
    },
  },
}); 