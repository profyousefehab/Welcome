import React from 'react';
import { APPROVED_COMMITTEES } from '../constants/committees';
import { User, Users, Type, Minus, Plus, ArrowRight, ArrowLeft } from 'lucide-react';

interface FormControlsProps {
  fullName: string;
  nameFontSize?: number;
  committee: string;
  onFullNameChange: (name: string) => void;
  onNameFontSizeChange: (size: number) => void;
  onCommitteeChange: (committee: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const FormControls: React.FC<FormControlsProps> = ({
  fullName,
  nameFontSize = 80,
  committee,
  onFullNameChange,
  onNameFontSizeChange,
  onCommitteeChange,
  onNext,
  onBack,
}) => {
  return (
    <div className="control-section form-controls-section">
      <div className="section-header">
        <label className="section-label">
          <span className="step-badge">2</span>
          <span>Your Details</span>
        </label>
      </div>

      <p className="step-instruction">
        Enter your full name and select your assigned committee. The card preview updates in real time.
      </p>

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
              onClick={() => onNameFontSizeChange(Math.max(30, nameFontSize - 2))}
              title="Decrease font size"
              aria-label="Decrease font size"
            >
              <Minus size={13} />
            </button>
            <input
              type="range"
              min={30}
              max={100}
              step={2}
              value={nameFontSize}
              onChange={(e) => onNameFontSizeChange(Number(e.target.value))}
              className="font-size-slider"
              aria-label="Name font size slider"
            />
            <button
              type="button"
              className="font-size-btn"
              onClick={() => onNameFontSizeChange(Math.min(100, nameFontSize + 2))}
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

      {/* Step 2 Navigation Footer */}
      <div className="step-navigation-footer">
        <button
          type="button"
          className="btn-step-back"
          onClick={onBack}
        >
          <ArrowLeft size={17} />
          <span>Back to Photo</span>
        </button>
        <button
          type="button"
          className="btn-step-next"
          onClick={onNext}
        >
          <span>Continue to Step 3</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
};

