// Get API URL from various configuration sources
const runtimeConfig = (window as any).runtimeConfig;
const externalConfig = (window as any).RUNTIME_CONFIG;

const API_BASE_URL =
    // First check runtime config from HTML
    (runtimeConfig && runtimeConfig.API_URL) ||
    // Then check external config file
    (externalConfig && externalConfig.API_URL) ||
    // Then check environment variable
    process.env.REACT_APP_API_URL ||
    // Fall back to localhost
    'http://localhost:8080/api';

export default API_BASE_URL; 