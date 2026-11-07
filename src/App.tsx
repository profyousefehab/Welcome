import React, { useState, useEffect } from 'react';
import { VINTAGE_POSTAGE_STAMP_TEMPLATE } from './templates/vintagePostageTemplate';
import { UserCardData } from './types/template';
import { exportHighResolutionPng } from './services/renderingEngine';

import { CardPreview } from './components/CardPreview';
import { PhotoUploader } from './components/PhotoUploader';
import { PhotoAdjuster } from './components/PhotoAdjuster';
import { FormControls } from './components/FormControls';
import { CaptionBox } from './components/CaptionBox';
import logoEnactusAu from './assets/logoEnactusAu_web.png';
import samplePortraitUrl from './assets/sample_portrait.jpg';

export const App: React.FC = () => {
  const activeTemplate = VINTAGE_POSTAGE_STAMP_TEMPLATE;

  // Application State
  const [userData, setUserData] = useState<UserCardData>({
    photoImage: null,
    photoUrl: null,
    photoPosition: {
      x: 0,
      y: 0,
      zoom: 1.0,
    },
    fullName: 'Yousef Ehab',
    nameFontSize: 80,
    committee: 'SOCIAL MEDIA',
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

  const handleCommitteeChange = (committee: string) => {
    setUserData((prev) => ({
      ...prev,
      committee,
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
        {/* Simple 3-Step Member Guide Bar */}
        <div className="member-steps-guide">
          <div className="step-pill">
            <span className="step-pill-number">1</span>
            <span className="step-pill-title">Upload Photo</span>
          </div>
          <div className="step-pill-line" />
          <div className="step-pill">
            <span className="step-pill-number">2</span>
            <span className="step-pill-title">Enter Details</span>
          </div>
          <div className="step-pill-line" />
          <div className="step-pill">
            <span className="step-pill-number">3</span>
            <span className="step-pill-title">Download &amp; Share</span>
          </div>
        </div>

        {/* Two-Column Responsive Layout */}
        <div className="app-grid">
          {/* Left Column: Live Card Preview (Sticky on Desktop) */}
          <section className="preview-column" aria-label="Card Live Preview">
            <CardPreview
              template={activeTemplate}
              userData={userData}
              onUpdatePosition={handleUpdatePosition}
              isExporting={isExporting}
            />
          </section>

          {/* Right Column: Member Controls and Customization Form */}
          <section className="controls-column" aria-label="Card Editor Controls">
            {/* Step 1: Member Photo Upload */}
            <PhotoUploader
              hasPhoto={!!userData.photoImage}
              onPhotoLoaded={handlePhotoLoaded}
              onPhotoRemoved={handlePhotoRemoved}
            />

            {/* Photo Position & Zoom Controls (Visible when photo is uploaded) */}
            <PhotoAdjuster
              position={userData.photoPosition}
              onUpdatePosition={handleUpdatePosition}
              disabled={!userData.photoImage}
            />

            {/* Step 2: Full Name & Committee Dropdown + Download CTA */}
            <FormControls
              fullName={userData.fullName}
              nameFontSize={userData.nameFontSize}
              committee={userData.committee}
              onFullNameChange={handleFullNameChange}
              onNameFontSizeChange={handleNameFontSizeChange}
              onCommitteeChange={handleCommitteeChange}
              onExportPng={handleExportPng}
              isExporting={isExporting}
              hasExported={hasExported}
            />

            {/* Step 3: Social Media Announcement Caption */}
            <CaptionBox committee={userData.committee} />
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
    </div>
  );
};

export default App;
