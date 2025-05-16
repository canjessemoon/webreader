# WebReader Features Documentation

## Core Functionality

### Content Extraction
WebReader uses advanced techniques to extract the main content from websites while filtering out navigation menus, advertisements, sidebars, and other non-essential elements.

#### How It Works
1. The application sends a request to the target URL through a CORS proxy
2. HTML is parsed using Cheerio (server-side jQuery equivalent)
3. Common non-content elements are removed (ads, navigation, etc.)
4. The main content is identified using multiple selector strategies
5. Text is cleaned and formatted for readability

#### Extraction Strategies
- Primary: Look for semantic HTML5 elements (`<article>`, `<main>`)
- Secondary: Check for common content class names (`.content`, `.article`, `.post-content`)
- Fallback: Use text density analysis to find the largest text block

### Text-to-Speech (TTS)
WebReader leverages the Web Speech API to convert extracted text content into natural-sounding speech.

#### Features
- **Voice Selection**: Choose from all available system voices
- **Language Support**: Multiple languages based on available voices
- **Customizable Speech**:
  - Rate: Adjust reading speed (0.5x to 2.0x)
  - Pitch: Change voice pitch
  - Volume: Adjust speech volume

#### Reading Controls
- Play/Pause: Start or pause reading
- Stop: Stop reading completely
- Skip: Jump to next paragraph
- Previous: Return to previous paragraph
- Current Position: Visual indicator of reading progress

### User Interface

#### Responsive Design
- Adapts to all screen sizes (mobile, tablet, desktop)
- Fluid layout with appropriate spacing and sizing

#### Accessibility Features
- Keyboard navigation for all controls
- High contrast mode
- Adjustable font sizes
- ARIA attributes for screen readers

#### Theme Customization
- Dark/Light mode toggle
- Font size adjustment (small, medium, large, extra-large)
- Color themes for reading comfort

## Technical Implementation

### Frontend (React + TypeScript)
- Component-based architecture
- Strong typing with TypeScript
- CSS with Tailwind for responsive design

### Backend (Express)
- CORS proxy for content retrieval
- Health checks for deployment monitoring
- Static file serving for the React application

### Content Processing
- HTML parsing with Cheerio
- Text extraction with html-to-text
- Content cleaning and formatting

## Advanced Features

### Proxy Fallback System
- Multiple CORS proxies to ensure content can always be accessed
- Automatic switching between proxies if one fails
- Environment detection (development vs. production)

### Error Handling
- Graceful error messages for content extraction issues
- Automatic retries for failed requests
- Detailed console logging for troubleshooting

### Performance Optimizations
- Code splitting for faster initial load time
- Efficient state management
- Optimized rendering for large text content

## Deployment Options

### Railway Deployment
- One-click deployment with Railway
- Automatic health checks
- Environment variable configuration

### Traditional Hosting
- Instructions for standard Node.js hosting
- PM2 process management support
- Nginx configuration for production environments
