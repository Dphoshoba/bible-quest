import React, { useState } from 'react';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

const APP_URL = window.location.origin;

function ShareButton({ message = "Check out my progress on Bible Quest!", url = APP_URL, style = {} }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setError("");
    setIsSharing(true);
    
    try {
      const isNative = Capacitor.isNativePlatform();
      console.log('Platform:', isNative ? 'Native' : 'Web');
      
      if (isNative) {
        // Native platform sharing (Android/iOS)
        try {
          await Share.share({
            title: 'Bible Quest',
            text: message,
            url: url,
            dialogTitle: 'Share Bible Quest'
          });
        } catch (shareError) {
          console.error('Native share error:', shareError);
          // Fallback to copy if sharing fails
          await handleCopy();
        }
      } else {
        // Web sharing
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Bible Quest',
              text: message,
              url: url
            });
          } catch (webShareError) {
            console.error('Web share error:', webShareError);
            // Fallback to copy if sharing fails
            await handleCopy();
          }
        } else {
          // If Web Share API is not available, just copy
          await handleCopy();
        }
      }
    } catch (err) {
      console.error('Share error:', err);
      setError("Failed to share. Copying to clipboard instead.");
      await handleCopy();
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopy = async () => {
    setError("");
    try {
      const text = `${message} ${url}`;
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Legacy fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          throw new Error('Copy failed');
        }
      }
    } catch (err) {
      console.error('Copy error:', err);
      setError("Copy to clipboard failed. Please copy manually.");
    }
  };

  return (
    <div style={{ display: 'inline-block', ...style }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button 
          onClick={handleShare}
          disabled={isSharing}
          style={{ 
            background: '#03a9f4', 
            color: 'white', 
            border: 'none', 
            borderRadius: 6, 
            padding: '8px 16px', 
            fontSize: 15, 
            cursor: isSharing ? 'not-allowed' : 'pointer',
            opacity: isSharing ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {isSharing ? 'Sharing...' : '📤 Share'}
        </button>
        <button 
          onClick={handleCopy}
          style={{ 
            background: '#4caf50', 
            color: 'white', 
            border: 'none', 
            borderRadius: 6, 
            padding: '8px 16px', 
            fontSize: 15, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          📋 Copy
        </button>
        {copied && <span style={{ color: '#4caf50', fontWeight: 500 }}>Copied!</span>}
        {error && <span style={{ color: 'red', fontWeight: 500 }}>{error}</span>}
      </div>
    </div>
  );
}

// Facebook Share Button (Web only)
export function FacebookShareButton({ url = APP_URL, message = "Check out my progress on Bible Quest!" }) {
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`;
  return (
    <a
      href={fbShareUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        background: '#4267B2',
        color: 'white',
        border: 'none',
        borderRadius: 6,
        padding: '8px 16px',
        fontSize: 15,
        textDecoration: 'none',
        marginLeft: 8,
        display: 'inline-block',
        fontWeight: 500
      }}
    >
      📘 Share on Facebook
    </a>
  );
}

export default ShareButton; 