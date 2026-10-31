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
          <span className="step-badge">2</span>
          <span>Your Details</span>
        </label>
      </div>

      {/* Full Name Input */}
      <div className="input-group">
        <label htmlFor="fullNameInput" className="input-label">
          <User size={15} className="inline-icon" />
          <span>Full Name</span>
        </label>
        <div className="input-wrapper">
          <input
            id="fullNameInput"
            type="text"
            className="text-input"
            placeholder="e.g. Yousef Ehab"
            value={fullName}
            maxLength={40}
            onChange={(e) => onFullNameChange(e.target.value)}
          />
          <span className="char-counter">{fullName.length}/40</span>
        </div>
      </div>

      {/* Committee Dropdown */}
      <div className="input-group">
        <label htmlFor="committeeSelect" className="input-label">
          <Users size={15} className="inline-icon" />
          <span>Your Committee</span>
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
      </div>

      {/* Download Action CTA */}
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
              <span>Generating your card...</span>
            </>
          ) : hasExported ? (
            <>
              <CheckCircle size={20} />
              <span>Downloaded! Click to download again</span>
            </>
          ) : (
            <>
              <Download size={20} />
              <span>Download Membership Card</span>
              <Sparkles size={16} className="sparkle-icon" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

