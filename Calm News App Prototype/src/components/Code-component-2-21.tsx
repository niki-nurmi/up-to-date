import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { NewsItem } from "./NewsCard";

interface ArticleScreenProps {
  article: NewsItem;
  onBack: () => void;
}

export function ArticleScreen({ article, onBack }: ArticleScreenProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 -ml-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="ml-2 text-muted-foreground">Article</span>
        </div>
      </div>

      {/* Article Content */}
      <div className="p-6 max-w-2xl mx-auto">
        <div className="space-y-6">
          {/* Meta */}
          <div className="space-y-3">
            <Badge variant="secondary" className="text-xs">
              {article.category}
            </Badge>
            <p className="text-xs text-muted-foreground">
              {formatDate(article.publishedAt)}
            </p>
          </div>

          {/* Headline */}
          <h1 className="leading-relaxed text-foreground">
            {article.headline}
          </h1>

          {/* Summary */}
          <div className="prose prose-neutral max-w-none">
            <div className="bg-muted/30 p-4 rounded-lg border border-border">
              <h3 className="text-sm mb-3 text-muted-foreground uppercase tracking-wide">
                AI Summary
              </h3>
              <p className="leading-relaxed text-foreground">
                {article.summary}
              </p>
            </div>
          </div>

          {/* Extended Summary */}
          <div className="space-y-4">
            <p className="leading-relaxed text-foreground">
              This story has been developing across multiple sources, with coverage focusing on the broader implications and context. Key stakeholders have provided measured responses, indicating a cautious but optimistic outlook.
            </p>
            <p className="leading-relaxed text-foreground">
              Industry experts suggest that while immediate impacts may be limited, long-term effects could be more significant. Additional reporting is expected as more information becomes available.
            </p>
          </div>

          {/* Source Links */}
          <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-sm text-muted-foreground uppercase tracking-wide">
              Read the full story
            </h3>
            <div className="space-y-3">
              {article.sources.map((source, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-between h-12 border-border"
                  onClick={() => {
                    // In a real app, this would open the external source
                    console.log(`Opening ${source.name}`);
                  }}
                >
                  <span>Continue reading on {source.name}</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}