import React from 'react';
import { ZoomIn, RotateCcw, Sliders, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Crosshair } from 'lucide-react';

interface PhotoAdjusterProps {
  position: { x: number; y: number; zoom: number };
  onUpdatePosition: (newPos: { x: number; y: number; zoom: number }) => void;
  disabled: boolean;
}

export const PhotoAdjuster: React.FC<PhotoAdjusterProps> = ({
  position,
  onUpdatePosition,
  disabled,
}) => {
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdatePosition({
      ...position,
      zoom: parseFloat(e.target.value),
    });
  };

  const handlePanXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdatePosition({
      ...position,
      x: parseInt(e.target.value, 10),
    });
  };

  const handlePanYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdatePosition({
      ...position,
      y: parseInt(e.target.value, 10),
    });
  };

  const handleNudge = (dx: number, dy: number) => {
    onUpdatePosition({
      ...position,
      x: position.x + dx,
      y: position.y + dy,
    });
  };

  const handleReset = () => {
    onUpdatePosition({
      x: 0,
      y: 0,
      zoom: 1.0,
    });
  };

  return (
    <div className={`control-section photo-adjuster-section ${disabled ? 'is-disabled' : ''}`}>
      <div className="section-header">
        <label className="section-label">
          <Sliders size={18} className="section-icon" />
          <span>Position & Zoom Controls</span>
        </label>
        <button
          type="button"
          className="btn-text-secondary"
          onClick={handleReset}
          disabled={disabled}
          title="Reset zoom and position"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>

      {disabled && (
        <p className="section-disabled-note">
          Upload a photo first to enable zoom and alignment adjustments.
        </p>
      )}

      {/* Zoom Slider */}
      <div className="control-field">
        <div className="field-header">
          <span className="field-label">
            <ZoomIn size={14} /> Zoom
          </span>
          <span className="field-value">{Math.round(position.zoom * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="3.0"
          step="0.05"
          value={position.zoom}
          onChange={handleZoomChange}
          disabled={disabled}
          className="range-slider"
        />
      </div>

      {/* Horizontal Alignment Slider */}
      <div className="control-field">
        <div className="field-header">
          <span className="field-label">Horizontal Pan (X)</span>
          <span className="field-value">{position.x > 0 ? `+${position.x}` : position.x} px</span>
        </div>
        <input
          type="range"
          min="-350"
          max="350"
          step="2"
          value={position.x}
          onChange={handlePanXChange}
          disabled={disabled}
          className="range-slider"
        />
      </div>

      {/* Vertical Alignment Slider */}
      <div className="control-field">
        <div className="field-header">
          <span className="field-label">Vertical Pan (Y)</span>
          <span className="field-value">{position.y > 0 ? `+${position.y}` : position.y} px</span>
        </div>
        <input
          type="range"
          min="-350"
          max="350"
          step="2"
          value={position.y}
          onChange={handlePanYChange}
          disabled={disabled}
          className="range-slider"
        />
      </div>

      {/* Quick Directional Nudge Pad */}
      <div className="nudge-pad-container">
        <span className="nudge-pad-label">Fine Tuning:</span>
        <div className="nudge-buttons">
          <button
            type="button"
            className="btn-nudge"
            onClick={() => handleNudge(-10, 0)}
            disabled={disabled}
            title="Pan Left"
          >
            <ArrowLeft size={14} />
          </button>
          <button
            type="button"
            className="btn-nudge"
            onClick={() => handleNudge(0, -10)}
            disabled={disabled}
            title="Pan Up"
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            className="btn-nudge"
            onClick={() => handleNudge(0, 10)}
            disabled={disabled}
            title="Pan Down"
          >
            <ArrowDown size={14} />
          </button>
          <button
            type="button"
            className="btn-nudge"
            onClick={() => handleNudge(10, 0)}
            disabled={disabled}
            title="Pan Right"
          >
            <ArrowRight size={14} />
          </button>
          <button
            type="button"
            className="btn-nudge btn-nudge-center"
            onClick={() => onUpdatePosition({ ...position, x: 0, y: 0 })}
            disabled={disabled}
            title="Center Image"
          >
            <Crosshair size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

