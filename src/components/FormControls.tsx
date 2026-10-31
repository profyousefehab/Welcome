import React from 'react';
import { APPROVED_COMMITTEES } from '../constants/committees';
import { User, Users, Download, Sparkles, CheckCircle } from 'lucide-react';

interface FormControlsProps {
  fullName: string;
  committee: string;
  onFullNameChange: (name: string) => void;
  onCommitteeChange: (committee: string) => void;
  onExportPng: () => void;
  isExporting: boolean;
  hasExported: boolean;
}

export const FormControls: React.FC<FormControlsProps> = ({
  fullName,
  committee,
  onFullNameChange,
  onCommitteeChange,
  onExportPng,
  isExporting,
  hasExported,
}) => {
  return (
    <div className="control-section form-controls-section">
      <div className="section-header">
        <label className="section-label">
          <User size={18} className="section-icon" />
          <span>Member Details</span>
        </label>
        <span className="fixed-design-badge">Design Fixed</span>
      </div>

      {/* Full Name Input */}
      <div className="input-group">
        <label htmlFor="fullNameInput" className="input-label">
          Full Name
        </label>
        <div className="input-wrapper">
          <input
            id="fullNameInput"
            type="text"
            className="text-input"
            placeholder="Enter member's full name (e.g. Youssef Nabil)"
            value={fullName}
            maxLength={40}
            onChange={(e) => onFullNameChange(e.target.value)}
          />
          <span className="char-counter">{fullName.length}/40</span>
        </div>
        <p className="input-help">Will be formatted in uppercase on the card automatically.</p>
      </div>

      {/* Committee Dropdown */}
      <div className="input-group">
        <label htmlFor="committeeSelect" className="input-label">
          <Users size={15} className="inline-icon" />
          <span>Assigned Committee</span>
        </label>
        <div className="select-wrapper">
          <select
            id="committeeSelect"
            className="select-input"
            value={committee}
            onChange={(e) => onCommitteeChange(e.target.value)}
          >
            {APPROVED_COMMITTEES.map((comm) => (
              <option key={comm} value={comm}>
                {comm}
              </option>
            ))}
          </select>
        </div>
        <p className="input-help">Select from the 7 officially recognized Enactus committees.</p>
      </div>

      {/* High-Resolution PNG Export CTA */}
      <div className="export-action-block">
        <button
          type="button"
          className={`btn-export ${hasExported ? 'has-exported' : ''}`}
          onClick={onExportPng}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <div className="spinner-mini" />
              <span>Generating High-Res PNG...</span>
            </>
          ) : hasExported ? (
            <>
              <CheckCircle size={20} />
              <span>Download Ready (Click to re-download)</span>
            </>
          ) : (
            <>
              <Download size={20} />
              <span>Download High-Resolution PNG</span>
              <Sparkles size={16} className="sparkle-icon" />
            </>
          )}
        </button>
        <p className="export-spec-note">
          Outputs pixel-perfect 1080 × 1350 PNG with full transparent overlays and auto-scaled typography.
        </p>
      </div>
    </div>
  );
};

