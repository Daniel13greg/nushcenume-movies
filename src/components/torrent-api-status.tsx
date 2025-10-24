"use client";

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2, RefreshCw, Download } from 'lucide-react';

/**
 * Torrent API Status Component
 * Displays the connection status of the local torrent API
 */

interface ApiStatus {
  connected: boolean;
  loading: boolean;
  error: string | null;
  apiUrl: string;
  lastChecked: Date | null;
}

export function TorrentApiStatus() {
  const [status, setStatus] = useState<ApiStatus>({
    connected: false,
    loading: true,
    error: null,
    apiUrl: process.env.NEXT_PUBLIC_TORRENT_API_URL || 'http://localhost:3000',
    lastChecked: null,
  });

  const checkApiHealth = async () => {
    setStatus(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await fetch(`${status.apiUrl}/api/ping`, {
        method: 'GET',
        cache: 'no-store',
      });

      if (response.ok) {
        setStatus(prev => ({
          ...prev,
          connected: true,
          loading: false,
          error: null,
          lastChecked: new Date(),
        }));
      } else {
        throw new Error(`API returned status ${response.status}`);
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        connected: false,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to connect',
        lastChecked: new Date(),
      }));
    }
  };

  useEffect(() => {
    checkApiHealth();
    
    // Check every 30 seconds
    const interval = setInterval(checkApiHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            <CardTitle className="text-lg">Torrent API Status</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={checkApiHealth}
            disabled={status.loading}
          >
            <RefreshCw className={`h-4 w-4 ${status.loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>{status.apiUrl}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Connection Status</span>
          {status.loading ? (
            <Badge variant="secondary">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Checking...
            </Badge>
          ) : status.connected ? (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="destructive">
              <XCircle className="h-3 w-3 mr-1" />
              Disconnected
            </Badge>
          )}
        </div>

        {status.error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            <strong>Error:</strong> {status.error}
          </div>
        )}

        {status.lastChecked && (
          <div className="text-xs text-muted-foreground">
            Last checked: {status.lastChecked.toLocaleTimeString()}
          </div>
        )}

        {!status.connected && !status.loading && (
          <div className="text-sm space-y-2 pt-2 border-t">
            <p className="font-medium">Troubleshooting:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Ensure your torrent API is running</li>
              <li>Check if it&apos;s on port 3000</li>
              <li>Verify CORS settings</li>
              <li>Check your .env.local configuration</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}