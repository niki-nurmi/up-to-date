// API Configuration
// To use real news APIs, replace the placeholder values with your actual API keys

export const API_KEYS = {
  // Get your free Guardian API key from: https://open-platform.theguardian.com/access/
  GUARDIAN_API_KEY: process.env.GUARDIAN_API_KEY || 'YOUR_GUARDIAN_API_KEY_HERE',
  
  // Get your free YLE API credentials from: https://developer.yle.fi/
  YLE_API_KEY: process.env.YLE_API_KEY || 'YOUR_YLE_API_KEY_HERE',
  YLE_APP_ID: process.env.YLE_APP_ID || 'YOUR_YLE_APP_ID_HERE',
};

// Check if API keys are configured
export const isApiConfigured = (source: 'guardian' | 'yle'): boolean => {
  switch (source) {
    case 'guardian':
      return API_KEYS.GUARDIAN_API_KEY !== 'YOUR_GUARDIAN_API_KEY_HERE';
    case 'yle':
      return API_KEYS.YLE_API_KEY !== 'YOUR_YLE_API_KEY_HERE' && 
             API_KEYS.YLE_APP_ID !== 'YOUR_YLE_APP_ID_HERE';
    default:
      return false;
  }
};

// Instructions for setting up environment variables
export const SETUP_INSTRUCTIONS = {
  guardian: {
    name: 'The Guardian',
    url: 'https://open-platform.theguardian.com/access/',
    envVar: 'GUARDIAN_API_KEY',
    description: 'Free API with 12,000 calls per day for development'
  },
  yle: {
    name: 'YLE (Finnish Broadcasting)',
    url: 'https://developer.yle.fi/',
    envVars: ['YLE_API_KEY', 'YLE_APP_ID'],
    description: 'Free API for Finnish news content'
  }
};