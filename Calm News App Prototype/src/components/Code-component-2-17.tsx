import { useState } from "react";
import { Settings } from "lucide-react";
import { NewsCard, NewsItem } from "./NewsCard";
import { Button } from "./ui/button";

interface MainFeedProps {
  onArticleSelect: (item: NewsItem) => void;
  onSettingsOpen: () => void;
}

// Mock data for demonstration
const mockNewsItems: NewsItem[] = [
  {
    id: "1",
    headline: "Global renewable energy capacity reaches new milestone as countries accelerate clean transition",
    summary: "International energy agencies report significant progress in renewable infrastructure development across multiple regions. The transition appears to be gaining momentum despite ongoing economic challenges.",
    category: "Environment",
    sources: [
      { name: "Financial Times", url: "#" },
      { name: "Reuters", url: "#" }
    ],
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "2", 
    headline: "New research reveals insights into cognitive benefits of multilingual education",
    summary: "Recent studies from educational institutions suggest that learning multiple languages may have broader cognitive impacts than previously understood. Researchers emphasize the need for further investigation.",
    category: "Education",
    sources: [
      { name: "Nature", url: "#" },
      { name: "The Guardian", url: "#" }
    ],
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "3",
    headline: "Technology companies report mixed results in latest earnings season",
    summary: "Quarterly financial reports show varied performance across the technology sector. Market analysts note diverging trends between different subsectors and business models.",
    category: "Technology",
    sources: [
      { name: "TechCrunch", url: "#" },
      { name: "Wall Street Journal", url: "#" },
      { name: "Bloomberg", url: "#" }
    ],
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "4",
    headline: "Archaeological discovery provides new perspective on ancient civilization",
    summary: "Researchers have uncovered artifacts that may reshape understanding of historical trade routes and cultural exchange. The findings are being studied by international teams.",
    category: "Science",
    sources: [
      { name: "Scientific American", url: "#" }
    ],
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "5",
    headline: "Healthcare systems adapt to changing demographic patterns in developed nations",
    summary: "Medical professionals and policy makers are implementing new strategies to address evolving population health needs. Several pilot programs are showing promising preliminary results.",
    category: "Health",
    sources: [
      { name: "Medical News Today", url: "#" },
      { name: "The Lancet", url: "#" }
    ],
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

export function MainFeed({ onArticleSelect, onSettingsOpen }: MainFeedProps) {
  const [items] = useState<NewsItem[]>(mockNewsItems);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl tracking-tight text-foreground">Up-to-date</h1>
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

      {/* News Feed */}
      <div className="pb-6">
        {items.map((item) => (
          <NewsCard
            key={item.id}
            item={item}
            onClick={onArticleSelect}
          />
        ))}
      </div>
    </div>
  );
}