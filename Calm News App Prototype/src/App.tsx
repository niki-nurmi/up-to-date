import { useState } from "react";
import { SignInScreen } from "./components/SignInScreen";
import { MainFeed } from "./components/MainFeed";
import { ArticleScreen } from "./components/ArticleScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { NewsItem } from "./components/NewsCard";

type Screen = 'signin' | 'feed' | 'article' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('signin');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleSignIn = () => {
    setCurrentScreen('feed');
  };

  const handleArticleSelect = (article: NewsItem) => {
    setSelectedArticle(article);
    setCurrentScreen('article');
  };

  const handleSettingsOpen = () => {
    setCurrentScreen('settings');
  };

  const handleBack = () => {
    if (currentScreen === 'article') {
      setCurrentScreen('feed');
      setSelectedArticle(null);
    } else if (currentScreen === 'settings') {
      setCurrentScreen('feed');
      // Trigger refresh when returning from settings
      setRefreshTrigger(prev => prev + 1);
    }
  };

  const handleSettingsChange = () => {
    // Trigger refresh when settings change
    setRefreshTrigger(prev => prev + 1);
  };

  // Mobile-first responsive container
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md">
        {currentScreen === 'signin' && (
          <SignInScreen onSignIn={handleSignIn} />
        )}
        
        {currentScreen === 'feed' && (
          <MainFeed 
            onArticleSelect={handleArticleSelect}
            onSettingsOpen={handleSettingsOpen}
            refreshTrigger={refreshTrigger}
          />
        )}
        
        {currentScreen === 'article' && selectedArticle && (
          <ArticleScreen 
            article={selectedArticle}
            onBack={handleBack}
          />
        )}
        
        {currentScreen === 'settings' && (
          <SettingsScreen 
            onBack={handleBack} 
            onSettingsChange={handleSettingsChange}
          />
        )}
      </div>
    </div>
  );
}