import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const newsTopics = [
    { id: 'politics', label: 'Politics', enabled: true },
    { id: 'technology', label: 'Technology', enabled: true },
    { id: 'science', label: 'Science', enabled: true },
    { id: 'health', label: 'Health', enabled: true },
    { id: 'environment', label: 'Environment', enabled: true },
    { id: 'education', label: 'Education', enabled: false },
    { id: 'sports', label: 'Sports', enabled: false },
    { id: 'business', label: 'Business', enabled: true },
    { id: 'culture', label: 'Culture', enabled: false }
  ];

  const newsSources = [
    { name: 'Financial Times', connected: false },
    { name: 'The Guardian', connected: false },
    { name: 'TechCrunch', connected: false },
    { name: 'Reuters', connected: false },
    { name: 'Wall Street Journal', connected: false },
    { name: 'Bloomberg', connected: false }
  ];

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
            Choose which topics you'd like to see in your feed. You can always adjust these later.
          </p>
          
          <div className="space-y-4">
            {newsTopics.map((topic) => (
              <div key={topic.id} className="flex items-center justify-between py-2">
                <span className="text-foreground">{topic.label}</span>
                <Switch 
                  defaultChecked={topic.enabled}
                  onCheckedChange={(checked) => {
                    console.log(`${topic.label}: ${checked}`);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* News Sources Section */}
        <div className="space-y-4">
          <h2 className="text-lg text-foreground">News Sources</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Connect your accounts to access full articles directly. Your login credentials are never stored by Up-to-date.
          </p>
          
          <div className="space-y-3">
            {newsSources.map((source) => (
              <div key={source.name} className="flex items-center justify-between py-3 px-4 bg-muted/30 rounded-lg border border-border">
                <span className="text-foreground">{source.name}</span>
                <Button
                  variant={source.connected ? "secondary" : "outline"}
                  size="sm"
                  className="h-8"
                  onClick={() => {
                    console.log(`Connecting to ${source.name}`);
                  }}
                >
                  {source.connected ? (
                    "Connected"
                  ) : (
                    <>
                      Connect
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* App Info */}
        <div className="space-y-4">
          <h2 className="text-lg text-foreground">About</h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Up-to-date curates news from multiple sources using AI to create neutral, non-clickbait headlines and summaries.
            </p>
            <p>
              Our goal is to help you stay informed without the stress and overwhelm of traditional news consumption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}