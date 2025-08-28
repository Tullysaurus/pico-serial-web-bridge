import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  Clock, 
  Filter,
  ArrowRight,
  ExternalLink,
  Globe,
  Shield,
  Database,
  Zap
} from 'lucide-react';

interface ProxyRequest {
  id: string;
  timestamp: Date;
  method: string;
  url: string;
  status: number;
  duration: number;
  bytes: number;
  userAgent?: string;
  fromTab?: string;
}

interface AdvancedProxyManagerProps {
  onRequestReceived?: (request: ProxyRequest) => void;
}

export const AdvancedProxyManager = ({ onRequestReceived }: AdvancedProxyManagerProps) => {
  const [requests, setRequests] = useState<ProxyRequest[]>([]);
  const [proxyActive, setProxyActive] = useState(true);
  const [filter, setFilter] = useState<'all' | 'html' | 'api' | 'assets'>('all');
  const [stats, setStats] = useState({
    totalRequests: 0,
    totalBytes: 0,
    avgResponseTime: 0,
    activeConnections: 0
  });

  // Simulate receiving proxy requests
  useEffect(() => {
    if (!proxyActive) return;

    const interval = setInterval(() => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      const domains = ['example.com', 'api.github.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com'];
      const paths = [
        '/', '/api/users', '/static/css/main.css', '/api/data',
        '/images/logo.png', '/js/app.bundle.js', '/fonts/roboto.woff2'
      ];
      
      const newRequest: ProxyRequest = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        method: methods[Math.floor(Math.random() * methods.length)],
        url: `https://${domains[Math.floor(Math.random() * domains.length)]}${paths[Math.floor(Math.random() * paths.length)]}`,
        status: Math.random() > 0.1 ? 200 : Math.random() > 0.5 ? 404 : 500,
        duration: Math.floor(Math.random() * 2000) + 10,
        bytes: Math.floor(Math.random() * 1024 * 50) + 1024,
        userAgent: 'MicroBrowser/1.0',
        fromTab: 'Tab ' + Math.ceil(Math.random() * 3)
      };

      setRequests(prev => [newRequest, ...prev].slice(0, 200));
      onRequestReceived?.(newRequest);

      // Update stats
      setStats(prev => ({
        totalRequests: prev.totalRequests + 1,
        totalBytes: prev.totalBytes + newRequest.bytes,
        avgResponseTime: Math.round((prev.avgResponseTime + newRequest.duration) / 2),
        activeConnections: Math.floor(Math.random() * 8) + 2
      }));
    }, 1500 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [proxyActive, onRequestReceived]);

  const getRequestTypeIcon = (url: string, method: string) => {
    if (url.includes('/api/')) return <Database className="h-3 w-3" />;
    if (url.includes('.css') || url.includes('.js') || url.includes('.woff')) return <Zap className="h-3 w-3" />;
    if (method === 'GET' && url === '/') return <Globe className="h-3 w-3" />;
    return <ExternalLink className="h-3 w-3" />;
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-success border-success';
    if (status >= 300 && status < 400) return 'text-info border-info';
    if (status >= 400 && status < 500) return 'text-warning border-warning';
    if (status >= 500) return 'text-destructive border-destructive';
    return 'text-muted-foreground border-muted';
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + 'KB';
    return Math.round(bytes / (1024 * 1024)) + 'MB';
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'html') return req.method === 'GET' && !req.url.includes('/api/') && !req.url.includes('.');
    if (filter === 'api') return req.url.includes('/api/');
    if (filter === 'assets') return req.url.includes('.css') || req.url.includes('.js') || req.url.includes('.png') || req.url.includes('.woff');
    return true;
  });

  return (
    <Card className="terminal-border h-full flex flex-col">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Proxy Analytics</h2>
        </div>
        <Badge variant={proxyActive ? "default" : "secondary"} className="gap-1 glow-primary">
          <Shield className="h-3 w-3" />
          {proxyActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <Separator />

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-primary">{stats.totalRequests}</div>
          <div className="text-xs text-muted-foreground">Total Requests</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-accent">{formatBytes(stats.totalBytes)}</div>
          <div className="text-xs text-muted-foreground">Data Transferred</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-info">{stats.avgResponseTime}ms</div>
          <div className="text-xs text-muted-foreground">Avg Response</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-warning">{stats.activeConnections}</div>
          <div className="text-xs text-muted-foreground">Active Connections</div>
        </div>
      </div>

      <Separator />

      {/* Filter Buttons */}
      <div className="flex gap-2 p-4">
        {[
          { key: 'all' as const, label: 'All', count: requests.length },
          { key: 'html' as const, label: 'Pages', count: requests.filter(r => r.method === 'GET' && !r.url.includes('/api/') && !r.url.includes('.')).length },
          { key: 'api' as const, label: 'API', count: requests.filter(r => r.url.includes('/api/')).length },
          { key: 'assets' as const, label: 'Assets', count: requests.filter(r => r.url.includes('.css') || r.url.includes('.js') || r.url.includes('.png')).length }
        ].map(({ key, label, count }) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(key)}
            className="text-xs"
          >
            {label} ({count})
          </Button>
        ))}
      </div>

      <Separator />

      {/* Request List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors group"
            >
              <div className="flex items-center gap-2">
                {getRequestTypeIcon(request.url, request.method)}
                <Badge variant="outline" className="text-xs font-mono min-w-[50px] justify-center">
                  {request.method}
                </Badge>
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-sm font-mono truncate">{request.url}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {request.timestamp.toLocaleTimeString()}
                  </span>
                  <span>{request.duration}ms</span>
                  <span>{formatBytes(request.bytes)}</span>
                  {request.fromTab && <span>from {request.fromTab}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3 text-primary opacity-60" />
                <Badge 
                  variant="outline" 
                  className={`text-xs font-mono ${getStatusColor(request.status)}`}
                >
                  {request.status}
                </Badge>
              </div>
            </div>
          ))}
          
          {filteredRequests.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No requests match the current filter</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};