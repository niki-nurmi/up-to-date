import { Badge } from "./ui/badge";

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  category: string;
  sources: Array<{
    name: string;
    url: string;
  }>;
  publishedAt: string;
}

interface NewsCardProps {
  item: NewsItem;
  onClick: (item: NewsItem) => void;
}

export function NewsCard({ item, onClick }: NewsCardProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className="bg-card border-b border-border p-6 cursor-pointer transition-colors hover:bg-accent/50 active:bg-accent"
      onClick={() => onClick(item)}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs px-2 py-1">
            {item.category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatTime(item.publishedAt)}
          </span>
        </div>
        
        <h2 className="leading-relaxed text-foreground">
          {item.headline}
        </h2>
        
        <p className="text-muted-foreground leading-relaxed line-clamp-3">
          {item.summary}
        </p>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <span>{item.sources.length} source{item.sources.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
}