import React from 'react';
import { APPROVED_COMMITTEES } from '../constants/committees';
import {
  User,
  Users,
  Type,
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Move,
  RotateCcw,
} from 'lucide-react';

interface FormControlsProps {
  fullName: string;
  nameFontSize?: number;
  namePosition?: { x: number; y: number };
  committee: string;
  committeePosition?: { x: number; y: number };
  onFullNameChange: (name: string) => void;
  onNameFontSizeChange: (size: number) => void;
  onNamePositionChange: (pos: { x: number; y: number }) => void;
  onCommitteeChange: (committee: string) => void;
  onCommitteePositionChange?: (pos: { x: number; y: number }) => void;
  onNext: () => void;
  onBack: () => void;
}

export const FormControls: React.FC<FormControlsProps> = ({
  fullName,
  nameFontSize = 80,
  namePosition = { x: 0, y: 0 },
  committee,
  committeePosition = { x: 0, y: 0 },
  onFullNameChange,
  onNameFontSizeChange,
  onNamePositionChange,
  onCommitteeChange,
  onCommitteePositionChange,
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
        Enter your full name and select your assigned committee. You can also adjust text size and X/Y positioning.
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

        {/* Name Position Adjuster (X and Y) */}
        <div className="position-adjuster-block">
          <div className="position-header">
            <span className="position-label">
              <Move size={13} className="inline-icon" />
              <span>Name Position (X / Y)</span>
            </span>
            {(namePosition.x !== 0 || namePosition.y !== 0) && (
              <button
                type="button"
                className="btn-reset-position"
                onClick={() => onNamePositionChange({ x: 0, y: 0 })}
                title="Reset name to center"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="position-axis-grid">
            {/* Horizontal (X) */}
            <div className="axis-control-item">
              <div className="axis-header">
                <span className="axis-title">X (Horizontal)</span>
                <span className="axis-value">{namePosition.x > 0 ? `+${namePosition.x}` : namePosition.x}px</span>
              </div>
              <div className="font-size-slider-row">
                <button
                  type="button"
                  className="font-size-btn"
                  onClick={() => onNamePositionChange({ ...namePosition, x: namePosition.x - 2 })}
                  title="Move Name Left"
                  aria-label="Move name left"
                >
                  <ArrowLeft size={13} />
                </button>
                <input
                  type="range"
                  min={-150}
                  max={150}
                  step={2}
                  value={namePosition.x}
                  onChange={(e) => onNamePositionChange({ ...namePosition, x: Number(e.target.value) })}
                  className="font-size-slider"
                  aria-label="Name X position slider"
                />
                <button
                  type="button"
                  className="font-size-btn"
                  onClick={() => onNamePositionChange({ ...namePosition, x: namePosition.x + 2 })}
                  title="Move Name Right"
                  aria-label="Move name right"
                >
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Vertical (Y) */}
            <div className="axis-control-item">
              <div className="axis-header">
                <span className="axis-title">Y (Vertical)</span>
                <span className="axis-value">{namePosition.y > 0 ? `+${namePosition.y}` : namePosition.y}px</span>
              </div>
              <div className="font-size-slider-row">
                <button
                  type="button"
                  className="font-size-btn"
                  onClick={() => onNamePositionChange({ ...namePosition, y: namePosition.y - 2 })}
                  title="Move Name Up"
                  aria-label="Move name up"
                >
                  <ArrowUp size={13} />
                </button>
                <input
                  type="range"
                  min={-100}
                  max={100}
                  step={2}
                  value={namePosition.y}
                  onChange={(e) => onNamePositionChange({ ...namePosition, y: Number(e.target.value) })}
                  className="font-size-slider"
                  aria-label="Name Y position slider"
                />
                <button
                  type="button"
                  className="font-size-btn"
                  onClick={() => onNamePositionChange({ ...namePosition, y: namePosition.y + 2 })}
                  title="Move Name Down"
                  aria-label="Move name down"
                >
                  <ArrowDown size={13} />
                </button>
              </div>
            </div>
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

        {/* Committee Position Adjuster (X and Y) */}
        {onCommitteePositionChange && (
          <div className="position-adjuster-block committee-position-block">
            <div className="position-header">
              <span className="position-label">
                <Move size={13} className="inline-icon" />
                <span>Committee Position (X / Y)</span>
              </span>
              {(committeePosition.x !== 0 || committeePosition.y !== 0) && (
                <button
                  type="button"
                  className="btn-reset-position"
                  onClick={() => onCommitteePositionChange({ x: 0, y: 0 })}
                  title="Reset committee position"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <div className="position-axis-grid">
              {/* Horizontal (X) */}
              <div className="axis-control-item">
                <div className="axis-header">
                  <span className="axis-title">X (Horizontal)</span>
                  <span className="axis-value">{committeePosition.x > 0 ? `+${committeePosition.x}` : committeePosition.x}px</span>
                </div>
                <div className="font-size-slider-row">
                  <button
                    type="button"
                    className="font-size-btn"
                    onClick={() => onCommitteePositionChange({
                      ...committeePosition,
                      x: committeePosition.x - 2,
                    })}
                    title="Move Committee Left"
                    aria-label="Move committee left"
                  >
                    <ArrowLeft size={13} />
                  </button>
                  <input
                    type="range"
                    min={-100}
                    max={100}
                    step={2}
                    value={committeePosition.x}
                    onChange={(e) => onCommitteePositionChange({
                      ...committeePosition,
                      x: Number(e.target.value),
                    })}
                    className="font-size-slider"
                    aria-label="Committee X position slider"
                  />
                  <button
                    type="button"
                    className="font-size-btn"
                    onClick={() => onCommitteePositionChange({
                      ...committeePosition,
                      x: committeePosition.x + 2,
                    })}
                    title="Move Committee Right"
                    aria-label="Move committee right"
                  >
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Vertical (Y) */}
              <div className="axis-control-item">
                <div className="axis-header">
                  <span className="axis-title">Y (Vertical)</span>
                  <span className="axis-value">{committeePosition.y > 0 ? `+${committeePosition.y}` : committeePosition.y}px</span>
                </div>
                <div className="font-size-slider-row">
                  <button
                    type="button"
                    className="font-size-btn"
                    onClick={() => onCommitteePositionChange({
                      ...committeePosition,
                      y: committeePosition.y - 2,
                    })}
                    title="Move Committee Up"
                    aria-label="Move committee up"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <input
                    type="range"
                    min={-60}
                    max={60}
                    step={2}
                    value={committeePosition.y}
                    onChange={(e) => onCommitteePositionChange({
                      ...committeePosition,
                      y: Number(e.target.value),
                    })}
                    className="font-size-slider"
                    aria-label="Committee Y position slider"
                  />
                  <button
                    type="button"
                    className="font-size-btn"
                    onClick={() => onCommitteePositionChange({
                      ...committeePosition,
                      y: committeePosition.y + 2,
                    })}
                    title="Move Committee Down"
                    aria-label="Move committee down"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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

