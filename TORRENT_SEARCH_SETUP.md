# Torrent Search Integration Setup Guide

## Overview

This application now uses real torrent search via `torrent-search-api` integrated into the WebTorrent backend server. The search supports multiple providers for better results.

## Architecture

```
Frontend (Next.js)
    ↓
Backend WebTorrent Server (port 3001)
    ↓
torrent-search-api (1337x, ThePirateBay, Rarbg)
    ↓
Real Torrent Results
```

## Setup Instructions

### 1. Install Backend Dependencies

Navigate to the backend directory and install the new dependency:

```bash
cd "backend webtorrent"
npm install
```

This will install `torrent-search-api` along with other dependencies.

### 2. Start the Backend Server

**Option A: Using npm script (recommended)**
```bash
npm run torrent:start
```

**Option B: Manual start**
```bash
cd "backend webtorrent"
node server.js
```

The server will start on port 3001 and you should see:
```
🚀 Server running on port 3001
[SEARCH] Enabled providers: 1337x, ThePirateBay, Rarbg
```

### 3. Start the Frontend

In a separate terminal, start the Next.js development server:

```bash
npm run dev
```

The frontend will start on port 3000.

## Features

### Enabled Torrent Providers

1. **1337x** - Fast and reliable, good quality torrents
2. **ThePirateBay** - Large collection, many seeders
3. **Rarbg** - High-quality releases

### Search Capabilities

- Search by movie/show title
- Automatic quality detection (4K, 1080p, 720p, 480p)
- Seeder/leecher counts
- File size information
- Multiple provider fallback

### API Endpoints

#### Search Torrents
```
GET http://localhost:3001/search?query=movie+name&type=movie&limit=20
```

Parameters:
- `query` (required): Search query
- `type` (optional): "movie" or "show" (default: "movie")
- `limit` (optional): Number of results (default: 20)

Response:
```json
{
  "success": true,
  "count": 15,
  "query": "Inception",
  "results": [
    {
      "title": "Inception (2010) 1080p BluRay x264",
      "magnet": "magnet:?xt=urn:btih:...",
      "size": "2.1 GB",
      "seeders": 245,
      "leechers": 42,
      "quality": "1080p",
      "year": 2010,
      "type": "movie",
      "provider": "1337x"
    }
  ]
}
```

## Usage in Application

### Automatic Search

When viewing a movie or show, the application automatically:
1. Builds a search query from the media title and year
2. For shows, adds season/episode information (e.g., "S01E05")
3. Searches all enabled providers
4. Sorts results by quality (4K → 1080p → 720p → 480p) and seeders
5. Displays results with stream buttons

### Manual Search

Users can:
- Filter results by quality
- Refresh search results
- View seeder/leecher counts
- Select and stream any result
- Open magnet links in external torrent clients

## Troubleshooting

### Backend Not Running

**Error:** "Failed to search torrents. Make sure the backend is running on port 3001."

**Solution:** Start the backend server:
```bash
npm run torrent:start
```

### No Search Results

**Possible Causes:**
1. Torrent providers are temporarily down
2. Search query is too specific
3. Network connectivity issues

**Solutions:**
- Try a simpler search query
- Check your internet connection
- Wait a few minutes and retry

### Port 3001 Already in Use

**Error:** "EADDRINUSE: address already in use :::3001"

**Solution:**
1. Find the process using port 3001:
   ```bash
   # Windows
   netstat -ano | findstr :3001

   # Linux/Mac
   lsof -i :3001
   ```
2. Kill the process or change the port in `backend webtorrent/server.js`

### Search Providers Not Working

If one provider fails, the search will continue with other providers. Check the backend console for specific errors:

```
[SEARCH ERROR] Provider '1337x' failed: timeout
```

This is normal - the system will use results from other providers.

## Environment Variables

### Frontend (.env.local)

```bash
# Optional: Override backend URL (default: http://localhost:3001)
NEXT_PUBLIC_WEBTORRENT_BACKEND_URL=http://localhost:3001
```

### Backend (backend webtorrent/.env)

```bash
# Server port (default: 3001)
PORT=3001

# WebTorrent settings
MAX_CONNECTIONS=55
DOWNLOAD_LIMIT=0  # KB/s, 0 = unlimited
UPLOAD_LIMIT=0    # KB/s, 0 = unlimited
KEEP_SEEDING=true

# Cleanup interval (default: 24 hours)
CLEANUP_INTERVAL_HOURS=24
```

## Development Notes

### File Structure

```
backend webtorrent/
├── server.js              # Main server with search endpoint
├── package.json           # Dependencies including torrent-search-api
└── .env                   # Configuration

src/
├── services/
│   └── torrent-search.ts  # Frontend service calling backend
├── components/
│   ├── torrent-provider.tsx       # Search UI component
│   └── torrent-video-player.tsx   # Streaming player
└── app/api/torrent/
    ├── search/route.ts    # Next.js API proxy (optional)
    └── stream/route.ts    # Stream endpoint proxy
```

### Adding More Providers

To enable additional providers, edit `backend webtorrent/server.js`:

```javascript
// Enable more providers
TorrentSearchApi.enableProvider('Torrent9');
TorrentSearchApi.enableProvider('Torlock');
TorrentSearchApi.enableProvider('TorrentProject');

// Check available providers
console.log(TorrentSearchApi.getProviders());
```

See [torrent-search-api documentation](https://www.npmjs.com/package/torrent-search-api) for all available providers.

## Security Considerations

⚠️ **Important:** This is for educational/personal use only.

- Backend server should not be exposed to the public internet
- Use VPN when downloading torrents
- Respect copyright laws in your jurisdiction
- Consider rate limiting for production use

## Performance Tips

1. **Limit results:** Keep the limit parameter reasonable (20-30 results)
2. **Cache results:** Results are cached client-side during the session
3. **Provider selection:** Disable slow providers if needed
4. **Network:** Ensure good internet connection for fast searches

## Next Steps

1. ✅ Backend running on port 3001
2. ✅ Frontend running on port 3000
3. ✅ Search for a movie/show
4. ✅ Select a torrent result
5. ✅ Click "Stream" to watch

Enjoy streaming! 🍿