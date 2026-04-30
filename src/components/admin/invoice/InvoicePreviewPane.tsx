'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { generateItineraryInvoiceHTML } from '@/lib/templates/invoice-html-generator';
import type { ItineraryInvoiceData } from '@/lib/templates/invoice-html-generator';
import { ExternalLink, Download, Printer, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InvoicePreviewPaneProps {
  data: ItineraryInvoiceData;
}

export function InvoicePreviewPane({ data }: InvoicePreviewPaneProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [html, setHtml] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate HTML when data changes
  useEffect(() => {
    const generateHTML = async () => {
      const generatedHtml = await generateItineraryInvoiceHTML(data);
      setHtml(generatedHtml);
    };
    generateHTML();
  }, [data]);

  // Update iframe content when HTML changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentDocument) {
      const doc = iframe.contentDocument;
      doc.open();
      doc.write(html);
      doc.close();
    }
  }, [html]);

  /**
   * Open invoice in new browser tab
   * Creates a blob URL and opens it in a new window
   */
  const handleOpenInNewTab = () => {
    setIsLoading(true);
    try {
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');

      // Clean up the blob URL after a short delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to open preview:', error);
      setIsLoading(false);
    }
  };

  /**
   * Download invoice as HTML file
   */
  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.invoice_number.replace(/\//g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Print invoice
   */
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 250);
      };
    }
  };

  return (
    <div className="flex flex-col h-full bg-muted/30">
      {/* Sticky Header with Actions */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-md border-b border-border px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="text-sm font-medium text-foreground truncate">
              Preview
            </h3>
            <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 bg-green-500/10 dark:bg-green-500/20 rounded-full flex-shrink-0">
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[9px] text-green-700 dark:text-green-400 font-medium uppercase tracking-wide">Live</span>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="gap-1 h-7 px-2 text-[10px] font-medium"
              title="Print"
            >
              <Printer className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownload}
              className="gap-1 h-7 px-2 text-[10px] font-medium"
              title="Download"
            >
              <Download className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              onClick={handleOpenInNewTab}
              disabled={isLoading}
              className="gap-1 h-7 px-2 text-[10px] font-medium bg-amber-600 hover:bg-amber-700 text-white"
              title="Open in New Tab"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <ExternalLink className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Preview Area */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {/* Mobile-only live indicator */}
          <div className="lg:hidden flex items-center justify-center gap-1 px-2 py-1 bg-green-500/10 dark:bg-green-500/20 rounded-full">
            <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[9px] text-green-700 dark:text-green-400 font-medium uppercase">Live</span>
          </div>

          {/* Invoice Summary */}
          <div className="bg-card rounded-lg border border-border shadow-sm p-2">
            <h4 className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Summary
            </h4>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="text-xs font-medium text-foreground tabular-nums">
                  {data.currency_symbol}{data.total_amount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Advance</span>
                <span className="text-xs font-medium text-foreground tabular-nums">
                  {data.currency_symbol}{data.advance_payment.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-border">
                <span className="text-xs font-medium text-foreground">Balance</span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                  {data.currency_symbol}{(data.balance_due || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* A4 Preview Container */}
          <div className="bg-muted rounded-md p-1.5 flex items-start justify-center">
            <div
              ref={containerRef}
              className="relative bg-card shadow-lg rounded-sm overflow-hidden border border-border w-full"
              style={{
                aspectRatio: '210 / 297',
              }}
            >
              <iframe
                ref={iframeRef}
                title="Invoice Preview"
                className="w-full h-full border-0"
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          </div>

          {/* Page Size Info */}
          <div className="text-center">
            <p className="text-[9px] text-muted-foreground">
              A4 (210×297mm) • Updates as you type
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
