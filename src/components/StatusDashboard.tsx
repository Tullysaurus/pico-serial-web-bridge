import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, 
  HardDrive, 
  Wifi, 
  Battery, 
  Thermometer,
  Activity,
  Clock
} from 'lucide-react';

interface SystemMetric {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
  icon: React.ReactNode;
}

export const StatusDashboard = () => {
  const metrics: SystemMetric[] = [
    {
      label: 'CPU Usage',
      value: '23%',
      status: 'good',
      icon: <Cpu className="h-4 w-4" />
    },
    {
      label: 'Memory',
      value: '45MB/264MB',
      status: 'good',
      icon: <HardDrive className="h-4 w-4" />
    },
    {
      label: 'WiFi Signal',
      value: '-67 dBm',
      status: 'good',
      icon: <Wifi className="h-4 w-4" />
    },
    {
      label: 'Temperature',
      value: '42°C',
      status: 'warning',
      icon: <Thermometer className="h-4 w-4" />
    },
    {
      label: 'Uptime',
      value: '2h 34m',
      status: 'good',
      icon: <Clock className="h-4 w-4" />
    },
    {
      label: 'Power',
      value: 'USB 5V',
      status: 'good',
      icon: <Battery className="h-4 w-4" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'border-success bg-success/10 text-success';
      case 'warning': return 'border-warning bg-warning/10 text-warning';
      case 'critical': return 'border-destructive bg-destructive/10 text-destructive';
      default: return 'border-muted bg-muted/10 text-muted-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="terminal-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-primary">{metric.icon}</div>
              <div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
                <div className="font-mono font-semibold">{metric.value}</div>
              </div>
            </div>
            <Badge className={getStatusColor(metric.status)}>
              {metric.status}
            </Badge>
          </div>
        </Card>
      ))}
      
      <Card className="terminal-border p-4 md:col-span-2 lg:col-span-3">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Network Activity</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Requests/min</div>
            <div className="font-mono font-semibold text-lg">127</div>
          </div>
          <div>
            <div className="text-muted-foreground">Data In</div>
            <div className="font-mono font-semibold text-lg">2.3MB</div>
          </div>
          <div>
            <div className="text-muted-foreground">Data Out</div>
            <div className="font-mono font-semibold text-lg">1.8MB</div>
          </div>
          <div>
            <div className="text-muted-foreground">Avg Latency</div>
            <div className="font-mono font-semibold text-lg">45ms</div>
          </div>
        </div>
      </Card>
    </div>
  );
};