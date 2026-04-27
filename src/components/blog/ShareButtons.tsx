'use client';

import { MessageCircle, Link2, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ backgroundColor: 'rgba(0, 104, 56, 0.08)' }}
        title="Share on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" style={{ color: '#25D366' }} />
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ backgroundColor: 'rgba(0, 104, 56, 0.08)' }}
        title="Share on Facebook"
      >
        <span className="text-sm font-bold" style={{ color: '#1877F2', fontFamily: 'serif' }}>f</span>
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
        style={{ backgroundColor: 'rgba(0, 104, 56, 0.08)' }}
        title="Copy link"
      >
        {copied ? (
          <Check className="w-4 h-4" style={{ color: '#006838' }} />
        ) : (
          <Link2 className="w-4 h-4" style={{ color: '#006838' }} />
        )}
      </button>
    </div>
  );
}
