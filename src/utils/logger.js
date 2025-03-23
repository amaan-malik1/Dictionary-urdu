export const logger = {
    info: (message, ...args) => {
        console.log(`ℹ️ ${message}`, ...args);
    },
    warn: (message, ...args) => {
        console.warn(`⚠️ ${message}`, ...args);
    },
    error: (message, ...args) => {
        console.error(`❌ ${message}`, ...args);
    },
    debug: (message, ...args) => {
        if (process.env.NODE_ENV === 'development') {
            console.debug(`🔍 ${message}`, ...args);
        }
    }
}; 