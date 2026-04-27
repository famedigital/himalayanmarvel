'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Phone, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function WhatsAppConcierge() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showMobileBar, setShowMobileBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowMobileBar(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50 hidden md:block">
        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: showTooltip ? 1 : 0, y: showTooltip ? 0 : 4 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-full right-0 mb-3 px-4 py-2 rounded-xl whitespace-nowrap pointer-events-none"
          style={{
            backgroundColor: 'rgba(247, 247, 242, 0.95)',
            color: '#1A1A1A',
            fontSize: '0.7rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            border: '1px solid rgba(212, 175, 55, 0.12)',
          }}
        >
          Chat with Local Expert
        </motion.div>

        {/* Pulse Ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: '2px solid rgba(0, 104, 56, 0.3)' }}
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />

        {/* Button */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2, type: 'spring', stiffness: 200, damping: 15 }}
          whileHover={{ scale: 1.08, boxShadow: '0 8px 32px rgba(0, 104, 56, 0.35)' }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setShowTooltip(true)}
          onHoverEnd={() => setShowTooltip(false)}
          onClick={() => window.open('https://wa.me/97577270465', '_blank')}
          className="relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            backgroundColor: '#006838',
            boxShadow: '0 4px 20px rgba(0, 104, 56, 0.25)',
          }}
          aria-label="Chat with us on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </motion.button>
      </div>

      {/* Mobile Sticky CTA Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: showMobileBar ? 0 : 100 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          backgroundColor: 'rgba(14, 20, 14, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(212, 175, 55, 0.1)',
        }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          {/* WhatsApp Button */}
          <a
            href="https://wa.me/97577270465"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-xs font-semibold tracking-wide"
            style={{
              backgroundColor: '#006838',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <MessageCircle className="w-4 h-4" />
            Local Expert
          </a>

          {/* Inquire Button */}
          <a
            href="tel:+97577270465"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              color: '#D4AF37',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Phone className="w-4 h-4" />
            Call Us
          </a>

          {/* Inquire CTA */}
          <a
            href="#contact"
            className="flex items-center gap-1 px-4 py-2.5 rounded-full text-white text-xs font-semibold tracking-wide"
            style={{
              background: 'linear-gradient(135deg, #006838, #004D29)',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            Inquire
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </motion.div>
    </>
  );
}
