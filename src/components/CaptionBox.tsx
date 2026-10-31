import React, { useState } from 'react';
import { generateCampaignCaption } from '../constants/campaignCaption';
import { Copy, Check, MessageSquareText, Share2 } from 'lucide-react';

interface CaptionBoxProps {
  committee: string;
}

export const CaptionBox: React.FC<CaptionBoxProps> = ({ committee }) => {
  const [copied, setCopied] = useState(false);
  const caption = generateCampaignCaption(committee);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API is restricted
      const textarea = document.createElement('textarea');
      textarea.value = caption;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="control-section caption-section">
      <div className="section-header">
        <label className="section-label">
          <MessageSquareText size={18} className="section-icon" />
          <span>Official Campaign Caption</span>
        </label>
        <span className="fixed-design-badge">Auto-Synced</span>
      </div>

      <p className="caption-instruction">
        This campaign announcement text is standardized for all members. Your assigned committee is automatically inserted below.
      </p>

      <div className="caption-display-box">
        <pre className="caption-text">{caption}</pre>
      </div>

      <div className="caption-actions">
        <button
          type="button"
          className={`btn-copy-caption ${copied ? 'is-copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check size={18} />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy size={18} />
              <span>Copy Campaign Caption</span>
            </>
          )}
        </button>
        <div className="caption-tags-hint">
          <Share2 size={13} />
          <span>Ready for LinkedIn, Facebook & Instagram</span>
        </div>
      </div>
    </div>
  );
};

