import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ProcessedDocument } from '../types/document';
import { motion, AnimatePresence } from 'framer-motion';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';

interface ProcessingResultsProps {
  document: ProcessedDocument | null;
  processing: boolean;
  isUpdating?: boolean;
  updateSuccess?: boolean;
}

interface CharacteristicsType {
  contains_tables: boolean;
  contains_diagrams: boolean;
  number_of_diagrams: string;
  contains_text: boolean;
  diagram_types: string[];
}

interface FieldValue {
  value: string;
  confidence: number;
}

interface PageData {
  fields: Record<string, FieldValue>;
  page_number: number;
  table_data: Record<string, Record<string, FieldValue>>;
}

interface DocumentStructure {
  key_fields: string[];
  special_elements: string[];
  identified_sections: string[];
}

interface ExtractedData {
  characteristics: CharacteristicsType;
  pages: PageData[];
  structure: DocumentStructure;
  document_type: string;
  confidence: string;
}

// Add new interfaces for workflow elements
interface WorkflowDecisionPoint {
  name: string;
  code: string | null;
  false_path?: string;
  true_path?: string;
}

interface WorkflowProcessStep {
  name: string;
  message: string;
  code: string | null;
}

interface WorkflowConnection {
  from: string;
  to: string;
  label: string;
  type: string;
}

interface Workflow {
  decision_points: WorkflowDecisionPoint[];
  process_steps: WorkflowProcessStep[];
  connections: WorkflowConnection[];
}

interface Annotation {
  location: string;
  text: string;
}

// Add new interfaces
interface Component {
  name: string;
  description: string;
  type: string;
  connections: string[];
  confidence: number;
}

interface Process {
  name: string;
  description: string;
  steps: string[];
  confidence: number;
}

interface DataFlow {
  source: string;
  destination: string;
  data: string;
  confidence: number;
}

// Add loading animation component
const LoadingAnimation = () => (
  <Box
    sx={{
      p: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 3,
      textAlign: 'center'
    }}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ position: 'relative' }}>
        {/* Outer circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '3px solid rgba(175, 82, 222, 0.1)',
            borderTop: '3px solid #AF52DE',
            position: 'absolute'
          }}
        />
        {/* Middle circle */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '3px solid rgba(255, 45, 85, 0.1)',
            borderTop: '3px solid #FF2D55',
            margin: '10px'
          }}
        />
        {/* Inner pulse */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #AF52DE, #FF2D55)',
            margin: '20px'
          }}
        />
      </Box>
    </motion.div>

    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Typography
          variant="h6"
          sx={{
            background: 'linear-gradient(135deg, #AF52DE, #FF2D55)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600,
            mb: 1
          }}
        >
          Processing Document
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Typography
          color="text.secondary"
          sx={{ fontSize: '0.9rem' }}
        >
          Analyzing content with AI...
        </Typography>
      </motion.div>
    </Box>

    {/* Processing steps */}
    <Box sx={{ width: '100%', maxWidth: '280px' }}>
      {[
        'Extracting text...',
        'Identifying fields...',
        'Processing tables...',
        'Validating data...'
      ].map((step, index) => (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 + index * 0.2 }}
        >
          <Typography
            sx={{
              fontSize: '0.8rem',
              color: '#666',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2
              }}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #AF52DE, #FF2D55)'
              }}
            />
            {step}
          </Typography>
        </motion.div>
      ))}
    </Box>
  </Box>
);

const LandingPreview = () => (
  <Box
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      p: 4,
      pt: 8,
      background: 'linear-gradient(135deg, rgba(175, 82, 222, 0.03), rgba(255, 45, 85, 0.03))'
    }}
  >
    {/* Animated Icons Section */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ position: 'relative', mb: 2 }}>
        {/* Floating Documents Animation */}
        {[
          { delay: 0, x: -20, y: -20 },
          { delay: 0.2, x: 20, y: -10 },
          { delay: 0.4, x: 0, y: 0 }
        ].map((pos, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: pos.x, y: pos.y }}
            animate={{
              opacity: [0.5, 1, 0.5],
              y: [pos.y - 10, pos.y + 10, pos.y - 10]
            }}
            transition={{
              delay: pos.delay,
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(${pos.x}px, ${pos.y}px)`
            }}
          >
            <Paper
              elevation={4}
              sx={{
                width: 60,
                height: 80,
                borderRadius: 2,
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: pos.delay
                }}
              >
                {index === 0 && <AutoFixHighIcon sx={{ color: '#AF52DE', fontSize: '2rem' }} />}
                {index === 1 && <SmartToyOutlinedIcon sx={{ color: '#FF2D55', fontSize: '2rem' }} />}
                {index === 2 && <SpeedOutlinedIcon sx={{ color: '#007AFF', fontSize: '2rem' }} />}
              </motion.div>
            </Paper>
          </motion.div>
        ))}

        {/* Central Processing Circle */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: 360
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            border: '2px dashed rgba(175, 82, 222, 0.3)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </Box>
    </motion.div>

    {/* Feature Highlights */}
    <Box sx={{ textAlign: 'center', mt: 2 }}>
      {[
        {
          icon: <VerifiedOutlinedIcon sx={{ color: '#34C759' }} />,
          text: 'Intelligent Document Processing',
          description: 'Extract data with high accuracy'
        },
        {
          icon: <SmartToyOutlinedIcon sx={{ color: '#AF52DE' }} />,
          text: 'AI-Powered Analysis',
          description: 'Advanced machine learning algorithms'
        },
        {
          icon: <SpeedOutlinedIcon sx={{ color: '#007AFF' }} />,
          text: 'Real-time Processing',
          description: 'Get results in seconds'
        }
      ].map((feature, index) => (
        <motion.div
          key={feature.text}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + index * 0.2 }}
        >
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                background: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}
            >
              {feature.icon}
            </Box>
            <Box sx={{ textAlign: 'left' }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#1D1D1F'
                }}
              >
                {feature.text}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.8rem',
                  color: '#666'
                }}
              >
                {feature.description}
              </Typography>
            </Box>
          </Box>
        </motion.div>
      ))}
    </Box>
  </Box>
);

// Add new rendering functions
const renderWorkflow = (workflow: Workflow) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    {/* Decision Points */}
    {workflow.decision_points.length > 0 && (
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, color: '#1D1D1F', fontWeight: 600 }}>
          Decision Points
        </Typography>
        {workflow.decision_points.map((point, index) => (
          <Box
            key={`decision-${index}`}
            sx={{
              p: 2,
              borderRadius: '8px',
              border: '1px solid rgba(0, 122, 255, 0.2)',
              mb: 1,
              background: 'rgba(0, 122, 255, 0.03)'
            }}
          >
            <Typography sx={{ fontWeight: 600, color: '#007AFF' }}>
              {point.name} {point.code && `(${point.code})`}
            </Typography>
            {point.true_path && (
              <Typography sx={{ fontSize: '0.9rem', color: '#34C759' }}>
                True → {point.true_path}
              </Typography>
            )}
            {point.false_path && (
              <Typography sx={{ fontSize: '0.9rem', color: '#FF3B30' }}>
                False → {point.false_path}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    )}

    {/* Process Steps */}
    {workflow.process_steps.length > 0 && (
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, color: '#1D1D1F', fontWeight: 600 }}>
          Process Steps
        </Typography>
        {workflow.process_steps.map((step, index) => (
          <Box
            key={`step-${index}`}
            sx={{
              p: 2,
              borderRadius: '8px',
              border: '1px solid rgba(52, 199, 89, 0.2)',
              mb: 1,
              background: 'rgba(52, 199, 89, 0.03)'
            }}
          >
            <Typography sx={{ fontWeight: 600, color: '#34C759' }}>
              {step.name} {step.code && `(${step.code})`}
            </Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#666', whiteSpace: 'pre-wrap' }}>
              {step.message}
            </Typography>
          </Box>
        ))}
      </Box>
    )}

    {/* Connections */}
    {workflow.connections.length > 0 && (
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, color: '#1D1D1F', fontWeight: 600 }}>
          Flow Connections
        </Typography>
        {workflow.connections.map((connection, index) => (
          <Box
            key={`connection-${index}`}
            sx={{
              p: 2,
              borderRadius: '8px',
              border: '1px solid rgba(175, 82, 222, 0.2)',
              mb: 1,
              background: 'rgba(175, 82, 222, 0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Typography sx={{ color: '#666' }}>{connection.from}</Typography>
            <Typography sx={{ color: '#AF52DE' }}>→</Typography>
            <Typography sx={{ color: '#666' }}>{connection.to}</Typography>
            {connection.label && (
              <Typography sx={{
                ml: 'auto',
                fontSize: '0.85rem',
                color: connection.type === 'conditional' ? '#FF9F0A' : '#007AFF'
              }}>
                {connection.label}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    )}
  </Box>
);

const renderAnnotations = (annotations: Annotation[]) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    {annotations.map((annotation, index) => (
      <Box
        key={`annotation-${index}`}
        sx={{
          p: 2,
          borderRadius: '8px',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          background: 'rgba(0, 0, 0, 0.02)'
        }}
      >
        <Typography sx={{ fontSize: '0.85rem', color: '#666', mb: 0.5 }}>
          Location: {annotation.location}
        </Typography>
        <Typography sx={{ fontSize: '0.95rem', color: '#1D1D1F' }}>
          {annotation.text}
        </Typography>
      </Box>
    ))}
  </Box>
);

export const ProcessingResults: React.FC<ProcessingResultsProps> = ({
  document,
  processing,
  isUpdating = false,
  updateSuccess = false
}) => {
  // Add state for edited values
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  // Add handler for value changes
  const handleValueChange = (key: string, value: string) => {
    setEditedValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Move all render functions inside the component
  const renderComponents = (components: Component[]) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {components.map((component, index) => (
        <Box
          key={`component-${index}`}
          sx={{
            p: 2,
            borderRadius: '8px',
            border: '1px solid rgba(0, 122, 255, 0.2)',
            background: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <TextField
            fullWidth
            label="Name"
            value={editedValues[`component-${index}-name`] ?? component.name}
            onChange={(e) => handleValueChange(`component-${index}-name`, e.target.value)}
            variant="outlined"
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={editedValues[`component-${index}-desc`] ?? component.description}
            onChange={(e) => handleValueChange(`component-${index}-desc`, e.target.value)}
            variant="outlined"
            size="small"
            multiline
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            {component.connections.map((conn, i) => (
              <TextField
                key={i}
                size="small"
                value={editedValues[`component-${index}-conn-${i}`] ?? conn}
                onChange={(e) => handleValueChange(`component-${index}-conn-${i}`, e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(0, 122, 255, 0.1)',
                    '& fieldset': {
                      borderColor: 'transparent'
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 122, 255, 0.2)'
                    }
                  }
                }}
              />
            ))}
          </Box>
          <Typography sx={{
            fontSize: '0.8rem',
            color: component.confidence >= 0.9 ? '#34C759' : '#FF9F0A'
          }}>
            Confidence: {(component.confidence * 100).toFixed(1)}%
          </Typography>
        </Box>
      ))}
    </Box>
  );

  const renderProcesses = (processes: Process[]) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {processes.map((process, index) => (
        <Box
          key={`process-${index}`}
          sx={{
            p: 2,
            borderRadius: '8px',
            border: '1px solid rgba(52, 199, 89, 0.2)',
            background: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <TextField
            fullWidth
            label="Process Name"
            value={editedValues[`process-${index}-name`] ?? process.name}
            onChange={(e) => handleValueChange(`process-${index}-name`, e.target.value)}
            variant="outlined"
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={editedValues[`process-${index}-desc`] ?? process.description}
            onChange={(e) => handleValueChange(`process-${index}-desc`, e.target.value)}
            variant="outlined"
            size="small"
            multiline
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {process.steps.map((step, i) => (
              <TextField
                key={i}
                fullWidth
                label={`Step ${i + 1}`}
                value={editedValues[`process-${index}-step-${i}`] ?? step}
                onChange={(e) => handleValueChange(`process-${index}-step-${i}`, e.target.value)}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
          <Typography sx={{
            mt: 1,
            fontSize: '0.8rem',
            color: process.confidence >= 0.9 ? '#34C759' : '#FF9F0A'
          }}>
            Confidence: {(process.confidence * 100).toFixed(1)}%
          </Typography>
        </Box>
      ))}
    </Box>
  );

  const renderDataFlows = (dataFlows: DataFlow[]) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {dataFlows.map((flow, index) => (
        <Box
          key={`flow-${index}`}
          sx={{
            p: 2,
            borderRadius: '8px',
            border: '1px solid rgba(175, 82, 222, 0.2)',
            background: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <TextField
            size="small"
            value={editedValues[`flow-${index}-source`] ?? flow.source}
            onChange={(e) => handleValueChange(`flow-${index}-source`, e.target.value)}
            sx={{ flex: 1 }}
          />
          <Typography sx={{ color: '#AF52DE', mx: 1 }}>→</Typography>
          <TextField
            size="small"
            value={editedValues[`flow-${index}-dest`] ?? flow.destination}
            onChange={(e) => handleValueChange(`flow-${index}-dest`, e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            value={editedValues[`flow-${index}-data`] ?? flow.data}
            onChange={(e) => handleValueChange(`flow-${index}-data`, e.target.value)}
            sx={{ flex: 2 }}
          />
        </Box>
      ))}
    </Box>
  );

  const renderPageContent = (page: any, pageNumber: number) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Components Section */}
      {page.components?.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>Components</Typography>
          {renderComponents(page.components)}
        </Box>
      )}

      {/* Processes Section */}
      {page.processes?.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>Processes</Typography>
          {renderProcesses(page.processes)}
        </Box>
      )}

      {/* Data Flows Section */}
      {page.data_flows?.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>Data Flows</Typography>
          {renderDataFlows(page.data_flows)}
        </Box>
      )}

      {/* Keep existing sections */}
      {page.text_content?.fields && Object.keys(page.text_content.fields).length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>Text Content</Typography>
          {renderPageFields(page.text_content.fields, pageNumber)}
        </Box>
      )}
    </Box>
  );

  const renderPageFields = (fields: Record<string, FieldValue>, pageNumber: number) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {Object.entries(fields).map(([key, data], index) => (
        <Box
          key={`field-${pageNumber}-${index}`}
          sx={{
            p: 2,
            borderRadius: '8px',
            border: '1px solid rgba(0, 122, 255, 0.15)',
            background: 'white',
            mb: 1
          }}
        >
          <Typography
            sx={{
              fontSize: '0.9rem',
              color: '#666',
              mb: 0.5
            }}
          >
            {key.split('_').join(' ')}
          </Typography>
          <Typography
            sx={{
              fontSize: '1rem',
              color: '#1D1D1F',
              fontWeight: 500,
              whiteSpace: 'pre-wrap'
            }}
          >
            {Array.isArray(data.value)
              ? data.value.map((item, i) => (
                <Box key={i} sx={{ mb: 0.5 }}>
                  {item}
                </Box>
              ))
              : data.value
            }
          </Typography>
          <Typography
            sx={{
              fontSize: '0.8rem',
              color: data.confidence >= 0.9
                ? '#34C759'
                : data.confidence >= 0.7
                  ? '#FF9F0A'
                  : '#FF3B30',
              mt: 0.5
            }}
          >
            Confidence: {(data.confidence * 100).toFixed(1)}%
          </Typography>
        </Box>
      ))}
    </Box>
  );

  const renderCharacteristics = (characteristics: CharacteristicsType) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {Object.entries(characteristics).map(([key, value]) => (
        <TextField
          key={key}
          fullWidth
          label={key.split('_').join(' ')}
          value={editedValues[`char-${key}`] ?? value.toString()}
          onChange={(e) => handleValueChange(`char-${key}`, e.target.value)}
          variant="outlined"
          size="small"
          sx={{ mb: 1 }}
        />
      ))}
    </Box>
  );

  const renderStructure = (structure: DocumentStructure) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {Object.entries(structure).map(([key, value]) => (
        <TextField
          key={key}
          fullWidth
          label={key.split('_').join(' ')}
          value={editedValues[`struct-${key}`] ?? (Array.isArray(value) ? value.join(', ') : value.toString())}
          onChange={(e) => handleValueChange(`struct-${key}`, e.target.value)}
          variant="outlined"
          size="small"
          multiline={Array.isArray(value)}
          sx={{ mb: 1 }}
        />
      ))}
    </Box>
  );

  if (!document && !processing) {
    return <LandingPreview />;
  }

  if (processing) {
    return <LoadingAnimation />;
  }

  const extractedData = document?.extractedData as ExtractedData;
  const confidence = document?.confidence ?? 0;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        overflowY: 'auto',
        backgroundColor: '#FAFAFA',
        '&::-webkit-scrollbar': {
          width: '8px'
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px'
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
          '&:hover': {
            background: '#555'
          }
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Enhanced Title Section with Larger Typography */}
        <Box
          sx={{
            mb: 2,
            p: 2.5,
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 1px 8px rgba(0, 0, 0, 0.02)',
          }}
        >
          {/* Classification Label */}
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: '#666',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              mb: 1
            }}
          >
            Document Type Classified
          </Typography>

          {/* Document Type */}
          <Typography
            sx={{
              fontSize: '1.75rem',
              color: '#1D1D1F',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              mb: 2
            }}
          >
            {extractedData?.document_type || 'Document'}
          </Typography>

          {/* Metrics Grid */}
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              flexWrap: 'wrap'
            }}
          >
            {/* Confidence Score */}
            <Box
              sx={{
                flex: '1 1 auto',
                p: 1.5,
                borderRadius: '8px',
                background: confidence >= 0.9
                  ? 'rgba(52, 199, 89, 0.08)'
                  : confidence >= 0.7
                    ? 'rgba(255, 159, 10, 0.08)'
                    : 'rgba(255, 59, 48, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minWidth: '140px'
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.8rem',
                  color: '#666',
                  fontWeight: 500
                }}
              >
                Confidence
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: confidence >= 0.9
                    ? '#34C759'
                    : confidence >= 0.7
                      ? '#FF9F0A'
                      : '#FF3B30',
                }}
              >
                {(confidence * 100).toFixed(1)}%
              </Typography>
            </Box>

            {/* Pages Count */}
            <Box
              sx={{
                flex: '0 0 auto',
                p: 1.5,
                borderRadius: '8px',
                background: 'rgba(0, 122, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                minWidth: '100px'
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.8rem',
                  color: '#666',
                  fontWeight: 500
                }}
              >
                Pages
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#007AFF'
                }}
              >
                {extractedData?.pages?.length || 0}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Refined Accordion Sections */}
        <Box sx={{
          '& .MuiAccordion-root': {
            mb: 2,
            '& .MuiAccordionSummary-content': {
              '& .MuiTypography-root': {
                fontSize: '1.25rem',
                fontWeight: 600
              }
            }
          }
        }}>
          {/* Document Characteristics */}
          {extractedData?.characteristics && (
            <Accordion
              defaultExpanded
              sx={{
                '& .MuiAccordionSummary-root': {
                  minHeight: '48px',
                  py: 0
                },
                '& .MuiAccordionDetails-root': {
                  p: 1.5,
                  pt: 0.5
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ fontSize: '1.2rem' }} />}
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#1D1D1F'
                  }
                }}
              >
                <Typography>Document Characteristics</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderCharacteristics(extractedData.characteristics)}
              </AccordionDetails>
            </Accordion>
          )}

          {/* Pages Data */}
          {extractedData?.pages?.map((page, index) => (
            <Accordion key={`page-${index}`} defaultExpanded={index === 0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Page {page.page_number}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderPageContent(page, page.page_number)}
              </AccordionDetails>
            </Accordion>
          ))}

          {/* Document Structure */}
          {extractedData?.structure && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Document Structure</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderStructure(extractedData.structure)}
              </AccordionDetails>
            </Accordion>
          )}
        </Box>
      </motion.div>
    </Paper>
  );
}; 