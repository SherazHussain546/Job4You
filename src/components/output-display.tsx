'use client';

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Copy, Download, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';

interface OutputDisplayProps {
  title: string;
  content: string;
  language: string;
  downloadFilename: string;
  downloadExtension: string;
  enablePrint?: boolean;
}

export default function OutputDisplay({
  title,
  content,
  language,
  downloadFilename,
  enablePrint = false,
}: OutputDisplayProps) {
  const { toast } = useToast();
  const printableRef = useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({ title: 'Copied to clipboard!' });
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handlePrint = () => {
    if (!printableRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({ title: "Could not open print window", description: "Please disable your pop-up blocker.", variant: "destructive" });
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap');
            body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; }
            h1, h2, h3, h4, h5, h6 { font-family: 'Space Grotesk', sans-serif; }
            pre { white-space: pre-wrap; word-wrap: break-word; font-family: monospace; }
          </style>
        </head>
        <body>
          ${printableRef.current.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <div className="flex items-center gap-2">
          {enablePrint && (
             <Button variant="ghost" size="icon" onClick={handlePrint}><Printer className="h-4 w-4" /></Button>
          )}
          <Button variant="ghost" size="icon" onClick={handleCopy}><Copy className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={handleDownload}><Download className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 rounded-md border bg-secondary/50">
          <pre className="p-4 text-sm" ref={printableRef}>
            <code className={`language-${language}`}>{content}</code>
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
