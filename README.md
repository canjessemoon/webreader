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
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
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

## License

This project is licensed under the MIT License - see the LICENSE file for details.
```
