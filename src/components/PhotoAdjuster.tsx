import React, { useState } from 'react';
import {
  ZoomIn,
  RotateCcw,
  Sliders,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Crosshair,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

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
  const [showAdvancedSliders, setShowAdvancedSliders] = useState(false);

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdatePosition({
      ...position,
      zoom: parseFloat(e.target.value),
    });
  };

  const handleZoomDelta = (delta: number) => {
    const newZoom = Math.max(0.5, Math.min(3.0, Math.round((position.zoom + delta) * 100) / 100));
    onUpdatePosition({
      ...position,
      zoom: newZoom,
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

  if (disabled) {
    return null;
  }

  return (
    <div className="control-section photo-adjuster-section compact">
      <div className="section-header compact">
        <label className="section-label compact">
          <Sliders size={14} className="section-icon" />
          <span>Framing &amp; Zoom</span>
        </label>
        <button
          type="button"
          className="btn-text-secondary"
          onClick={handleReset}
          title="Reset zoom and position"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Touch-Friendly Zoom Row with - / + buttons */}
      <div className="zoom-control-row">
        <div className="field-header compact">
          <span className="field-label compact">
            <ZoomIn size={13} /> Zoom
          </span>
          <span className="field-value compact">{Math.round(position.zoom * 100)}%</span>
        </div>
        <div className="font-size-slider-row">
          <button
            type="button"
            className="font-size-btn"
            onClick={() => handleZoomDelta(-0.1)}
            disabled={disabled || position.zoom <= 0.5}
            title="Zoom out"
            aria-label="Zoom out"
          >
            <Minus size={14} />
          </button>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.05"
            value={position.zoom}
            onChange={handleZoomChange}
            disabled={disabled}
            className="font-size-slider"
            aria-label="Photo zoom slider"
          />
          <button
            type="button"
            className="font-size-btn"
            onClick={() => handleZoomDelta(0.1)}
            disabled={disabled || position.zoom >= 3.0}
            title="Zoom in"
            aria-label="Zoom in"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Quick Directional Nudge Row */}
      <div className="nudge-pad-compact-wrap">
        <span className="nudge-hint">Tap arrows or drag card above:</span>
        <div className="nudge-buttons compact">
          <button
            type="button"
            className="btn-nudge"
            onClick={() => handleNudge(-10, 0)}
            disabled={disabled}
            title="Pan Left"
            aria-label="Pan Left"
          >
            <ArrowLeft size={14} />
          </button>
          <button
            type="button"
            className="btn-nudge"
            onClick={() => handleNudge(0, -10)}
            disabled={disabled}
            title="Pan Up"
            aria-label="Pan Up"
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            className="btn-nudge"
            onClick={() => handleNudge(0, 10)}
            disabled={disabled}
            title="Pan Down"
            aria-label="Pan Down"
          >
            <ArrowDown size={14} />
          </button>
          <button
            type="button"
            className="btn-nudge"
            onClick={() => handleNudge(10, 0)}
            disabled={disabled}
            title="Pan Right"
            aria-label="Pan Right"
          >
            <ArrowRight size={14} />
          </button>
          <button
            type="button"
            className="btn-nudge btn-nudge-center"
            onClick={() => onUpdatePosition({ ...position, x: 0, y: 0 })}
            disabled={disabled}
            title="Center Image"
            aria-label="Center Image"
          >
            <Crosshair size={14} />
          </button>
        </div>
      </div>

      {/* Advanced Precision Sliders Toggle */}
      <button
        type="button"
        className="btn-toggle-tuning subtle"
        onClick={() => setShowAdvancedSliders(!showAdvancedSliders)}
      >
        <span>Exact coordinates (X / Y)</span>
        {showAdvancedSliders ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {showAdvancedSliders && (
        <div className="advanced-sliders-wrap">
          <div className="control-field compact">
            <div className="field-header compact">
              <span className="field-label compact">Horizontal Pan (X)</span>
              <span className="field-value compact">{position.x > 0 ? `+${position.x}` : position.x}px</span>
            </div>
            <input
              type="range"
              min="-350"
              max="350"
              step="2"
              value={position.x}
              onChange={handlePanXChange}
              disabled={disabled}
              className="font-size-slider"
            />
          </div>

          <div className="control-field compact">
            <div className="field-header compact">
              <span className="field-label compact">Vertical Pan (Y)</span>
              <span className="field-value compact">{position.y > 0 ? `+${position.y}` : position.y}px</span>
            </div>
            <input
              type="range"
              min="-350"
              max="350"
              step="2"
              value={position.y}
              onChange={handlePanYChange}
              disabled={disabled}
              className="font-size-slider"
            />
          </div>
        </div>
      )}
    </div>
  );
};

