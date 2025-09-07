# Up-to-date App Guidelines

## Design Philosophy
- Calm, minimalist mobile app focused on reducing doomscrolling
- Medium-inspired design with clean typography, muted colors, generous whitespace
- Light mode only
- Minimal cognitive load, no addictive elements (no saving, sharing, likes, excessive animations)

## BBC News Integration
- Single source: BBC News only for consistency and reliability
- AI-generated headlines (neutral tone, not copied directly from sources)
- Authentic BBC News sections: UK, World, Business, Politics, Technology, Science, Health, Entertainment & Arts, Sport, Climate
- Production-ready architecture ready for live BBC RSS feeds

## App Structure
- Sign-in screen → Main feed → Article screen → Settings screen
- Main feed: endless scrolling news cards with neutral headlines
- Article screen: AI summaries with "Read more" buttons linking to BBC sources
- Settings screen: topic filters that properly affect the main feed
- Persistent settings with topic-based filtering

## Technical Guidelines
- Mobile-first responsive design (max-width: 28rem/448px)
- React + TypeScript + Tailwind CSS
- Clean component architecture with separation of concerns
- Proper state management for settings and feed refresh