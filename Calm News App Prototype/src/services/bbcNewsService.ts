import { NewsItem } from '../components/NewsCard';
import { BBC_CONFIG, BBC_TOPIC_MAPPING } from '../config/apiConfig';

// BBC RSS feed item structure
interface BbcRssItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  category?: string;
  guid: string;
}

// BBC News API response structure  
interface BbcApiResponse {
  status: string;
  totalResults: number;
  articles: BbcRssItem[];
}

// Helper function to generate neutral headlines from BBC titles
function neutralizeHeadline(originalTitle: string): string {
  // Remove BBC-specific prefixes and sensationalized language
  let neutral = originalTitle
    .replace(/^BBC\s*-?\s*/i, '')
    .replace(/\b(BREAKING|URGENT|EXCLUSIVE|LIVE|WATCH)[\s:]/gi, '')
    .replace(/[!]{2,}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Replace potentially biased or sensationalized terms
  neutral = neutral
    .replace(/\b(slams|blasts|destroys|rips|tears into|lashes out)\b/gi, 'criticizes')
    .replace(/\b(fury|outrage|chaos|mayhem)\b/gi, 'concern')
    .replace(/\b(shocking|stunning|incredible|amazing)\b/gi, 'notable')
    .replace(/\b(disaster|catastrophe)\b/gi, 'incident');
  
  return neutral;
}

// Helper function to clean BBC descriptions for summaries
function generateNeutralSummary(description: string, title: string): string {
  if (!description || description.length < 20) {
    return `News development regarding ${title.toLowerCase()}. Additional details available from BBC News.`;
  }
  
  // Remove HTML tags and clean up
  let summary = description
    .replace(/<[^>]*>/g, '')
    .replace(/&[a-zA-Z0-9#]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Limit to 200 characters and ensure it ends properly
  if (summary.length > 200) {
    summary = summary.substring(0, 200);
    const lastPeriod = summary.lastIndexOf('.');
    if (lastPeriod > 100) {
      summary = summary.substring(0, lastPeriod + 1);
    } else {
      summary = summary + '...';
    }
  }
  
  return summary;
}

// Function to fetch BBC RSS feed for a specific topic
async function fetchBbcRssFeed(topic: string): Promise<BbcRssItem[]> {
  const feedUrl = BBC_CONFIG.RSS_FEEDS[topic as keyof typeof BBC_CONFIG.RSS_FEEDS];
  if (!feedUrl) {
    console.warn(`No RSS feed configured for topic: ${topic}`);
    return [];
  }
  
  try {
    // In a real app, you'd need a CORS proxy or backend service
    // For development, you can use a proxy service like allorigins
    const proxyUrl = `${BBC_CONFIG.RSS_PROXY}${encodeURIComponent(feedUrl)}`;
    
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const xmlText = data.contents;
    
    // Parse RSS XML (simplified - in production, use a proper XML parser)
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');
    
    const articles: BbcRssItem[] = [];
    
    items.forEach((item, index) => {
      const title = item.querySelector('title')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const guid = item.querySelector('guid')?.textContent || `${topic}-${index}`;
      
      if (title && link) {
        articles.push({
          title,
          description,
          link,
          pubDate,
          category: topic,
          guid
        });
      }
    });
    
    return articles;
  } catch (error) {
    console.error(`Error fetching BBC RSS feed for ${topic}:`, error);
    return [];
  }
}

// Convert BBC RSS items to our NewsItem format
function convertBbcItemsToNewsItems(bbcItems: BbcRssItem[], topic: string): NewsItem[] {
  return bbcItems.map((item, index) => {
    const neutralHeadline = neutralizeHeadline(item.title);
    const neutralSummary = generateNeutralSummary(item.description, item.title);
    
    // Convert topic to our category format
    const categoryMapping: { [key: string]: string } = {
      'uk': 'UK',
      'world': 'World',
      'business': 'Business', 
      'politics': 'Politics',
      'technology': 'Technology',
      'science': 'Science',
      'health': 'Health',
      'entertainment': 'Entertainment & Arts',
      'sport': 'Sport',
      'climate': 'Climate'
    };
    
    return {
      id: item.guid || `bbc-${topic}-${index}`,
      headline: neutralHeadline,
      summary: neutralSummary,
      category: categoryMapping[topic] || 'World',
      sources: [{ 
        name: 'BBC News', 
        url: item.link 
      }],
      publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()
    };
  });
}

// Main function to fetch BBC news for specific topics
export async function fetchBbcNewsByTopics(enabledTopics: string[]): Promise<NewsItem[]> {
  try {
    // Map our category names to BBC topic keys
    const bbcTopics = enabledTopics.map(category => {
      const topicKey = Object.entries(BBC_TOPIC_MAPPING)
        .find(([key, _]) => key === category)?.[1];
      return topicKey;
    }).filter(Boolean) as string[];
    
    // Fetch RSS feeds for all enabled topics in parallel
    const feedPromises = bbcTopics.map(topic => fetchBbcRssFeed(topic));
    const feedResults = await Promise.allSettled(feedPromises);
    
    // Process successful results
    const allNewsItems: NewsItem[] = [];
    
    feedResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const topic = bbcTopics[index];
        const newsItems = convertBbcItemsToNewsItems(result.value, topic);
        allNewsItems.push(...newsItems);
      } else {
        console.error(`Failed to fetch news for topic ${bbcTopics[index]}:`, result.reason);
      }
    });
    
    // Sort by publication date (newest first)
    return allNewsItems.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
  } catch (error) {
    console.error('Error fetching BBC news:', error);
    throw error;
  }
}

// Function to fetch all BBC news (all topics)
export async function fetchAllBbcNews(): Promise<NewsItem[]> {
  const allTopics = Object.keys(BBC_TOPIC_MAPPING);
  return fetchBbcNewsByTopics(allTopics);
}

// Test function to validate BBC RSS access
export async function testBbcRssAccess(): Promise<boolean> {
  try {
    const testItems = await fetchBbcRssFeed('uk');
    return testItems.length > 0;
  } catch (error) {
    console.error('BBC RSS access test failed:', error);
    return false;
  }
}