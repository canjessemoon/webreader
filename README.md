# WebReader: Web Content Text-to-Speech Application

![React](https://img.shields.io/badge/React-19.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8)
![Vite](https://img.shields.io/badge/Vite-6.3-646cff)
![Status](https://img.shields.io/badge/Status-Active-success)
![Railway Ready](https://img.shields.io/badge/Railway-Ready-7b5bd6)

WebReader is a feature-rich web application that extracts content from websites and transforms it into speech using Text-to-Speech technology. Built with modern web technologies, it provides a clean, accessible interface with extensive customization options.

## 🌟 Key Features

- **Content Extraction** - Intelligent extraction of main content from websites
- **Text-to-Speech** - High-quality speech synthesis with voice customization
- **Multi-Proxy System** - Automatic fallback between different CORS proxies
- **Responsive UI** - Works seamlessly on mobile, tablet, and desktop
- **Accessibility** - Fully keyboard navigable with high-contrast options
- **Dark Mode** - Toggle between light and dark themes
- **Status Dashboard** - System-wide health monitoring
- **One-Click Deployment** - Integrated deployment assistant

## 🚀 Latest Updates (May 2023)

- **Deployment Assistant** - Step-by-step deployment guide with Railway integration
- **Status Dashboard** - Real-time monitoring of all application services
- **Enhanced Error Handling** - Improved error recovery with automatic proxy switching
- **FallbackContent System** - User-friendly error displays with troubleshooting options
- **Health Check API** - Comprehensive system status endpoint for monitoring tools

## 📋 Project Structure

```
webreader/
├── src/                  # Frontend source code
│   ├── components/       # React components
│   ├── services/         # Service modules
│   └── types/            # TypeScript type definitions
├── server/               # Backend server code
├── public/               # Static assets
├── dist/                 # Build output
└── docs/                 # Documentation
```

## 🛠️ Technology Stack

### Frontend
- **React** - UI component library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next-generation frontend tooling

### Backend
- **Express** - Web server framework
- **Cheerio** - Server-side jQuery for HTML parsing
- **html-to-text** - HTML to plain text conversion
- **Axios** - HTTP client

### API
- **Web Speech API** - Browser Text-to-Speech functionality
- **CORS Proxies** - Content access through proxy servers

## 🏃‍♂️ Quick Start

### One-Click Deployment

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/webreader)

### Manual Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/webreader.git
cd webreader

# Install dependencies
npm install
```

### Development

```bash
# Start development server (frontend only)
npm run dev

# Start both frontend and backend servers
npm run dev:all
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 📦 Deployment Options

### Using Deployment Assistant (Recommended)

WebReader now includes an integrated deployment assistant that makes the process simple:

1. In the application footer, click on "Deployment Assistant"
2. Follow the step-by-step guide:
   - Copy Railway configuration with one click
   - Build the application for production
   - Deploy to Railway platform

The assistant will guide you through each step and provide troubleshooting options if needed.

### Manual Railway Deployment

1. Copy the simplified Railway configuration:
   ```bash
   cp railway.simple.json railway.json
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Push to GitHub and connect to Railway:
   - Create a new project in Railway
   - Connect to your GitHub repository
   - Deploy the application

Detailed instructions available in `RAILWAY_DEPLOYMENT.md`

### Traditional Hosting

For standard Node.js hosting environments, follow the instructions in `PLATFORMLESS_DEPLOYMENT.md`.

## 🔍 Testing

Run the comprehensive test script to verify your setup:

```bash
./test-webreader.ps1
```

This will check all components of the application and ensure everything is correctly configured.

## 📄 Documentation

- **`FEATURES.md`** - Detailed feature documentation
- **`DEPLOYMENT_CHECKLIST.md`** - Pre-flight deployment checks
- **`SIMPLE_DEPLOYMENT.md`** - Simplified Railway deployment guide
- **`PLATFORMLESS_DEPLOYMENT.md`** - Traditional hosting guide

## 🔧 Troubleshooting

### Content Extraction Issues

If you encounter "No content found on this page" or other extraction errors:

1. **Website Blocking**: Some websites actively block content extraction. Look for the specific error message displayed by the FallbackContent component.
2. **CORS Issues**: Click the "Try Different Proxy" button to cycle through available proxies.
3. **Network Problems**: Check your internet connection and try again with the "Retry" button.
4. **Console Logs**: Open browser DevTools (F12) and check the console for detailed error information.
5. **Status Page**: Check the Status Page (linked in footer) to verify all services are operational.

### Speech Synthesis Issues

If text-to-speech is not working:

1. **Browser Support**: Ensure your browser supports the Web Speech API (Chrome and Edge work best).
2. **Voice Selection**: Some voices may not be available on all operating systems, try selecting a different voice.
3. **Permission Issues**: Some browsers require permission to use speech synthesis.
4. **Volume Settings**: Check both the application volume slider and your system volume.

### Deployment Problems

1. **Pre-Flight Checks**: Run `./test-webreader.ps1` to verify your setup before deployment.
2. **Configuration**: Ensure `railway.json` is properly set up (use the Deployment Assistant).
3. **Logs**: Check Railway logs for detailed error information in production.
4. **Health Checks**: Verify the `/api/health` endpoint is responding correctly.
5. **Proxy Issues**: If the proxy fails in production, the application will automatically try external proxies.

## 🔜 Future Enhancements

- Browser extension version
- User accounts to save preferences
- Offline reading capability
- PDF document support
- Automatic language detection
- Content translation features

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
