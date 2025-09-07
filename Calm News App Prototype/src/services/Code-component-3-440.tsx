// Settings management for topic preferences and app configuration

export interface TopicSetting {
  id: string;
  label: string;
  enabled: boolean;
}

export interface AppSettings {
  enabledTopics: string[];
  lastUpdated: string;
}

const SETTINGS_STORAGE_KEY = 'up-to-date-settings';

// Default topic settings matching BBC News categories
const DEFAULT_TOPIC_SETTINGS: TopicSetting[] = [
  { id: 'uk', label: 'UK', enabled: true },
  { id: 'world', label: 'World', enabled: true },
  { id: 'business', label: 'Business', enabled: true },
  { id: 'politics', label: 'Politics', enabled: true },
  { id: 'technology', label: 'Technology', enabled: true },
  { id: 'science', label: 'Science', enabled: true },
  { id: 'health', label: 'Health', enabled: true },
  { id: 'entertainment', label: 'Entertainment & Arts', enabled: false },
  { id: 'sport', label: 'Sport', enabled: false },
  { id: 'climate', label: 'Climate', enabled: false }
];

// Load settings from localStorage
export function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        enabledTopics: parsed.enabledTopics || getDefaultEnabledTopics(),
        lastUpdated: parsed.lastUpdated || new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  
  // Return defaults if no settings found or error occurred
  return {
    enabledTopics: getDefaultEnabledTopics(),
    lastUpdated: new Date().toISOString()
  };
}

// Save settings to localStorage
export function saveSettings(settings: AppSettings): void {
  try {
    settings.lastUpdated = new Date().toISOString();
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

// Get topic settings with current enabled state
export function getTopicSettings(): TopicSetting[] {
  const currentSettings = loadSettings();
  
  return DEFAULT_TOPIC_SETTINGS.map(topic => ({
    ...topic,
    enabled: currentSettings.enabledTopics.includes(topic.label)
  }));
}

// Update topic enabled state
export function updateTopicSetting(topicLabel: string, enabled: boolean): void {
  const currentSettings = loadSettings();
  
  if (enabled) {
    // Add topic if not already enabled
    if (!currentSettings.enabledTopics.includes(topicLabel)) {
      currentSettings.enabledTopics.push(topicLabel);
    }
  } else {
    // Remove topic if currently enabled
    currentSettings.enabledTopics = currentSettings.enabledTopics.filter(
      topic => topic !== topicLabel
    );
  }
  
  saveSettings(currentSettings);
}

// Get list of currently enabled topic labels
export function getEnabledTopics(): string[] {
  return loadSettings().enabledTopics;
}

// Get default enabled topics
function getDefaultEnabledTopics(): string[] {
  return DEFAULT_TOPIC_SETTINGS
    .filter(topic => topic.enabled)
    .map(topic => topic.label);
}

// Reset settings to defaults
export function resetSettings(): void {
  const defaultSettings: AppSettings = {
    enabledTopics: getDefaultEnabledTopics(),
    lastUpdated: new Date().toISOString()
  };
  
  saveSettings(defaultSettings);
}

// Check if at least one topic is enabled
export function hasEnabledTopics(): boolean {
  const enabledTopics = getEnabledTopics();
  return enabledTopics.length > 0;
}

// Ensure at least one topic is always enabled
export function ensureMinimumTopics(): void {
  const enabledTopics = getEnabledTopics();
  
  if (enabledTopics.length === 0) {
    // Re-enable UK and World as minimum topics
    const settings = loadSettings();
    settings.enabledTopics = ['UK', 'World'];
    saveSettings(settings);
  }
}