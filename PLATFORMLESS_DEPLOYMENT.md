# WebReader Deployment Guide for Traditional Hosting

This guide provides detailed instructions for deploying WebReader to a traditional hosting environment that supports Node.js (like DigitalOcean, AWS, Heroku, etc.).

## Step 1: Prepare Your Server

1. Set up a server with Node.js installed (version 14+ recommended)
2. Install Git if it's not already installed
3. Set up any necessary environment variables (e.g., PORT if you want to run on a specific port)

## Step 2: Clone the Repository

```
git clone https://github.com/canjessemoon/webreader.git
cd webreader
```

## Step 3: Install Dependencies

```
npm install
```

## Step 4: Build the Application

```
npm run build
```

This will create a `dist` directory with the production-ready build.

## Step 5: Start the Server

```
npm start
```

By default, the server will run on port 3000. You can change this by setting the PORT environment variable:

```
PORT=8080 npm start
```

## Setting Up PM2 (Recommended for Production)

For a more robust production setup, consider using PM2 to manage the Node.js process:

1. Install PM2 globally:
```
npm install -g pm2
```

2. Start your application with PM2:
```
pm2 start simple-server.js --name "webreader"
```

3. Set up PM2 to start on server boot:
```
pm2 startup
pm2 save
```

## Setting Up as a Service with Systemd

On Linux systems with systemd, you can create a service file:

1. Create a service file: `/etc/systemd/system/webreader.service`
```
[Unit]
Description=WebReader Application
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/webreader
ExecStart=/usr/bin/node /path/to/webreader/simple-server.js
Restart=on-failure
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

2. Start and enable the service:
```
sudo systemctl start webreader
sudo systemctl enable webreader
```

## Setting Up with Nginx as a Reverse Proxy

For a more robust setup, use Nginx as a reverse proxy in front of your Node.js application:

1. Install Nginx:
```
sudo apt update
sudo apt install nginx
```

2. Create a site configuration: `/etc/nginx/sites-available/webreader`
```
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. Enable the site:
```
sudo ln -s /etc/nginx/sites-available/webreader /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Securing with HTTPS

For HTTPS, set up Certbot with Let's Encrypt:

```
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Troubleshooting

### Content Extraction Issues

If you're seeing "No content found on this page" errors:

1. Check server logs for any API errors
2. Make sure the site you're trying to extract from doesn't block web scrapers
3. Try adding more headers to the axios request in `simple-server.js`:

```javascript
const response = await axios.get(targetUrl, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'https://www.google.com/',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0'
  },
  responseType: 'text'
});
```

### Server Won't Start

If the server won't start:

1. Check for proper Node.js version (14+)
2. Make sure all dependencies are installed
3. Check if the port is already in use

### CORS Issues

If you encounter CORS issues:

1. Make sure the simple-server.js properly handles CORS headers
2. Add these headers to the API response:

```javascript
res.writeHead(200, { 
  'Content-Type': 'text/html',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
});
```
