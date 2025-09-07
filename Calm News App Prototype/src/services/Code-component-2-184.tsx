import { NewsItem } from '../components/NewsCard';

// API Configuration
const API_CONFIG = {
  GUARDIAN: {
    baseUrl: 'https://content.guardianapis.com',
    // Get your free API key from: https://open-platform.theguardian.com/access/
    apiKey: 'YOUR_GUARDIAN_API_KEY_HERE'
  },
  BBC: {
    baseUrl: 'https://feeds.bbci.co.uk/news',
    // BBC RSS feeds don't require API keys
    rssEndpoint: '/rss.xml'
  },
  YLE: {
    baseUrl: 'https://external.api.yle.fi/v1',
    // Get your free API key from: https://developer.yle.fi/
    apiKey: 'YOUR_YLE_API_KEY_HERE',
    appId: 'YOUR_YLE_APP_ID_HERE'
  },
  REDDIT: {
    baseUrl: 'https://www.reddit.com',
    // Reddit API doesn't require keys for public read access
    userAgent: 'Up-to-date/1.0'
  }
};

// Types for API responses
interface GuardianResponse {
  response: {
    status: string;
    results: Array<{
      id: string;
      webTitle: string;
      webUrl: string;
      sectionName: string;
      webPublicationDate: string;
      fields?: {
        trailText?: string;
        bodyText?: string;
      };
    }>;
  };
}

interface RedditResponse {
  data: {
    children: Array<{
      data: {
        id: string;
        title: string;
        url: string;
        subreddit: string;
        created_utc: number;
        selftext: string;
        score: number;
      };
    }>;
  };
}

interface YleResponse {
  data: Array<{
    id: string;
    title: {
      fi?: string;
      sv?: string;
      en?: string;
    };
    description: {
      fi?: string;
      sv?: string;
      en?: string;
    };
    subject: Array<{
      title: {
        fi?: string;
        sv?: string;
        en?: string;
      };
    }>;
    datePublished: string;
    url: {
      full: string;
    };
  }>;
}

// Helper function to generate AI-like neutral headlines
function generateNeutralHeadline(originalTitle: string, source: string): string {
  // In a real app, this would call an AI service to generate neutral headlines
  // For now, we'll do basic text processing to make headlines more neutral
  let neutral = originalTitle
    .replace(/\b(BREAKING|URGENT|EXCLUSIVE|SHOCKING|AMAZING|INCREDIBLE)\b/gi, '')
    .replace(/[!]{2,}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Remove potentially biased language patterns
  neutral = neutral
    .replace(/\b(slams|blasts|destroys|owns|crushes)\b/gi, 'criticizes')
    .replace(/\b(perfect|terrible|awful|amazing)\b/gi, 'notable');
  
  return neutral;
}

// Helper function to generate concise summaries
function generateSummary(text: string, title: string): string {
  // In a real app, this would use AI to generate summaries
  // For now, we'll create a simple summary from available text
  if (!text || text.length < 50) {
    return `News about ${title.toLowerCase()}. More details available from the source.`;
  }
  
  // Take first 200 characters and clean up
  let summary = text.substring(0, 200).replace(/\s+/g, ' ').trim();
  
  // Find the last complete sentence
  const lastPeriod = summary.lastIndexOf('.');
  if (lastPeriod > 100) {
    summary = summary.substring(0, lastPeriod + 1);
  } else {
    summary = summary + '...';
  }
  
  return summary;
}

// Fetch from Guardian API
async function fetchGuardianNews(): Promise<NewsItem[]> {
  try {
    if (API_CONFIG.GUARDIAN.apiKey === 'YOUR_GUARDIAN_API_KEY_HERE') {
      return getMockGuardianNews();
    }

    const response = await fetch(
      `${API_CONFIG.GUARDIAN.baseUrl}/search?api-key=${API_CONFIG.GUARDIAN.apiKey}&show-fields=trailText,bodyText&page-size=10&order-by=newest`
    );
    
    if (!response.ok) throw new Error('Guardian API failed');
    
    const data: GuardianResponse = await response.json();
    
    return data.response.results.map((article, index) => ({
      id: `guardian-${article.id}`,
      headline: generateNeutralHeadline(article.webTitle, 'Guardian'),
      summary: generateSummary(
        article.fields?.trailText || article.fields?.bodyText || '',
        article.webTitle
      ),
      category: article.sectionName || 'News',
      sources: [{ name: 'The Guardian', url: article.webUrl }],
      publishedAt: article.webPublicationDate
    }));
  } catch (error) {
    console.error('Guardian API error:', error);
    return getMockGuardianNews();
  }
}

// Fetch from YLE API (Finnish news)
async function fetchYleNews(): Promise<NewsItem[]> {
  try {
    if (API_CONFIG.YLE.apiKey === 'YOUR_YLE_API_KEY_HERE') {
      return getMockYleNews();
    }

    const response = await fetch(
      `${API_CONFIG.YLE.baseUrl}/programs/items.json?app_id=${API_CONFIG.YLE.appId}&app_key=${API_CONFIG.YLE.apiKey}&limit=10&type=article&availability=ondemand`
    );
    
    if (!response.ok) throw new Error('YLE API failed');
    
    const data: YleResponse = await response.json();
    
    return data.data.map((article, index) => ({
      id: `yle-${article.id}`,
      headline: generateNeutralHeadline(
        article.title.en || article.title.fi || article.title.sv || 'Finnish News',
        'YLE'
      ),
      summary: generateSummary(
        article.description.en || article.description.fi || article.description.sv || '',
        article.title.en || article.title.fi || ''
      ),
      category: article.subject[0]?.title?.en || article.subject[0]?.title?.fi || 'Finland',
      sources: [{ name: 'YLE', url: article.url.full }],
      publishedAt: article.datePublished
    }));
  } catch (error) {
    console.error('YLE API error:', error);
    return getMockYleNews();
  }
}

// Fetch from Reddit API
async function fetchRedditNews(): Promise<NewsItem[]> {
  try {
    const subreddits = ['worldnews', 'news', 'Finland', 'europe'];
    const allPosts: NewsItem[] = [];
    
    for (const subreddit of subreddits) {
      const response = await fetch(
        `${API_CONFIG.REDDIT.baseUrl}/r/${subreddit}/hot.json?limit=5`,
        {
          headers: {
            'User-Agent': API_CONFIG.REDDIT.userAgent
          }
        }
      );
      
      if (!response.ok) continue;
      
      const data: RedditResponse = await response.json();
      
      const posts = data.data.children
        .filter(post => post.data.score > 100) // Filter for quality
        .map((post, index) => ({
          id: `reddit-${post.data.id}`,
          headline: generateNeutralHeadline(post.data.title, 'Reddit'),
          summary: generateSummary(post.data.selftext, post.data.title),
          category: subreddit === 'Finland' ? 'Finland' : 'International',
          sources: [{ name: `r/${post.data.subreddit}`, url: post.data.url }],
          publishedAt: new Date(post.data.created_utc * 1000).toISOString()
        }));
      
      allPosts.push(...posts);
    }
    
    return allPosts.slice(0, 10); // Limit total Reddit posts
  } catch (error) {
    console.error('Reddit API error:', error);
    return getMockRedditNews();
  }
}

// Mock data functions (used when API keys aren't configured)
function getMockGuardianNews(): NewsItem[] {
  return [
    {
      id: 'guardian-mock-1',
      headline: 'UK inflation rate drops to 2.1% in latest government figures',
      summary: 'Official statistics show inflation continuing its downward trend following recent monetary policy adjustments. The decrease reflects changes in energy costs and consumer spending patterns across multiple sectors.',
      category: 'Business',
      sources: [{ name: 'The Guardian', url: '#' }],
      publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'guardian-mock-2',
      headline: 'Scientists report breakthrough in renewable energy storage',
      summary: 'Researchers developed a new battery technology that could store renewable energy for extended periods. The innovation addresses one of the key challenges in transitioning to sustainable power systems.',
      category: 'Science',
      sources: [{ name: 'The Guardian', url: '#' }],
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    }
  ];
}

function getMockYleNews(): NewsItem[] {
  return [
    {
      id: 'yle-mock-1',
      headline: 'Helsinki introduces new public transportation routes',
      summary: 'The city announced expansion of bus and tram services to better connect suburban areas with the city center. The changes aim to improve accessibility and reduce private vehicle usage.',
      category: 'Finland',
      sources: [{ name: 'YLE', url: '#' }],
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'yle-mock-2',
      headline: 'Finnish education system receives international recognition',
      summary: 'UNESCO praised Finland\'s educational approach in a new report highlighting innovative teaching methods and student well-being initiatives. The recognition reinforces Finland\'s position in global education rankings.',
      category: 'Finland',
      sources: [{ name: 'YLE', url: '#' }],
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    }
  ];
}

function getMockRedditNews(): NewsItem[] {
  return [
    {
      id: 'reddit-mock-1',
      headline: 'Global climate summit reaches agreement on emission targets',
      summary: 'International delegates established new framework for reducing carbon emissions over the next decade. The agreement includes specific commitments from major economies and developing nations.',
      category: 'International',
      sources: [{ name: 'r/worldnews', url: '#' }],
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    }
  ];
}

// Main function to fetch all news
export async function fetchAllNews(): Promise<NewsItem[]> {
  try {
    const [guardianNews, yleNews, redditNews] = await Promise.allSettled([
      fetchGuardianNews(),
      fetchYleNews(),
      fetchRedditNews()
    ]);
    
    const allNews: NewsItem[] = [];
    
    // Collect successful results
    if (guardianNews.status === 'fulfilled') {
      allNews.push(...guardianNews.value);
    }
    
    if (yleNews.status === 'fulfilled') {
      allNews.push(...yleNews.value);
    }
    
    if (redditNews.status === 'fulfilled') {
      allNews.push(...redditNews.value);
    }
    
    // Sort by publication date (newest first)
    allNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    // Return first 20 articles
    return allNews.slice(0, 20);
  } catch (error) {
    console.error('Error fetching news:', error);
    
    // Fallback to mock data if all APIs fail
    return [
      ...getMockGuardianNews(),
      ...getMockYleNews(),
      ...getMockRedditNews()
    ].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }
}

// Function to refresh news (can be called periodically)
export async function refreshNews(): Promise<NewsItem[]> {
  return fetchAllNews();
}