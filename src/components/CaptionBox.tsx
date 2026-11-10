import React, { useState } from 'react';
import { generateCampaignCaption, ENACTUS_LINKEDIN_URL } from '../constants/campaignCaption';
import { Copy, Check, Share2, ExternalLink } from 'lucide-react';

interface CaptionBoxProps {
  committee: string;
}

const LinkedInIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

export const CaptionBox: React.FC<CaptionBoxProps> = ({ committee }) => {
  const [copied, setCopied] = useState(false);
  const caption = generateCampaignCaption(committee);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      return true;
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = caption;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      return true;
    }
  };

  const handleOpenLinkedIn = async () => {
    // Copy the text to clipboard so it's ready to paste if needed
    await copyToClipboard();

    // Open LinkedIn feed with the post composer active and caption pre-filled
    const linkedInIntentUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(caption)}`;
    window.open(linkedInIntentUrl, '_blank', 'noopener,noreferrer');
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
        Ready to share with your membership card on LinkedIn, Facebook, and Instagram:
      </p>

      <div className="caption-display-box">
        <pre className="caption-text">{caption}</pre>
      </div>

      <div className="caption-actions">
        <button
          type="button"
          className="btn-linkedin-post"
          onClick={handleOpenLinkedIn}
          title="Copies caption and opens LinkedIn to create a post"
        >
          <LinkedInIcon size={18} />
          <span>Post on LinkedIn</span>
        </button>

        <button
          type="button"
          className={`btn-copy-caption ${copied ? 'is-copied' : ''}`}
          onClick={copyToClipboard}
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

        <a
          href={ENACTUS_LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="caption-page-link"
          title="Visit Enactus Assiut LinkedIn page"
        >
          <ExternalLink size={13} />
          <span>Enactus Assiut Page</span>
        </a>
      </div>
    </div>
  );
};
