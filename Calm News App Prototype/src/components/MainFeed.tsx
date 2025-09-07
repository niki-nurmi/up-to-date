import { useState, useEffect } from "react";
import { Settings, RefreshCw } from "lucide-react";
import { NewsCard, NewsItem } from "./NewsCard";
import { Button } from "./ui/button";
import { fetchNewsByTopics, updateArticleUrls } from "../services/newsService";
import { getEnabledTopics, hasEnabledTopics } from "../services/settingsService";

interface MainFeedProps {
  onArticleSelect: (item: NewsItem) => void;
  onSettingsOpen: () => void;
  refreshTrigger?: number; // Optional prop to trigger refresh from outside
}

export function MainFeed({ onArticleSelect, onSettingsOpen, refreshTrigger }: MainFeedProps) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enabledTopics, setEnabledTopics] = useState<string[]>([]);

  // Load news on component mount and when settings change
  useEffect(() => {
    loadNews();
  }, [refreshTrigger]);

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get current enabled topics
      const currentEnabledTopics = getEnabledTopics();
      setEnabledTopics(currentEnabledTopics);

      // Check if any topics are enabled
      if (!hasEnabledTopics()) {
        setError('No topics selected. Please enable at least one topic in Settings.');
        setItems([]);
        return;
      }

      // Fetch news for enabled topics only
      const newsItems = await fetchNewsByTopics(currentEnabledTopics);
      
      // Update URLs to point to real BBC articles
      const itemsWithUrls = updateArticleUrls(newsItems);
      
      setItems(itemsWithUrls);

      if (newsItems.length === 0) {
        setError('No news articles found for selected topics.');
      }
    } catch (err) {
      setError('Unable to load news content.');
      console.error('Error loading news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadNews();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl tracking-tight text-foreground">Up-to-date</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="p-2"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettingsOpen}
              className="p-2"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="px-4 pb-2">
            <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded">
              {error}
            </div>
          </div>
        )}
      </div>

      {/* News Feed */}
      <div className="pb-6">
        {loading && items.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-muted-foreground">Loading news...</div>
          </div>
        ) : (
          items.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              onClick={onArticleSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}