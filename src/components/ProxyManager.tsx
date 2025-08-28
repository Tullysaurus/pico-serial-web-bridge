import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  Globe, 
  Shield, 
  ShieldOff, 
  Activity, 
  Clock, 
  Filter,
  ArrowRight,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';

interface ProxyRequest {
  id: string;
  timestamp: Date;
  method: string;
  url: string;
  status: number;
  duration: number;
  intercepted: boolean;
}

export const ProxyManager = () => {
  const [proxyActive, setProxyActive] = useState(false);
  const [targetUrl, setTargetUrl] = useState('https://api.example.com');
  const [requests, setRequests] = useState<ProxyRequest[]>([]);
  const [filter, setFilter] = useState('');

  // Simulate proxy requests for demo
  useEffect(() => {
    if (!proxyActive) return;

    const interval = setInterval(() => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE'];
      const endpoints = ['/users', '/api/data', '/health', '/auth', '/proxy'];
      const statuses = [200, 201, 404, 500, 403];
      
      const newRequest: ProxyRequest = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        method: methods[Math.floor(Math.random() * methods.length)],
        url: targetUrl + endpoints[Math.floor(Math.random() * endpoints.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        duration: Math.floor(Math.random() * 1000) + 50,
        intercepted: Math.random() > 0.7
      };

      setRequests(prev => [newRequest, ...prev].slice(0, 100));
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [proxyActive, targetUrl]);

  const toggleProxy = () => {
    setProxyActive(!proxyActive);
    if (!proxyActive) {
      toast.success('HTTPS Proxy activated');
    } else {
      toast.info('HTTPS Proxy deactivated');
    }
  };

  const clearRequests = () => {
    setRequests([]);
    toast.info('Request log cleared');
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-success';
    if (status >= 400 && status < 500) return 'text-warning';
    if (status >= 500) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const filteredRequests = requests.filter(req => 
    req.url.toLowerCase().includes(filter.toLowerCase()) ||
    req.method.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Card className="terminal-border h-full flex flex-col">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">HTTPS Proxy</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={proxyActive ? "default" : "secondary"} className="gap-1">
            {proxyActive ? <Shield className="h-3 w-3" /> : <ShieldOff className="h-3 w-3" />}
            {proxyActive ? 'Active' : 'Inactive'}
          </Badge>
          <Button 
            variant={proxyActive ? "destructive" : "default"}
            size="sm" 
            onClick={toggleProxy}
            className={proxyActive ? "" : "glow-primary"}
          >
            {proxyActive ? 'Stop' : 'Start'} Proxy
          </Button>
        </div>
      </div>

      <Separator />

      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Target URL"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="flex-1 font-mono text-sm"
          />
          <Button variant="outline" size="sm">
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Filter requests..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="sm" onClick={clearRequests}>
            Clear
          </Button>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between p-4 py-2">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            {filteredRequests.length} requests
          </div>
          <div className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            {filteredRequests.filter(r => r.intercepted).length} intercepted
          </div>
        </div>
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border-l-2 border-l-transparent hover:border-l-primary group"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Badge variant="outline" className="text-xs font-mono">
                  {request.method}
                </Badge>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-mono truncate">{request.url}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {request.timestamp.toLocaleTimeString()}
                    <span>{request.duration}ms</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {request.intercepted && (
                  <Badge variant="secondary" className="text-xs glow-accent">
                    <ArrowRight className="h-3 w-3 mr-1" />
                    Proxied
                  </Badge>
                )}
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
              {proxyActive ? 'Waiting for requests...' : 'Start the proxy to see requests'}
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};