import React from 'react';
import { APPROVED_COMMITTEES } from '../constants/committees';
import { User, Users, Download, CheckCircle, Type, Minus, Plus } from 'lucide-react';

interface FormControlsProps {
  fullName: string;
  nameFontSize?: number;
  committee: string;
  onFullNameChange: (name: string) => void;
  onNameFontSizeChange: (size: number) => void;
  onCommitteeChange: (committee: string) => void;
  onExportPng: () => void;
  isExporting: boolean;
  hasExported: boolean;
}

export const FormControls: React.FC<FormControlsProps> = ({
  fullName,
  nameFontSize = 54,
  committee,
  onFullNameChange,
  onNameFontSizeChange,
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

      {/* Full Name Input & Font Size Control */}
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

        {/* Font Size Adjuster */}
        <div className="font-size-adjuster">
          <div className="font-size-header">
            <span className="font-size-label">
              <Type size={13} className="inline-icon" />
              <span>Name Font Size</span>
            </span>
            <span className="font-size-value">{nameFontSize}px</span>
          </div>
          <div className="font-size-slider-row">
            <button
              type="button"
              className="font-size-btn"
              onClick={() => onNameFontSizeChange(Math.max(24, nameFontSize - 2))}
              title="Decrease font size"
              aria-label="Decrease font size"
            >
              <Minus size={13} />
            </button>
            <input
              type="range"
              min={24}
              max={80}
              step={2}
              value={nameFontSize}
              onChange={(e) => onNameFontSizeChange(Number(e.target.value))}
              className="font-size-slider"
              aria-label="Name font size slider"
            />
            <button
              type="button"
              className="font-size-btn"
              onClick={() => onNameFontSizeChange(Math.min(80, nameFontSize + 2))}
              title="Increase font size"
              aria-label="Increase font size"
            >
              <Plus size={13} />
            </button>
          </div>
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
            </>
          )}
        </button>
      </div>
    </div>
  );
};

