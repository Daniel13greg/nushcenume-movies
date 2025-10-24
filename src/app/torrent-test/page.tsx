"use client";

import { useState } from 'react';
import { TorrentApiStatus } from '@/components/torrent-api-status';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Search, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const VideoPlayer = dynamic(() => import('@/components/video-player'), {
  ssr: false,
  loading: () => <div className="w-full aspect-video bg-muted animate-pulse" />,
});

/**
 * Torrent Integration Test Page
 * Use this page to test the torrent API integration
 */

interface TestMovie {
  tmdbId: number;
  title: string;
  type: 'movie' | 'show';
}

const TEST_MOVIES: TestMovie[] = [
  { tmdbId: 550, title: 'Fight Club', type: 'movie' },
  { tmdbId: 13, title: 'Forrest Gump', type: 'movie' },
  { tmdbId: 122, title: 'The Lord of the Rings: The Return of the King', type: 'movie' },
  { tmdbId: 278, title: 'The Shawshank Redemption', type: 'movie' },
  { tmdbId: 155, title: 'The Dark Knight', type: 'movie' },
];

export default function TorrentTestPage() {
  const [customTmdbId, setCustomTmdbId] = useState('');
  const [testResults, setTestResults] = useState<{ id: number; success: boolean; message: string }[]>([]);
  const [testing, setTesting] = useState(false);

  const testSingleMovie = async (tmdbId: number) => {
    const apiUrl = process.env.NEXT_PUBLIC_TORRENT_API_URL || 'http://localhost:3000';
    const apiKey = process.env.NEXT_PUBLIC_TORRENT_API_KEY || '2a452893104f67c7ec892d41fafd4265d3906e17657bd52664832d0f3df5f4c1';

    try {
      const response = await fetch(
        `${apiUrl}/api/search/${tmdbId}?apikey=${apiKey}&type=movie`,
        { cache: 'no-store' }
      );

      if (!response.ok) {
        return {
          id: tmdbId,
          success: false,
          message: `API returned status ${response.status}`,
        };
      }

      const data = await response.json();
      
      if (data.torrents && data.torrents.length > 0) {
        return {
          id: tmdbId,
          success: true,
          message: `Found ${data.torrents.length} torrent sources`,
        };
      } else {
        return {
          id: tmdbId,
          success: false,
          message: 'No torrent sources found',
        };
      }
    } catch (error) {
      return {
        id: tmdbId,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setTestResults([]);

    for (const movie of TEST_MOVIES) {
      const result = await testSingleMovie(movie.tmdbId);
      setTestResults(prev => [...prev, result]);
      // Wait a bit between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setTesting(false);
  };

  const testCustomMovie = async () => {
    if (!customTmdbId) return;

    setTesting(true);
    const result = await testSingleMovie(parseInt(customTmdbId));
    setTestResults([result]);
    setTesting(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Torrent API Integration Test</h1>
        <p className="text-muted-foreground">
          Test your local torrent API connection and streaming functionality
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* API Status Card */}
        <TorrentApiStatus />

        {/* Configuration Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configuration</CardTitle>
            <CardDescription>Current environment settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-1">API URL</p>
              <code className="text-xs bg-muted p-2 rounded block">
                {process.env.NEXT_PUBLIC_TORRENT_API_URL || 'http://localhost:3000'}
              </code>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">API Key</p>
              <code className="text-xs bg-muted p-2 rounded block truncate">
                {process.env.NEXT_PUBLIC_TORRENT_API_KEY?.substring(0, 20)}...
              </code>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Configure these values in your <code>.env.local</code> file
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Popular Movies */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Test Popular Movies</CardTitle>
              <CardDescription>
                Test torrent search with popular movies to verify API functionality
              </CardDescription>
            </div>
            <Button onClick={runAllTests} disabled={testing}>
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Run Tests
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {TEST_MOVIES.map((movie) => {
              const result = testResults.find(r => r.id === movie.tmdbId);
              
              return (
                <div
                  key={movie.tmdbId}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm font-medium">{movie.title}</span>
                    <Badge variant="outline" className="text-xs">
                      TMDB: {movie.tmdbId}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    {result && (
                      <Badge
                        variant={result.success ? 'default' : 'destructive'}
                        className={result.success ? 'bg-green-500' : ''}
                      >
                        {result.message}
                      </Badge>
                    )}
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4 mr-1" />
                          Play
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl p-0 border-0" showCloseButton={false}>
                        <DialogTitle className="sr-only">Play {movie.title}</DialogTitle>
                        <VideoPlayer
                          tmdbId={movie.tmdbId}
                          type={movie.type}
                          title={movie.title}
                          initialProviderId="torrent"
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom TMDB ID Test */}
      <Card>
        <CardHeader>
          <CardTitle>Test Custom TMDB ID</CardTitle>
          <CardDescription>
            Enter any TMDB movie ID to test torrent search
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter TMDB ID (e.g., 550)"
              value={customTmdbId}
              onChange={(e) => setCustomTmdbId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && testCustomMovie()}
            />
            <Button onClick={testCustomMovie} disabled={!customTmdbId || testing}>
              {testing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Test
                </>
              )}
            </Button>
          </div>

          {testResults.length > 0 && customTmdbId && (
            <div className="mt-4">
              {testResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-3 rounded-lg ${
                    result.success ? 'bg-green-500/10 border-green-500' : 'bg-destructive/10 border-destructive'
                  } border`}
                >
                  <p className="text-sm font-medium">
                    {result.success ? '✓ Success' : '✗ Failed'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{result.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documentation Link */}
      <div className="mt-8 p-6 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Need Help?</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Check the TORRENT_SETUP_GUIDE.md for detailed setup instructions and troubleshooting.
        </p>
        <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
          <li>Ensure your torrent API server is running on port 3000</li>
          <li>Check that .env.local is configured correctly</li>
          <li>Verify CORS settings on your API server</li>
          <li>Try restarting both servers if issues persist</li>
        </ul>
      </div>
    </div>
  );
}
