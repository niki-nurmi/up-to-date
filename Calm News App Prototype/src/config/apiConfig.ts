// API Configuration for BBC News integration
// Note: BBC does not offer a public API. Instead, we use BBC RSS feeds and web scraping approaches.

export const BBC_CONFIG = {
  // BBC RSS feeds by topic
  RSS_FEEDS: {
    'uk': 'http://feeds.bbci.co.uk/news/uk/rss.xml',
    'world': 'http://feeds.bbci.co.uk/news/world/rss.xml',
    'business': 'http://feeds.bbci.co.uk/news/business/rss.xml',
    'politics': 'http://feeds.bbci.co.uk/news/politics/rss.xml',
    'technology': 'http://feeds.bbci.co.uk/news/technology/rss.xml',
    'science': 'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
    'health': 'http://feeds.bbci.co.uk/news/health/rss.xml',
    'entertainment': 'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
    'sport': 'http://feeds.bbci.co.uk/sport/rss.xml',
    'climate': 'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml'
  },
  
  // For CORS issues in browser, you would need a proxy service
  RSS_PROXY: 'https://api.allorigins.win/get?url=',
  
  // Alternative: Use BBC's JSON feeds (if available)
  JSON_FEEDS: {
    'uk': 'https://www.bbc.com/news/uk',
    'world': 'https://www.bbc.com/news/world',
    'business': 'https://www.bbc.com/news/business',
    'politics': 'https://www.bbc.com/news/politics',
    'technology': 'https://www.bbc.com/news/technology',
    'science': 'https://www.bbc.com/news/science-environment',
    'health': 'https://www.bbc.com/news/health',
    'entertainment': 'https://www.bbc.com/news/entertainment-arts',
    'sport': 'https://www.bbc.com/sport',
    'climate': 'https://www.bbc.com/news/science-environment'
  }
};

// Topic mappings between our app categories and BBC categories
export const BBC_TOPIC_MAPPING = {
  'UK': 'uk',
  'World': 'world', 
  'Business': 'business',
  'Politics': 'politics',
  'Technology': 'technology',
  'Science': 'science',
  'Health': 'health',
  'Entertainment & Arts': 'entertainment',
  'Sport': 'sport',
  'Climate': 'climate'
};

// Check if BBC feeds are accessible (would need CORS proxy in production)
export const isBbcApiConfigured = (): boolean => {
  // In a real app, this would check if the RSS proxy is working
  return true; // For now, always return true since we have mock data
};

// Instructions for BBC News integration
export const BBC_SETUP_INSTRUCTIONS = {
  rss: {
    name: 'BBC RSS Feeds',
    description: 'Free RSS feeds from BBC News. Requires CORS proxy for browser access.',
    feeds: BBC_CONFIG.RSS_FEEDS,
    proxy_needed: true,
    recommended_proxy: 'https://api.allorigins.win/get?url='
  },
  alternative: {
    name: 'Web Scraping',
    description: 'Extract content directly from BBC news pages (requires backend service)',
    legal_note: 'Ensure compliance with BBC Terms of Service and robots.txt'
  }
};