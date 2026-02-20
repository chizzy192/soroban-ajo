// Environment configuration with type safety and validation

export type AppEnvironment = 'development' | 'staging' | 'production';
export type StellarNetwork = 'testnet' | 'mainnet' | 'futurenet';
export type WalletType = 'freighter' | 'albedo';
export type Theme = 'light' | 'dark' | 'system';
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface EnvironmentConfig {
    // Application
    appEnv: AppEnvironment;
    appName: string;
    appVersion: string;

    // Stellar Network
    stellarNetwork: StellarNetwork;
    sorobanRpcUrl: string;
    horizonUrl: string;
    networkPassphrase: string;

    // Contract
    contractId: string;
    contractNetwork: StellarNetwork;

    // Wallet
    defaultWallet: WalletType;
    walletAutoConnect: boolean;

    // API
    apiUrl: string;
    apiTimeout: number;

    // Feature Flags
    debug: boolean;
    enableAnalytics: boolean;
    enableErrorReporting: boolean;
    maintenanceMode: boolean;

    // UI
    defaultTheme: Theme;
    enableAnimations: boolean;
    itemsPerPage: number;

    // Transactions
    txTimeout: number;
    maxTxFee: number;
    defaultSlippage: number;

    // Monitoring
    sentryDsn?: string;
    gaId?: string;
    mixpanelToken?: string;

    // Development
    enableDevtools: boolean;
    enableReduxDevtools: boolean;
    logLevel: LogLevel;

    // Security
    https: boolean;
    corsOrigins: string[];

    // Performance
    enableServiceWorker: boolean;
    cacheDuration: number;

    // Links
    githubUrl?: string;
    discordUrl?: string;
    twitterUrl?: string;
    docsUrl?: string;
}

// Helper to get environment variable with fallback
function getEnvVar(key: string, defaultValue: string = ''): string {
    return import.meta.env[key] || defaultValue;
}

// Helper to get boolean environment variable
function getBoolEnvVar(key: string, defaultValue: boolean = false): boolean {
    const value = import.meta.env[key];
    if (value === undefined || value === '') return defaultValue;
    return value === 'true' || value === '1';
}

// Helper to get number environment variable
function getNumberEnvVar(key: string, defaultValue: number): number {
    const value = import.meta.env[key];
    if (value === undefined || value === '') return defaultValue;
    const parsed = Number(value);
    return isNaN(parsed) ? defaultValue : parsed;
}

// Parse environment variables
const env: EnvironmentConfig = {
    // Application
    appEnv: (getEnvVar('VITE_APP_ENV', 'development') as AppEnvironment),
    appName: getEnvVar('VITE_APP_NAME', 'Soroban Ajo'),
    appVersion: getEnvVar('VITE_APP_VERSION', '0.1.0'),

    // Stellar Network
    stellarNetwork: (getEnvVar('VITE_STELLAR_NETWORK', 'testnet') as StellarNetwork),
    sorobanRpcUrl: getEnvVar('VITE_SOROBAN_RPC_URL', 'https://soroban-testnet.stellar.org'),
    horizonUrl: getEnvVar('VITE_HORIZON_URL', 'https://horizon-testnet.stellar.org'),
    networkPassphrase: getEnvVar('VITE_STELLAR_NETWORK_PASSPHRASE', 'Test SDF Network ; September 2015'),

    // Contract
    contractId: getEnvVar('VITE_SOROBAN_CONTRACT_ID', ''),
    contractNetwork: (getEnvVar('VITE_CONTRACT_NETWORK', 'testnet') as StellarNetwork),

    // Wallet
    defaultWallet: (getEnvVar('VITE_DEFAULT_WALLET', 'freighter') as WalletType),
    walletAutoConnect: getBoolEnvVar('VITE_WALLET_AUTO_CONNECT', false),

    // API
    apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:3000'),
    apiTimeout: getNumberEnvVar('VITE_API_TIMEOUT', 30000),

    // Feature Flags
    debug: getBoolEnvVar('VITE_DEBUG', false),
    enableAnalytics: getBoolEnvVar('VITE_ENABLE_ANALYTICS', false),
    enableErrorReporting: getBoolEnvVar('VITE_ENABLE_ERROR_REPORTING', false),
    maintenanceMode: getBoolEnvVar('VITE_MAINTENANCE_MODE', false),

    // UI
    defaultTheme: (getEnvVar('VITE_DEFAULT_THEME', 'light') as Theme),
    enableAnimations: getBoolEnvVar('VITE_ENABLE_ANIMATIONS', true),
    itemsPerPage: getNumberEnvVar('VITE_ITEMS_PER_PAGE', 10),

    // Transactions
    txTimeout: getNumberEnvVar('VITE_TX_TIMEOUT', 30),
    maxTxFee: getNumberEnvVar('VITE_MAX_TX_FEE', 100000),
    defaultSlippage: getNumberEnvVar('VITE_DEFAULT_SLIPPAGE', 0.5),

    // Monitoring
    sentryDsn: getEnvVar('VITE_SENTRY_DSN'),
    gaId: getEnvVar('VITE_GA_ID'),
    mixpanelToken: getEnvVar('VITE_MIXPANEL_TOKEN'),

    // Development
    enableDevtools: getBoolEnvVar('VITE_ENABLE_DEVTOOLS', true),
    enableReduxDevtools: getBoolEnvVar('VITE_ENABLE_REDUX_DEVTOOLS', true),
    logLevel: (getEnvVar('VITE_LOG_LEVEL', 'info') as LogLevel),

    // Security
    https: getBoolEnvVar('VITE_HTTPS', false),
    corsOrigins: getEnvVar('VITE_CORS_ORIGINS', 'http://localhost:5173').split(','),

    // Performance
    enableServiceWorker: getBoolEnvVar('VITE_ENABLE_SW', false),
    cacheDuration: getNumberEnvVar('VITE_CACHE_DURATION', 3600),

    // Links
    githubUrl: getEnvVar('VITE_GITHUB_URL'),
    discordUrl: getEnvVar('VITE_DISCORD_URL'),
    twitterUrl: getEnvVar('VITE_TWITTER_URL'),
    docsUrl: getEnvVar('VITE_DOCS_URL'),
};

// Validation
function validateEnvironment(): void {
    const errors: string[] = [];

    // Required fields
    if (!env.sorobanRpcUrl) {
        errors.push('VITE_SOROBAN_RPC_URL is required');
    }

    if (!env.horizonUrl) {
        errors.push('VITE_HORIZON_URL is required');
    }

    if (!env.networkPassphrase) {
        errors.push('VITE_STELLAR_NETWORK_PASSPHRASE is required');
    }

    // Validate URLs
    try {
        new URL(env.sorobanRpcUrl);
    } catch {
        errors.push('VITE_SOROBAN_RPC_URL must be a valid URL');
    }

    try {
        new URL(env.horizonUrl);
    } catch {
        errors.push('VITE_HORIZON_URL must be a valid URL');
    }

    // Validate network consistency
    if (env.appEnv === 'production' && env.stellarNetwork !== 'mainnet') {
        console.warn('Warning: Production environment should use mainnet');
    }

    // Log errors
    if (errors.length > 0) {
        console.error('Environment configuration errors:');
        errors.forEach(error => console.error(`  - ${error}`));

        if (env.appEnv === 'production') {
            throw new Error('Invalid environment configuration');
        }
    }
}

// Validate on load
validateEnvironment();

// Helper functions
export const isDevelopment = env.appEnv === 'development';
export const isStaging = env.appEnv === 'staging';
export const isProduction = env.appEnv === 'production';
export const isTestnet = env.stellarNetwork === 'testnet';
export const isMainnet = env.stellarNetwork === 'mainnet';

// Log configuration in development
if (isDevelopment && env.debug) {
    console.log('Environment Configuration:', env);
}

export default env;
