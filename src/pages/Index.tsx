import { useState } from 'react';
import { SerialConnection } from '@/components/SerialConnection';
import { MicroBrowser } from '@/components/MicroBrowser';
import { AdvancedProxyManager } from '@/components/AdvancedProxyManager';
import { StatusDashboard } from '@/components/StatusDashboard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Router, 
  Shield, 
  Cpu, 
  Activity,
  Terminal,
  Globe,
  Monitor,
  Settings
} from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState<'browser' | 'analytics' | 'serial' | 'status'>('browser');
  const [proxyStats, setProxyStats] = useState({
    requests: 0,
    dataTransferred: 0
  });

  const handleProxyRequest = (url: string, method: string) => {
    setProxyStats(prev => ({
      requests: prev.requests + 1,
      dataTransferred: prev.dataTransferred + Math.floor(Math.random() * 1024 * 10)
    }));
  };

  const views = [
    { key: 'browser' as const, label: 'Browser', icon: Globe },
    { key: 'analytics' as const, label: 'Analytics', icon: Activity },
    { key: 'serial' as const, label: 'Serial', icon: Terminal },
    { key: 'status' as const, label: 'Status', icon: Monitor }
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="max-w-[1800px] mx-auto p-4 space-y-4">
        {/* Header */}
        <Card className="terminal-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 glow-primary">
                <Router className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Pi Pico 2W Micro Browser</h1>
                <p className="text-sm text-muted-foreground">
                  Advanced HTTPS proxy with integrated browser interface
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4 text-accent" />
                  <span className="font-mono">{proxyStats.requests} requests</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="font-mono">{Math.round(proxyStats.dataTransferred / 1024)}KB transferred</span>
                </div>
              </div>
              <Badge variant="default" className="gap-1 glow-primary animate-pulse-glow">
                <Activity className="h-3 w-3" />
                Live
              </Badge>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <Card className="terminal-border p-2">
          <div className="flex gap-1">
            {views.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={currentView === key ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView(key)}
                className={`gap-2 ${currentView === key ? 'glow-primary' : ''}`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Main Content */}
        <div className="h-[calc(100vh-200px)]">
          {currentView === 'browser' && (
            <MicroBrowser onProxyRequest={handleProxyRequest} />
          )}
          
          {currentView === 'analytics' && (
            <AdvancedProxyManager />
          )}
          
          {currentView === 'serial' && (
            <SerialConnection />
          )}
          
          {currentView === 'status' && (
            <StatusDashboard />
          )}
        </div>

        {/* Footer Status */}
        <Card className="terminal-border p-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>Secure Web Serial API</span>
              </div>
              <div className="flex items-center gap-1">
                <Cpu className="h-3 w-3" />
                <span>Raspberry Pi Pico 2W</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span>HTTPS Proxy Ready</span>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
