const isProduction = process.env.NODE_ENV === 'production';

export const secureLogger = {
    log: (...args: any[]) => {
        if (!isProduction) {
            console.log(...args);
        }
    },
    error: (...args: any[]) => {
        if (!isProduction) {
            console.error(...args);
        }
    },
    warn: (...args: any[]) => {
        if (!isProduction) {
            console.warn(...args);
        }
    }
};

// Remove console in production
if (isProduction) {
    console.log = () => { };
    console.warn = () => { };
    console.error = () => { };
    console.info = () => { };
    console.debug = () => { };
} 