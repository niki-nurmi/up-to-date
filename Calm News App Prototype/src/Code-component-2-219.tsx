# Up-to-date News App

A calm, minimalist mobile news app that helps users stay informed without doomscrolling. Features AI-generated neutral headlines and summaries from multiple sources.

## News Sources

The app integrates with:

- **YLE API** - Finnish public broadcasting (free API key required)
- **The Guardian API** - International quality journalism (free API key required)
- **BBC News** - RSS feeds (no API key needed)
- **Reddit API** - Community-curated news (no API key needed)

## Setup Instructions

### 1. Get API Keys (Optional)

The app works without API keys using sample data. For live news:

**Guardian API (Free):**
1. Visit https://open-platform.theguardian.com/access/
2. Register for a free developer key
3. Get 12,000 calls per day

**YLE API (Free):**
1. Visit https://developer.yle.fi/
2. Register for API access
3. Get both API key and App ID

### 2. Configure API Keys

**Option A: Environment Variables (Recommended)**
```bash
export GUARDIAN_API_KEY="your_guardian_key_here"
export YLE_API_KEY="your_yle_key_here"
export YLE_APP_ID="your_yle_app_id_here"
```

**Option B: Direct Configuration**
Edit `/config/apiConfig.ts` and replace the placeholder values:
```typescript
export const API_KEYS = {
  GUARDIAN_API_KEY: 'your_actual_guardian_key',
  YLE_API_KEY: 'your_actual_yle_key',
  YLE_APP_ID: 'your_actual_yle_app_id',
};
```

### 3. Features

- **Neutral Headlines**: AI-generated headlines remove clickbait and bias
- **Concise Summaries**: Single-paragraph summaries for quick consumption
- **Multiple Sources**: Aggregates from Finnish and international news
- **Minimal Design**: Clean, calm interface focused on reading
- **No Addiction Features**: No likes, shares, or endless engagement hooks

### 4. Technical Details

- Built with React and TypeScript
- Styled with Tailwind CSS v4
- Mobile-first responsive design
- Real-time news aggregation
- Fallback to sample data when APIs unavailable

### 5. Privacy

- No user tracking or analytics
- API keys stored locally
- No personal data collection
- Direct source linking for full articles

## Development

The app automatically falls back to sample news data when API keys aren't configured, so you can test all functionality immediately.

When API keys are added, the app will start fetching live news from the configured sources and display it in the same calm, neutral format.