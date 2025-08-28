import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Home, 
  Plus, 
  X, 
  Globe,
  Lock,
  Shield,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface Tab {
  id: string;
  title: string;
  url: string;
  content: string;
  loading: boolean;
  secure: boolean;
  favicon?: string;
}

interface BrowserProps {
  onProxyRequest?: (url: string, method: string) => void;
}

export const MicroBrowser = ({ onProxyRequest }: BrowserProps) => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      title: 'New Tab',
      url: '',
      content: '',
      loading: false,
      secure: false
    }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [addressBar, setAddressBar] = useState('');
  const contentRef = useRef<HTMLIFrameElement>(null);

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  useEffect(() => {
    if (activeTab) {
      setAddressBar(activeTab.url);
    }
  }, [activeTabId, activeTab]);

  const createNewTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: '',
      content: '',
      loading: false,
      secure: false
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) {
      createNewTab();
    }
    
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
    
    if (activeTabId === tabId) {
      const remainingTabs = tabs.filter(tab => tab.id !== tabId);
      if (remainingTabs.length > 0) {
        setActiveTabId(remainingTabs[remainingTabs.length - 1].id);
      }
    }
  };

  const navigateToUrl = async (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, loading: true, url }
        : tab
    ));

    onProxyRequest?.(url, 'GET');

    try {
      // Simulate fetching content through proxy
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Simulate receiving HTML content
      const mockContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${new URL(url).hostname}</title>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
              }
              .container {
                max-width: 800px;
                margin: 0 auto;
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 40px;
                text-align: center;
              }
              h1 { font-size: 2.5rem; margin-bottom: 20px; }
              p { font-size: 1.2rem; line-height: 1.6; opacity: 0.9; }
              .badge { 
                display: inline-block;
                background: rgba(255,255,255,0.2);
                padding: 8px 16px;
                border-radius: 20px;
                margin: 10px;
                font-size: 0.9rem;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🌐 Proxied Content</h1>
              <p>This page was loaded through your Raspberry Pi Pico 2W HTTPS proxy!</p>
              <p><strong>Domain:</strong> ${new URL(url).hostname}</p>
              <p><strong>Protocol:</strong> ${new URL(url).protocol}</p>
              <div class="badge">✅ Secure Connection</div>
              <div class="badge">🚀 Proxy Active</div>
              <div class="badge">🔒 Encrypted</div>
            </div>
          </body>
        </html>
      `;

      setTabs(prev => prev.map(tab => 
        tab.id === activeTabId 
          ? { 
              ...tab, 
              loading: false, 
              content: mockContent,
              title: new URL(url).hostname,
              secure: url.startsWith('https://')
            }
          : tab
      ));

      toast.success(`Loaded ${new URL(url).hostname} via proxy`);
    } catch (error) {
      setTabs(prev => prev.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, loading: false }
          : tab
      ));
      toast.error('Failed to load page');
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addressBar.trim()) {
      navigateToUrl(addressBar.trim());
    }
  };

  const reloadPage = () => {
    if (activeTab?.url) {
      navigateToUrl(activeTab.url);
    }
  };

  const goHome = () => {
    setAddressBar('example.com');
    navigateToUrl('https://example.com');
  };

  return (
    <Card className="terminal-border h-full flex flex-col bg-card/50 backdrop-blur-sm">
      {/* Tab Bar */}
      <div className="flex items-center border-b border-border p-2 gap-2">
        <div className="flex-1 flex items-center gap-1 overflow-hidden">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg min-w-0 max-w-48 cursor-pointer transition-all ${
                tab.id === activeTabId
                  ? 'bg-primary/20 border border-primary/30'
                  : 'bg-muted/50 hover:bg-muted/70'
              }`}
              onClick={() => setActiveTabId(tab.id)}
            >
              <div className="flex items-center gap-1 min-w-0 flex-1">
                {tab.loading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : tab.secure ? (
                  <Lock className="h-3 w-3 text-success" />
                ) : (
                  <Globe className="h-3 w-3 text-muted-foreground" />
                )}
                <span className="text-xs truncate">{tab.title}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive/20"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={createNewTab}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center gap-2 p-3 border-b border-border">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={reloadPage}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={goHome}>
            <Home className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleAddressSubmit} className="flex-1 flex items-center gap-2">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {activeTab?.secure ? (
                <Lock className="h-4 w-4 text-success" />
              ) : (
                <Globe className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <Input
              value={addressBar}
              onChange={(e) => setAddressBar(e.target.value)}
              placeholder="Enter URL or search..."
              className="pl-10 font-mono text-sm"
            />
          </div>
          <Button type="submit" size="sm" disabled={activeTab?.loading}>
            {activeTab?.loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Go'
            )}
          </Button>
        </form>

        <Badge variant={activeTab?.secure ? "default" : "secondary"} className="gap-1">
          <Shield className="h-3 w-3" />
          {activeTab?.secure ? 'Secure' : 'HTTP'}
        </Badge>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-background">
        {activeTab?.content ? (
          <iframe
            ref={contentRef}
            srcDoc={activeTab.content}
            className="w-full h-full border-0"
            title={activeTab.title}
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <div className="space-y-4">
              <Globe className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Ready to Browse</h3>
                <p className="text-muted-foreground">
                  Enter a URL to start browsing through your Pi Pico 2W proxy
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};