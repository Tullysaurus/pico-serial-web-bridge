import { useState, useEffect, useRef } from 'react';
import '@/types/web-serial.d.ts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Wifi, WifiOff, Activity, Terminal } from 'lucide-react';
import { toast } from 'sonner';

interface SerialMessage {
  timestamp: Date;
  data: string;
  type: 'sent' | 'received';
}

export const SerialConnection = () => {
  const [port, setPort] = useState<SerialPort | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<SerialMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectSerial = async () => {
    try {
      if (!('serial' in navigator)) {
        toast.error('Web Serial API not supported in this browser');
        return;
      }

      const selectedPort = await (navigator as any).serial.requestPort();
      await selectedPort.open({ baudRate: 115200 });
      
      setPort(selectedPort);
      setConnected(true);
      toast.success('Connected to Raspberry Pi Pico 2W');

      // Start reading data
      const decoder = new TextDecoder();
      const reader = selectedPort.readable.getReader();
      readerRef.current = reader;

      const readLoop = async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            const text = decoder.decode(value);
            setMessages(prev => [...prev, {
              timestamp: new Date(),
              data: text.trim(),
              type: 'received'
            }]);
          }
        } catch (error) {
          console.error('Reading error:', error);
        }
      };

      readLoop();
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect to device');
    }
  };

  const disconnect = async () => {
    if (readerRef.current) {
      await readerRef.current.cancel();
      readerRef.current = null;
    }
    
    if (port) {
      await port.close();
      setPort(null);
      setConnected(false);
      toast.info('Disconnected from device');
    }
  };

  const sendMessage = async () => {
    if (!port || !inputValue.trim()) return;

    try {
      const writer = port.writable.getWriter();
      const encoder = new TextEncoder();
      await writer.write(encoder.encode(inputValue + '\n'));
      writer.releaseLock();

      setMessages(prev => [...prev, {
        timestamp: new Date(),
        data: inputValue,
        type: 'sent'
      }]);
      setInputValue('');
    } catch (error) {
      console.error('Send error:', error);
      toast.error('Failed to send message');
    }
  };

  return (
    <Card className="terminal-border h-full flex flex-col">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Serial Connection</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={connected ? "default" : "secondary"} className="gap-1">
            {connected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {connected ? 'Connected' : 'Disconnected'}
          </Badge>
          {connected ? (
            <Button variant="outline" size="sm" onClick={disconnect}>
              Disconnect
            </Button>
          ) : (
            <Button size="sm" onClick={connectSerial} className="glow-primary">
              Connect
            </Button>
          )}
        </div>
      </div>

      <Separator />

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-2 text-sm ${
                msg.type === 'sent' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  msg.type === 'sent'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <div className="text-xs opacity-70 mb-1">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
                <div className="font-mono break-all">{msg.data}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <Separator />

      <div className="p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Send command to Pico..."
            className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={!connected}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!connected || !inputValue.trim()}
            size="sm"
          >
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
};