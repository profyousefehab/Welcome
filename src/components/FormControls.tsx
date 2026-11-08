import React, { useState } from 'react';
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
  ChevronDown,
  ChevronUp,
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
  const [showPositionTuning, setShowPositionTuning] = useState(false);

  const hasCustomPositions =
    namePosition.x !== 0 ||
    namePosition.y !== 0 ||
    committeePosition.x !== 0 ||
    committeePosition.y !== 0;

  return (
    <div className="control-section form-controls-section compact">
      {/* Full Name Input & Font Size Control */}
      <div className="input-group compact">
        <label htmlFor="fullNameInput" className="input-label compact">
          <User size={14} className="inline-icon" />
          <span>Full Name</span>
        </label>
        <div className="input-wrapper compact">
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
      <div className="input-group compact">
        <label htmlFor="committeeSelect" className="input-label compact">
          <Users size={14} className="inline-icon" />
          <span>Your Committee</span>
        </label>
        <div className="select-wrapper compact">
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

      {/* Font Size Adjuster */}
      <div className="font-size-adjuster compact">
        <div className="font-size-header compact">
          <span className="font-size-label compact">
            <Type size={13} className="inline-icon" />
            <span>Name Font Size</span>
          </span>
          <span className="font-size-value compact">{nameFontSize}px</span>
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

      {/* Collapsible Precision Text Position Tuning */}
      <div className="position-tuning-accordion">
        <button
          type="button"
          className={`btn-toggle-tuning ${hasCustomPositions ? 'has-custom' : ''}`}
          onClick={() => setShowPositionTuning(!showPositionTuning)}
          aria-expanded={showPositionTuning}
        >
          <span className="toggle-tuning-title">
            <Move size={13} className="inline-icon" />
            <span>Position Fine-Tuning (X / Y)</span>
            {hasCustomPositions && <span className="custom-badge">Modified</span>}
          </span>
          {showPositionTuning ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showPositionTuning && (
          <div className="position-tuning-body">
            <p className="tuning-hint-text">
              Tip: You can also drag your name directly on the card preview above.
            </p>

            {/* Name Position Adjuster */}
            <div className="position-adjuster-block">
              <div className="position-header compact">
                <span className="position-label compact">
                  <span>Name Coordinates</span>
                </span>
                {(namePosition.x !== 0 || namePosition.y !== 0) && (
                  <button
                    type="button"
                    className="btn-reset-position"
                    onClick={() => onNamePositionChange({ x: 0, y: 0 })}
                    title="Reset name to center"
                  >
                    <RotateCcw size={11} />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              <div className="position-axis-grid">
                {/* Horizontal (X) */}
                <div className="axis-control-item">
                  <div className="axis-header compact">
                    <span className="axis-title">X (Horiz)</span>
                    <span className="axis-value">{namePosition.x > 0 ? `+${namePosition.x}` : namePosition.x}px</span>
                  </div>
                  <div className="font-size-slider-row compact">
                    <button
                      type="button"
                      className="font-size-btn"
                      onClick={() => onNamePositionChange({ ...namePosition, x: namePosition.x - 2 })}
                      title="Move Name Left"
                    >
                      <ArrowLeft size={12} />
                    </button>
                    <input
                      type="range"
                      min={-150}
                      max={150}
                      step={2}
                      value={namePosition.x}
                      onChange={(e) => onNamePositionChange({ ...namePosition, x: Number(e.target.value) })}
                      className="font-size-slider"
                    />
                    <button
                      type="button"
                      className="font-size-btn"
                      onClick={() => onNamePositionChange({ ...namePosition, x: namePosition.x + 2 })}
                      title="Move Name Right"
                    >
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>

                {/* Vertical (Y) */}
                <div className="axis-control-item">
                  <div className="axis-header compact">
                    <span className="axis-title">Y (Vert)</span>
                    <span className="axis-value">{namePosition.y > 0 ? `+${namePosition.y}` : namePosition.y}px</span>
                  </div>
                  <div className="font-size-slider-row compact">
                    <button
                      type="button"
                      className="font-size-btn"
                      onClick={() => onNamePositionChange({ ...namePosition, y: namePosition.y - 2 })}
                      title="Move Name Up"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <input
                      type="range"
                      min={-100}
                      max={100}
                      step={2}
                      value={namePosition.y}
                      onChange={(e) => onNamePositionChange({ ...namePosition, y: Number(e.target.value) })}
                      className="font-size-slider"
                    />
                    <button
                      type="button"
                      className="font-size-btn"
                      onClick={() => onNamePositionChange({ ...namePosition, y: namePosition.y + 2 })}
                      title="Move Name Down"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Committee Position Adjuster */}
            {onCommitteePositionChange && (
              <div className="position-adjuster-block committee-position-block">
                <div className="position-header compact">
                  <span className="position-label compact">
                    <span>Committee Coordinates</span>
                  </span>
                  {(committeePosition.x !== 0 || committeePosition.y !== 0) && (
                    <button
                      type="button"
                      className="btn-reset-position"
                      onClick={() => onCommitteePositionChange({ x: 0, y: 0 })}
                      title="Reset committee position"
                    >
                      <RotateCcw size={11} />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                <div className="position-axis-grid">
                  {/* Horizontal (X) */}
                  <div className="axis-control-item">
                    <div className="axis-header compact">
                      <span className="axis-title">X (Horiz)</span>
                      <span className="axis-value">{committeePosition.x > 0 ? `+${committeePosition.x}` : committeePosition.x}px</span>
                    </div>
                    <div className="font-size-slider-row compact">
                      <button
                        type="button"
                        className="font-size-btn"
                        onClick={() => onCommitteePositionChange({
                          ...committeePosition,
                          x: committeePosition.x - 2,
                        })}
                        title="Move Committee Left"
                      >
                        <ArrowLeft size={12} />
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
                      />
                      <button
                        type="button"
                        className="font-size-btn"
                        onClick={() => onCommitteePositionChange({
                          ...committeePosition,
                          x: committeePosition.x + 2,
                        })}
                        title="Move Committee Right"
                      >
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Vertical (Y) */}
                  <div className="axis-control-item">
                    <div className="axis-header compact">
                      <span className="axis-title">Y (Vert)</span>
                      <span className="axis-value">{committeePosition.y > 0 ? `+${committeePosition.y}` : committeePosition.y}px</span>
                    </div>
                    <div className="font-size-slider-row compact">
                      <button
                        type="button"
                        className="font-size-btn"
                        onClick={() => onCommitteePositionChange({
                          ...committeePosition,
                          y: committeePosition.y - 2,
                        })}
                        title="Move Committee Up"
                      >
                        <ArrowUp size={12} />
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
                      />
                      <button
                        type="button"
                        className="font-size-btn"
                        onClick={() => onCommitteePositionChange({
                          ...committeePosition,
                          y: committeePosition.y + 2,
                        })}
                        title="Move Committee Down"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step 2 Navigation Footer */}
      <div className="step-navigation-footer compact">
        <button
          type="button"
          className="btn-step-back"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          <span>Back to Photo</span>
        </button>
        <button
          type="button"
          className="btn-step-next"
          onClick={onNext}
        >
          <span>Continue to Step 3</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

