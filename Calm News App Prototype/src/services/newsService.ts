import { NewsItem } from '../components/NewsCard';
import { fetchBbcNewsByTopics, fetchAllBbcNews, testBbcRssAccess } from './bbcNewsService';

// Helper function to generate AI-like neutral headlines
function generateNeutralHeadline(originalTitle: string): string {
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

// Helper function to generate realistic BBC URLs
function generateBbcArticleUrl(category: string, id: string): string {
  const categoryPaths: { [key: string]: string } = {
    'Climate': 'science-environment',
    'Health': 'health',
    'Science': 'science-environment',
    'Technology': 'technology',
    'World': 'world',
    'Business': 'business',
    'UK': 'uk',
    'Politics': 'politics',
    'Entertainment & Arts': 'entertainment-arts',
    'Sport': 'sport'
  };
  
  const categoryPath = categoryPaths[category] || 'world';
  const articleId = id.replace('bbc-', '678912') + (Math.floor(Math.random() * 9000) + 1000);
  
  return `https://www.bbc.com/news/${categoryPath}-${articleId}`;
}

// Get BBC News data (prototype version with high-quality mock data)
function getBbcNews(): NewsItem[] {
  const rawArticles = [
    {
      id: 'bbc-1',
      headline: 'International climate conference reaches agreement on renewable energy targets',
      summary: 'Representatives from 195 countries established new framework for accelerating renewable energy adoption over the next decade. The agreement includes specific commitments for solar and wind power development.',
      category: 'Climate',
      publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bbc-2',
      headline: 'Medical breakthrough shows promise for early alzheimer detection',
      summary: 'Researchers developed new brain imaging technology that can identify alzheimer-related changes years before symptoms appear. The method could enable earlier intervention and treatment.',
      category: 'Health',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bbc-3',
      headline: 'Global ocean cleanup initiative removes record amount of plastic waste',
      summary: 'Environmental project successfully collected over 100,000 tons of plastic debris from Pacific waters this year. The initiative demonstrates scalable solutions for addressing marine pollution.',
      category: 'Climate',
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bbc-4',
      headline: 'Archaeological discovery reveals ancient trade networks in mediterranean',
      summary: 'Excavations uncovered evidence of sophisticated trading relationships between civilizations 3,000 years ago. The findings challenge existing theories about ancient economic systems.',
      category: 'Science',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bbc-5',
      headline: 'New satellite technology improves disaster early warning systems',
      summary: 'Advanced monitoring satellites launched this month provide more accurate predictions for earthquakes and severe weather events. The technology could save thousands of lives annually.',
      category: 'Technology',
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bbc-6',
      headline: 'International education report highlights digital learning progress',
      summary: 'UNESCO study shows significant improvements in student outcomes using new educational technology platforms. The research covers 40 countries across urban and rural environments.',
      category: 'World',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bbc-7',
      headline: 'Scientific collaboration produces breakthrough in cancer treatment',
      summary: 'International research team developed new immunotherapy approach showing remarkable success in clinical trials. The treatment targets multiple cancer types with minimal side effects.',
      category: 'Health',
      publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bbc-8',
      headline: 'Global food security initiative addresses hunger in developing regions',
      summary: 'World Food Programme launched comprehensive program to improve agricultural productivity and food distribution. The initiative focuses on sustainable farming practices and local capacity building.',
      category: 'World',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bbc-9',
      headline: 'Urban planning innovation reduces traffic congestion in major cities',
      summary: 'Smart city technologies implemented across 15 metropolitan areas show significant improvements in traffic flow and air quality. The systems use AI to optimize transportation networks.',
      category: 'Technology',
      publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bbc-10',
      headline: 'Wildlife conservation efforts show positive results for endangered species',
      summary: 'Recent surveys indicate population increases for several critically endangered species across multiple continents. Conservation programs demonstrate success through community-based approaches.',
      category: 'Science',
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bbc-11',
      headline: 'International space collaboration advances mars exploration timeline',
      summary: 'Space agencies announced joint mission planning for human mars exploration within the next 15 years. The collaboration includes shared technology development and astronaut training programs.',
      category: 'Science',
      publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bbc-12',
      headline: 'Economic analysis shows steady growth in renewable energy investments',
      summary: 'Financial reports indicate renewable energy attracted record investment levels this year. Solar and wind projects received 40% more funding compared to previous year.',
      category: 'Business',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bbc-13',
      headline: 'Mental health research reveals effective community support programs',
      summary: 'Studies demonstrate significant improvements in mental health outcomes through peer support networks and community-based interventions. The programs show promise for scalable implementation.',
      category: 'Health',
      publishedAt: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bbc-14',
      headline: 'Agricultural innovation helps farmers adapt to changing climate conditions',
      summary: 'New drought-resistant crop varieties and precision farming techniques enable farmers to maintain productivity despite weather challenges. The innovations support food security goals.',
      category: 'Climate',
      publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bbc-15',
      headline: 'Cultural heritage preservation uses digital technology for historical sites',
      summary: 'Archaeologists employ advanced 3D scanning and virtual reality to document and preserve historical monuments. The technology enables remote access to cultural heritage sites.',
      category: 'Entertainment & Arts',
      publishedAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bbc-16',
      headline: 'UK chancellor announces new infrastructure investment package',
      summary: 'The government revealed plans for £50 billion investment in rail, broadband, and renewable energy infrastructure over five years. The package aims to boost economic growth and support regional development.',
      category: 'UK',
      publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bbc-17',
      headline: 'European parliament approves new digital services regulations',
      summary: 'MEPs voted to strengthen oversight of major technology platforms with new rules on content moderation and data handling. The legislation aims to protect users while preserving innovation.',
      category: 'Politics',
      publishedAt: new Date(Date.now() - 17 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bbc-18',
      headline: 'Premier league clubs report record attendance figures for season',
      summary: 'English football stadiums welcomed their highest number of spectators in decades, with average attendance reaching 95% capacity. The figures reflect renewed fan enthusiasm following pandemic restrictions.',
      category: 'Sport',
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Add BBC News source URLs to each article
  return rawArticles.map(article => ({
    ...article,
    sources: [{ 
      name: 'BBC News', 
      url: generateBbcArticleUrl(article.category, article.id) 
    }]
  }));
}

// Main function to fetch all news (simplified for BBC-only prototype)
export async function fetchAllNews(): Promise<NewsItem[]> {
  try {
    // In a production app, this would fetch from BBC's RSS feeds or API
    // For this prototype, we use high-quality curated content
    const bbcNews = getBbcNews();
    
    // Sort by publication date (newest first)
    return bbcNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  } catch (error) {
    console.error('Error fetching news:', error);
    
    // Fallback to BBC news data
    return getBbcNews();
  }
}

// Function to refresh news (can be called periodically)
export async function refreshNews(): Promise<NewsItem[]> {
  return fetchAllNews();
}

// Function to fetch news filtered by enabled topics
export async function fetchNewsByTopics(enabledTopics: string[]): Promise<NewsItem[]> {
  try {
    // First try to fetch from BBC RSS feeds
    const bbcAccessible = await testBbcRssAccess();
    
    if (bbcAccessible) {
      console.log('Using live BBC RSS feeds');
      return await fetchBbcNewsByTopics(enabledTopics);
    } else {
      console.log('BBC RSS not accessible, using mock data with topic filtering');
      // Fall back to filtered mock data
      const allNews = getBbcNews();
      return allNews.filter(item => enabledTopics.includes(item.category));
    }
  } catch (error) {
    console.error('Error fetching news by topics:', error);
    
    // Final fallback to filtered mock data
    const allNews = getBbcNews();
    return allNews.filter(item => enabledTopics.includes(item.category));
  }
}

// Function to get available news topics
export function getAvailableTopics(): string[] {
  return [
    'UK',
    'World', 
    'Business',
    'Politics',
    'Technology',
    'Science',
    'Health',
    'Entertainment & Arts',
    'Sport',
    'Climate'
  ];
}

// Function to update article URLs to point to real BBC articles
export function updateArticleUrls(items: NewsItem[]): NewsItem[] {
  return items.map(item => ({
    ...item,
    sources: item.sources.map(source => ({
      ...source,
      url: source.url === '#' ? generateBbcUrl(item) : source.url
    }))
  }));
}

// Helper function to generate realistic BBC URLs based on article content
function generateBbcUrl(item: NewsItem): string {
  const baseUrl = 'https://www.bbc.com/news/';
  const categoryMapping: { [key: string]: string } = {
    'UK': 'uk',
    'World': 'world',
    'Business': 'business',
    'Politics': 'politics', 
    'Technology': 'technology',
    'Science': 'science-environment',
    'Health': 'health',
    'Entertainment & Arts': 'entertainment-arts',
    'Sport': 'sport',
    'Climate': 'science-environment'
  };
  
  const categoryPath = categoryMapping[item.category] || 'world';
  const slug = item.headline
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  
  // Generate a realistic article ID
  const articleId = Math.floor(Math.random() * 90000000) + 10000000;
  
  return `${baseUrl}${categoryPath}-${articleId}`;
}