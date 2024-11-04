const isProd = process.env.NODE_ENV === 'production';

export const console = {
    log: (...args: any[]) => {
        if (!isProd) {
            window.console.log(...args);
        }
    },
    error: (...args: any[]) => {
        if (!isProd) {
            window.console.error(...args);
        }
    },
    warn: (...args: any[]) => {
        if (!isProd) {
            window.console.warn(...args);
        }
    },
    info: (...args: any[]) => {
        if (!isProd) {
            window.console.info(...args);
        }
    }
};