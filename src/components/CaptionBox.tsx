import React, { useState } from 'react';
import { generateCampaignCaption } from '../constants/campaignCaption';
import { Copy, Check, Share2 } from 'lucide-react';

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
          <Share2 size={16} className="inline-icon" />
          <span>Social Media Caption</span>
        </label>
      </div>

      <p className="caption-instruction">
        Ready to share with your card on LinkedIn, Facebook, and Instagram:
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
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={18} />
              <span>Copy Caption</span>
            </>
          )}
        </button>
        <div className="caption-tags-hint">
          <Share2 size={13} />
          <span>Includes your committee hashtags</span>
        </div>
      </div>
    </div>
  );
};

