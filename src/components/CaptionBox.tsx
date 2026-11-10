import React, { useState } from 'react';
import { generateCampaignCaption } from '../constants/campaignCaption';
import { Copy, Check, Share2, Image as ImageIcon } from 'lucide-react';

interface CaptionBoxProps {
  committee: string;
  onGetCardBlob?: () => Promise<{ blob: Blob; filename: string }>;
  onOpenShareModal?: () => void;
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

export const CaptionBox: React.FC<CaptionBoxProps> = ({
  committee,
  onGetCardBlob,
  onOpenShareModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  const caption = generateCampaignCaption(committee);

  const copyToClipboard = async (): Promise<boolean> => {
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

  const handlePostOnLinkedIn = async () => {
    setIsSharing(true);
    setShareNotice(null);

    try {
      let cardBlob: Blob | null = null;
      let cardFilename = 'Enactus_MembershipCard.png';

      if (onGetCardBlob) {
        const result = await onGetCardBlob();
        cardBlob = result.blob;
        cardFilename = result.filename;
      }

      // Check if native Web Share API supports file sharing (mobile / supported browsers)
      if (cardBlob && typeof navigator.share === 'function') {
        const file = new File([cardBlob], cardFilename, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'Enactus Assiut Membership Card',
              text: caption,
              files: [file],
            });
            setIsSharing(false);
            return;
          } catch (err) {
            // If user aborted/dismissed the share sheet, stop cleanly
            if ((err as Error)?.name === 'AbortError') {
              setIsSharing(false);
              return;
            }
            // Otherwise, fall through to browser desktop sharing method
          }
        }
      }

      // Desktop / Browser Fallback Flow:
      // 1. Auto-download the card image so the user has the PNG ready to attach
      if (cardBlob) {
        const downloadUrl = URL.createObjectURL(cardBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = cardFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      }

      // 2. Copy the caption text to clipboard
      await copyToClipboard();

      // 3. Open LinkedIn's feed with post composer
      const linkedInIntentUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(caption)}`;
      window.open(linkedInIntentUrl, '_blank', 'noopener,noreferrer');

      // 4. Show friendly guidance notice
      setShareNotice(
        'Card image downloaded & caption copied! On LinkedIn, paste the caption and attach your downloaded card photo.'
      );
      setTimeout(() => setShareNotice(null), 8000);
    } catch (err) {
      console.error('LinkedIn share error:', err);
      // Fallback: at least open LinkedIn with caption
      await copyToClipboard();
      window.open(
        `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(caption)}`,
        '_blank',
        'noopener,noreferrer'
      );
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="control-section caption-section">
      <div className="section-header">
        <label className="section-label">
          <Share2 size={16} className="inline-icon" />
          <span>Social Media Caption &amp; Share</span>
        </label>
      </div>

      <p className="caption-instruction">
        Share your card on LinkedIn with official @Enactus Assiut tagging:
      </p>

      <div className="caption-display-box">
        <pre className="caption-text">{caption}</pre>
      </div>

      {shareNotice && (
        <div className="caption-share-notice" role="alert">
          <ImageIcon size={16} className="notice-icon" />
          <span>{shareNotice}</span>
        </div>
      )}

      <div className="caption-actions">
        <button
          type="button"
          className="btn-linkedin-post"
          onClick={onOpenShareModal || handlePostOnLinkedIn}
          disabled={isSharing}
          title="Share your card image & caption on LinkedIn"
        >
          <LinkedInIcon size={18} />
          <span>{isSharing ? 'Preparing Post...' : 'Share Announcement on LinkedIn'}</span>
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
      </div>
    </div>
  );
};
