import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { getTopicSettings, updateTopicSetting, ensureMinimumTopics, TopicSetting } from "../services/settingsService";

interface SettingsScreenProps {
  onBack: () => void;
  onSettingsChange?: () => void; // Callback to notify parent of setting changes
}

export function SettingsScreen({ onBack, onSettingsChange }: SettingsScreenProps) {
  const [newsTopics, setNewsTopics] = useState<TopicSetting[]>([]);

  // Load topic settings on component mount
  useEffect(() => {
    const topicSettings = getTopicSettings();
    setNewsTopics(topicSettings);
  }, []);

  const handleTopicToggle = (topicLabel: string, enabled: boolean) => {
    // Update the local state
    setNewsTopics(prevTopics => 
      prevTopics.map(topic => 
        topic.label === topicLabel 
          ? { ...topic, enabled } 
          : topic
      )
    );

    // Update persistent storage
    updateTopicSetting(topicLabel, enabled);
    
    // Ensure at least one topic remains enabled
    ensureMinimumTopics();
    
    // Notify parent component of changes
    if (onSettingsChange) {
      onSettingsChange();
    }
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
          <span className="ml-2">Settings</span>
        </div>
      </div>

      {/* Settings Content */}
      <div className="p-6 space-y-8">
        
        {/* Topics Section */}
        <div className="space-y-4">
          <h2 className="text-lg text-foreground">Topics</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Choose which topics you'd like to see in your feed. These settings affect which BBC News content appears in your timeline.
          </p>
          
          <div className="space-y-4">
            {newsTopics.map((topic) => (
              <div key={topic.id} className="flex items-center justify-between py-2">
                <span className="text-foreground">{topic.label}</span>
                <Switch 
                  checked={topic.enabled}
                  onCheckedChange={(checked) => handleTopicToggle(topic.label, checked)}
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* News Source Section */}
        <div className="space-y-4">
          <h2 className="text-lg text-foreground">News Source</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Up-to-date is powered by BBC News content, processed through AI to create neutral headlines and summaries.
          </p>
          
          <div className="py-3 px-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <span className="text-foreground">BBC News</span>
              <div className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                Active
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              High-quality content from BBC's trusted journalism
            </div>
          </div>
        </div>

        <Separator />

        {/* Reading Experience */}
        <div className="space-y-4">
          <h2 className="text-lg text-foreground">Reading Experience</h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Our AI processes BBC News content to create:
            </p>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Neutral headlines:</strong> Removes clickbait and bias</li>
              <li>• <strong>Clear summaries:</strong> Key information without overwhelm</li>
              <li>• <strong>Calm design:</strong> Focus on content, not engagement</li>
            </ul>
          </div>
        </div>

        <Separator />

        {/* App Info */}
        <div className="space-y-4">
          <h2 className="text-lg text-foreground">About Up-to-date</h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Up-to-date helps you stay informed without the stress of traditional news consumption.
            </p>
            <p>
              By processing BBC News through AI, we create a calm, neutral reading experience that focuses on information rather than engagement.
            </p>
            <p>
              No algorithms pushing extreme content. No endless scrolling addiction. Just clear, balanced news when you need it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}