import React, { useState } from 'react';
import { VINTAGE_POSTAGE_STAMP_TEMPLATE } from './templates/vintagePostageTemplate';
import { UserCardData } from './types/template';
import { exportHighResolutionPng } from './services/renderingEngine';

import { CardPreview } from './components/CardPreview';
import { PhotoUploader } from './components/PhotoUploader';
import { PhotoAdjuster } from './components/PhotoAdjuster';
import { FormControls } from './components/FormControls';
import { CaptionBox } from './components/CaptionBox';
import { ArchitectureHandoverGuide } from './components/ArchitectureHandoverGuide';

import confetti from 'canvas-confetti';
import { Stamp, CheckCircle2 } from 'lucide-react';

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
    committee: 'SOCIAL MEDIA COMMITTEE',
  });

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

      // Celebratory Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFC20E', '#FFFFFF', '#0B192C', '#38BDF8'],
        });
      } catch {
        // Confetti fallback
      }
    } catch (err) {
      console.error('Export error:', err);
      alert('An error occurred while generating high-resolution PNG. Please try again.');
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
            <div className="brand-logo-icon">E</div>
            <div className="brand-title-wrap">
              <span className="brand-title">Enactus Welcome</span>
              <span className="brand-tagline">Membership Card Generator</span>
            </div>
          </div>

          <div className="header-actions">
            <ArchitectureHandoverGuide />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="app-main">
        {/* Template Status Banner */}
        <div className="banner-dev-notice" style={{ borderLeftColor: '#F4B92B' }} role="status">
          <div className="banner-dev-notice-text">
            <Stamp size={18} style={{ color: '#F4B92B', flexShrink: 0 }} />
            <span>
              <strong>Active Template:</strong> Enactus Vintage Postage Stamp (Season 2027 &bull; Assiut University) integrated from <code>Card2.psd</code>.
            </span>
          </div>
          <span className="banner-dev-badge" style={{ background: '#10B981', color: '#FFFFFF' }}>
            <CheckCircle2 size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '3px' }} />
            CARD2 TEMPLATE LOADED
          </span>
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
            {/* 1. Member Photo Upload & Client-Side Validation */}
            <PhotoUploader
              hasPhoto={!!userData.photoImage}
              onPhotoLoaded={handlePhotoLoaded}
              onPhotoRemoved={handlePhotoRemoved}
            />

            {/* 2. Photo Position & Zoom Controls */}
            <PhotoAdjuster
              position={userData.photoPosition}
              onUpdatePosition={handleUpdatePosition}
              disabled={!userData.photoImage}
            />

            {/* 3. Full Name & Committee Dropdown + PNG Export CTA */}
            <FormControls
              fullName={userData.fullName}
              committee={userData.committee}
              onFullNameChange={handleFullNameChange}
              onCommitteeChange={handleCommitteeChange}
              onExportPng={handleExportPng}
              isExporting={isExporting}
              hasExported={hasExported}
            />

            {/* 4. Fixed Campaign Caption with Dynamic Committee Substitution */}
            <CaptionBox committee={userData.committee} />
          </section>
        </div>
      </main>

      {/* App Footer */}
      <footer className="app-footer">
        <div className="footer-left">
          <span>Enactus Welcome Card Generator &bull; Template Engine v1.0.0-dev</span>
        </div>
        <div className="footer-right">
          <span>All design assets fixed &bull; Candidate designs: Black &amp; Gold / Vintage Postage Stamp</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
