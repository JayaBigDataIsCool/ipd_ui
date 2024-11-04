// Store original console methods
const originalConsole = {
    log: console.log.bind(console),
    error: console.error.bind(console),
    warn: console.warn.bind(console),
    info: console.info.bind(console)
};

// Sensitive patterns to redact
const SENSITIVE_PATTERNS = [
    /us-east-1_[a-zA-Z0-9]{8,}/g,  // User Pool IDs
    /[a-zA-Z0-9]{26,}/g,           // Client IDs
    /us-east-1:[a-f0-9-]{36}/g,    // Identity Pool IDs
    /arn:aws:[a-zA-Z0-9-]+/g,      // ARNs
    /[a-zA-Z0-9+/]{40,}/g,         // Base64 tokens
    /Bearer\s+[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]+/g, // JWT tokens
    /[0-9]{12}/g,                  // Account IDs
    /key-[a-zA-Z0-9]{32}/g,       // API Keys
    /sk-[a-zA-Z0-9]{32,}/g,       // Secret Keys
    /password["']?\s*[:=]\s*["'][^"']+["']/g  // Password fields
];

// Redact sensitive information
const redactSensitiveInfo = (input: any): string => {
    if (typeof input !== 'string') {
        try {
            input = JSON.stringify(input);
        } catch {
            return '[Complex Object]';
        }
    }

    SENSITIVE_PATTERNS.forEach(pattern => {
        input = input.replace(pattern, '[REDACTED]');
    });

    return input;
};

// Create secure logger instance
export const secureLogger = {
    log: (...args: any[]) => {
        const safeArgs = args.map(arg => redactSensitiveInfo(arg));
        originalConsole.log('[SECURE]', ...safeArgs);
    },
    error: (...args: any[]) => {
        const safeArgs = args.map(arg => redactSensitiveInfo(arg));
        originalConsole.error('[SECURE-ERROR]', ...safeArgs);
    },
    warn: (...args: any[]) => {
        const safeArgs = args.map(arg => redactSensitiveInfo(arg));
        originalConsole.warn('[SECURE-WARN]', ...safeArgs);
    },
    info: (...args: any[]) => {
        const safeArgs = args.map(arg => redactSensitiveInfo(arg));
        originalConsole.info('[SECURE-INFO]', ...safeArgs);
    }
};

// Override console methods safely
if (process.env.NODE_ENV === 'production') {
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
    console.info = () => {};
    console.debug = () => {};
    console.trace = () => {};
} else {
    console.log = secureLogger.log;
    console.error = secureLogger.error;
    console.warn = secureLogger.warn;
    console.info = secureLogger.info;
}

// Prevent console restoration
Object.freeze(console);