import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Download,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
} from 'lucide-react';
import { generateCampaignCaption, ENACTUS_LINKEDIN_URL } from '../constants/campaignCaption';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  committee: string;
  onGetCardBlob: () => Promise<{ blob: Blob; filename: string }>;
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

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  committee,
  onGetCardBlob,
}) => {
  const [view, setView] = useState<'options' | 'guided'>('options');
  const [isQuickSharing, setIsQuickSharing] = useState(false);
  const [quickShareNotice, setQuickShareNotice] = useState<string | null>(null);

  // Guided view state
  const [isDownloadingGuided, setIsDownloadingGuided] = useState(false);
  const [guidedDownloaded, setGuidedDownloaded] = useState(false);
  const [guidedCopied, setGuidedCopied] = useState(false);

  if (!isOpen) return null;

  const caption = generateCampaignCaption(committee);

  const copyTextToClipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
      } catch {
        return false;
      }
    }
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };

  /**
   * OPTION 1 — QUICK SHARE (PRIMARY)
   * Fastest possible mobile sharing experience using Web Share API with files.
   * Graceful fallback for desktop / unsupported browsers.
   */
  const handleQuickShare = async () => {
    setIsQuickSharing(true);
    setQuickShareNotice(null);

    try {
      const { blob, filename } = await onGetCardBlob();

      // Check if file sharing is supported on this device/browser
      const file = new File([blob], filename, { type: 'image/png' });
      const canShareFiles =
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] });

      if (canShareFiles) {
        try {
          await navigator.share({
            title: 'My Enactus Assiut Announcement',
            text: caption,
            files: [file],
          });
          // Successful opening of share sheet; user handles publishing inside LinkedIn
          setIsQuickSharing(false);
          return;
        } catch (shareErr) {
          // If the user cancelled/closed the native share sheet, do not show an error
          if ((shareErr as Error)?.name === 'AbortError') {
            setIsQuickSharing(false);
            return;
          }
          // Fall through to desktop fallback if native share threw an unexpected error
        }
      }

      // Desktop & Unsupported Browser Fallback Flow:
      // 1. Download the generated PNG
      triggerDownload(blob, filename);

      // 2. Copy the campaign caption to clipboard
      await copyTextToClipboard(caption);

      // 3. Open LinkedIn's post composer in a new tab
      const linkedInPostUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(caption)}`;
      try {
        window.open(linkedInPostUrl, '_blank', 'noopener,noreferrer');
      } catch {
        // Handled popup restrictions gracefully
      }

      // 4. Show clear guidance instruction
      setQuickShareNotice(
        'Card downloaded & caption copied! On LinkedIn, attach your downloaded card image and paste the caption.'
      );
    } catch (err) {
      console.error('Quick share error:', err);
      // Graceful fallback
      await copyTextToClipboard(caption);
      setQuickShareNotice('Caption copied to clipboard. Please open LinkedIn to share your announcement.');
    } finally {
      setIsQuickSharing(false);
    }
  };

  /**
   * OPTION 2 — GUIDED STEP HANDLERS
   */
  const handleGuidedDownload = async () => {
    setIsDownloadingGuided(true);
    try {
      const { blob, filename } = await onGetCardBlob();
      triggerDownload(blob, filename);
      setGuidedDownloaded(true);
      setTimeout(() => setGuidedDownloaded(false), 3500);
    } catch (err) {
      console.error('Download error:', err);
      alert('Unable to generate card image. Please try again.');
    } finally {
      setIsDownloadingGuided(false);
    }
  };

  const handleGuidedCopy = async () => {
    const success = await copyTextToClipboard(caption);
    if (success) {
      setGuidedCopied(true);
      setTimeout(() => setGuidedCopied(false), 2500);
    }
  };

  const handleOpenLinkedInPublish = () => {
    const linkedInPostUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(caption)}`;
    window.open(linkedInPostUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="share-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
      <div className="share-modal-backdrop" onClick={onClose} />

      <div className="share-modal-card">
        {/* Modal Header */}
        <div className="share-modal-header">
          <div className="share-modal-badge">
            <Sparkles size={16} />
            <span>ENACTUS ASSIUT ANNOUNCEMENT</span>
          </div>
          <button
            type="button"
            className="share-modal-close"
            onClick={onClose}
            aria-label="Close sharing modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="share-modal-headings">
          <h2 id="share-modal-title" className="share-modal-title">
            OUR FAMILY IS GROWING!
          </h2>
          <p className="share-modal-subtitle">
            Your membership card is ready. How would you like to share your moment?
          </p>
        </div>

        {/* View 1: Main Two-Option Chooser */}
        {view === 'options' && (
          <div className="share-options-container">
            {/* OPTION 1: QUICK SHARE */}
            <div className="share-option-card is-recommended">
              <div className="share-option-top">
                <span className="recommended-pill">Recommended</span>
                <span className="option-number">Option 1</span>
              </div>
              <h3 className="share-option-title">QUICK SHARE</h3>
              <p className="share-option-desc">
                Share your card and caption using your device&apos;s native sharing options.
              </p>

              {quickShareNotice && (
                <div className="share-notice-box" role="status">
                  <Info size={16} className="notice-icon" />
                  <span>{quickShareNotice}</span>
                </div>
              )}

              <button
                type="button"
                className="btn-share-primary"
                onClick={handleQuickShare}
                disabled={isQuickSharing}
              >
                <LinkedInIcon size={20} />
                <span>{isQuickSharing ? 'Preparing Announcement...' : 'SHARE ON LINKEDIN'}</span>
              </button>

              <div className="share-option-footnote">
                <p>
                  On supported mobile devices, choose LinkedIn from your device&apos;s share sheet to review and publish.
                  On desktop, your card downloads and caption copies automatically.
                </p>
                <a
                  href={ENACTUS_LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="official-page-ref"
                >
                  <ExternalLink size={12} />
                  <span>Official Page: linkedin.com/company/enactus-assiut</span>
                </a>
              </div>
            </div>

            {/* OPTION 2: GUIDED SHARING */}
            <div className="share-option-card">
              <div className="share-option-top">
                <span className="guide-pill">Detailed Walkthrough</span>
                <span className="option-number">Option 2</span>
              </div>
              <h3 className="share-option-title">GUIDED SHARING</h3>
              <p className="share-option-desc">
                Follow simple steps to download, copy, tag, and publish.
              </p>

              <button
                type="button"
                className="btn-share-secondary"
                onClick={() => setView('guided')}
              >
                <span>GUIDE ME STEP BY STEP</span>
                <ArrowRight size={18} />
              </button>

              <div className="share-option-footnote">
                <p>
                  Recommended if you want to preview the exact caption, manually attach the high-res card, and properly mention the Enactus Assiut page.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* View 2: Guided Step-by-Step Flow */}
        {view === 'guided' && (
          <div className="guided-steps-container">
            <button
              type="button"
              className="btn-back-to-options"
              onClick={() => setView('options')}
            >
              <ArrowLeft size={16} />
              <span>Back to sharing options</span>
            </button>

            <div className="guided-steps-list">
              {/* STEP 1 */}
              <div className="guided-step-item">
                <div className="guided-step-indicator">
                  <span className="step-num">1</span>
                </div>
                <div className="guided-step-body">
                  <h4 className="guided-step-title">STEP 1: DOWNLOAD YOUR CARD</h4>
                  <p className="guided-step-desc">
                    Download the personalized high-resolution card PNG to your device.
                  </p>
                  <button
                    type="button"
                    className={`btn-guided-action ${guidedDownloaded ? 'is-done' : ''}`}
                    onClick={handleGuidedDownload}
                    disabled={isDownloadingGuided}
                  >
                    {guidedDownloaded ? (
                      <>
                        <Check size={16} />
                        <span>Card Downloaded!</span>
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        <span>{isDownloadingGuided ? 'Generating...' : 'Download Card PNG'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* STEP 2 */}
              <div className="guided-step-item">
                <div className="guided-step-indicator">
                  <span className="step-num">2</span>
                </div>
                <div className="guided-step-body">
                  <h4 className="guided-step-title">STEP 2: COPY YOUR CAPTION</h4>
                  <p className="guided-step-desc">
                    Copy the campaign caption with your assigned committee inserted.
                  </p>
                  <div className="guided-caption-preview">
                    <pre>{caption}</pre>
                  </div>
                  <button
                    type="button"
                    className={`btn-guided-action ${guidedCopied ? 'is-done' : ''}`}
                    onClick={handleGuidedCopy}
                  >
                    {guidedCopied ? (
                      <>
                        <Check size={16} />
                        <span>Caption Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>Copy Caption</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* STEP 3 */}
              <div className="guided-step-item">
                <div className="guided-step-indicator">
                  <span className="step-num">3</span>
                </div>
                <div className="guided-step-body">
                  <h4 className="guided-step-title">STEP 3: TAG ENACTUS ASSIUT</h4>
                  <p className="guided-step-desc">
                    In LinkedIn, type <strong>@Enactus Assiut</strong> and select the official company page from the suggestions.
                  </p>
                  <div className="guided-warning-box">
                    <Info size={14} className="warn-icon" />
                    <span>
                      Copying the page name alone does not create a real LinkedIn mention. You must click the official Enactus Assiut page from the suggestion popup when writing your post.
                    </span>
                  </div>
                  <a
                    href={ENACTUS_LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-guided-link"
                  >
                    <ExternalLink size={15} />
                    <span>VISIT OFFICIAL LINKEDIN PAGE</span>
                  </a>
                </div>
              </div>

              {/* STEP 4 */}
              <div className="guided-step-item">
                <div className="guided-step-indicator">
                  <span className="step-num">4</span>
                </div>
                <div className="guided-step-body">
                  <h4 className="guided-step-title">STEP 4: PUBLISH</h4>
                  <p className="guided-step-desc">
                    Open LinkedIn and finish attaching the downloaded card image, pasting the caption, confirming the @Enactus Assiut mention, and publishing.
                  </p>
                  <button
                    type="button"
                    className="btn-guided-publish"
                    onClick={handleOpenLinkedInPublish}
                  >
                    <LinkedInIcon size={18} />
                    <span>OPEN LINKEDIN TO PUBLISH</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="share-modal-footer">
          <button type="button" className="btn-modal-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
