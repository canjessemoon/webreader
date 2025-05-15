# WebReader: Website Content Text-to-Speech App

![WebReader](https://img.shields.io/badge/WebReader-v1.0-blue)
![React](https://img.shields.io/badge/React-18.x-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8)

WebReader is a web application that extracts the main content from any website and reads it aloud using text-to-speech technology. The app provides a clean, accessible interface with extensive customization options to enhance the reading experience.

## Features

### Content Extraction
- Extracts the main body content from websites, excluding navigation, advertisements, and sidebars
- Supports common HTML structures and various webpage layouts
- Handles dynamically loaded content

### Text-to-Speech
- High-quality speech synthesis using the Web Speech API
- Support for multiple languages based on the browser's available voices
- Adjustable speech rate, pitch, and volume
- Real-time text highlighting as content is read

### User Interface
- Clean, responsive design that works across devices (mobile, tablet, desktop)
- Dark/light mode toggle
- Adjustable font size and background color
- Accessible keyboard navigation
- Visual feedback during content reading

### Accessibility
- Fully keyboard navigable
- High-contrast options
- Customizable text display
- Visual indicators for current reading position

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Content Extraction**: Axios, Cheerio, html-to-text
- **Text-to-Speech**: Web Speech API
- **CORS Proxy**: Express.js backend server

## Latest Updates (May 2025)

- Fixed build errors preventing deployment
- Fixed CORS issues with content extraction in production environment
- Improved scrollable content layout to prevent overlap with reading controls
- Added enhanced styling for better user experience
- Fixed various TypeScript errors and type safety improvements

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   cd server && npm install
   cd ..
   ```

2. **Development Mode**
   ```bash
   npm run dev:all
   ```
   This will start both the Vite development server and the API proxy server.

3. **Production Build**
   ```bash
   npm run build
   npm run start
   ```
   This builds the application and starts the simple server that handles both static files and API requests.

## Deployment Options

WebReader supports multiple deployment options:

1. **Simple Node.js Server (Recommended)**
   - Uses `simple-server.js` for both static files and API proxying
   - Single process, simple setup
   - Command: `npm run start`

2. **Express Server**
   - Uses `server.cjs` with Express
   - More configurable, supports middleware
   - Command: `npm run start:express`

3. **Vercel Deployment**
   - Configured with `vercel.json` and API endpoint in `/api/proxy.js`
   - See `DEPLOYMENT.md` for detailed instructions

4. **Custom Platform**
   - See `PLATFORMLESS_DEPLOYMENT.md` for platform-agnostic deployment

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/webreader.git
cd webreader
```

2. Install dependencies:
```
npm install
npm run install:server
```

### Development

Run the development server (both frontend and backend):
```
npm run dev:all
```

- Frontend will be available at http://localhost:5173
- Backend CORS proxy server will run on http://localhost:3001

### Building for Production

```
npm run build
```

## Usage

1. Enter a website URL in the input field
2. Click the search button to extract content
3. Use the play button to start reading the content
4. Adjust voice settings and appearance as needed
5. Use the controls to pause, resume, or stop the reading

## Known Issues and Fixes

- If content extraction fails with "No content found", check your CORS proxy configuration
- For scrolling issues on mobile devices, adjust the viewport settings in `index.html`
- For build issues, check that TypeScript is properly configured

## Limitations

- Some websites may block content extraction through their security policies
- Text-to-Speech quality depends on the voices available in your browser
- Complex page layouts might not extract perfectly

## Future Enhancements

- Browser extension version for direct integration with browsing
- User accounts to save preferences and favorite articles
- Offline reading capability
- Support for PDF documents
- More advanced text processing for better content extraction

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
