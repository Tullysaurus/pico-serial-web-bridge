import { SerialConnection } from '@/components/SerialConnection';
import { ProxyManager } from '@/components/ProxyManager';
import { StatusDashboard } from '@/components/StatusDashboard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Router, 
  Shield, 
  Cpu, 
  Activity,
  Terminal
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-bg p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="terminal-border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 glow-primary">
                <Router className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Pi Pico 2W Proxy Controller</h1>
                <p className="text-muted-foreground">
                  Serial communication & HTTPS proxy management dashboard
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="gap-1">
                <Terminal className="h-3 w-3" />
                CircuitPython
              </Badge>
              <Badge variant="default" className="gap-1 glow-primary">
                <Activity className="h-3 w-3" />
                Live
              </Badge>
            </div>
          </div>
        </Card>

        {/* Status Dashboard */}
        <StatusDashboard />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Serial Connection */}
          <div className="h-[600px]">
            <SerialConnection />
          </div>

          {/* Proxy Manager */}
          <div className="h-[600px]">
            <ProxyManager />
          </div>
        </div>

        {/* Footer */}
        <Card className="terminal-border p-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secure Web Serial API Connection</span>
            <span>•</span>
            <Cpu className="h-4 w-4" />
            <span>Raspberry Pi Pico 2W</span>
            <span>•</span>
            <span>HTTPS Proxy Ready</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
