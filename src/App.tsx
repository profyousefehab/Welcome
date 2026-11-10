import React, { useState, useEffect } from 'react';
import { VINTAGE_POSTAGE_STAMP_TEMPLATE } from './templates/vintagePostageTemplate';
import { UserCardData } from './types/template';
import { exportHighResolutionPng } from './services/renderingEngine';

import { CardPreview } from './components/CardPreview';
import { PhotoUploader } from './components/PhotoUploader';
import { PhotoAdjuster } from './components/PhotoAdjuster';
import { FormControls } from './components/FormControls';
import { CaptionBox } from './components/CaptionBox';
import { ShareModal } from './components/ShareModal';
import logoEnactusAu from './assets/logoEnactusAu_web.webp';
import samplePortraitUrl from './assets/sample_portrait.webp';
import { ArrowRight, ArrowLeft, Check, Download, CheckCircle, RotateCcw, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const activeTemplate = VINTAGE_POSTAGE_STAMP_TEMPLATE;

  // Active Wizard Step (1: Photo, 2: Details, 3: Export & Share)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Sharing Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Application State
  const [userData, setUserData] = useState<UserCardData>({
    photoImage: null,
    photoUrl: null,
    photoPosition: {
      x: 0,
      y: 0,
      zoom: 1.0,
    },
    fullName: 'Your Name',
    nameFontSize: 80,
    namePosition: { x: 0, y: 0 },
    committee: '',
    committeePosition: { x: 0, y: 0 },
  });

  // Preload initial sample portrait matching Card2.psd
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setUserData((prev) => {
        if (!prev.photoImage) {
          return {
            ...prev,
            photoImage: img,
            photoUrl: samplePortraitUrl,
          };
        }
        return prev;
      });
    };
    img.src = samplePortraitUrl;
  }, []);

  const [isExporting, setIsExporting] = useState(false);
  const [hasExported, setHasExported] = useState(false);

  // Handlers for Photo Updates
  const handlePhotoLoaded = (image: HTMLImageElement, url: string) => {
    setUserData((prev) => ({
      ...prev,
      photoImage: image,
      photoUrl: url,
      photoPosition: { x: 0, y: 0, zoom: 1.0 },
    }));
  };

  const handlePhotoRemoved = () => {
    setUserData((prev) => ({
      ...prev,
      photoImage: null,
      photoUrl: null,
      photoPosition: { x: 0, y: 0, zoom: 1.0 },
    }));
  };

  const handleUpdatePosition = (newPos: { x: number; y: number; zoom: number }) => {
    setUserData((prev) => ({
      ...prev,
      photoPosition: newPos,
    }));
  };

  const handleFullNameChange = (name: string) => {
    setUserData((prev) => ({
      ...prev,
      fullName: name,
    }));
  };

  const handleNameFontSizeChange = (size: number) => {
    setUserData((prev) => ({
      ...prev,
      nameFontSize: size,
    }));
  };

  const handleNamePositionChange = (newPos: { x: number; y: number }) => {
    setUserData((prev) => ({
      ...prev,
      namePosition: newPos,
    }));
  };

  const handleCommitteeChange = (committee: string) => {
    setUserData((prev) => ({
      ...prev,
      committee,
    }));
  };

  const handleCommitteePositionChange = (newPos: { x: number; y: number }) => {
    setUserData((prev) => ({
      ...prev,
      committeePosition: newPos,
    }));
  };

  // High-Resolution PNG Export Handler
  const handleExportPng = async () => {
    setIsExporting(true);

    try {
      const { blob, filename } = await exportHighResolutionPng(
        activeTemplate,
        userData
      );

      // Trigger browser download
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setHasExported(true);
      // Automatically show sharing options modal after card generation
      setIsShareModalOpen(true);
    } catch (err) {
      console.error('Export error:', err);
      alert('An error occurred while generating your card. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="app-root">
      {/* Top Application Bar */}
      <header className="app-header">
        <div className="header-container">
          <div className="brand-badge">
            <img src={logoEnactusAu} alt="Enactus Assiut University" className="enactus-header-logo" />
            <div className="brand-title-wrap">
              <span className="brand-title">Welcome to our family</span>
              <span className="brand-tagline">Official Membership Card</span>
            </div>
          </div>
          <div className="header-season-tag">
            <span>SEASON 2027</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="app-main">
        {/* Interactive 3-Step Member Navigation Bar */}
        <nav className="member-steps-guide" aria-label="Creation Steps">
          <button
            type="button"
            className={`step-pill ${currentStep === 1 ? 'is-active' : ''} ${currentStep > 1 ? 'is-completed' : ''}`}
            onClick={() => setCurrentStep(1)}
            aria-current={currentStep === 1 ? 'step' : undefined}
          >
            <span className="step-pill-number">
              {currentStep > 1 ? <Check size={13} /> : 1}
            </span>
            <span className="step-pill-title">
              <span className="step-title-short">Photo</span>
              <span className="step-title-full">Your Photo</span>
            </span>
          </button>

          <div className={`step-pill-line ${currentStep > 1 ? 'is-completed' : ''}`} />

          <button
            type="button"
            className={`step-pill ${currentStep === 2 ? 'is-active' : ''} ${currentStep > 2 ? 'is-completed' : ''}`}
            onClick={() => setCurrentStep(2)}
            aria-current={currentStep === 2 ? 'step' : undefined}
          >
            <span className="step-pill-number">
              {currentStep > 2 ? <Check size={13} /> : 2}
            </span>
            <span className="step-pill-title">
              <span className="step-title-short">Details</span>
              <span className="step-title-full">Your Details</span>
            </span>
          </button>

          <div className={`step-pill-line ${currentStep > 2 ? 'is-completed' : ''}`} />

          <button
            type="button"
            className={`step-pill ${currentStep === 3 ? 'is-active' : ''}`}
            onClick={() => setCurrentStep(3)}
            aria-current={currentStep === 3 ? 'step' : undefined}
          >
            <span className="step-pill-number">3</span>
            <span className="step-pill-title">
              <span className="step-title-short">Export</span>
              <span className="step-title-full">Download</span>
            </span>
          </button>
        </nav>

        {/* Two-Column Responsive Layout (Mobile-First) */}
        <div className="app-grid">
          {/* Left Column: Live Card Preview (Optimized for Mobile & Desktop) */}
          <section className={`preview-column step-${currentStep}-preview`} aria-label="Card Live Preview">
            <CardPreview
              template={activeTemplate}
              userData={userData}
              currentStep={currentStep}
              onUpdatePosition={handleUpdatePosition}
              onUpdateNamePosition={handleNamePositionChange}
              isExporting={isExporting}
            />
          </section>

          {/* Right Column: Dynamic Step Content */}
          <section className="controls-column" aria-label="Card Editor Controls">
            {/* Step 1: Member Photo Upload & Adjust */}
            {currentStep === 1 && (
              <div className="step-panel step-1-panel">
                <PhotoUploader
                  hasPhoto={!!userData.photoImage}
                  onPhotoLoaded={handlePhotoLoaded}
                  onPhotoRemoved={handlePhotoRemoved}
                />

                {userData.photoImage && (
                  <PhotoAdjuster
                    position={userData.photoPosition}
                    onUpdatePosition={handleUpdatePosition}
                    disabled={!userData.photoImage}
                  />
                )}

                <div className="step-navigation-footer">
                  <button
                    type="button"
                    className="btn-step-next full-width"
                    onClick={() => setCurrentStep(2)}
                  >
                    <span>Continue to Step 2: Your Details</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Full Name & Committee Selector + X/Y Text Controls */}
            {currentStep === 2 && (
              <div className="step-panel step-2-panel">
                <FormControls
                  fullName={userData.fullName}
                  nameFontSize={userData.nameFontSize}
                  namePosition={userData.namePosition || { x: 0, y: 0 }}
                  committee={userData.committee}
                  committeePosition={userData.committeePosition || { x: 0, y: 0 }}
                  onFullNameChange={handleFullNameChange}
                  onNameFontSizeChange={handleNameFontSizeChange}
                  onNamePositionChange={handleNamePositionChange}
                  onCommitteeChange={handleCommitteeChange}
                  onCommitteePositionChange={handleCommitteePositionChange}
                  onNext={() => setCurrentStep(3)}
                  onBack={() => setCurrentStep(1)}
                />
              </div>
            )}

            {/* Step 3: High-Res Export & Social Media Caption */}
            {currentStep === 3 && (
              <div className="step-panel step-3-panel">
                <div className="control-section export-final-section">
                  <div className="section-header">
                    <label className="section-label">
                      <span className="step-badge">3</span>
                      <span>Download &amp; Share</span>
                    </label>
                  </div>

                  <p className="step-instruction">
                    Your official membership card is ready. Download the high-resolution PNG and copy your campaign announcement below.
                  </p>

                  {/* High-Resolution PNG Download Button */}
                  <div className="export-action-block">
                    <button
                      type="button"
                      className={`btn-export ${hasExported ? 'has-exported' : ''}`}
                      onClick={handleExportPng}
                      disabled={isExporting}
                    >
                      {isExporting ? (
                        <>
                          <div className="spinner-mini" />
                          <span>Generating 1080 × 1440 PNG...</span>
                        </>
                      ) : hasExported ? (
                        <>
                          <CheckCircle size={20} />
                          <span>Card Downloaded! Click to Download Again</span>
                        </>
                      ) : (
                        <>
                          <Download size={20} />
                          <span>Download Membership Card (PNG)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Persistent Share Action Button */}
                  <div className="persistent-share-block">
                    <button
                      type="button"
                      className="btn-persistent-share"
                      onClick={() => setIsShareModalOpen(true)}
                    >
                      <Sparkles size={18} className="share-btn-icon" />
                      <span>SHARE YOUR ANNOUNCEMENT</span>
                      <ArrowRight size={16} />
                    </button>
                    <p className="persistent-share-hint">
                      Fast 1-click mobile share or guided step-by-step walkthrough
                    </p>
                  </div>

                  {/* Campaign Caption Box */}
                  <CaptionBox
                    committee={userData.committee}
                    onGetCardBlob={() => exportHighResolutionPng(activeTemplate, userData)}
                    onOpenShareModal={() => setIsShareModalOpen(true)}
                  />

                  {/* Step 3 Navigation Footer */}
                  <div className="step-navigation-footer">
                    <button
                      type="button"
                      className="btn-step-back"
                      onClick={() => setCurrentStep(2)}
                    >
                      <ArrowLeft size={17} />
                      <span>Back to Details</span>
                    </button>
                    <button
                      type="button"
                      className="btn-step-subtle"
                      onClick={() => setCurrentStep(1)}
                    >
                      <RotateCcw size={15} />
                      <span>Change Photo</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* App Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <img src={logoEnactusAu} alt="Enactus Assiut University" className="footer-logo" />
          <span>Enactus Assiut University &bull; Season 2027</span>
        </div>
      </footer>

      {/* Two-Option Announcement Sharing Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        committee={userData.committee}
        onGetCardBlob={() => exportHighResolutionPng(activeTemplate, userData)}
      />
    </div>
  );
};

export default App;
